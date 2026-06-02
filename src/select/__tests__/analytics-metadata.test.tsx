// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import FormField from '../../../lib/components/form-field';
import Select, { SelectProps } from '../../../lib/components/select';
import InternalSelect from '../../../lib/components/select/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import buttonTriggerLabels from '../../../lib/components/internal/components/button-trigger/analytics-metadata/styles.css.js';
import optionLabels from '../../../lib/components/internal/components/option/analytics-metadata/styles.css.js';
import selectableItemsLabels from '../../../lib/components/internal/components/selectable-item/analytics-metadata/styles.css.js';

const labels = { ...selectableItemsLabels, ...optionLabels, ...buttonTriggerLabels };

function renderSelect(props: Partial<SelectProps>) {
  const renderResult = render(
    <Select options={options} selectedOption={null} ariaLabel="select with metadata" onChange={() => {}} {...props} />
  );
  return createWrapper(renderResult.container).findSelect()!;
}

const options: SelectProps['options'] = [
  { value: 'value1' },
  { value: 'value2', label: 'label2' },
  { value: 'value4', label: 'label4', disabled: true },
];
const optionsWithGroups: SelectProps['options'] = [
  {
    label: 'group1',
    options: [{ value: 'value1', label: 'label1' }, { value: 'value1repeated' }],
  },
  {
    label: 'group2',
    disabled: true,
    options: [{ value: 'value2', label: 'label2' }],
  },
  {
    label: 'group3',
    options: [{ value: 'value3', label: 'label3' }],
  },
  {
    label: 'group4',
    options: [
      { value: 'value4', label: 'label4', disabled: true },
      { value: 'value5', label: 'label5', disabled: true },
    ],
  },
  {
    label: 'group5',
    options: [
      { value: 'value6', label: 'label6' },
      { value: 'value7', label: 'label7' },
    ],
  },
];

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Select renders correct analytics metadata', () => {
  test('on the trigger button', () => {
    const wrapper = renderSelect({});
    let trigger = wrapper.findTrigger()!.getElement();
    validateComponentNameAndLabels(trigger, labels);
    expect(getGeneratedAnalyticsMetadata(trigger)).toMatchSnapshot();

    wrapper.openDropdown();
    trigger = wrapper.findTrigger()!.getElement();
    validateComponentNameAndLabels(trigger, labels);
    expect(getGeneratedAnalyticsMetadata(trigger)).toMatchSnapshot();
  });
  test('when disabled', () => {
    const wrapper = renderSelect({ disabled: true });
    expect(getGeneratedAnalyticsMetadata(wrapper.findTrigger()!.getElement())).toMatchSnapshot();
  });
  test('when readonly', () => {
    const wrapper = renderSelect({ readOnly: true });
    expect(getGeneratedAnalyticsMetadata(wrapper.findTrigger()!.getElement())).toMatchSnapshot();
  });

  describe('with selectedOption', () => {
    test('and defined value', () => {
      const wrapper = renderSelect({ selectedOption: { value: 'value1' } });
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toMatchSnapshot();
    });
    test('and undefined value', () => {
      const wrapper = renderSelect({ selectedOption: { label: 'label1' } });
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toMatchSnapshot();
    });
  });

  test('with simple items', () => {
    const wrapper = renderSelect({});
    wrapper.openDropdown();

    const simpleEnabledItemWithoutLabel = wrapper.findDropdown().findOptionByValue('value1')!.getElement();
    validateComponentNameAndLabels(simpleEnabledItemWithoutLabel, labels);
    expect(getGeneratedAnalyticsMetadata(simpleEnabledItemWithoutLabel)).toMatchSnapshot();

    const simpleEnabledItemWithLabel = wrapper.findDropdown().findOptionByValue('value2')!.getElement();
    validateComponentNameAndLabels(simpleEnabledItemWithLabel, labels);
    expect(getGeneratedAnalyticsMetadata(simpleEnabledItemWithLabel)).toMatchSnapshot();

    const disabledItem = wrapper.findDropdown().findOptionByValue('value4')!.getElement();
    validateComponentNameAndLabels(disabledItem, labels);
    expect(getGeneratedAnalyticsMetadata(disabledItem)).toMatchSnapshot();
  });
  test.each([false, true])('with groups and expandToViewport=%s', expandToViewport => {
    const wrapper = renderSelect({ options: optionsWithGroups, expandToViewport });
    wrapper.openDropdown();

    const enabledItemWithoutLabel = wrapper
      .findDropdown({ expandToViewport })
      .findOptionByValue('value1repeated')!
      .getElement();
    validateComponentNameAndLabels(enabledItemWithoutLabel, labels);
    expect(getGeneratedAnalyticsMetadata(enabledItemWithoutLabel)).toMatchSnapshot();

    const enabledItemWithLabel = wrapper.findDropdown({ expandToViewport }).findOptionByValue('value3')!.getElement();
    validateComponentNameAndLabels(enabledItemWithLabel, labels);
    expect(getGeneratedAnalyticsMetadata(enabledItemWithLabel)).toMatchSnapshot();

    const inDisabledGroup = wrapper.findDropdown({ expandToViewport }).findOptionByValue('value2')!.getElement();
    validateComponentNameAndLabels(inDisabledGroup, labels);
    expect(getGeneratedAnalyticsMetadata(inDisabledGroup)).toMatchSnapshot();

    const disabledItem = wrapper.findDropdown({ expandToViewport }).findOptionByValue('value4')!.getElement();
    validateComponentNameAndLabels(disabledItem, labels);
    expect(getGeneratedAnalyticsMetadata(disabledItem)).toMatchSnapshot();
  });
  test('within a formfield', () => {
    const renderResult = render(
      <FormField label="formfield label">
        <Select options={options} selectedOption={null} onChange={() => {}} />
      </FormField>
    );
    const element = createWrapper(renderResult.container).findSelect()!.getElement();
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
});

test('Internal Select does not render "component" metadata', () => {
  const renderResult = render(
    <InternalSelect options={options} selectedOption={null} ariaLabel="select with metadatada" onChange={() => {}} />
  );
  const wrapper = createWrapper(renderResult.container).findSelect()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.findTrigger()!.getElement()).contexts).toBeUndefined();
});
