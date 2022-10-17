// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import {
  ComparisonOperator,
  FilteringOption,
  FilteringProperty,
  GroupText,
  I18nStrings,
  JoinOperation,
  LoadItemsDetail,
  Token,
} from './interfaces';
import styles from './styles.css.js';
import { TokenEditor } from './token-editor';
import { getExtendedOperator, getOperatorLabel, getPropertyByKey } from './controller';

import FilteringToken from '../internal/components/filtering-token';
import { NonCancelableEventHandler } from '../internal/events';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';

interface TokenProps {
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  disabled?: boolean;
  disableFreeTextFiltering?: boolean;
  expandToViewport?: boolean;
  filteringOptions: readonly FilteringOption[];
  filteringProperties: readonly FilteringProperty[];
  first?: boolean;
  hideOperations?: boolean;
  i18nStrings: I18nStrings;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  operation: JoinOperation;
  removeToken: () => void;
  setOperation: (newOperation: JoinOperation) => void;
  setToken: (newToken: Token) => void;
  token: Token;
}

export const TokenButton = ({
  token,
  operation = 'and',
  first,
  removeToken,
  setToken,
  setOperation,
  filteringOptions,
  filteringProperties,
  asyncProps,
  onLoadItems,
  i18nStrings,
  asyncProperties,
  hideOperations,
  customGroupsText,
  disabled,
  disableFreeTextFiltering,
  expandToViewport,
}: TokenProps) => {
  const valueFormatter =
    token.propertyKey && getExtendedOperator(filteringProperties, token.propertyKey, token.operator)?.format;
  const property = token.propertyKey ? getPropertyByKey(filteringProperties, token.propertyKey) : undefined;
  const tokenValue = valueFormatter ? valueFormatter(token.value) : token.value;
  return (
    <FilteringToken
      showOperation={!first && !hideOperations}
      operation={operation}
      andText={i18nStrings.operationAndText}
      orText={i18nStrings.operationOrText}
      dismissAriaLabel={i18nStrings.removeTokenButtonAriaLabel(token)}
      onChange={setOperation}
      onDismiss={removeToken}
      disabled={disabled}
    >
      <TokenEditor
        setToken={setToken}
        triggerComponent={
          <span className={styles['token-trigger']}>
            <TokenTrigger property={property} operator={token.operator} value={tokenValue} />
          </span>
        }
        filteringOptions={filteringOptions}
        filteringProperties={filteringProperties}
        token={token}
        asyncProps={asyncProps}
        onLoadItems={onLoadItems}
        i18nStrings={i18nStrings}
        asyncProperties={asyncProperties}
        customGroupsText={customGroupsText}
        disableFreeTextFiltering={disableFreeTextFiltering}
        expandToViewport={expandToViewport}
      />
    </FilteringToken>
  );
};

const TokenTrigger = ({
  property,
  operator,
  value,
}: {
  property?: FilteringProperty;
  operator?: ComparisonOperator;
  value: string;
}) => {
  let propertyLabel = property ? property.propertyLabel : '';

  if (propertyLabel) {
    propertyLabel += ' ';
  }
  const operatorLabel = property && operator ? getOperatorLabel(property, operator) : operator;
  const freeTextContainsToken = operator === ':' && !propertyLabel;
  const operatorText = freeTextContainsToken ? '' : operatorLabel + ' ';
  return (
    <>
      {propertyLabel}
      <span className={styles['token-operator']}>{operatorText}</span>
      {value}
    </>
  );
};
