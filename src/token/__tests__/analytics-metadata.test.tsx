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
import Token, { TokenProps } from '../../../lib/components/token';
import InternalToken from '../../../lib/components/token/internal';

import analyticsSelectors from '../../../lib/components/token/analytics-metadata/styles.css.js';

function renderToken(props: TokenProps) {
  const renderResult = render(<Token {...props} />);
  return createWrapper(renderResult.container).findToken()!;
}

const tokenMetadata: GeneratedAnalyticsMetadataFragment = {
  contexts: [
    {
      type: 'component',
      detail: {
        name: 'awsui.Token',
        label: '',
      },
    },
  ],
};

describe('Token analytics metadata', () => {
  beforeEach(() => {
    activateAnalyticsMetadata(true);
  });

  test('Token renders correct analytics metadata', () => {
    const wrapper = renderToken({ label: 'test' });

    const simpleToken = wrapper.getElement();

    expect(wrapper.findDismiss()).toBe(null);
    expect(getGeneratedAnalyticsMetadata(simpleToken)).toEqual(tokenMetadata);
  });

  test('Internal Token does not render "component" metadata', () => {
    const renderResult = render(<InternalToken label="test" />);
    const wrapper = createWrapper(renderResult.container).findToken();
    expect(getGeneratedAnalyticsMetadata(wrapper!.getElement())).toEqual({});
  });

  test('adds analytics metadata to the token', () => {
    const wrapper = renderToken({ label: 'Test token' });
    expect(wrapper.getElement()).toHaveClass(analyticsSelectors.token);

    const metadata = wrapper.getElement().getAttribute('data-awsui-analytics');
    expect(metadata).toBeTruthy();
  });

  test('adds analytics metadata to the dismiss button', () => {
    const onDismiss = jest.fn();
    const wrapper = renderToken({ label: 'Test token', onDismiss });

    const dismissButton = wrapper.findDismiss()!.getElement();
    const metadata = dismissButton.getAttribute('data-awsui-analytics');
    expect(metadata).toBeTruthy();
  });

  test('does not add analytics metadata to dismiss button when disabled', () => {
    const onDismiss = jest.fn();
    const wrapper = renderToken({ label: 'Test token', onDismiss, disabled: true });

    const dismissButton = wrapper.findDismiss()!.getElement();
    const metadata = dismissButton.getAttribute('data-awsui-analytics');
    expect(metadata).toBeFalsy();
  });

  test('does not add analytics metadata to dismiss button when readOnly', () => {
    const onDismiss = jest.fn();
    const wrapper = renderToken({ label: 'Test token', onDismiss, readOnly: true });

    const dismissButton = wrapper.findDismiss()!.getElement();
    const metadata = dismissButton.getAttribute('data-awsui-analytics');
    expect(metadata).toBeFalsy();
  });
});
