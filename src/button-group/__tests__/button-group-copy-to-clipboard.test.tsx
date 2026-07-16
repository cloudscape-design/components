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
  const copyToClipboard = createWrapper(container).findCopyToClipboard()!;
  return { wrapper, copyToClipboard };
}

describe('ButtonGroup copy-to-clipboard item', () => {
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

  test('renders the copy-to-clipboard item as a button-group item', () => {
    const { wrapper, copyToClipboard } = renderButtonGroup({});

    expect(copyToClipboard).not.toBeNull();
    expect(copyToClipboard.findCopyButton().getElement()).toHaveAccessibleName('Copy code');
    expect(wrapper.findItems()).toHaveLength(1);
  });

  test('calls onCopySuccess with the copied text when the copy succeeds', async () => {
    const onCopySuccess = jest.fn();
    const { copyToClipboard } = renderButtonGroup({ onCopySuccess });

    copyToClipboard.findCopyButton().click();

    await waitFor(() => {
      expect(onCopySuccess).toHaveBeenCalledTimes(1);
      expect(onCopySuccess).toHaveBeenCalledWith(expect.objectContaining({ detail: { text: 'Text to copy' } }));
    });
  });

  test('calls onCopyFailure with the copied text when the copy fails', async () => {
    const onCopyFailure = jest.fn();
    const { copyToClipboard } = renderButtonGroup({
      items: [{ ...copyItem, textToCopy: 'Text to copy with error' }],
      onCopyFailure,
    });

    copyToClipboard.findCopyButton().click();

    await waitFor(() => {
      expect(onCopyFailure).toHaveBeenCalledTimes(1);
      expect(onCopyFailure).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { text: 'Text to copy with error' } })
      );
    });
  });

  test('does not throw when copy callbacks are not provided', async () => {
    const { copyToClipboard } = renderButtonGroup({});

    expect(() => copyToClipboard.findCopyButton().click()).not.toThrow();
    await waitFor(() => expect(copyToClipboard.findStatusText()!.getElement().textContent).toBe('Copied'));
  });

  test('dismisses the item tooltip when a copy succeeds', async () => {
    const onCopySuccess = jest.fn();
    const { wrapper, copyToClipboard } = renderButtonGroup({ onCopySuccess });

    // Show the button-group tooltip by hovering the item.
    fireEvent.pointerEnter(copyToClipboard.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copy code');

    copyToClipboard.findCopyButton().click();

    await waitFor(() => expect(onCopySuccess).toHaveBeenCalledTimes(1));
    expect(wrapper.findTooltip()).toBeNull();
  });

  test('dismisses the item tooltip when a copy fails', async () => {
    const onCopyFailure = jest.fn();
    const { wrapper, copyToClipboard } = renderButtonGroup({
      items: [{ ...copyItem, textToCopy: 'Text to copy with error' }],
      onCopyFailure,
    });

    fireEvent.pointerEnter(copyToClipboard.getElement());
    expect(wrapper.findTooltip()!.getElement()).toHaveTextContent('Copy code');

    copyToClipboard.findCopyButton().click();

    await waitFor(() => expect(onCopyFailure).toHaveBeenCalledTimes(1));
    expect(wrapper.findTooltip()).toBeNull();
  });
});
