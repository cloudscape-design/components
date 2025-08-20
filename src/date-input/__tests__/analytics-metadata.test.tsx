// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import DateInput, { DateInputProps } from '../../../lib/components/date-input';
import FormField from '../../../lib/components/form-field';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderDateInput(props: Partial<DateInputProps>) {
  const renderResult = render(<DateInput value="" onChange={() => {}} {...props} />);
  return createWrapper(renderResult.container).findDateInput()!;
}

const getComponentMetadata = (label: string, value: string) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.DateInput',
          label,
          properties: {
            value,
          },
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});

describe('DateInput renders correct analytics metadata', () => {
  describe('on the component', () => {
    test('with aria label', () => {
      const wrapper = renderDateInput({ value: '2023-12-25', ariaLabel: 'label' });
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getComponentMetadata('label', '2023-12-25'));
    });
    test('with empty value', () => {
      const wrapper = renderDateInput({ ariaLabel: 'label' });
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getComponentMetadata('label', ''));
    });
    test('within a form field', () => {
      const formFieldLabel = 'form-field-label';
      const renderResult = render(
        <FormField label={formFieldLabel}>
          <DateInput value="2023-12-25" onChange={() => {}} />
        </FormField>
      );
      const componentElement = createWrapper(renderResult.container).findDateInput()!.getElement();
      expect(getGeneratedAnalyticsMetadata(componentElement)).toEqual({
        contexts: [
          {
            type: 'component',
            detail: {
              name: 'awsui.DateInput',
              label: formFieldLabel,
              properties: {
                value: '2023-12-25',
              },
            },
          },
          {
            type: 'component',
            detail: {
              name: 'awsui.FormField',
              label: formFieldLabel,
            },
          },
        ],
      });
    });
  });
});
