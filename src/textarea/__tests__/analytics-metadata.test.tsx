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
import createWrapper from '../../../lib/components/test-utils/dom';
import Textarea, { TextareaProps } from '../../../lib/components/textarea';

const getComponentMetadata = (label: string, value: string) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Textarea',
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

function renderTextarea(props: Partial<TextareaProps>) {
  const renderResult = render(<Textarea value="a" onChange={() => {}} {...props} />);
  return createWrapper(renderResult.container).findTextarea()!;
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Input renders correct analytics metadata', () => {
  test('with aria label', () => {
    const componentElement = renderTextarea({ ariaLabel: 'label' }).getElement();
    expect(getGeneratedAnalyticsMetadata(componentElement)).toEqual(getComponentMetadata('label', 'a'));
  });
  test('with empty value', () => {
    const componentElement = renderTextarea({ ariaLabel: 'label', value: '' }).getElement();
    expect(getGeneratedAnalyticsMetadata(componentElement)).toEqual(getComponentMetadata('label', ''));
  });
  test('within a form field', () => {
    const formFieldLabel = 'form-field-label';
    const renderResult = render(
      <FormField label={formFieldLabel}>
        <Textarea value="a" onChange={() => {}} />
      </FormField>
    );
    const componentElement = createWrapper(renderResult.container).findTextarea()!.getElement();
    expect(getGeneratedAnalyticsMetadata(componentElement)).toEqual({
      contexts: [
        {
          type: 'component',
          detail: {
            name: 'awsui.Textarea',
            label: formFieldLabel,
            properties: {
              value: 'a',
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
