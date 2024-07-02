// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import {
  ComparisonOperator,
  GroupText,
  I18nStrings,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  InternalToken,
  InternalTokenGroup,
  JoinOperation,
  LoadItemsDetail,
  Token,
  TokenGroup,
} from './interfaces';
import styles from './styles.css.js';
import { TokenEditor } from './token-editor';

import FilteringToken from '../internal/components/filtering-token';
import { NonCancelableEventHandler } from '../internal/events';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';
import { getFormattedToken } from './utils';

interface TokenProps {
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  disabled?: boolean;
  freeTextFiltering: InternalFreeTextFiltering;
  expandToViewport?: boolean;
  filteringProperties: readonly InternalFilteringProperty[];
  filteringOptions: readonly InternalFilteringOption[];
  first?: boolean;
  hideOperations?: boolean;
  i18nStrings: I18nStrings;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  operation: JoinOperation;
  removeToken: () => void;
  setOperation: (newOperation: JoinOperation) => void;
  setToken: (newToken: TokenGroup, newStandalone?: Token[]) => void;
  token: InternalTokenGroup;
  allTokens: readonly InternalTokenGroup[];
}

export const TokenButton = ({
  token,
  allTokens,
  operation = 'and',
  first,
  removeToken,
  setToken,
  setOperation,
  filteringProperties,
  filteringOptions,
  asyncProps,
  onLoadItems,
  i18nStrings,
  asyncProperties,
  hideOperations,
  customGroupsText,
  disabled,
  freeTextFiltering,
  expandToViewport,
}: TokenProps) => {
  const flatTokens: Token[] = [];
  function traverse(tokenOrGroup: InternalTokenGroup | InternalToken) {
    if ('operation' in tokenOrGroup) {
      tokenOrGroup.tokens.forEach(traverse);
    } else {
      flatTokens.push({ ...tokenOrGroup, propertyKey: tokenOrGroup.property?.propertyKey });
    }
  }
  traverse(token);

  const singleTokens: InternalTokenGroup[] = [];
  for (const tokenOrGroup of allTokens) {
    if (tokenOrGroup === token) {
      continue;
    }
    if ('operation' in tokenOrGroup && tokenOrGroup.tokens.length === 1) {
      singleTokens.push(tokenOrGroup);
    }
  }

  const externalToken = flatTokens[0];
  const formattedToken = getFormattedToken(token);
  return (
    <FilteringToken
      ariaLabel={formattedToken.label}
      showOperation={!first && !hideOperations}
      operation={operation}
      andText={i18nStrings.operationAndText ?? ''}
      orText={i18nStrings.operationOrText ?? ''}
      dismissAriaLabel={i18nStrings?.removeTokenButtonAriaLabel?.(externalToken)}
      operatorAriaLabel={i18nStrings.tokenOperatorAriaLabel}
      onChange={setOperation}
      onDismiss={removeToken}
      disabled={disabled}
    >
      <TokenEditor
        setToken={setToken}
        triggerComponent={
          <span className={styles['token-trigger']}>
            <TokenTrigger
              property={formattedToken.property}
              operator={formattedToken.operator}
              value={formattedToken.value}
              suffix={formattedToken.suffix}
            />
          </span>
        }
        filteringProperties={filteringProperties}
        filteringOptions={filteringOptions}
        token={token}
        asyncProps={asyncProps}
        onLoadItems={onLoadItems}
        i18nStrings={i18nStrings}
        asyncProperties={asyncProperties}
        customGroupsText={customGroupsText}
        freeTextFiltering={freeTextFiltering}
        expandToViewport={expandToViewport}
      />
    </FilteringToken>
  );
};

const TokenTrigger = ({
  property,
  operator,
  value,
  suffix,
}: {
  property?: string;
  operator?: ComparisonOperator;
  value: string;
  suffix: string;
}) => {
  if (property) {
    property += ' ';
  }
  const freeTextContainsToken = operator === ':' && !property;
  const operatorText = freeTextContainsToken ? '' : operator + ' ';
  return (
    <>
      {property}
      <span className={styles['token-operator']}>{operatorText}</span>
      {value}
      {suffix}
    </>
  );
};
