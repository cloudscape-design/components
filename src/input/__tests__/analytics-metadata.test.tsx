// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import FormField from '../../../lib/components/form-field/index.js';
import Input from '../../../lib/components/input/index.js';
import InternalInput from '../../../lib/components/input/internal.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';

import styles from '../../../lib/components/input/styles.css.js';

const getComponentMetadata = (label: string, value: string) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Input',
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
describe('Input renders correct analytics metadata', () => {
  describe('on the right button', () => {
    test('when it is the clear button', () => {
      const renderResult = render(<Input value="value" onChange={() => {}} type="search" clearAriaLabel="clear" />);
      const clearInputButton = createWrapper(renderResult.container).findInput()!.findClearButton()!.getElement();
      expect(getGeneratedAnalyticsMetadata(clearInputButton)).toEqual({
        action: 'clearInput',
        detail: {
          label: 'clear',
        },
        ...getComponentMetadata('', 'value'),
      });
    });
    test('when it is not the clear button', () => {
      const renderResult = render(<InternalInput value="value" onChange={() => {}} __rightIcon="settings" />);
      const rightIconButton = createWrapper(renderResult.container)
        .findByClassName(styles['input-icon-right'])!
        .getElement();
      expect(getGeneratedAnalyticsMetadata(rightIconButton)).toEqual({});
    });
  });
  describe('on the component', () => {
    test('with aria label', () => {
      const renderResult = render(<Input value="a" onChange={() => {}} ariaLabel="label" />);
      const componentElement = createWrapper(renderResult.container).findInput()!.getElement();
      expect(getGeneratedAnalyticsMetadata(componentElement)).toEqual(getComponentMetadata('label', 'a'));
    });
    test('with empty value', () => {
      const renderResult = render(<Input value="" onChange={() => {}} ariaLabel="label" />);
      const componentElement = createWrapper(renderResult.container).findInput()!.getElement();
      expect(getGeneratedAnalyticsMetadata(componentElement)).toEqual(getComponentMetadata('label', ''));
    });
    test('within a form field', () => {
      const formFieldLabel = 'form-field-label';
      const renderResult = render(
        <FormField label={formFieldLabel}>
          <Input value="a" onChange={() => {}} />
        </FormField>
      );
      const componentElement = createWrapper(renderResult.container).findInput()!.getElement();
      expect(getGeneratedAnalyticsMetadata(componentElement)).toEqual({
        contexts: [
          {
            type: 'component',
            detail: {
              name: 'awsui.Input',
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
});
