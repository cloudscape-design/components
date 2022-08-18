// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { PropertyFilterProps } from './interfaces';
import styles from './styles.css.js';
import { TokenEditor } from './token-editor';
import { getPropertyByKey } from './controller';

import { AutosuggestProps } from '../autosuggest/interfaces';
import FilteringToken from '../internal/components/filtering-token';

interface TokenProps
  extends Pick<
    PropertyFilterProps,
    | 'filteringOptions'
    | 'filteringProperties'
    | 'onLoadItems'
    | 'i18nStrings'
    | 'asyncProperties'
    | 'hideOperations'
    | 'customGroupsText'
    | 'disabled'
    | 'disableFreeTextFiltering'
    | 'expandToViewport'
  > {
  operation: PropertyFilterProps.JoinOperation;
  token: PropertyFilterProps.Token;
  first?: boolean;
  removeToken: () => void;
  setToken: (newToken: PropertyFilterProps.Token) => void;
  setOperation: (newOperation: PropertyFilterProps.JoinOperation) => void;
  asyncProps: Pick<
    AutosuggestProps,
    'empty' | 'loadingText' | 'finishedText' | 'errorText' | 'recoveryText' | 'statusType'
  >;
}

export const Token = ({
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
  const property = token.propertyKey && getPropertyByKey(filteringProperties, token.propertyKey);
  const propertyLabel = property && property.propertyLabel;
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
            <TokenTrigger property={propertyLabel} operator={token.operator} value={token.value} />
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
  property?: string;
  operator?: PropertyFilterProps.ComparisonOperator;
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
