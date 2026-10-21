// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { isThemeActive } from '@cloudscape-design/component-toolkit/internal';

import CopyToClipboard from '../../../lib/components/copy-to-clipboard';
import InternalCopyToClipboard from '../../../lib/components/copy-to-clipboard/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';

import styles from '../../../lib/components/copy-to-clipboard/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  isThemeActive: jest.fn().mockReturnValue(false),
}));

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
    (isThemeActive as jest.Mock).mockReturnValue(false);
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

  test('renders JSX in textToDisplay when variant="inline"', () => {
    const { container } = render(
      <CopyToClipboard
        {...defaultProps}
        variant="inline"
        textToDisplay={
          <>
            styled <strong>content</strong>
          </>
        }
      />
    );
    const wrapper = createWrapper(container).findCopyToClipboard()!;
    const displayedEl = wrapper.findDisplayedText()!.getElement();
    expect(displayedEl.innerHTML).toBe('styled <strong>content</strong>');
  });

  test('renders textToCopy for variant="inline" when textToDisplay is explicitly undefined', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" textToDisplay={undefined} />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findDisplayedText()!.getElement().textContent).toBe('Text to copy');
  });

  test('renders null for variant="inline" when textToDisplay is explicitly null', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" textToDisplay={null} />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    expect(wrapper.findDisplayedText()!.getElement().textContent).toBe('');
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

  test('does not schedule the One Theme status icon timer outside One Theme', async () => {
    jest.useFakeTimers();
    const { container } = render(<CopyToClipboard {...defaultProps} />);
    const wrapper = createWrapper(container).findCopyToClipboard()!;

    await act(async () => {
      wrapper.findCopyButton().click();
      await Promise.resolve();
    });

    expect(jest.getTimerCount()).toBe(0);
    jest.useRealTimers();
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

      // The `inline` variant renders the trigger as an `inline-icon` button, which only gained
      // `disabledReason` support alongside `link` and `inline-link`. Cover every variant so the
      // trigger mapping in `copy-to-clipboard/internal.tsx` stays wired up.
      test.each(['button', 'icon', 'inline'] as const)(
        'sets the disabled reason when the %s variant button is focused',
        async variant => {
          const { container } = render(
            <CopyToClipboard
              {...defaultProps}
              popoverRenderWithPortal={popoverRenderWithPortal}
              variant={variant}
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
        }
      );

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

  test('wraps text by default for variant="inline"', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" />);
    expect(container.querySelector(`.${styles['inline-container-no-wrap']}`)).toBeNull();
  });

  test('InternalCopyToClipboard wraps text by default for variant="inline"', () => {
    const { container } = render(<InternalCopyToClipboard {...defaultProps} variant="inline" />);
    expect(container.querySelector(`.${styles['inline-container-no-wrap']}`)).toBeNull();
  });

  test('does not wrap text when wrapText=false', () => {
    const { container } = render(<CopyToClipboard {...defaultProps} variant="inline" wrapText={false} />);
    expect(container.querySelector(`.${styles['inline-container-no-wrap']}`)).not.toBeNull();
  });

  test('InternalCopyToClipboard does not wrap text when wrapText=false', () => {
    const { container } = render(<InternalCopyToClipboard {...defaultProps} variant="inline" wrapText={false} />);
    expect(container.querySelector(`.${styles['inline-container-no-wrap']}`)).not.toBeNull();
  });

  describe('One Theme glyph-swap behavior', () => {
    beforeEach(() => {
      (isThemeActive as jest.Mock).mockReturnValue(true);
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    function renderCopyToClipboard(props: Partial<React.ComponentProps<typeof CopyToClipboard>> = {}) {
      const { container, unmount } = render(<CopyToClipboard {...defaultProps} {...props} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;
      const hasClass = (className: string) => container.querySelector(`.${className}`) !== null;
      const copy = () =>
        act(async () => {
          wrapper.findCopyButton().click();
          await Promise.resolve();
        });
      return { container, unmount, wrapper, hasClass, copy };
    }

    test('swaps the copy glyph for the success glyph and shows the message as plain text', async () => {
      const { wrapper, hasClass, copy } = renderCopyToClipboard();
      // Both glyphs are mounted up front so the swap can transition; the result is hidden until a copy.
      expect(hasClass(styles['icon-swap'])).toBe(true);
      expect(hasClass(styles['icon-swap-copied'])).toBe(false);

      await copy();

      expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard');
      expect(wrapper.findStatusText()!.findByClassName(styles['popover-message'])).not.toBeNull();
      expect(hasClass(iconStyles['variant-success'])).toBe(true);
      expect(hasClass(styles['icon-swap-copied'])).toBe(true);
    });

    test('swaps the copy glyph for the error glyph when the copy fails', async () => {
      const { wrapper, hasClass, copy } = renderCopyToClipboard({ textToCopy: 'Text to copy with error' });

      await copy();

      expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard');
      expect(hasClass(iconStyles['variant-error'])).toBe(true);
      expect(hasClass(styles['icon-swap-copied'])).toBe(true);
    });

    test('hands back to the copy glyph and dismisses the popover after the status icon duration', async () => {
      const { wrapper, hasClass, copy } = renderCopyToClipboard();
      await copy();
      expect(hasClass(styles['icon-swap-copied'])).toBe(true);
      expect(wrapper.findStatusText()).not.toBeNull();

      act(() => jest.advanceTimersByTime(1499));
      expect(hasClass(styles['icon-swap-copied'])).toBe(true);

      act(() => jest.advanceTimersByTime(1));
      expect(hasClass(styles['icon-swap-copied'])).toBe(false);
      expect(wrapper.findStatusText()).toBeNull();
    });

    test('restarts the status icon timer without replaying the swap on rapid re-click', async () => {
      const { hasClass, copy } = renderCopyToClipboard();
      await copy();
      act(() => jest.advanceTimersByTime(1000));
      await copy();

      act(() => jest.advanceTimersByTime(1000));
      expect(hasClass(styles['icon-swap-copied'])).toBe(true);

      act(() => jest.advanceTimersByTime(500));
      expect(hasClass(styles['icon-swap-copied'])).toBe(false);
    });

    test('does not render the stacked glyphs outside One Theme', () => {
      (isThemeActive as jest.Mock).mockReturnValue(false);
      const { wrapper, hasClass } = renderCopyToClipboard();
      expect(hasClass(styles['icon-swap'])).toBe(false);
      expect(wrapper.findCopyButton().getElement().querySelector('svg')).not.toBeNull();
    });

    test.each(['button', 'icon', 'inline'] as const)('swaps the glyph for variant="%s"', async variant => {
      const { hasClass, copy } = renderCopyToClipboard({ variant });
      expect(hasClass(styles['icon-swap'])).toBe(true);
      await copy();
      expect(hasClass(styles['icon-swap-copied'])).toBe(true);
    });

    test('does not swap the glyph or show a popover when disabled', async () => {
      const { container, hasClass, copy } = renderCopyToClipboard({ disabled: true });
      await copy();
      expect(hasClass(styles['icon-swap-copied'])).toBe(false);
      expect(createWrapper(container).findPopover()).toBeNull();
    });

    test('keeps the copy glyph when permission is denied on mount and recovers on a successful copy', async () => {
      // The permission query resolves through a promise chain; real timers let `waitFor` observe it.
      jest.useRealTimers();
      Object.assign(global.navigator, {
        permissions: { query: jest.fn().mockResolvedValue({ state: 'denied' }) },
      });
      const { hasClass, copy } = renderCopyToClipboard();

      // The denial only seeds the status; the trigger does not announce anything before a click.
      await waitFor(() => expect(hasClass(iconStyles['variant-error'])).toBe(true));
      expect(hasClass(styles['icon-swap-copied'])).toBe(false);

      await copy();

      await waitFor(() => expect(hasClass(styles['icon-swap-copied'])).toBe(true));
      expect(hasClass(iconStyles['variant-success'])).toBe(true);
      expect(hasClass(iconStyles['variant-error'])).toBe(false);
    });

    test('swaps to the error glyph when the clipboard API is unavailable', async () => {
      Object.assign(global.navigator, { clipboard: undefined });
      const onCopyFailure = jest.fn();
      const { wrapper, hasClass, copy } = renderCopyToClipboard({ onCopyFailure });
      await copy();

      expect(hasClass(styles['icon-swap-copied'])).toBe(true);
      expect(hasClass(iconStyles['variant-error'])).toBe(true);
      expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard');
      expect(onCopyFailure).toHaveBeenCalledWith(expect.objectContaining({ detail: { text: 'Text to copy' } }));
    });

    test('keeps the button accessible name and hides the glyphs from assistive technology', async () => {
      const { wrapper, copy } = renderCopyToClipboard({ copyButtonAriaLabel: 'Copy ARN' });
      const button = wrapper.findCopyButton().getElement();
      expect(button).toHaveAccessibleName('Copy ARN');

      await copy();

      expect(button).toHaveAccessibleName('Copy ARN');
      expect(button).not.toHaveAttribute('aria-pressed');
      const stack = button.querySelector(`.${styles['icon-swap']}`)!;
      expect(stack.closest('[aria-hidden="true"]')).not.toBeNull();
    });

    test('cancels the status icon timer on unmount', async () => {
      const { unmount, copy } = renderCopyToClipboard();
      await copy();
      const pendingTimersWhileShown = jest.getTimerCount();

      unmount();

      expect(jest.getTimerCount()).toBeLessThan(pendingTimersWhileShown);
      expect(() => act(() => jest.advanceTimersByTime(1500))).not.toThrow();
    });

    test('hands back immediately and cancels the status icon timer when the popover is closed with Escape', async () => {
      const { wrapper, hasClass, copy } = renderCopyToClipboard();
      await copy();
      expect(wrapper.findStatusText()).not.toBeNull();

      act(() => wrapper.findCopyButton().keydown(KeyCode.escape));
      expect(wrapper.findStatusText()).toBeNull();
      expect(hasClass(styles['icon-swap-copied'])).toBe(false);

      act(() => jest.advanceTimersByTime(1500));
      expect(wrapper.findStatusText()).toBeNull();
    });
  });
});
