// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';
import InternalInput from '../../../lib/components/input/internal';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/input/styles.css.js';

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Input renders correct analytics metadata', () => {
  describe('on the right button', () => {
    test('when it is the clear button', () => {
      const renderResult = render(<Input value="value" onChange={() => {}} type="search" clearAriaLabel="clear" />);
      const clearInputButton = createWrapper(renderResult.container).findInput()!.findClearButton()!.getElement();
      expect(getGeneratedAnalyticsMetadata(clearInputButton)).toMatchSnapshot();
    });
    test('when it is not the clear button', () => {
      const renderResult = render(<InternalInput value="value" onChange={() => {}} __rightIcon="settings" />);
      const rightIconButton = createWrapper(renderResult.container)
        .findByClassName(styles['input-icon-right'])!
        .getElement();
      expect(getGeneratedAnalyticsMetadata(rightIconButton)).toMatchSnapshot();
    });
  });
  describe('on the component', () => {
    test('with aria label', () => {
      const renderResult = render(<Input value="a" onChange={() => {}} ariaLabel="label" />);
      const componentElement = createWrapper(renderResult.container).findInput()!.getElement();
      expect(getGeneratedAnalyticsMetadata(componentElement)).toMatchSnapshot();
    });
    test('with empty value', () => {
      const renderResult = render(<Input value="" onChange={() => {}} ariaLabel="label" />);
      const componentElement = createWrapper(renderResult.container).findInput()!.getElement();
      expect(getGeneratedAnalyticsMetadata(componentElement)).toMatchSnapshot();
    });
    test('within a form field', () => {
      const formFieldLabel = 'form-field-label';
      const renderResult = render(
        <FormField label={formFieldLabel}>
          <Input value="a" onChange={() => {}} />
        </FormField>
      );
      const componentElement = createWrapper(renderResult.container).findInput()!.getElement();
      expect(getGeneratedAnalyticsMetadata(componentElement)).toMatchSnapshot();
    });
  });
});
