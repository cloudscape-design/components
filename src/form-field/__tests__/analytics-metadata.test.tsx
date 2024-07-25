// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import FormField from '../../../lib/components/form-field';
import InternalFormField from '../../../lib/components/form-field/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/form-field/analytics-metadata/styles.css.js';

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Form field', () => {
  test('renders correct component metadata', () => {
    const renderResult = render(<FormField label="form field label" />);
    const element = createWrapper(renderResult.container).findFormField()!.getElement()!;
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({
      contexts: [
        {
          type: 'component',
          detail: {
            name: 'awsui.FormField',
            label: 'form field label',
          },
        },
      ],
    });
  });
  test('does not render metadata when internal version is used', () => {
    const renderResult = render(<InternalFormField label="form field label" />);
    const element = createWrapper(renderResult.container).findFormField()!.getElement()!;
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual({});
  });
});
