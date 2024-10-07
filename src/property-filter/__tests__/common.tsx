// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import PropertyFilter from '../../../lib/components/property-filter';
import { FilteringProperty, I18nStrings, InternalFilteringProperty, PropertyFilterProps, Token } from '../interfaces';

export const i18nStrings: I18nStrings = {
  dismissAriaLabel: 'Dismiss',

  groupValuesText: 'Values',
  groupPropertiesText: 'Properties',
  operatorsText: 'Operators',

  operationAndText: 'and',
  operationOrText: 'or',

  operatorLessText: 'Less than',
  operatorLessOrEqualText: 'Less than or equal',
  operatorGreaterText: 'Greater than',
  operatorGreaterOrEqualText: 'Greater than or equal',
  operatorContainsText: 'Contains',
  operatorDoesNotContainText: 'Does not contain',
  operatorEqualsText: 'Equals',
  operatorDoesNotEqualText: 'Does not equal',

  editTokenHeader: 'Edit filter',
  propertyText: 'Property',
  operatorText: 'Operator',
  valueText: 'Value',
  cancelActionText: 'Cancel',
  applyActionText: 'Apply',
  allPropertiesLabel: 'All properties',

  tokenLimitShowMore: 'Show more',
  tokenLimitShowFewer: 'Show fewer',
  clearFiltersText: 'Clear filters',
  tokenOperatorAriaLabel: 'Boolean Operator',
  clearAriaLabel: 'clear',
  enteredTextLabel: (text: string) => `Use: "${text}"`,

  formatToken: token => `${token.propertyLabel} ${formatOperator(token.operator)} ${token.value}`,
  removeTokenButtonAriaLabel: (token: Token) =>
    'Remove token ' + token.propertyKey + ' ' + formatOperator(token.operator) + ' ' + token.value,

  groupEditAriaLabel: group =>
    'Edit filter, ' +
    group.tokens
      .map(token => `${token.propertyLabel} ${formatOperator(token.operator)} ${token.value}`)
      .join(` ${group.operationLabel} `),
  tokenEditorTokenActionsAriaLabel: token =>
    `Remove actions, ${token.propertyLabel} ${formatOperator(token.operator)} ${token.value}`,
  tokenEditorTokenRemoveAriaLabel: token =>
    `Remove filter, ${token.propertyLabel} ${formatOperator(token.operator)} ${token.value}`,
  tokenEditorTokenRemoveLabel: 'Remove filter',
  tokenEditorTokenRemoveFromGroupLabel: 'Remove filter from group',
  tokenEditorAddNewTokenLabel: 'Add new filter',
  tokenEditorAddTokenActionsAriaLabel: 'Add filter actions',
  tokenEditorAddExistingTokenAriaLabel: token =>
    `Add filter ${token.propertyLabel} ${formatOperator(token.operator)} ${token.value} to group`,
  tokenEditorAddExistingTokenLabel: token =>
    `Add filter ${token.propertyLabel} ${token.operator} ${token.value} to group`,
};

export const providedI18nStrings = {
  autosuggest: {
    enteredTextLabel: 'Use: "{value}"',
  },
  popover: {
    dismissAriaLabel: 'Dismiss',
  },
  'property-filter': {
    'i18nStrings.editTokenHeader': 'Edit filter',
    'i18nStrings.propertyText': 'Property',
    'i18nStrings.operatorText': 'Operator',
    'i18nStrings.valueText': 'Value',
    'i18nStrings.cancelActionText': 'Cancel',
    'i18nStrings.applyActionText': 'Apply',
    'i18nStrings.formatToken': '{token__propertyLabel} {token__operator} {token__value}',
    'i18nStrings.tokenEditorTokenActionsAriaLabel': 'Remove actions, {token__formattedText}',
    'i18nStrings.tokenEditorTokenRemoveAriaLabel': 'Remove filter, {token__formattedText}',
    'i18nStrings.tokenEditorTokenRemoveLabel': 'Remove filter',
    'i18nStrings.tokenEditorTokenRemoveFromGroupLabel': 'Remove filter from group',
    'i18nStrings.tokenEditorAddNewTokenLabel': 'Add new filter',
    'i18nStrings.tokenEditorAddTokenActionsAriaLabel': 'Add filter actions',
    'i18nStrings.tokenEditorAddExistingTokenAriaLabel': 'Add filter {token__formattedText} to group',
    'i18nStrings.tokenEditorAddExistingTokenLabel':
      'Add filter {token__propertyLabel} {token__operator} {token__value} to group',
  },
};

function formatOperator(operator: string) {
  switch (operator) {
    case '=':
      return 'equals';
    case '!=':
      return 'does_not_equal';
    default:
      return operator;
  }
}

export const createDefaultProps = (
  filteringProperties: PropertyFilterProps['filteringProperties'],
  filteringOptions: PropertyFilterProps['filteringOptions']
): PropertyFilterProps => ({
  id: 'property-filter',
  filteringEmpty: 'Empty',
  filteringProperties,
  filteringOptions,
  filteringPlaceholder: 'Search',
  filteringAriaLabel: 'your choice',
  onChange: () => {},
  query: { tokens: [], operation: 'and' },
  i18nStrings,
  filteringLoadingText: 'Loading status',
  filteringErrorText: 'Error status',
  filteringFinishedText: 'Finished status',
  filteringRecoveryText: 'Retry',
});

export function toInternalProperties(properties: FilteringProperty[]): InternalFilteringProperty[] {
  return properties.map(property => ({
    propertyKey: property.key,
    propertyLabel: property.propertyLabel,
    groupValuesLabel: property.groupValuesLabel,
    propertyGroup: property.group,
    operators: (property.operators ?? []).map(op => (typeof op === 'string' ? op : op.operator)),
    defaultOperator: property.defaultOperator ?? '=',
    getTokenType: () => 'value',
    getValueFormatter: () => null,
    getValueFormRenderer: () => null,
    externalProperty: property,
  }));
}

export function StatefulPropertyFilter(props: PropertyFilterProps) {
  const [query, setQuery] = useState<PropertyFilterProps.Query>(props.query);
  return (
    <PropertyFilter
      {...props}
      query={query}
      onChange={event => {
        props.onChange(event);
        setQuery(event.detail);
      }}
    />
  );
}
