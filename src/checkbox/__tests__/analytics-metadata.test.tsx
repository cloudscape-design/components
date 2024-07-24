// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
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

const getMetadata = (label: string, checked: boolean, disabled?: boolean) => {
  const eventMetadata = {
    action: 'select',
    detail: {
      label,
      selected: `${!checked}`,
    },
  };

  let metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Checkbox',
          label,
        },
      },
    ],
  };
  if (!disabled) {
    metadata = { ...metadata, ...eventMetadata };
  }
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Checkbox renders correct analytics metadata', () => {
  test('simple', () => {
    const element = renderCheckbox({ children: 'cb label', checked: false });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('cb label', false));
  });
  test('with aria-label', () => {
    const element = renderCheckbox({ ariaLabel: 'aria label', checked: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('aria label', true));
  });
  test('disabled', () => {
    const element = renderCheckbox({ children: 'cb label', checked: true, disabled: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('cb label', true, true));
  });
  test('readonly', () => {
    const element = renderCheckbox({ children: 'cb label', checked: true, readOnly: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('cb label', true, true));
  });
});

test('Internal Checkbox does not render "component" metadata', () => {
  const renderResult = render(<InternalCheckbox checked={true} />);
  const element = createWrapper(renderResult.container).findCheckbox()!.findNativeInput()!.getElement();
  validateComponentNameAndLabels(element, labels);
  expect(getGeneratedAnalyticsMetadata(element)).toEqual({
    action: 'select',
    detail: {
      selected: 'false',
    },
  });
});
