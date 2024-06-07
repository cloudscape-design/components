// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { i18nStrings } from '../code-editor/__tests__/common';
export { defaultSplitPanelContextProps } from '../split-panel/__tests__/helpers';

const defaultProps: Record<string, Record<string, any>> = {
  tabs: { tabs: [] },
  table: { columnDefinitions: [] },
  cards: { cardDefinition: {} },
  autosuggest: { options: [], enteredPrefix: '' },
  'anchor-navigation': { anchors: [] },
  'code-editor': { i18nStrings },
  wizard: {
    steps: [],
    i18nStrings: {
      stepNumberLabel: () => '',
      collapsedStepsLabel: () => '',
      cancelButton: '',
      previousButton: '',
      nextButton: '',
      submitButton: '',
    },
  },
  'date-input': {
    value: '',
  },
  'time-input': {
    value: '',
  },
  'date-picker': {
    value: '',
    onChange: () => {},
  },
  's3-resource-selector': {
    resource: { uri: '' },
    fetchBuckets: () => Promise.resolve([]),
  },
  'tag-editor': {
    i18nStrings: {
      keyPlaceholder: '',
      valuePlaceholder: '',
      addButton: '',
      removeButton: '',
      undoButton: '',
      undoPrompt: '',
      loading: '',
      keyHeader: '',
      valueHeader: '',
      optional: '',
      keySuggestion: '',
      valueSuggestion: '',
      emptyTags: '',
      tooManyKeysSuggestion: '',
      tooManyValuesSuggestion: '',
      keysSuggestionLoading: '',
      keysSuggestionError: '',
      valuesSuggestionLoading: '',
      valuesSuggestionError: '',
      emptyKeyError: '',
      maxKeyCharLengthError: '',
      maxValueCharLengthError: '',
      duplicateKeyError: '',
      invalidKeyError: '',
      invalidValueError: '',
      awsPrefixError: '',
      tagLimit: () => '',
      tagLimitReached: () => '',
      tagLimitExceeded: () => '',
      enteredKeyLabel: () => '',
      enteredValueLabel: () => '',
    },
  },
  'top-navigation': {
    identity: {
      href: '#',
    },
    utilities: [],
    i18nStrings: {
      searchIconAriaLabel: '',
      searchDismissIconAriaLabel: '',
      overflowMenuTriggerText: '',
    },
  },
  'tutorial-panel': {
    i18nStrings: {
      stepTitle: () => '',
      labelTotalSteps: () => '',
    },
    tutorials: [],
  },
  'annotation-context': {
    i18nStrings: {},
  },
  'split-panel': {
    i18nStrings: {},
  },
  'date-range-picker': {
    i18nStrings: {},
    relativeOptions: [],
  },
  'property-filter': {
    i18nStrings: {
      filteringAriaLabel: '',
      dismissAriaLabel: '',
      groupValuesText: '',
      groupPropertiesText: '',
      operatorsText: '',
      operationAndText: '',
      operationOrText: '',
      operatorLessText: '',
      operatorLessOrEqualText: '',
      operatorGreaterText: '',
      operatorGreaterOrEqualText: '',
      operatorContainsText: '',
      operatorDoesNotContainText: '',
      operatorEqualsText: '',
      operatorDoesNotEqualText: '',
      editTokenHeader: '',
      propertyText: '',
      operatorText: '',
      valueText: '',
      cancelActionText: '',
      applyActionText: '',
      clearFiltersText: '',
      removeTokenButtonAriaLabel: () => '',
      enteredTextLabel: () => '',
    },
    query: { tokens: [], operation: 'and' },
    filteringProperties: [],
    onChange: () => {},
  },
  'button-dropdown': {
    items: [],
  },
  'area-chart': {
    series: [],
  },
  flashbar: {
    items: [],
  },
  'file-upload': {
    value: [],
    i18nStrings: {
      uploadButtonText: () => 'Choose file(s)',
    },
  },
  'key-value-pairs': {
    columns: 4,
    items: [],
  },
};

export function getRequiredPropsForComponent(componentName: string): Record<string, any> {
  return defaultProps[componentName] || {};
}
