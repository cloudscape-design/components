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
  removeToken: (index: number) => void;
  setOperation: (newOperation: JoinOperation) => void;
  setToken: (newToken: TokenGroup, newStandalone?: Token[]) => void;
  token: InternalTokenGroup;
}

export const TokenButton = ({
  token,
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
  const firstLevelTokens: InternalToken[] = [];
  for (const tokenOrGroup of token.tokens) {
    if ('operation' in tokenOrGroup) {
      // ignore as deeply nested tokens are not supported
    } else {
      firstLevelTokens.push(tokenOrGroup);
    }
  }
  const externalTokens = firstLevelTokens.map(t => ({
    propertyKey: t.property?.propertyKey,
    operator: t.operator,
    value: t.value,
  }));
  return (
    <FilteringToken
      tokens={firstLevelTokens.map((t, index) => {
        const formatted = getFormattedToken(t);
        return {
          content: (
            <TokenEditor
              setToken={setToken}
              triggerComponent={
                <span className={styles['token-trigger']}>
                  <TokenTrigger property={formatted.property} operator={formatted.operator} value={formatted.value} />
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
          ),
          ariaLabel: formatted.label,
          dismissAriaLabel: i18nStrings?.removeTokenButtonAriaLabel?.(externalTokens[index]) ?? '',
        };
      })}
      groupAriaLabel={i18nStrings.tokenGroupAriaLabel?.(externalTokens) ?? ''}
      showOperation={!first && !hideOperations}
      operation={operation}
      groupOperation={token.operation}
      andText={i18nStrings.operationAndText ?? ''}
      orText={i18nStrings.operationOrText ?? ''}
      operationAriaLabel={i18nStrings.tokenOperatorAriaLabel ?? ''}
      onChangeOperation={setOperation}
      onChangeGroupOperation={operation =>
        setToken({
          operation,
          tokens: firstLevelTokens.map(t => ({
            propertyKey: t.property?.propertyKey,
            operator: t.operator,
            value: t.value,
          })),
        })
      }
      onDismissToken={removeToken}
      disabled={disabled}
    />
  );
};

const TokenTrigger = ({
  property,
  operator,
  value,
}: {
  property?: string;
  operator?: ComparisonOperator;
  value: string;
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
    </>
  );
};
