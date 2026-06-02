// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import FormField from '../../../lib/components/form-field';
import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import InternalMultiselect from '../../../lib/components/multiselect/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import buttonTriggerLabels from '../../../lib/components/internal/components/button-trigger/analytics-metadata/styles.css.js';
import optionLabels from '../../../lib/components/internal/components/option/analytics-metadata/styles.css.js';
import selectableItemsLabels from '../../../lib/components/internal/components/selectable-item/analytics-metadata/styles.css.js';

const labels = { ...selectableItemsLabels, ...optionLabels, ...buttonTriggerLabels };

function renderMultiselect(props: Partial<MultiselectProps>) {
  const renderResult = render(
    <Multiselect
      options={options}
      selectedOptions={[]}
      ariaLabel="multiselect with metadata"
      onChange={() => {}}
      {...props}
    />
  );
  return createWrapper(renderResult.container).findMultiselect()!;
}

function renderMultiselectWithSelectedOptions(props: Partial<MultiselectProps>) {
  const renderResult = render(
    <Multiselect
      options={optionsWithGroups}
      selectedOptions={selectedOptions}
      ariaLabel="multiselect with metadata"
      onChange={() => {}}
      {...props}
      deselectAriaLabel={option => `Dismiss ${option.label}`}
    />
  );
  return createWrapper(renderResult.container).findMultiselect()!;
}

const options: MultiselectProps['options'] = [
  { value: 'value1' },
  { value: 'value2', label: 'label2' },
  { value: 'value4', label: 'label4', disabled: true },
];
const optionsWithGroups: MultiselectProps['options'] = [
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

const selectedOptions = [
  { value: 'value1', label: 'label1' },
  { value: 'value4', label: 'label4', disabled: true },
  { value: 'value5', label: 'label5', disabled: true },
  { value: 'value6', label: 'label6' },
  { value: 'value7', label: 'label7' },
];

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Multiselect renders correct analytics metadata', () => {
  test('on the trigger button', () => {
    const wrapper = renderMultiselect({});
    let trigger = wrapper.findTrigger()!.getElement();
    validateComponentNameAndLabels(trigger, labels);
    expect(getGeneratedAnalyticsMetadata(trigger)).toMatchSnapshot();

    wrapper.openDropdown();
    trigger = wrapper.findTrigger()!.getElement();
    validateComponentNameAndLabels(trigger, labels);
    expect(getGeneratedAnalyticsMetadata(trigger)).toMatchSnapshot();
  });
  test('when disabled', () => {
    const wrapper = renderMultiselect({ disabled: true });
    expect(getGeneratedAnalyticsMetadata(wrapper.findTrigger()!.getElement())).toMatchSnapshot();
  });

  test('with simple items', () => {
    const wrapper = renderMultiselect({});
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
    const wrapper = renderMultiselect({ options: optionsWithGroups, expandToViewport });
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
        <Multiselect options={options} selectedOptions={[]} onChange={() => {}} />
      </FormField>
    );
    const element = createWrapper(renderResult.container).findMultiselect()!.getElement();
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
  describe('with selected options', () => {
    test('with one selected option', () => {
      const wrapper = renderMultiselectWithSelectedOptions({ selectedOptions: [selectedOptions[0]] });
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toMatchSnapshot();
    });
    test('with selected options without value', () => {
      const wrapper = renderMultiselectWithSelectedOptions({ selectedOptions: [{ label: 'label1' }] });
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toMatchSnapshot();
    });

    test('when readonly', () => {
      const wrapper = renderMultiselectWithSelectedOptions({ readOnly: true });
      const simpleToken = wrapper.findToken(1)!.findDismiss().getElement();
      expect(getGeneratedAnalyticsMetadata(simpleToken)).toMatchSnapshot();
    });

    test('in dismiss button', () => {
      const wrapper = renderMultiselectWithSelectedOptions({});

      const simpleToken = wrapper.findToken(1)!.findDismiss().getElement();
      expect(getGeneratedAnalyticsMetadata(simpleToken)).toMatchSnapshot();

      const disabledToken = wrapper.findToken(3)!.findDismiss().getElement();
      expect(getGeneratedAnalyticsMetadata(disabledToken)).toMatchSnapshot();
    });

    test('in show more', () => {
      const wrapper = renderMultiselectWithSelectedOptions({
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

test('Internal Multiselect does not render "component" metadata', () => {
  const renderResult = render(
    <InternalMultiselect
      options={options}
      selectedOptions={[]}
      ariaLabel="multiselect with metadatada"
      onChange={() => {}}
      keepOpen={true}
      hideTokens={false}
      statusType="finished"
      filteringType="none"
    />
  );
  const wrapper = createWrapper(renderResult.container).findMultiselect()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.findTrigger()!.getElement()).contexts).toBeUndefined();
});
