// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import createWrapper from '../../../lib/components/test-utils/dom';
import Toggle, { ToggleProps } from '../../../lib/components/toggle';
import InternalToggle from '../../../lib/components/toggle/internal';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/internal/components/abstract-switch/analytics-metadata/styles.css.js';

function renderToggle(props: ToggleProps) {
  const renderResult = render(<Toggle {...props} />);
  return createWrapper(renderResult.container).findToggle()!.findNativeInput()!.getElement();
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
          name: 'awsui.Toggle',
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
describe('Toggle renders correct analytics metadata', () => {
  test('simple', () => {
    const element = renderToggle({ children: 'cb label', checked: false });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('cb label', false));
  });
  test('with aria-label', () => {
    const element = renderToggle({ ariaLabel: 'aria label', checked: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('aria label', true));
  });
  test('disabled', () => {
    const element = renderToggle({ children: 'cb label', checked: true, disabled: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('cb label', true, true));
  });
  test('readonly', () => {
    const element = renderToggle({ children: 'cb label', checked: true, readOnly: true });
    validateComponentNameAndLabels(element, labels);
    expect(getGeneratedAnalyticsMetadata(element)).toEqual(getMetadata('cb label', true, true));
  });
});

test('Internal Toggle does not render "component" metadata', () => {
  const renderResult = render(<InternalToggle checked={true}>toggle label</InternalToggle>);
  const element = createWrapper(renderResult.container).findToggle()!.findNativeInput()!.getElement();
  validateComponentNameAndLabels(element, labels);
  expect(getGeneratedAnalyticsMetadata(element)).toEqual({
    action: 'select',
    detail: {
      selected: 'false',
      label: 'toggle label',
    },
  });
});
