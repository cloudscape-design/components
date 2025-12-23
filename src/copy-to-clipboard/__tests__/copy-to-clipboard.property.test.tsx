// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import CopyToClipboard from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';

// Representative test cases covering various string types
const testCases = [
  'simple text',
  'text with spaces and punctuation!',
  '12345',
  'special chars: @#$%^&*()',
  'unicode: 你好世界 🎉',
  'multiline\ntext\nhere',
  '<html>tags</html>',
  '   whitespace   ',
  'a', // single character
  'a'.repeat(1000), // long string
];

/**
 * **Feature: copy-to-clipboard-oncopy-handler, Property 1: Successful copy invokes callback with correct text**
 *
 * *For any* text value passed to `textToCopy`, when the clipboard write operation succeeds,
 * the `onCopySuccess` callback should be invoked exactly once with an event detail object
 * where `detail.text` equals the `textToCopy` value.
 *
 * **Validates: Requirements 1.1, 1.2, 2.2**
 */
describe('CopyToClipboard Property Tests', () => {
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

  test.each(testCases)('Property 1: Successful copy invokes callback with correct text - %s', async textToCopy => {
    const onCopySuccess = jest.fn();

    const { container } = render(
      <CopyToClipboard
        textToCopy={textToCopy}
        copyButtonText="Copy"
        copySuccessText="Copied"
        copyErrorText="Failed"
        onCopySuccess={onCopySuccess}
      />
    );

    const wrapper = createWrapper(container).findCopyToClipboard()!;

    await act(() => {
      wrapper.findCopyButton().click();
    });

    await waitFor(() => {
      // Callback should be invoked exactly once
      expect(onCopySuccess).toHaveBeenCalledTimes(1);
      // Callback should receive the correct text in detail object
      expect(onCopySuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { text: textToCopy },
        })
      );
    });
  });

  /**
   * **Feature: copy-to-clipboard-oncopy-handler, Property 2: Failed copy invokes failure callback with correct text**
   *
   * *For any* text value passed to `textToCopy`, when the clipboard write operation fails,
   * the `onCopyFailure` callback should be invoked exactly once with an event detail object
   * where `detail.text` equals the `textToCopy` value.
   *
   * **Validates: Requirements 3.1, 3.2, 4.2**
   */
  test.each(testCases)('Property 2: Failed copy invokes failure callback with correct text - %s', async textToCopy => {
    // Mock clipboard to fail
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn().mockRejectedValue(new Error('Copy failed')),
      },
    });

    const onCopyFailure = jest.fn();

    const { container } = render(
      <CopyToClipboard
        textToCopy={textToCopy}
        copyButtonText="Copy"
        copySuccessText="Copied"
        copyErrorText="Failed"
        onCopyFailure={onCopyFailure}
      />
    );

    const wrapper = createWrapper(container).findCopyToClipboard()!;

    await act(() => {
      wrapper.findCopyButton().click();
    });

    await waitFor(() => {
      // Callback should be invoked exactly once
      expect(onCopyFailure).toHaveBeenCalledTimes(1);
      // Callback should receive the correct text in detail object
      expect(onCopyFailure).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { text: textToCopy },
        })
      );
    });
  });

  /**
   * **Feature: copy-to-clipboard-oncopy-handler, Property 3: Success and failure callbacks are mutually exclusive**
   *
   * *For any* copy operation, exactly one of `onCopySuccess` or `onCopyFailure` should be invoked,
   * never both and never neither (when both callbacks are provided).
   *
   * **Validates: Requirements 1.3, 3.3**
   */
  describe('Property 3: Success and failure callbacks are mutually exclusive', () => {
    test.each(testCases)('when copy succeeds - %s', async textToCopy => {
      Object.assign(global.navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });

      const onCopySuccess = jest.fn();
      const onCopyFailure = jest.fn();

      const { container } = render(
        <CopyToClipboard
          textToCopy={textToCopy}
          copyButtonText="Copy"
          copySuccessText="Copied"
          copyErrorText="Failed"
          onCopySuccess={onCopySuccess}
          onCopyFailure={onCopyFailure}
        />
      );

      const wrapper = createWrapper(container).findCopyToClipboard()!;

      await act(() => {
        wrapper.findCopyButton().click();
      });

      await waitFor(() => {
        const successCalls = onCopySuccess.mock.calls.length;
        const failureCalls = onCopyFailure.mock.calls.length;

        expect(successCalls + failureCalls).toBe(1);
        expect(onCopySuccess).toHaveBeenCalledTimes(1);
        expect(onCopyFailure).not.toHaveBeenCalled();
      });
    });

    test.each(testCases)('when copy fails - %s', async textToCopy => {
      Object.assign(global.navigator, {
        clipboard: {
          writeText: jest.fn().mockRejectedValue(new Error('Copy failed')),
        },
      });

      const onCopySuccess = jest.fn();
      const onCopyFailure = jest.fn();

      const { container } = render(
        <CopyToClipboard
          textToCopy={textToCopy}
          copyButtonText="Copy"
          copySuccessText="Copied"
          copyErrorText="Failed"
          onCopySuccess={onCopySuccess}
          onCopyFailure={onCopyFailure}
        />
      );

      const wrapper = createWrapper(container).findCopyToClipboard()!;

      await act(() => {
        wrapper.findCopyButton().click();
      });

      await waitFor(() => {
        const successCalls = onCopySuccess.mock.calls.length;
        const failureCalls = onCopyFailure.mock.calls.length;

        expect(successCalls + failureCalls).toBe(1);
        expect(onCopyFailure).toHaveBeenCalledTimes(1);
        expect(onCopySuccess).not.toHaveBeenCalled();
      });
    });
  });

  /**
   * **Feature: copy-to-clipboard-oncopy-handler, Property 4: Disabled component invokes neither callback**
   *
   * *For any* disabled CopyToClipboard component, clicking the copy button should not invoke
   * either `onCopySuccess` or `onCopyFailure` callbacks.
   *
   * **Validates: Requirements 2.3, 4.3**
   */
  test.each(testCases)('Property 4: Disabled component invokes neither callback - %s', async textToCopy => {
    const onCopySuccess = jest.fn();
    const onCopyFailure = jest.fn();

    const { container } = render(
      <CopyToClipboard
        textToCopy={textToCopy}
        copyButtonText="Copy"
        copySuccessText="Copied"
        copyErrorText="Failed"
        onCopySuccess={onCopySuccess}
        onCopyFailure={onCopyFailure}
        disabled={true}
      />
    );

    const wrapper = createWrapper(container).findCopyToClipboard()!;

    await act(() => {
      wrapper.findCopyButton().click();
    });

    // Neither callback should be invoked for disabled component
    expect(onCopySuccess).not.toHaveBeenCalled();
    expect(onCopyFailure).not.toHaveBeenCalled();
  });
});
