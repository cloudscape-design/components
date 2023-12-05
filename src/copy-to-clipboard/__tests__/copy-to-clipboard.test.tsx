// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import CopyToClipboard from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';
import TestI18nProvider from '../../../lib/components/i18n/testing';

const clickFn = jest.fn();

const defaultProps = {
  onClick: clickFn,
  i18nStrings: {
    copyButtonText: 'Copy',
  },
};

describe('CopyToClipboard', () => {
  beforeEach(() => {
    clickFn.mockClear();
  });

  test('renders a normal button with text and aria-label', () => {
    const { container } = render(
      <CopyToClipboard {...defaultProps} ariaLabel="Copy test content" message="Test content copied" />
    );
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('Copy');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy test content');

    wrapper.findCopyButton().click();
    expect(wrapper.findMessage()!.getElement().textContent).toBe('Test content copied');
    expect(clickFn).toBeCalledTimes(1);
  });

  test('renders an inline button with aria-label', () => {
    const { container } = render(
      <CopyToClipboard {...defaultProps} variant="inline" ariaLabel="Copy test content" message="Test content copied" />
    );
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy test content');

    wrapper.findCopyButton().click();
    expect(wrapper.findMessage()!.getElement().textContent).toBe('Test content copied');
    expect(clickFn).toBeCalledTimes(1);
  });

  test('renders an inline button with text used as aria-label if no aria-label is given', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" message="Test content copied" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy');

    wrapper.findCopyButton().click();
    expect(wrapper.findMessage()!.getElement().textContent).toBe('Test content copied');
    expect(clickFn).toBeCalledTimes(1);
  });

  test('takes labels from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          'copy-to-clipboard': { 'i18nStrings.copyButtonText': 'Copy from i18n' },
        }}
      >
        <CopyToClipboard message="Test content copied" onClick={clickFn} />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('Copy from i18n');
  });
});
