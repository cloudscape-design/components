// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';

import buttonGroupStyles from '../../../lib/components/button-group/styles.css.js';
import dropdownStyles from '../../../lib/components/dropdown/styles.css.js';

const items: ButtonGroupProps.ItemOrGroup[] = [
  {
    type: 'group',
    text: 'Feedback',
    items: [
      { type: 'icon-button', id: 'like', iconName: 'thumbs-up', text: 'Like' },
      {
        type: 'icon-toggle-button',
        id: 'pin',
        iconName: 'star',
        pressedIconName: 'star-filled',
        text: 'Pin',
        pressed: false,
      },
    ],
  },
  {
    type: 'icon-copy-to-clipboard',
    id: 'copy',
    text: 'Copy',
    textToCopy: 'text',
    copySuccessText: 'ok',
    copyErrorText: 'no',
  },
  { type: 'icon-file-input', id: 'upload', text: 'Upload' },
  { type: 'menu-dropdown', id: 'more', text: 'More', items: [{ id: 'a', text: 'A' }] },
];

function renderButtonGroup(styleClassNames: Record<string, unknown>) {
  const { container } = render(
    <ButtonGroup variant="icon" ariaLabel="Actions" items={items} {...{ styleClassNames }} />
  );
  return { container, wrapper: createWrapper(container).findButtonGroup()! };
}

describe('ButtonGroup Style API v2', () => {
  test('applies the item slot to the button of every item type', () => {
    const { wrapper } = renderButtonGroup({ item: 'a' });
    for (const id of ['like', 'pin', 'copy']) {
      expect(wrapper.findButtonById(id)!.getElement()).toHaveClass('a');
    }
    expect(wrapper.findMenuById('more')!.findNativeButton().getElement()).toHaveClass('a');
    expect(wrapper.findFileInputById('upload')!.findNativeInput().getElement().nextElementSibling).toHaveClass('a');
  });

  test('accepts a callback for the item slot', () => {
    const { wrapper } = renderButtonGroup({ item: ({ item }: { item: ButtonGroupProps.Item }) => `item-${item.id}` });
    expect(wrapper.findButtonById('like')!.getElement()).toHaveClass('item-like');
    expect(wrapper.findMenuById('more')!.findNativeButton().getElement()).toHaveClass('item-more');
  });

  test('applies the divider and dropdown slots', () => {
    const { container, wrapper } = renderButtonGroup({
      divider: 'd',
      dropdown: 'c',
      unknown: 'x',
    });
    expect(container.querySelector(`.${buttonGroupStyles.divider}`)).toHaveClass('d');
    const menu = wrapper.findMenuById('more')!;
    menu.openDropdown();
    expect(container.querySelector(`.${dropdownStyles['dropdown-content-wrapper']}`)).toHaveClass('c');
    expect(container.querySelector('.x')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderButtonGroup({ item: 'a' });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
