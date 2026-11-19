// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';

const copyItem: ButtonGroupProps.IconCopyToClipboard = {
  type: 'icon-copy-to-clipboard',
  id: 'copy',
  text: 'Copy code',
  textToCopy: 'Text to copy',
  copySuccessText: 'Copied',
  copyErrorText: 'Failed to copy',
};

function renderButtonGroup(props: Partial<ButtonGroupProps>) {
  const { container } = render(<ButtonGroup variant="icon" ariaLabel="Chat actions" items={[copyItem]} {...props} />);
  const wrapper = createWrapper(container).findButtonGroup()!;
  const copyToClipboard = wrapper.findCopyToClipboardById('copy')!;
  return { wrapper, copyToClipboard };
}

describe('ButtonGroup copy-to-clipboard item', () => {
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

  test('renders the copy-to-clipboard item as a button-group button', () => {
    const { wrapper, copyToClipboard } = renderButtonGroup({});

    expect(copyToClipboard.getElement()).toHaveAccessibleName('Copy code');
    expect(wrapper.findItems()).toHaveLength(1);
  });

  test('shows the tooltip with the item text on hover', () => {
    const { wrapper, copyToClipboard } = renderButtonGroup({});

    fireEvent.pointerEnter(copyToClipboard.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copy code');

    fireEvent.pointerLeave(copyToClipboard.getElement());
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('transitions from tooltip to success feedback popover on copy', async () => {
    const onCopySuccess = jest.fn();
    const { wrapper, copyToClipboard } = renderButtonGroup({ onCopySuccess });

    // Hover shows the plain tooltip.
    fireEvent.pointerEnter(copyToClipboard.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copy code');

    // Clicking copies and transitions the surface into the feedback popover.
    copyToClipboard.click();

    await waitFor(() => {
      expect(onCopySuccess).toHaveBeenCalledTimes(1);
      expect(onCopySuccess).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { id: 'copy', text: 'Text to copy' } })
      );
      expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied');
    });
  });

  test('transitions to error feedback popover when the copy fails', async () => {
    const onCopyFailure = jest.fn();
    const { wrapper, copyToClipboard } = renderButtonGroup({
      items: [{ ...copyItem, textToCopy: 'Text to copy with error' }],
      onCopyFailure,
    });

    copyToClipboard.click();

    await waitFor(() => {
      expect(onCopyFailure).toHaveBeenCalledTimes(1);
      expect(onCopyFailure).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { id: 'copy', text: 'Text to copy with error' } })
      );
      expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Failed to copy');
    });
  });

  test('falls back to the error feedback when the clipboard API is unavailable', async () => {
    Object.assign(global.navigator, { clipboard: undefined });
    const onCopyFailure = jest.fn();
    const { wrapper, copyToClipboard } = renderButtonGroup({ onCopyFailure });

    copyToClipboard.click();

    await waitFor(() => {
      expect(onCopyFailure).toHaveBeenCalledTimes(1);
      expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Failed to copy');
    });
  });

  test('does not throw when copy callbacks are not provided', async () => {
    const { wrapper, copyToClipboard } = renderButtonGroup({});

    expect(() => copyToClipboard.click()).not.toThrow();
    await waitFor(() => expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied'));
  });

  test('dismisses the feedback popover on Escape', async () => {
    const onCopySuccess = jest.fn();
    const { wrapper, copyToClipboard } = renderButtonGroup({ onCopySuccess });

    copyToClipboard.click();
    await waitFor(() => expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copied'));

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(wrapper.findTooltip()).toBeNull();
  });
});
