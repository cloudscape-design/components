// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FilteringProperty, InternalFilteringProperty, Token } from '../interfaces';

export const i18nStrings = {
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
  removeTokenButtonAriaLabel: (token: Token) =>
    'Remove token ' + token.propertyKey + ' ' + token.operator + ' ' + token.value,
  enteredTextLabel: (text: string) => `Use: "${text}"`,
} as const;

export function toInternalProperties(properties: FilteringProperty[]): InternalFilteringProperty[] {
  return properties.map(property => ({
    propertyKey: property.key,
    propertyLabel: property.propertyLabel,
    groupValuesLabel: property.groupValuesLabel,
    propertyGroup: property.group,
    operators: (property.operators ?? []).map(op => (typeof op === 'string' ? op : op.operator)),
    defaultOperator: property.defaultOperator ?? '=',
    getValueFormatter: () => null,
    getValueFormRenderer: () => null,
    externalProperty: property,
  }));
}
