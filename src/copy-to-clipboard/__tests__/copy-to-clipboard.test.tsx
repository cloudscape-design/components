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
  const originalNavigatorPermissions = global.navigator.permissions;

  beforeEach(() => {
    Object.assign(global.navigator, {
      clipboard: {
        writeText: (text: string) =>
          new Promise<void>((resolve, reject) => (text.includes('error') ? reject() : resolve())),
      },
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
  });

  afterEach(() => {
    Object.assign(global.navigator, {
      clipboard: originalNavigatorClipboard,
      permissions: originalNavigatorPermissions,
    });
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

  test('renders an inline button with custom text to display and separate text to copy', () => {
    const mockedWriteText = jest.fn().mockResolvedValue(act(() => new Promise(() => {}))); // The act here is just to prevent console warnings when tests run

    Object.assign(global.navigator, {
      clipboard: {
        writeText: mockedWriteText,
      },
    });

    const { container } = render(
      <CopyToClipboard {...defaultProps} variant="inline" textToDisplay="Copy test content" />
    );
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findCopyButton().getElement().textContent).toBe('');
    expect(wrapper.findCopyButton().getElement()).toHaveAccessibleName('Copy');
    expect(wrapper.findDisplayedText()!.getElement().textContent).toBe('Copy test content');

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

    describe('when disabled', () => {
      test('disables the copy button', () => {
        const { container } = render(
          <CopyToClipboard
            {...defaultProps}
            popoverRenderWithPortal={popoverRenderWithPortal}
            textToCopy="Text to copy with error"
            disabled={true}
          />
        );

        const copyButton = createWrapper(container).findCopyToClipboard()!.findCopyButton()!;

        expect(copyButton.isDisabled()).toBe(true);
      });

      test('sets the disabled reason when button is focused', async () => {
        const { container } = render(
          <CopyToClipboard
            {...defaultProps}
            popoverRenderWithPortal={popoverRenderWithPortal}
            textToCopy="Text to copy with error"
            disabled={true}
            disabledReason="Disabled reason"
          />
        );

        const copyToClipboardButton = createWrapper(container).findCopyToClipboard()!;
        copyToClipboardButton.findCopyButton()!.focus();

        await waitFor(() => {
          expect(copyToClipboardButton.findCopyButton()!.findDisabledReason()!.getElement()).toHaveTextContent(
            'Disabled reason'
          );
        });
      });

      test('does not show the popover when clicked', () => {
        const { container } = render(
          <CopyToClipboard
            {...defaultProps}
            popoverRenderWithPortal={popoverRenderWithPortal}
            textToCopy="Text to copy with error"
            disabled={true}
            disabledReason="Disabled reason"
          />
        );

        const wrapper = createWrapper(container);
        wrapper.findCopyToClipboard()!.click();

        expect(wrapper.findPopover()).toBeNull();
      });
    });
  });

  describe('permissions API behavior', () => {
    test('shows error state when clipboard-write permission is denied', async () => {
      Object.assign(global.navigator, {
        permissions: {
          query: jest.fn().mockResolvedValue({ state: 'denied' }),
        },
      });

      const { container } = render(<CopyToClipboard {...defaultProps} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() =>
        expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard')
      );
    });

    test('shows success state when clipboard-write permission is granted', async () => {
      Object.assign(global.navigator, {
        permissions: {
          query: jest.fn().mockResolvedValue({ state: 'granted' }),
        },
      });

      const { container } = render(<CopyToClipboard {...defaultProps} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard'));
    });

    test('defaults to success state when permissions API is not available', async () => {
      Object.assign(global.navigator, { permissions: undefined });

      const { container } = render(<CopyToClipboard {...defaultProps} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard'));
    });

    test('defaults to success state when permissions query fails', async () => {
      Object.assign(global.navigator, {
        permissions: {
          query: jest.fn().mockRejectedValue(new Error('Permission query failed')),
        },
      });

      const { container } = render(<CopyToClipboard {...defaultProps} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard'));
    });
  });

  describe('onCopySuccess callback', () => {
    test.each(['simple text', 'special chars: @#$%^&*()', 'unicode: 你好世界 🎉', 'multiline\ntext\nhere'])(
      'passes correct text to callback for various string types - %s',
      async textToCopy => {
        Object.assign(global.navigator, {
          clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
        });

        const onCopySuccess = jest.fn();
        const { container } = render(
          <CopyToClipboard {...defaultProps} textToCopy={textToCopy} onCopySuccess={onCopySuccess} />
        );
        const wrapper = createWrapper(container).findCopyToClipboard()!;

        wrapper.findCopyButton().click();
        await waitFor(() => {
          expect(onCopySuccess).toHaveBeenCalledWith(expect.objectContaining({ detail: { text: textToCopy } }));
        });
      }
    );

    test('invokes callback on successful copy', async () => {
      const onCopySuccess = jest.fn();
      const { container } = render(<CopyToClipboard {...defaultProps} onCopySuccess={onCopySuccess} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => {
        expect(onCopySuccess).toHaveBeenCalledTimes(1);
      });
    });

    test('callback receives correct text in detail object', async () => {
      const onCopySuccess = jest.fn();
      const { container } = render(<CopyToClipboard {...defaultProps} onCopySuccess={onCopySuccess} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => {
        expect(onCopySuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { text: 'Text to copy' },
          })
        );
      });
    });

    test('does not invoke callback on copy failure', async () => {
      const onCopySuccess = jest.fn();
      const { container } = render(
        <CopyToClipboard {...defaultProps} textToCopy="Text to copy with error" onCopySuccess={onCopySuccess} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() =>
        expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard')
      );
      expect(onCopySuccess).not.toHaveBeenCalled();
    });

    test('does not invoke callback when prop is undefined', async () => {
      const { container } = render(<CopyToClipboard {...defaultProps} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      // Should not throw when callback is undefined
      wrapper.findCopyButton().click();
      await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard'));
    });

    test('does not invoke callback when component is disabled', async () => {
      const onCopySuccess = jest.fn();
      const { container } = render(<CopyToClipboard {...defaultProps} disabled={true} onCopySuccess={onCopySuccess} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      // Wait a bit to ensure no async callback is triggered
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(onCopySuccess).not.toHaveBeenCalled();
    });
  });

  describe('onCopyFailure callback', () => {
    test.each(['simple text', 'special chars: @#$%^&*()', 'unicode: 你好世界 🎉', 'multiline\ntext\nhere'])(
      'passes correct text to callback for various string types - %s',
      async textToCopy => {
        Object.assign(global.navigator, {
          clipboard: { writeText: jest.fn().mockRejectedValue(new Error('Copy failed')) },
        });

        const onCopyFailure = jest.fn();
        const { container } = render(
          <CopyToClipboard {...defaultProps} textToCopy={textToCopy} onCopyFailure={onCopyFailure} />
        );
        const wrapper = createWrapper(container).findCopyToClipboard()!;

        wrapper.findCopyButton().click();
        await waitFor(() => {
          expect(onCopyFailure).toHaveBeenCalledWith(expect.objectContaining({ detail: { text: textToCopy } }));
        });
      }
    );

    test('invokes callback on copy failure', async () => {
      const onCopyFailure = jest.fn();
      const { container } = render(
        <CopyToClipboard {...defaultProps} textToCopy="Text to copy with error" onCopyFailure={onCopyFailure} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => {
        expect(onCopyFailure).toHaveBeenCalledTimes(1);
      });
    });

    test('invokes callback when Clipboard API is unavailable', async () => {
      Object.assign(global.navigator, { clipboard: undefined });

      const onCopyFailure = jest.fn();
      const { container } = render(<CopyToClipboard {...defaultProps} onCopyFailure={onCopyFailure} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => {
        expect(onCopyFailure).toHaveBeenCalledTimes(1);
      });
    });

    test('callback receives correct text in detail object', async () => {
      const onCopyFailure = jest.fn();
      const { container } = render(
        <CopyToClipboard {...defaultProps} textToCopy="Text to copy with error" onCopyFailure={onCopyFailure} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => {
        expect(onCopyFailure).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { text: 'Text to copy with error' },
          })
        );
      });
    });

    test('does not invoke callback on successful copy', async () => {
      const onCopyFailure = jest.fn();
      const { container } = render(<CopyToClipboard {...defaultProps} onCopyFailure={onCopyFailure} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      await waitFor(() => expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard'));
      expect(onCopyFailure).not.toHaveBeenCalled();
    });

    test('does not invoke callback when prop is undefined', async () => {
      const { container } = render(<CopyToClipboard {...defaultProps} textToCopy="Text to copy with error" />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      // Should not throw when callback is undefined
      wrapper.findCopyButton().click();
      await waitFor(() =>
        expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard')
      );
    });

    test('does not invoke callback when component is disabled', async () => {
      const onCopyFailure = jest.fn();
      const { container } = render(
        <CopyToClipboard
          {...defaultProps}
          textToCopy="Text to copy with error"
          disabled={true}
          onCopyFailure={onCopyFailure}
        />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();
      // Wait a bit to ensure no async callback is triggered
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(onCopyFailure).not.toHaveBeenCalled();
    });
  });
});
