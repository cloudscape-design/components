// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
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

const getMetadataContexts = (selectedOptionsCount = 0, label = 'multiselect with metadata', disabled?: boolean) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Multiselect',
          label,
          properties: {
            disabled: disabled ? 'true' : 'false',
            selectedOptionsCount: `${selectedOptionsCount}`,
          },
        },
      },
    ],
  };
  return metadata;
};

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
    expect(getGeneratedAnalyticsMetadata(trigger)).toEqual({
      action: 'expand',
      detail: {
        label: 'multiselect with metadata',
        expanded: 'true',
      },
      ...getMetadataContexts(),
    });

    wrapper.openDropdown();
    trigger = wrapper.findTrigger()!.getElement();
    validateComponentNameAndLabels(trigger, labels);
    expect(getGeneratedAnalyticsMetadata(trigger)).toEqual({
      action: 'expand',
      detail: {
        label: 'multiselect with metadata',
        expanded: 'false',
      },
      ...getMetadataContexts(),
    });
  });
  test('when disabled', () => {
    const wrapper = renderMultiselect({ disabled: true });
    expect(getGeneratedAnalyticsMetadata(wrapper.findTrigger()!.getElement())).toEqual({
      ...getMetadataContexts(0, undefined, true),
    });
  });

  test('with simple items', () => {
    const wrapper = renderMultiselect({});
    wrapper.openDropdown();

    const simpleEnabledItemWithoutLabel = wrapper.findDropdown().findOptionByValue('value1')!.getElement();
    validateComponentNameAndLabels(simpleEnabledItemWithoutLabel, labels);
    expect(getGeneratedAnalyticsMetadata(simpleEnabledItemWithoutLabel)).toEqual({
      action: 'select',
      detail: {
        label: 'value1',
        position: '1',
        value: 'value1',
      },
      ...getMetadataContexts(),
    });

    const simpleEnabledItemWithLabel = wrapper.findDropdown().findOptionByValue('value2')!.getElement();
    validateComponentNameAndLabels(simpleEnabledItemWithLabel, labels);
    expect(getGeneratedAnalyticsMetadata(simpleEnabledItemWithLabel)).toEqual({
      action: 'select',
      detail: {
        label: 'label2',
        position: '2',
        value: 'value2',
      },
      ...getMetadataContexts(),
    });

    const disabledItem = wrapper.findDropdown().findOptionByValue('value4')!.getElement();
    validateComponentNameAndLabels(disabledItem, labels);
    expect(getGeneratedAnalyticsMetadata(disabledItem)).toEqual({
      ...getMetadataContexts(),
    });
  });
  test.each([false, true])('with groups and expandToViewport=%s', expandToViewport => {
    const wrapper = renderMultiselect({ options: optionsWithGroups, expandToViewport });
    wrapper.openDropdown();

    const enabledItemWithoutLabel = wrapper
      .findDropdown({ expandToViewport })
      .findOptionByValue('value1repeated')!
      .getElement();
    validateComponentNameAndLabels(enabledItemWithoutLabel, labels);
    expect(getGeneratedAnalyticsMetadata(enabledItemWithoutLabel)).toEqual({
      action: 'select',
      detail: {
        label: 'value1repeated',
        position: '1,2',
        value: 'value1repeated',
        groupLabel: 'group1',
      },
      ...getMetadataContexts(),
    });

    const enabledItemWithLabel = wrapper.findDropdown({ expandToViewport }).findOptionByValue('value3')!.getElement();
    validateComponentNameAndLabels(enabledItemWithLabel, labels);
    expect(getGeneratedAnalyticsMetadata(enabledItemWithLabel)).toEqual({
      action: 'select',
      detail: {
        label: 'label3',
        position: '3,1',
        value: 'value3',
        groupLabel: 'group3',
      },
      ...getMetadataContexts(),
    });

    const inDisabledGroup = wrapper.findDropdown({ expandToViewport }).findOptionByValue('value2')!.getElement();
    validateComponentNameAndLabels(inDisabledGroup, labels);
    expect(getGeneratedAnalyticsMetadata(inDisabledGroup)).toEqual({
      ...getMetadataContexts(),
    });

    const disabledItem = wrapper.findDropdown({ expandToViewport }).findOptionByValue('value4')!.getElement();
    validateComponentNameAndLabels(disabledItem, labels);
    expect(getGeneratedAnalyticsMetadata(disabledItem)).toEqual({
      ...getMetadataContexts(),
    });
  });
  test('within a formfield', () => {
    const renderResult = render(
      <FormField label="formfield label">
        <Multiselect options={options} selectedOptions={[]} onChange={() => {}} />
      </FormField>
    );
    const element = createWrapper(renderResult.container).findMultiselect()!.getElement();
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({
      contexts: [
        ...getMetadataContexts(0, 'formfield label').contexts!,
        {
          type: 'component',
          detail: {
            name: 'awsui.FormField',
            label: 'formfield label',
          },
        },
      ],
    });
  });
  describe('with selected options', () => {
    test('when readonly', () => {
      const wrapper = renderMultiselectWithSelectedOptions({ readOnly: true });
      const simpleToken = wrapper.findToken(1)!.findDismiss().getElement();
      expect(getGeneratedAnalyticsMetadata(simpleToken)).toEqual(getMetadataContexts(5));
    });

    test('in dismiss button', () => {
      const wrapper = renderMultiselectWithSelectedOptions({});

      const simpleToken = wrapper.findToken(1)!.findDismiss().getElement();
      expect(getGeneratedAnalyticsMetadata(simpleToken)).toEqual({
        action: 'dismiss',
        detail: {
          label: 'Dismiss label1',
          position: '1',
        },
        ...getMetadataContexts(5),
      });

      const disabledToken = wrapper.findToken(3)!.findDismiss().getElement();
      expect(getGeneratedAnalyticsMetadata(disabledToken)).toEqual(getMetadataContexts(5));
    });

    test('in show more', () => {
      const wrapper = renderMultiselectWithSelectedOptions({
        tokenLimit: 3,
        tokenLimitShowFewerAriaLabel: 'show less',
        tokenLimitShowMoreAriaLabel: 'show more',
      });

      const tokenToggle = wrapper.findTokenToggle()!.getElement();
      expect(getGeneratedAnalyticsMetadata(tokenToggle)).toEqual({
        action: 'showMore',
        detail: {
          label: 'show more',
          expanded: 'true',
        },
        ...getMetadataContexts(5),
      });

      wrapper.findTokenToggle()!.click();
      expect(getGeneratedAnalyticsMetadata(wrapper.findTokenToggle()!.getElement())).toEqual({
        action: 'showMore',
        detail: {
          label: 'show less',
          expanded: 'false',
        },
        ...getMetadataContexts(5),
      });
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
    />
  );
  const wrapper = createWrapper(renderResult.container).findMultiselect()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.findTrigger()!.getElement()).contexts).toBeUndefined();
});
