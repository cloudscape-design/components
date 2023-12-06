// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CopyToClipboard, { CopyToClipboardProps } from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';
import TestI18nProvider from '../../../lib/components/i18n/testing';

const onCopySuccess = jest.fn();
const onCopyError = jest.fn();

const defaultProps = {
  onCopySuccess,
  onCopyError,
  copyTarget: 'Test content',
  textToCopy: 'Text to copy',
  i18nStrings: {
    copyButtonText: 'Copy',
    copySuccessText: (copyTarget: string) => `${copyTarget} copied`,
    copyErrorText: (copyTarget: string) => `${copyTarget} failed to copy`,
  },
};

describe('CopyToClipboard', () => {
  const originalNavigatorClipboard = global.navigator.clipboard;

  beforeEach(() => {
    onCopySuccess.mockClear();
    onCopyError.mockClear();

    Object.assign(global.navigator, {
      clipboard: {
        writeText: (text: string) =>
          new Promise<void>((resolve, reject) => (text.includes('error') ? reject() : resolve())),
      },
    });
  });

  afterEach(() => {
    Object.assign(global.navigator, { clipboard: originalNavigatorClipboard });
  });

  test('renders a normal button with button text and aria-label and no text to copy', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} ariaLabel="Copy test content" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('Copy');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy test content');
    expect(wrapper.findTextToCopy()).toBe(null);
  });

  test('renders an inline button with aria-label and text to copy', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" ariaLabel="Copy test content" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy test content');
    expect(wrapper.findTextToCopy()!.getElement().textContent).toBe('Text to copy');
  });

  test('renders an inline button with button text as aria label when no explicit aria label provided', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy');
    expect(wrapper.findTextToCopy()!.getElement().textContent).toBe('Text to copy');
  });

  test('copies to clipboard, shows i18n message, and fires onCopySuccess', async () => {
    const { container } = render(<CopyToClipboard {...defaultProps} />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    wrapper.findCopyButton().click();
    await waitFor(() => {
      expect(wrapper.findStatusText()!.getElement().textContent).toBe('Test content copied');
      expect(onCopySuccess).toBeCalledTimes(1);
    });
  });

  test('fails to copy to clipboard, shows i18n message, and fires onCopyError', async () => {
    const { container } = render(<CopyToClipboard {...defaultProps} textToCopy="Text to copy with error" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    wrapper.findCopyButton().click();
    await waitFor(() => {
      expect(wrapper.findStatusText()!.getElement().textContent).toBe('Test content failed to copy');
      expect(onCopyError).toBeCalledTimes(1);
    });
  });

  test('uses i18n provider for all messages', async () => {
    const TestComponent = (props: Partial<CopyToClipboardProps>) => (
      <TestI18nProvider
        messages={{
          'copy-to-clipboard': {
            'i18nStrings.copyButtonText': 'Copy i18n',
            'i18nStrings.copySuccessText': '{copyTarget} copied i18n',
            'i18nStrings.copyErrorText': '{copyTarget} failed i18n',
          },
        }}
      >
        <CopyToClipboard {...defaultProps} i18nStrings={undefined} {...props} />
      </TestI18nProvider>
    );

    const { container, rerender } = render(<TestComponent />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('Copy i18n');

    wrapper.findCopyButton().click();
    await waitFor(() => expect(wrapper.findStatusText()!.getElement()).toHaveTextContent('Test content copied i18n'));

    rerender(<TestComponent textToCopy="Text to copy with error" />);

    wrapper.findCopyButton().click();
    await waitFor(() => expect(wrapper.findStatusText()!.getElement()).toHaveTextContent('Test content failed i18n'));
  });
});
