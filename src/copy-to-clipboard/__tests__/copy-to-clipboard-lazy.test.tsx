// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import CopyToClipboard from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultProps = {
  textToCopy: 'Static fallback text',
  copyButtonText: 'Copy',
  copySuccessText: 'Copied to clipboard',
  copyErrorText: 'Failed to copy to clipboard',
};

describe('CopyToClipboard — getTextToCopy (lazy/async)', () => {
  const originalNavigatorClipboard = global.navigator.clipboard;
  const originalNavigatorPermissions = global.navigator.permissions;

  beforeEach(() => {
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
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

  describe('synchronous getter', () => {
    test('calls getTextToCopy on click and writes the returned value to clipboard', async () => {
      const getTextToCopy = jest.fn().mockReturnValue('sync computed text');
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(getTextToCopy).toHaveBeenCalledTimes(1);
        expect(global.navigator.clipboard.writeText as jest.Mock).toHaveBeenCalledWith('sync computed text');
      });
    });

    test('fires onCopySuccess with the resolved text, not textToCopy', async () => {
      const onCopySuccess = jest.fn();
      const getTextToCopy = jest.fn().mockReturnValue('sync computed text');
      const { container } = render(
        <CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} onCopySuccess={onCopySuccess} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(onCopySuccess).toHaveBeenCalledWith(expect.objectContaining({ detail: { text: 'sync computed text' } }));
      });
    });

    test('shows success status after sync getter resolves', async () => {
      const getTextToCopy = jest.fn().mockReturnValue('sync computed text');
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard');
      });
    });
  });

  describe('asynchronous getter', () => {
    test('calls getTextToCopy on click and writes the resolved promise value to clipboard', async () => {
      const getTextToCopy = jest.fn().mockResolvedValue('async fetched text');
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(getTextToCopy).toHaveBeenCalledTimes(1);
        expect(global.navigator.clipboard.writeText as jest.Mock).toHaveBeenCalledWith('async fetched text');
      });
    });

    test('fires onCopySuccess with the async resolved text', async () => {
      const onCopySuccess = jest.fn();
      const getTextToCopy = jest.fn().mockResolvedValue('async fetched text');
      const { container } = render(
        <CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} onCopySuccess={onCopySuccess} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(onCopySuccess).toHaveBeenCalledWith(expect.objectContaining({ detail: { text: 'async fetched text' } }));
      });
    });

    test('shows success status after async getter resolves', async () => {
      const getTextToCopy = jest.fn().mockResolvedValue('async fetched text');
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(wrapper.findStatusText()!.getElement().textContent).toBe('Copied to clipboard');
      });
    });

    test('does not write to clipboard before async getter resolves', async () => {
      let resolveGetter!: (value: string) => void;
      const getTextToCopy = jest.fn(
        () =>
          new Promise<string>(resolve => {
            resolveGetter = resolve;
          })
      );
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      // Clipboard should not have been called yet
      expect(global.navigator.clipboard.writeText as jest.Mock).not.toHaveBeenCalled();

      resolveGetter('deferred text');

      await waitFor(() => {
        expect(global.navigator.clipboard.writeText as jest.Mock).toHaveBeenCalledWith('deferred text');
      });
    });
  });

  describe('getter that rejects', () => {
    test('shows error status when async getter rejects', async () => {
      const getTextToCopy = jest.fn().mockRejectedValue(new Error('fetch failed'));
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard');
      });
    });

    test('does not write to clipboard when async getter rejects', async () => {
      const getTextToCopy = jest.fn().mockRejectedValue(new Error('fetch failed'));
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(wrapper.findStatusText()!.getElement().textContent).toBe('Failed to copy to clipboard');
      });
      expect(global.navigator.clipboard.writeText as jest.Mock).not.toHaveBeenCalled();
    });

    test('fires onCopyFailure with textToCopy when getter rejects', async () => {
      const onCopyFailure = jest.fn();
      const getTextToCopy = jest.fn().mockRejectedValue(new Error('fetch failed'));
      const { container } = render(
        <CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} onCopyFailure={onCopyFailure} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(onCopyFailure).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { text: 'Static fallback text' } })
        );
      });
    });
  });

  describe('loading state during async resolution', () => {
    test('button enters loading state while async getter is pending', async () => {
      let resolveGetter!: (value: string) => void;
      const getTextToCopy = jest.fn(
        () =>
          new Promise<string>(resolve => {
            resolveGetter = resolve;
          })
      );
      const { container } = render(<CopyToClipboard {...defaultProps} getTextToCopy={getTextToCopy} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      // Button should be in loading state
      expect(wrapper.findCopyButton().getElement()).toHaveAttribute('aria-disabled', 'true');

      resolveGetter('resolved text');

      await waitFor(() => {
        expect(global.navigator.clipboard.writeText as jest.Mock).toHaveBeenCalled();
      });
    });
  });

  describe('without getTextToCopy (backward compatibility)', () => {
    test('writes textToCopy to clipboard when no getter is provided', async () => {
      const { container } = render(<CopyToClipboard {...defaultProps} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(global.navigator.clipboard.writeText as jest.Mock).toHaveBeenCalledWith('Static fallback text');
      });
    });

    test('fires onCopySuccess with textToCopy when no getter is provided', async () => {
      const onCopySuccess = jest.fn();
      const { container } = render(<CopyToClipboard {...defaultProps} onCopySuccess={onCopySuccess} />);
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(onCopySuccess).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { text: 'Static fallback text' } })
        );
      });
    });
  });

  describe('inline variant with getTextToCopy', () => {
    test('displays textToCopy in inline variant regardless of getTextToCopy', () => {
      const getTextToCopy = jest.fn().mockResolvedValue('async text');
      const { container } = render(
        <CopyToClipboard {...defaultProps} variant="inline" getTextToCopy={getTextToCopy} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      // The displayed text should still be textToCopy
      expect(wrapper.findTextToCopy()!.getElement().textContent).toBe('Static fallback text');
    });

    test('copies async text when inline button is clicked', async () => {
      const getTextToCopy = jest.fn().mockResolvedValue('async inline text');
      const { container } = render(
        <CopyToClipboard {...defaultProps} variant="inline" getTextToCopy={getTextToCopy} />
      );
      const wrapper = createWrapper(container).findCopyToClipboard()!;

      wrapper.findCopyButton().click();

      await waitFor(() => {
        expect(global.navigator.clipboard.writeText as jest.Mock).toHaveBeenCalledWith('async inline text');
      });
    });
  });
});
