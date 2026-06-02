// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import PropertyFilter, { PropertyFilterProps } from '../../../lib/components/property-filter';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';
import { createDefaultProps } from './common';

import optionLabels from '../../../lib/components/internal/components/option/analytics-metadata/styles.css.js';
import selectableItemsLabels from '../../../lib/components/internal/components/selectable-item/analytics-metadata/styles.css.js';
import analyticsLabels from '../../../lib/components/property-filter/analytics-metadata/styles.css.js';
import styles from '../../../lib/components/property-filter/styles.css.js';

const labels = { ...selectableItemsLabels, ...optionLabels, ...analyticsLabels };

const filteringOptions = [
  { propertyKey: 'instanceid', value: 'i-2dc5ce28a0328391' },
  { propertyKey: 'instanceid', value: 'i-d0312e022392efa0' },
  { propertyKey: 'instanceid', value: 'i-070eef935c1301e6' },
  { propertyKey: 'instanceid', value: 'i-3b44795b1fea36ac' },
  { propertyKey: 'state', value: 'Stopped' },
  { propertyKey: 'state', value: 'Stopping' },
  { propertyKey: 'state', value: 'Pending' },
  { propertyKey: 'state', value: 'Running' },
  { propertyKey: 'instancetype', value: 't3.small' },
  { propertyKey: 'instancetype', value: 't2.small' },
  { propertyKey: 'instancetype', value: 't3.nano' },
  { propertyKey: 'instancetype', value: 't2.medium' },
  { propertyKey: 'instancetype', value: 't3.medium' },
  { propertyKey: 'instancetype', value: 't2.large' },
  { propertyKey: 'instancetype', value: 't2.nano' },
  { propertyKey: 'instancetype', value: 't2.micro' },
  { propertyKey: 'instancetype', value: 't3.large' },
  { propertyKey: 'instancetype', value: 't3.micro' },
  { propertyKey: 'averagelatency', value: '17' },
  { propertyKey: 'averagelatency', value: '53' },
  { propertyKey: 'averagelatency', value: '73' },
  { propertyKey: 'averagelatency', value: '74' },
  { propertyKey: 'averagelatency', value: '107' },
  { propertyKey: 'averagelatency', value: '236' },
  { propertyKey: 'averagelatency', value: '242' },
  { propertyKey: 'averagelatency', value: '375' },
  { propertyKey: 'averagelatency', value: '402' },
  { propertyKey: 'averagelatency', value: '636' },
  { propertyKey: 'averagelatency', value: '639' },
  { propertyKey: 'averagelatency', value: '743' },
  { propertyKey: 'averagelatency', value: '835' },
  { propertyKey: 'averagelatency', value: '981' },
  { propertyKey: 'averagelatency', value: '995' },
];

const filteringProperties = [
  {
    key: 'instanceid',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'Instance ID',
    groupValuesLabel: 'Instance ID values',
  },
  {
    key: 'state',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'State',
    groupValuesLabel: 'State values',
  },
  {
    key: 'instancetype',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'Instance type',
    groupValuesLabel: 'Instance type values',
  },
  {
    key: 'averagelatency',
    operators: ['=', '!=', '>', '<', '<=', '>='],
    propertyLabel: 'Average latency',
    groupValuesLabel: 'Average latency values',
  },
];

const defaultProps = createDefaultProps(filteringProperties, filteringOptions);

const query: PropertyFilterProps['query'] = {
  operation: 'and',
  tokens: [
    { propertyKey: 'instanceid', value: 'i-070eef935c1301e6', operator: '=' },
    { propertyKey: 'instancetype', value: 't3.small', operator: '!=' },
    { propertyKey: 'averagelatency', value: '981', operator: '>' },
    { propertyKey: 'state', value: 'Stopping', operator: '=' },
  ],
};

function renderPropertyFilter(props: Partial<PropertyFilterProps>) {
  const renderResult = render(<PropertyFilter {...defaultProps} {...props} />);
  return createWrapper(renderResult.container).findPropertyFilter()!;
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('PropertyFilter renders correct analytics metadata', () => {
  test('when disabled', () => {
    const wrapper = renderPropertyFilter({ disabled: true });
    expect(getGeneratedAnalyticsMetadata(wrapper!.getElement())).toMatchSnapshot();
  });

  test('in clear input button', () => {
    const wrapper = renderPropertyFilter({});
    act(() => wrapper.setInputValue('aaa'));
    const inputClearButton = wrapper.findClearButton()!.getElement();
    validateComponentNameAndLabels(inputClearButton, labels);
    expect(getGeneratedAnalyticsMetadata(inputClearButton)).toMatchSnapshot();
  });

  test.each([false, true])('in dropdown and expandToViewport=%s', expandToViewport => {
    const wrapper = renderPropertyFilter({ expandToViewport });

    act(() => wrapper.findNativeInput()!.focus());
    const propertiesItem = wrapper.findDropdown({ expandToViewport })!.findOptions()![0].getElement();
    validateComponentNameAndLabels(propertiesItem, labels);
    expect(getGeneratedAnalyticsMetadata(propertiesItem)).toMatchSnapshot();

    act(() => wrapper.setInputValue('State'));
    const operatorsItem = wrapper.findDropdown({ expandToViewport })!.findOptions()![1].getElement();
    validateComponentNameAndLabels(operatorsItem, labels);
    expect(getGeneratedAnalyticsMetadata(operatorsItem)).toMatchSnapshot();

    act(() => wrapper.setInputValue('State = '));
    const valueItem = wrapper.findDropdown({ expandToViewport })!.findOptions()![2].getElement();
    validateComponentNameAndLabels(valueItem, labels);
    expect(getGeneratedAnalyticsMetadata(valueItem)).toMatchSnapshot();
  });

  describe('in selected filters', () => {
    test('in clear all filters button', () => {
      const wrapper = renderPropertyFilter({ query });

      const removeAllButton = wrapper.findRemoveAllButton()!.getElement();
      validateComponentNameAndLabels(removeAllButton, labels);
      expect(getGeneratedAnalyticsMetadata(removeAllButton)).toMatchSnapshot();
    });
    test('in dismiss button', () => {
      const wrapper = renderPropertyFilter({ query });

      const dismissButton = wrapper.findTokens()[1]!.findRemoveButton()!.getElement();
      validateComponentNameAndLabels(dismissButton, labels);
      expect(getGeneratedAnalyticsMetadata(dismissButton)).toMatchSnapshot();
    });
    test('in operation select', () => {
      const wrapper = renderPropertyFilter({ query });

      let operationSelectTrigger = wrapper.findTokens()[2]!.findTokenOperation()!.findTrigger()!.getElement();
      validateComponentNameAndLabels(operationSelectTrigger, labels);
      expect(getGeneratedAnalyticsMetadata(operationSelectTrigger)).toMatchSnapshot();

      wrapper.findTokens()[2]!.findTokenOperation()!.openDropdown();

      operationSelectTrigger = wrapper.findTokens()[2]!.findTokenOperation()!.findTrigger()!.getElement();
      validateComponentNameAndLabels(operationSelectTrigger, labels);

      expect(getGeneratedAnalyticsMetadata(operationSelectTrigger)).toMatchSnapshot();

      const operationOption = wrapper
        .findTokens()[2]!
        .findTokenOperation()!
        .findDropdown()
        .findOptions()[1]!
        .getElement();
      validateComponentNameAndLabels(operationOption, labels);
      expect(getGeneratedAnalyticsMetadata(operationOption)).toMatchSnapshot();
    });

    test('in token edit flow', () => {
      const wrapper = renderPropertyFilter({ query });

      const editTrigger = wrapper.findTokens()[2]!.findByClassName(styles['token-trigger'])!.getElement();
      validateComponentNameAndLabels(editTrigger, labels);
      expect(getGeneratedAnalyticsMetadata(editTrigger)).toMatchSnapshot();

      act(() => wrapper.findTokens()[2]!.findLabel()!.click());

      const editPopoverWrapper = wrapper.findTokens()[2]!.findEditorDropdown()!;

      const submitButton = editPopoverWrapper.findSubmitButton().getElement();
      validateComponentNameAndLabels(submitButton, labels);
      expect(getGeneratedAnalyticsMetadata(submitButton)).toMatchSnapshot();
      const cancelButton = editPopoverWrapper.findCancelButton().getElement();
      validateComponentNameAndLabels(cancelButton, labels);
      expect(getGeneratedAnalyticsMetadata(cancelButton)).toMatchSnapshot();

      const closeButton = editPopoverWrapper.findDismissButton().getElement();
      validateComponentNameAndLabels(closeButton, labels);
      expect(getGeneratedAnalyticsMetadata(closeButton)).toMatchSnapshot();
    });

    test('in show more', () => {
      const wrapper = renderPropertyFilter({
        query,
        tokenLimit: 3,
        tokenLimitShowFewerAriaLabel: 'show less',
        tokenLimitShowMoreAriaLabel: 'show more',
      });

      const tokenToggle = wrapper.findTokenToggle()!.getElement();
      expect(getGeneratedAnalyticsMetadata(tokenToggle)).toMatchSnapshot();

      wrapper.findTokenToggle()!.click();
      expect(getGeneratedAnalyticsMetadata(wrapper.findTokenToggle()!.getElement())).toMatchSnapshot();
    });
  });
});
