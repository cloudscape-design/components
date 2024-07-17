// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';
import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import Button, { ButtonProps } from '../../../lib/components/button';
import InternalButton from '../../../lib/components/button/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';
import labels from '../../../lib/components/button/analytics-metadata/styles.css.js';

function renderButton(props: ButtonProps = {}) {
  const renderResult = render(<Button {...props} />);
  return createWrapper(renderResult.container).findButton()!;
}

const getMetadata = (label: string, variant: string, disabled?: boolean) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Button',
          label,
          properties: {
            variant,
            disabled: disabled ? 'true' : 'false',
          },
        },
      },
    ],
  };
  if (!disabled) {
    metadata.action = 'click';
    metadata.detail = { label };
  }
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Button renders correct analytics metadata', () => {
  test('when it is empty and with no aria label', () => {
    const wrapper = renderButton();
    validateComponentNameAndLabels(wrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('', 'normal'));
  });
  test('when it is empty and has aria label', () => {
    const wrapper = renderButton({ variant: 'primary', ariaLabel: 'button text', disabled: true });
    validateComponentNameAndLabels(wrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('button text', 'primary', true));
  });
  test('when it has text content', () => {
    const wrapper = renderButton({ children: 'inline button text', disabled: true, disabledReason: 'reason' });
    validateComponentNameAndLabels(wrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(
      getMetadata('inline button text', 'normal', true)
    );
  });
  test('when it has text content and aria label', () => {
    const wrapper = renderButton({ children: 'inline button text', ariaLabel: 'button text aria' });
    validateComponentNameAndLabels(wrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('inline button text', 'normal'));
  });
  test('when it has icon variant', () => {
    const wrapper = renderButton({ ariaLabel: 'button text aria', variant: 'inline-icon' });
    validateComponentNameAndLabels(wrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('button text aria', 'inline-icon'));
  });
});

test('Internal Button does not render "component" metadata', () => {
  const renderResult = render(<InternalButton>inline button text</InternalButton>);
  const wrapper = createWrapper(renderResult.container).findButton()!;
  validateComponentNameAndLabels(wrapper.getElement(), labels);
  expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({
    action: 'click',
    detail: {
      label: 'inline button text',
    },
  });
});
