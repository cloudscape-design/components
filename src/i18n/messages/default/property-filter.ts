// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PropertyFilterI18n } from '../../interfaces';

const messages: PropertyFilterI18n = {
  i18nStrings: {
    allPropertiesLabel: 'All properties',
    applyActionText: 'Apply',
    cancelActionText: 'Cancel',
    clearFiltersText: 'Clear filters',
    dismissAriaLabel: 'Dismiss',
    editTokenHeader: 'Edit token',
    enteredTextLabel: ({ text }) => `Use: "${text}"`,
    filteringAriaLabel: 'Your choice',
    groupPropertiesText: 'Properties',
    groupValuesText: 'Values',
    operationAndText: 'and',
    operationOrText: 'or',
    operatorContainsText: 'Contains',
    operatorDoesNotContainText: 'Does not contain',
    operatorDoesNotEqualText: 'Does not equal',
    operatorEqualsText: 'Equals',
    operatorGreaterOrEqualText: 'Greater than or equal',
    operatorGreaterText: 'Greater than',
    operatorLessOrEqualText: 'Less than or equal',
    operatorLessText: 'Less than',
    operatorText: 'Operator',
    operatorsText: 'Operators',
    propertyText: 'Property',
    removeTokenButtonAriaLabel: 'Remove token',
    tokenLimitShowFewer: 'Show fewer',
    tokenLimitShowMore: 'Show more',
    valueText: 'Value',
  },
  filteringPlaceholder: 'Search',
};

export default messages;
