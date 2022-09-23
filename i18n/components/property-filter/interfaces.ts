// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PropertyFilterI18n {
  i18nStrings: {
    allPropertiesLabel: string;
    applyActionText: string;
    cancelActionText: string;
    clearFiltersText: string;
    dismissAriaLabel: string;
    editTokenHeader: string;
    enteredTextLabel: ({ text }: { text: string }) => string;
    filteringAriaLabel: string;
    groupPropertiesText: string;
    groupValuesText: string;
    operationAndText: string;
    operationOrText: string;
    operatorContainsText: string;
    operatorDoesNotContainText: string;
    operatorDoesNotEqualText: string;
    operatorEqualsText: string;
    operatorGreaterOrEqualText: string;
    operatorGreaterText: string;
    operatorLessOrEqualText: string;
    operatorLessText: string;
    operatorText: string;
    operatorsText: string;
    propertyText: string;
    removeTokenButtonAriaLabel: string;
    tokenLimitShowFewer: string;
    tokenLimitShowMore: string;
    valueText: string;
  };
  filteringPlaceholder: string;
}
