// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';

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

// Reproduces a real click on the trigger while the filter input is focused. jsdom's
// element.click() only dispatches the click event, so we also emit the mouse-down and the
// input blur that a browser fires as part of the same gesture (mouse-down, then focus moves
// to the trigger, then click).
function clickTrigger(trigger: HTMLElement, focusedInput: HTMLElement) {
  fireEvent.mouseDown(trigger);
  fireEvent.blur(focusedInput, { relatedTarget: trigger });
  fireEvent.click(trigger);
}

afterEach(() => {
  // Some tests put the shared focus-visible tracker (useFocusVisible) into keyboard mode by
  // setting data-awsui-focus-visible on the body. Clean it up so we don't leak that global
  // state into other tests.
  delete document.body.dataset.awsuiFocusVisible;
});

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

describe('ButtonDropdown with filtering handles focus moving to the trigger', () => {
  test('does not reopen when clicking the trigger to close it', () => {
    const { wrapper } = renderButtonDropdown({ filteringType: 'auto' });
    wrapper.openDropdown();
    const trigger = wrapper.findNativeButton().getElement();
    const input = wrapper.findFilteringInput()!.findNativeInput().getElement();
    expect(wrapper.findOpenDropdown()).not.toBe(null);

    clickTrigger(trigger, input);

    expect(wrapper.findOpenDropdown()).toBe(null);
  });

  test('closes when Shift+Tab moves focus from the filter input to the trigger', () => {
    const { wrapper } = renderButtonDropdown({ filteringType: 'auto' });
    wrapper.openDropdown();
    const trigger = wrapper.findNativeButton().getElement();
    const input = wrapper.findFilteringInput()!.findNativeInput().getElement();
    expect(wrapper.findOpenDropdown()).not.toBe(null);

    wrapper.findFilteringInput()!.keydown({ keyCode: KeyCode.tab, shiftKey: true });
    fireEvent.blur(input, { relatedTarget: trigger });

    expect(wrapper.findOpenDropdown()).toBe(null);
  });
});
