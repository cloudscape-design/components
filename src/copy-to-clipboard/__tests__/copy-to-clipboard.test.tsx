// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CopyToClipboard from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';
import TestI18nProvider from '../../../lib/components/i18n/testing';

const defaultProps = {
  copyTarget: 'Test content',
  textToCopy: 'Text to copy',
  copyButtonText: 'Copy',
  i18nStrings: {
    copySuccessText: 'Copied to clipboard',
    copyErrorText: 'Failed to copy to clipboard',
  },
};

describe('CopyToClipboard', () => {
  const originalNavigatorClipboard = global.navigator.clipboard;

  beforeEach(() => {
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
    const { container } = render(<CopyToClipboard {...defaultProps} copyButtonAriaLabel="Copy test content" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('Copy');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy test content');
    expect(wrapper.findTextToCopy()).toBe(null);
  });

  test('renders an inline button with aria-label and text to copy', () => {
    const { container } = render(
      <CopyToClipboard {...defaultProps} variant="inline" copyButtonAriaLabel="Copy test content" />
    );
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

  test('copies to clipboard and shows success message', async () => {
    const { container } = render(<CopyToClipboard {...defaultProps} />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    wrapper.findCopyButton().click();
    await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard'));
  });

  test('fails to copy to clipboard and shows error message', async () => {
    const { container } = render(<CopyToClipboard {...defaultProps} textToCopy="Text to copy with error" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    wrapper.findCopyButton().click();
    await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard'));
  });

  test('uses i18n provider', async () => {
    function TestComponent({ textToCopy }: { textToCopy: string }) {
      return (
        <TestI18nProvider
          messages={{
            'copy-to-clipboard': {
              'i18nStrings.copySuccessText': 'Copied i18n',
              'i18nStrings.copyErrorText': 'Failed i18n',
            },
          }}
        >
          <CopyToClipboard {...defaultProps} textToCopy={textToCopy} i18nStrings={undefined} />
        </TestI18nProvider>
      );
    }

    const { container, rerender } = render(<TestComponent textToCopy="Text to copy" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    wrapper.findCopyButton().click();
    await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied i18n'));

    rerender(<TestComponent textToCopy="Text to copy with error" />);

    wrapper.findCopyButton().click();
    await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed i18n'));
  });
});
