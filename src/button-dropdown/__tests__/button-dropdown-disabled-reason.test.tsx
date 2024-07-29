// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { KeyCode } from '../../../lib/components/internal/keycode';
import createWrapper, { ButtonDropdownWrapper } from '../../../lib/components/test-utils/dom';

const renderOpenButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  const wrapper = createWrapper(renderResult.container).findButtonDropdown()!;
  wrapper.openDropdown();

  return wrapper;
};

const items: ButtonDropdownProps['items'] = [
  {
    id: 'plum',
    text: 'Plum',
  },
  {
    id: 'pear',
    text: 'pear',
    disabled: true,
  },
  {
    id: 'apple',
    text: 'Apple',
    disabledReason: 'No apples in stock.',
  },
  {
    id: 'cherries',
    text: 'Cherries',
    disabled: true,
    disabledReason: 'No cherries in stock.',
  },
  {
    text: 'Tropical',
    items: [{ id: 'banana', text: 'Banana', disabled: true, disabledReason: 'Not in season.' }],
  },
  {
    text: 'Rare',
    id: 'rare',
    items: [{ id: 'dragon-fruit', text: 'Dragon Fruit' }],
    disabled: true,
    disabledReason: 'Not enough money.',
  },
];

const props: ButtonDropdownProps = {
  items,
  expandableGroups: true,
};

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

describe('Button Dropdown - Disabled Reason', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('has no tooltip open by default', () => {
    const wrapper = renderOpenButtonDropdown(props);
    expect(wrapper.findDisabledReason()).toBe(null);
  });

  it('has no aria-describedby by default', () => {
    const item = items[0];
    const wrapper = renderOpenButtonDropdown(props);
    const menuItem = getMenuItemForId(wrapper, item.id!);
    expect(menuItem.getElement()).not.toHaveAttribute('aria-describedby');
  });

  it('has no aria-describedby without disabledReason', () => {
    const item = items[1];
    const wrapper = renderOpenButtonDropdown(props);
    const menuItem = getMenuItemForId(wrapper, item.id!);
    expect(menuItem.getElement()).not.toHaveAttribute('aria-describedby');
  });

  it('has no tooltip without disabledReason', () => {
    const item = items[1];
    const wrapper = renderOpenButtonDropdown(props);
    const menuItem = getMenuItemForId(wrapper, item.id!);
    act(() => {
      menuItem.focus();
    });
    expect(wrapper.findDisabledReason()).toBe(null);
  });

  it('has no tooltip without disabled flag', () => {
    const item = items[2];
    const wrapper = renderOpenButtonDropdown(props);
    const menuItem = getMenuItemForId(wrapper, item.id!);
    act(() => {
      menuItem.focus();
    });
    expect(wrapper.findDisabledReason()).toBe(null);
  });

  describe.each([
    ['Item Element', items[3], false],
    ['Expandable Category Element', items[5], false],
    ['Expandable Category Element - mobile', items[5], true],
  ])('%s', (_, item, mobile) => {
    beforeAll(() => {
      (useMobile as jest.Mock).mockReturnValue(mobile);
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it('has hidden element with disabledReason', () => {
      const wrapper = renderOpenButtonDropdown(props);
      const span = getItemById(wrapper, item.id!).find('span[hidden]')!;
      expect(span.getElement()).toContainHTML(item.disabledReason!);
    });

    it('open tooltip on focus', () => {
      const wrapper = renderOpenButtonDropdown(props);
      const menuItem = getMenuItemForId(wrapper, item.id!);
      act(() => {
        menuItem.focus();
        jest.advanceTimersByTime(1000);
      });
      expect(wrapper.findDisabledReason()!.getElement()).toContainHTML(item.disabledReason!);
    });

    it('closes tooltip on blur', () => {
      const wrapper = renderOpenButtonDropdown(props);
      const menuItem = getMenuItemForId(wrapper, item.id!);
      act(() => {
        menuItem.focus();
        jest.advanceTimersByTime(1000);
      });

      expect(wrapper.findDisabledReason()!.getElement()).toContainHTML(item.disabledReason!);

      act(() => {
        menuItem.blur();
      });
      expect(wrapper.findDisabledReason()).toBe(null);
    });

    it('closes tooltip on Escape', () => {
      const wrapper = renderOpenButtonDropdown(props);
      const menuItem = getMenuItemForId(wrapper, item.id!);
      act(() => {
        menuItem.focus();
        jest.advanceTimersByTime(1000);
      });
      expect(wrapper.findDisabledReason()!.getElement()).toContainHTML(item.disabledReason!);

      act(() => {
        menuItem.keydown(KeyCode.escape);
      });
      expect(wrapper.findDisabledReason()).toBe(null);
    });
  });
});

const getItemById = (wrapper: ButtonDropdownWrapper, id: string) => {
  const itemElement = wrapper.findItemById(id);
  const categoryElement = wrapper.findExpandableCategoryById(id);
  return categoryElement ? categoryElement! : itemElement!;
};

const getMenuItemForId = (wrapper: ButtonDropdownWrapper, id: string) => {
  const itemElement = wrapper.findItemById(id);
  const categoryElement = wrapper.findExpandableCategoryById(id);
  return (categoryElement || itemElement)!.find('[role="menuitem"]')!;
};
