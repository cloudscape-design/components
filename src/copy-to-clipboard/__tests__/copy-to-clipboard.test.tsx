// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import CopyToClipboard from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultProps = {
  copyTarget: 'Test content',
  textToCopy: 'Text to copy',
  copyButtonText: 'Copy',
  copySuccessText: 'Copied to clipboard',
  copyErrorText: 'Failed to copy to clipboard',
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

  test('renders an icon button with aria-label and no text to copy', () => {
    const { container } = render(
      <CopyToClipboard {...defaultProps} variant="icon" copyButtonAriaLabel="Copy test content" />
    );
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('');
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

  test('renders an inline button with custom content and separate text to copy', () => {
    const mockedWriteText = jest.fn().mockResolvedValue(act(() => new Promise(() => {}))); // The act here is just to prevent console warnings when tests run

    Object.assign(global.navigator, {
      clipboard: {
        writeText: mockedWriteText,
      },
    });

    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" content="Copy test content" />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy');
    expect(wrapper.findTextToCopy()!.getElement().textContent).toBe('Copy test content');

    // Assert content written to the clipboard
    wrapper.findCopyButton().click();
    expect(mockedWriteText).toHaveBeenCalledWith('Text to copy');
  });

  describe.each([false, true])('popoverRenderWithPortal set to %s', (popoverRenderWithPortal: boolean) => {
    test('copies to clipboard and shows success message', async () => {
      const { container } = render(
        <CopyToClipboard {...defaultProps} popoverRenderWithPortal={popoverRenderWithPortal} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() =>
        expect(wrapper.findStatusText({ popoverRenderWithPortal })!.getElement().textContent).toBe(
          'Copied to clipboard'
        )
      );
    });

    test('copies to clipboard and shows success message when clicking on popover trigger', async () => {
      const { container } = render(
        <CopyToClipboard {...defaultProps} popoverRenderWithPortal={popoverRenderWithPortal} />
      );
      const copyToClipboardWrapper = createWrapper(container).findCopyToClipboard()!;
      const popoverWrapper = createWrapper(container).findPopover();

      popoverWrapper!.findTrigger().click();
      await waitFor(() =>
        expect(copyToClipboardWrapper.findStatusText({ popoverRenderWithPortal })!.getElement().textContent).toBe(
          'Copied to clipboard'
        )
      );
    });

    test('fails to copy to clipboard and shows error message', async () => {
      const { container } = render(
        <CopyToClipboard
          {...defaultProps}
          popoverRenderWithPortal={popoverRenderWithPortal}
          textToCopy="Text to copy with error"
        />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() =>
        expect(wrapper.findStatusText({ popoverRenderWithPortal })!.getElement().textContent).toBe(
          'Failed to copy to clipboard'
        )
      );
    });

    describe('when the clipboard API is not available', () => {
      beforeEach(() => Object.assign(global.navigator, { clipboard: undefined }));
      afterEach(() => Object.assign(global.navigator, { clipboard: originalNavigatorClipboard }));

      test('fails to copy to clipboard and shows error message', async () => {
        const { container } = render(
          <CopyToClipboard
            {...defaultProps}
            popoverRenderWithPortal={popoverRenderWithPortal}
            textToCopy="Text to copy with error"
          />
        );
        const wrapper = createWrapper(container).findCopyToClipboard()!;

        wrapper.findCopyButton().click();
        await waitFor(() =>
          expect(wrapper.findStatusText({ popoverRenderWithPortal })!.getElement().textContent).toBe(
            'Failed to copy to clipboard'
          )
        );
      });
    });
  });
});
