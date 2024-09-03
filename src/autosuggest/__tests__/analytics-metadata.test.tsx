// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import InternalAutosuggest from '../../../lib/components/autosuggest/internal';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import optionLabels from '../../../lib/components/internal/components/option/analytics-metadata/styles.css.js';
import selectableItemsLabels from '../../../lib/components/internal/components/selectable-item/analytics-metadata/styles.css.js';

const labels = { ...selectableItemsLabels, ...optionLabels };

function renderAutosuggest(props: Partial<AutosuggestProps>) {
  const renderResult = render(
    <Autosuggest
      options={options}
      value=""
      ariaLabel="autosuggest with metadatada"
      enteredTextLabel={value => `Use "${value}"`}
      onChange={() => {}}
      clearAriaLabel="clear content"
      {...props}
    />
  );
  return createWrapper(renderResult.container).findAutosuggest()!;
}

const getMetadataContexts = (label = 'autosuggest with metadatada', disabled?: boolean) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Autosuggest',
          label,
          properties: {
            disabled: disabled ? 'true' : 'false',
          },
        },
      },
    ],
  };
  return metadata;
};

const options: AutosuggestProps['options'] = [
  { value: 'value1' },
  { value: 'value2', label: 'label2' },
  { value: 'value4', label: 'label4', disabled: true },
];
const optionsWithGroups: AutosuggestProps['options'] = [
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
describe('Autosuggest renders correct analytics metadata', () => {
  test('on the clear input button', () => {
    const wrapper = renderAutosuggest({ value: 'something' });
    const clearButton = wrapper.findClearButton()!.getElement();
    validateComponentNameAndLabels(clearButton, labels);
    expect(getGeneratedAnalyticsMetadata(clearButton)).toEqual({
      action: 'clearInput',
      detail: { label: 'clear content' },
      ...getMetadataContexts(),
    });
  });
  test('when disabled', () => {
    const wrapper = renderAutosuggest({ disabled: true });
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({
      ...getMetadataContexts(undefined, true),
    });
  });
  test('with simple items', () => {
    const wrapper = renderAutosuggest({ value: 'something' });
    wrapper.findNativeInput().focus();

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
    const wrapper = renderAutosuggest({ options: optionsWithGroups, expandToViewport });
    wrapper.findNativeInput().focus();

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
        <Autosuggest
          options={options}
          value=""
          enteredTextLabel={value => `Use "${value}"`}
          onChange={() => {}}
          clearAriaLabel="clear content"
        />
      </FormField>
    );
    const element = createWrapper(renderResult.container).findAutosuggest()!.getElement();
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({
      contexts: [
        ...getMetadataContexts('formfield label').contexts!,
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
});

test('Internal Autosuggest does not render "component" metadata', () => {
  const renderResult = render(
    <InternalAutosuggest
      options={options}
      value=""
      ariaLabel="autosuggest with metadatada"
      enteredTextLabel={value => `Use "${value}"`}
      onChange={() => {}}
      clearAriaLabel="clear content"
    />
  );
  const wrapper = createWrapper(renderResult.container).findAutosuggest()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.findNativeInput()!.getElement())).toEqual({});
});
