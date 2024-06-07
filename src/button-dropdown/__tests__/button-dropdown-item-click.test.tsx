// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, act } from '@testing-library/react';
import { KeyCode } from '../../internal/keycode';
import Mock = jest.Mock;

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper, { ButtonDropdownWrapper } from '../../../lib/components/test-utils/dom';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(false),
}));

const renderButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};
function renderWrappedButtonDropdown(props: ButtonDropdownProps) {
  const onClickSpy = jest.fn();
  const renderResult = render(
    <div onClick={onClickSpy}>
      <ButtonDropdown {...props} />
    </div>
  );
  const wrapper = createWrapper(renderResult.container).findButtonDropdown()!;
  return { onClickSpy, wrapper };
}

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1' },
  { id: 'i2', text: 'item2', disabled: true },
  { id: 'i3', text: 'item3', href: 'https://amazon.com', external: true },
  { id: 'i4', text: 'item4', href: 'https://amazon.com', disabled: true },
  { id: 'i5', text: 'item5', checked: true, itemType: 'checkbox' },
  { id: 'i6', text: 'item6', checked: false, itemType: 'checkbox' },
  { id: 'i7', text: 'item7', checked: true, disabled: true, itemType: 'checkbox' },
];

[{ expandToViewport: false }, { expandToViewport: true }].forEach(props => {
  describe(`ButtonDropdown onItemClick event ${props.expandToViewport ? 'with portal' : 'without portal'}`, () => {
    let wrapper: ButtonDropdownWrapper;
    let onClickSpy: Mock;
    beforeEach(() => {
      onClickSpy = jest.fn();
      wrapper = renderButtonDropdown({ ...props, items, onItemClick: onClickSpy });
      wrapper.openDropdown();
    });
    test('fires the event when an item is clicked', () => {
      act(() => wrapper.findItemById('i1')!.click());

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i1' } }));
    });

    test('fires the event when enter key is pressed', () => {
      act(() => wrapper.findOpenDropdown()!.keydown(KeyCode.enter));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i1' } }));
    });

    test('fires the event when space key is pressed', () => {
      act(() => wrapper.findOpenDropdown()!.keyup(KeyCode.space));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i1' } }));
    });

    test('fires the event when a link item is clicked', () => {
      act(() => wrapper.findItemById('i3')!.click());

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { id: 'i3', href: 'https://amazon.com', external: true, target: '_blank' } })
      );
    });

    test('fires the event when a link item anchor is clicked', () => {
      act(() => wrapper.findItemById('i3')!.find('a')!.click());

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { id: 'i3', href: 'https://amazon.com', external: true, target: '_blank' } })
      );
    });

    test('does not fire the event when clicking on a disabled item', () => {
      act(() => wrapper.findItemById('i2')!.click());
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('does not fire the event when clicking on a disabled link', () => {
      act(() => wrapper.findItemById('i4')!.click());
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('hides the dropdown after clicking an item', () => {
      expect(wrapper.findOpenDropdown()).not.toBe(null);
      act(() => wrapper.findItemById('i1')!.click());
      expect(wrapper.findOpenDropdown()).toBe(null);
    });
    test('does not hide the dropdown after clicking a disabled item', () => {
      act(() => wrapper.findItemById('i2')!.click());
      expect(wrapper.findOpenDropdown()).not.toBe(null);
    });

    test('fires the event when a checkbox item is clicked', () => {
      // Clicking item with checked checkbox should trigger event accordingly
      wrapper.findItemById('i5')!.click();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i5', checked: false } }));

      // Clicking item with unchecked checkbox should trigger event accordingly
      wrapper.openDropdown();
      act(() => wrapper.findItemById('i6')!.click());
      expect(onClickSpy).toHaveBeenCalledTimes(2);
      expect(onClickSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i6', checked: true } }));
    });

    test('does not fire the event when a disabled checkbox item is clicked', () => {
      act(() => wrapper.findItemById('i7')!.click());
      expect(onClickSpy).not.toHaveBeenCalled();
    });

    test('does not have checked defined in the event when action item is clicked', () => {
      act(() => wrapper.findItemById('i1')!.click());
      expect(onClickSpy).toHaveBeenCalled();
      expect(onClickSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'i1', checked: undefined } }));
    });
  });
});

describe('onItemFollow event', () => {
  test('fires a follow event', () => {
    const onFollowSpy = jest.fn();
    const wrapper = renderButtonDropdown({ items, onItemFollow: onFollowSpy });
    wrapper.openDropdown();
    act(() => wrapper.findItemById('i3')!.click());

    expect(onFollowSpy).toHaveBeenCalledTimes(1);
    expect(onFollowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          id: 'i3',
          href: 'https://amazon.com',
          external: true,
          target: '_blank',
        },
      })
    );
  });
  test('does not fire a follow event when meta keys pressed', () => {
    const onFollowSpy = jest.fn();
    const wrapper = renderButtonDropdown({ items, onItemFollow: onFollowSpy });
    wrapper.openDropdown();
    act(() => wrapper.findItemById('i3')!.click({ metaKey: true }));

    expect(onFollowSpy).not.toHaveBeenCalled();
  });
  test('does not fire a follow event when item without href clicked', () => {
    const onFollowSpy = jest.fn();
    const wrapper = renderButtonDropdown({ items, onItemFollow: onFollowSpy });
    wrapper.openDropdown();
    act(() => wrapper.findItemById('i1')!.click());

    expect(onFollowSpy).not.toHaveBeenCalled();
  });
});

describe('default href navigation', () => {
  beforeEach(() => {
    // JSDOM prints an error message to browser logs when form attempted to submit
    // https://github.com/jsdom/jsdom/issues/1937
    // We use it as an assertion
    jest.spyOn(console, 'error').mockImplementation(() => {
      /*do not print anything to browser logs*/
    });
  });
  afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve));
    expect(console.error).not.toHaveBeenCalled();
  });

  test('should allow default navigation when clicking on item with href', async () => {
    const wrapper = renderButtonDropdown({ items: [{ id: 'i1', text: 'item1', href: 'http://amazon.com' }] });
    wrapper.openDropdown();
    act(() => wrapper.findItemById('i1')!.find('a')!.click());
    await new Promise(resolve => setTimeout(resolve));
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Error',
        message: 'Not implemented: navigation (except hash changes)',
      })
    );
    (console.error as jest.Mock).mockClear();
  });

  test('should allow onItemFollow to prevent default navigation', () => {
    const wrapper = renderButtonDropdown({
      items: [{ id: 'i1', text: 'item1', href: 'http://amazon.com' }],
      onItemFollow: e => e.preventDefault(),
    });
    wrapper.openDropdown();
    act(() => wrapper.findItemById('i1')!.click());
  });
});

[{ expandToViewport: false }, { expandToViewport: true }].forEach(props => {
  test(`allows event propagation ${props.expandToViewport ? 'with portal' : 'without portal'}`, () => {
    const { onClickSpy, wrapper } = renderWrappedButtonDropdown({ ...props, items });
    act(() => wrapper.openDropdown());
    act(() => wrapper.findItemById('i1')!.click());
    expect(onClickSpy).toHaveBeenCalled();
  });

  [true, false].forEach(mobile => {
    test(`toggles category on click when mobile=${mobile}`, () => {
      (useMobile as jest.Mock).mockReturnValue(mobile);
      const categoryId = 'category';
      const itemId = 'nested-item';
      const { wrapper } = renderWrappedButtonDropdown({
        expandableGroups: true,
        items: [{ id: categoryId, text: 'Category', items: [{ id: itemId, text: 'Item' }] }],
      });
      wrapper.openDropdown();

      act(() => wrapper.findExpandableCategoryById(categoryId)!.click());

      expect(wrapper.findItemById(itemId)).not.toBeNull();
    });
  });
});
