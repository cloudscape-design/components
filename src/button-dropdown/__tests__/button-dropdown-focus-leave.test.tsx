// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'Item 1' },
  { id: 'i2', text: 'Item 2' },
];

function renderButtonDropdown(props: Partial<ButtonDropdownProps> = {}) {
  const { container } = render(
    <>
      <ButtonDropdown {...props} items={props.items ?? items} ariaLabel="dropdown" />
      <button data-testid="outside">outside</button>
    </>
  );
  const wrapper = createWrapper(container).findButtonDropdown()!;
  const outside = container.querySelector<HTMLButtonElement>('[data-testid="outside"]')!;
  return { wrapper, outside };
}

describe('ButtonDropdown closes when focus leaves the whole widget', () => {
  test('closes when focus moves to an element outside the dropdown', () => {
    const { wrapper, outside } = renderButtonDropdown();
    wrapper.openDropdown();
    expect(wrapper.findOpenDropdown()).not.toBe(null);

    fireEvent.blur(wrapper.findNativeButton().getElement(), { relatedTarget: outside });
    expect(wrapper.findOpenDropdown()).toBe(null);
  });

  test('closes when focus leaves to another frame (relatedTarget is null)', () => {
    // Moving focus into a different browsing context (iframe) reports relatedTarget === null;
    // this is the AWSUI-62068 case where an outside click never reaches this frame.
    const { wrapper } = renderButtonDropdown();
    wrapper.openDropdown();
    expect(wrapper.findOpenDropdown()).not.toBe(null);

    fireEvent.blur(wrapper.findNativeButton().getElement(), { relatedTarget: null });
    expect(wrapper.findOpenDropdown()).toBe(null);
  });

  test('does not close when focus moves to an item inside the dropdown', () => {
    const { wrapper } = renderButtonDropdown();
    wrapper.openDropdown();
    const menuItem = wrapper.findOpenDropdown()!.getElement().querySelector<HTMLElement>('[role="menuitem"]')!;

    fireEvent.blur(wrapper.findNativeButton().getElement(), { relatedTarget: menuItem });
    expect(wrapper.findOpenDropdown()).not.toBe(null);
  });
});
