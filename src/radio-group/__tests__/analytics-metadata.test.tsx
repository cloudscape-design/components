// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import FormField from '../../../lib/components/form-field';
import RadioGroup, { RadioGroupProps } from '../../../lib/components/radio-group';
import InternalRadioGroup from '../../../lib/components/radio-group/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import abstractSwitchLabels from '../../../lib/components/internal/components/abstract-switch/analytics-metadata/styles.css.js';
import radioGroupLabels from '../../../lib/components/radio-group/analytics-metadata/styles.css.js';

const labels = {
  ...abstractSwitchLabels,
  ...radioGroupLabels,
};

const items: RadioGroupProps['items'] = [
  {
    value: 'first',
    label: 'First choice',
    disabled: true,
    description: 'This option is disabled.',
  },
  { value: 'second', label: 'Second choice' },
  { value: 'third', label: 'Third choice' },
];

const componentLabel = 'radio group example';

function renderRadioGroup(props: RadioGroupProps) {
  const renderResult = render(<RadioGroup {...props} items={items} ariaLabel={componentLabel} />);
  return createWrapper(renderResult.container).findRadioGroup()!;
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Checkbox renders correct analytics metadata', () => {
  test('with disabled element', () => {
    const wrapper = renderRadioGroup({ value: 'second' });

    validateComponentNameAndLabels(wrapper.findInputByValue('second')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('second')!.getElement())).toMatchSnapshot();
    validateComponentNameAndLabels(wrapper.findInputByValue('first')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('first')!.getElement())).toMatchSnapshot();
  });
  test('with null value', () => {
    const wrapper = renderRadioGroup({ value: null });
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('second')!.getElement())).toMatchSnapshot();
  });
  test('readonly', () => {
    const wrapper = renderRadioGroup({ value: 'second', readOnly: true });

    validateComponentNameAndLabels(wrapper.findInputByValue('second')!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findInputByValue('second')!.getElement())).toMatchSnapshot();
  });
  describe('when rendered in a form field', () => {
    test('without aria label', () => {
      const renderResult = render(
        <FormField label="form field label">
          <RadioGroup items={items} value="second" />
        </FormField>
      );
      const element = createWrapper(renderResult.container).findRadioGroup()!.getElement()!;
      expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
    });
    test('with aria label', () => {
      const renderResult = render(
        <FormField label="form field label">
          <RadioGroup items={items} value="2" ariaLabel="aria label" />
        </FormField>
      );
      const element = createWrapper(renderResult.container).findRadioGroup()!.getElement()!;
      expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
    });
  });
});

test('Internal RadioGroup does not render "component" metadata', () => {
  const renderResult = render(<InternalRadioGroup items={items} value="second" />);
  const element = createWrapper(renderResult.container).findRadioGroup()!.findInputByValue('first')!.getElement();
  validateComponentNameAndLabels(element, labels);
  expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
});
