// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Checkbox, { CheckboxProps } from '../../../lib/components/checkbox';
import InternalCheckbox from '../../../lib/components/checkbox/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/internal/components/abstract-switch/analytics-metadata/styles.css.js';

function renderCheckbox(props: CheckboxProps) {
  const renderResult = render(<Checkbox {...props} />);
  return createWrapper(renderResult.container).findCheckbox()!.findNativeInput()!.getElement();
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Checkbox renders correct analytics metadata', () => {
  test('simple', () => {
    const element = renderCheckbox({ children: 'cb label', checked: false });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
  test('with aria-label', () => {
    const element = renderCheckbox({ ariaLabel: 'aria label', checked: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
  test('disabled', () => {
    const element = renderCheckbox({ children: 'cb label', checked: true, disabled: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
  test('readonly', () => {
    const element = renderCheckbox({ children: 'cb label', checked: true, readOnly: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
});

test('Internal Checkbox does not render "component" metadata', () => {
  const renderResult = render(<InternalCheckbox checked={true} />);
  const element = createWrapper(renderResult.container).findCheckbox()!.findNativeInput()!.getElement();
  validateComponentNameAndLabels(element, labels);
  expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
});
