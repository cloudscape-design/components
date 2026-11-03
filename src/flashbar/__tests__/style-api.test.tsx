// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/flashbar/styles.css.js';

function renderFlashbar(props: FlashbarProps & { styleClassNames?: Record<string, unknown> }) {
  const { container } = render(<Flashbar {...props} />);
  return { container, wrapper: createWrapper(container).findFlashbar()! };
}

const noop = () => void 0;

describe('Flashbar Style API v2', () => {
  test('applies each slot class to its element and ignores unknown keys', () => {
    const { container, wrapper } = renderFlashbar({
      items: [
        { type: 'success', content: 'Content', dismissible: true, dismissLabel: 'Dismiss', onDismiss: noop, id: '1' },
      ],
      styleClassNames: { item: 'a', icon: 'b', dismissButton: 'c', unknown: 'd' },
    });
    const item = wrapper.findItems()[0];
    expect(wrapper.findItemById('1')!.getElement()).toHaveClass('a');
    expect(item.findByClassName(styles['flash-icon'])!.getElement()).toHaveClass('b');
    expect(item.findDismissButton()!.getElement()).toHaveClass('c');
    expect(container.querySelectorAll('.a, .b, .c')).toHaveLength(3);
    expect(container.querySelector('.d')).toBeNull();
  });

  test('resolves the item callback for the full item and the collapsed placeholders of a stacked flashbar', () => {
    const { container, wrapper } = renderFlashbar({
      stackItems: true,
      items: [
        { type: 'success', content: 'Content', id: '1' },
        { type: 'error', content: 'Content', id: '2' },
        { type: 'info', content: 'Content', id: '3' },
      ],
      styleClassNames: {
        item: ({ item }: { item: FlashbarProps.MessageDefinition }) => `item-${item.type}`,
        notificationBar: 'bar',
      },
    });
    expect(wrapper.findItemById('1')!.getElement()).toHaveClass('item-success');
    const placeholders = container.querySelectorAll('li[aria-hidden="true"]');
    expect(placeholders).toHaveLength(2);
    expect(placeholders[0]).toHaveClass('item-error');
    expect(placeholders[1]).toHaveClass('item-info');
    expect(wrapper.findByClassName(styles['notification-bar'])!.getElement()).toHaveClass('bar');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderFlashbar({
      items: [{ type: 'info', content: 'Content', id: '1' }],
      styleClassNames: { item: 'a' },
    });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
