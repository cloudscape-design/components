// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import '../../__a11y__/to-validate-a11y';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

const renderButtonDropdown = (props: ButtonDropdownProps) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1', description: 'Item 1 description' },
  {
    text: 'category1',
    items: [
      { id: 'i2', text: 'item2' },
      { id: 'i3', text: 'item3' },
    ],
  },
  { id: 'i4', text: 'item4' },
  {
    text: 'category2',
    items: [{ id: 'i5', text: 'item5' }],
  },
];

[
  { expandToViewport: false, items },
  { expandToViewport: true, items },
].forEach(props => {
  describe(`Accessibility ${props.expandToViewport ? 'with portal' : 'without portal'}`, () => {
    it('sets correct attributes on the trigger', () => {
      const wrapper = renderButtonDropdown({ ...props });
      const triggerButton = wrapper.findNativeButton().getElement();

      expect(triggerButton).toHaveAttribute('aria-haspopup', 'true');
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false');

      wrapper.openDropdown();
      expect(triggerButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('uses appropriate roles for a simple list', () => {
      const wrapper = renderButtonDropdown({ ...props });
      wrapper.openDropdown();
      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).not.toBe(null);

      const menuItems = menuElement.findAll('[role="menuitem"]');
      expect(menuItems.length).toBe(5);
    });

    it('uses appropriate roles for grouped items', () => {
      const wrapper = renderButtonDropdown({ ...props });
      wrapper.openDropdown();

      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).not.toBe(null);

      const groups = menuElement.findAll('[role="group"]');
      expect(groups.length).toBe(2);

      expect(groups[0].findAll('[role="menuitem"]').length).toBe(2);
      expect(groups[1].findAll('[role="menuitem"]').length).toBe(1);
    });
  });
});

it('does not have aria-owns attribute by default', () => {
  const wrapper = renderButtonDropdown({ items });
  wrapper.openDropdown();

  expect(wrapper.getElement().getAttribute('aria-owns')).toEqual(null);
  expect(wrapper.find('[aria-owns]')).toEqual(null);
});

it('sets aria-owns attribute when dropdown is open and expandToViewport is activated', () => {
  const wrapper = renderButtonDropdown({ items, expandToViewport: true });
  expect(wrapper.getElement().getAttribute('aria-owns')).toEqual(null);

  wrapper.openDropdown();
  const dropdownId = wrapper.getElement().getAttribute('aria-owns');
  expect(dropdownId).toBeTruthy();
  expect(document.querySelector(`#${dropdownId}`)).toBeTruthy();
});

it('can set ariaLabel', () => {
  const wrapper = renderButtonDropdown({ items, ariaLabel: 'Some dropdown' });
  expect(wrapper.findNativeButton().getElement()).toHaveAttribute('aria-label', 'Some dropdown');
});

it('a11y: default', async () => {
  const { container } = render(<ButtonDropdown items={items}>Open dropdown</ButtonDropdown>);
  await expect(container).toValidateA11y();
});

it('a11y: default, opened', async () => {
  const { container } = render(<ButtonDropdown items={items}>Open dropdown</ButtonDropdown>);
  const wrapper = createWrapper(container).findButtonDropdown()!;
  wrapper.openDropdown();

  await expect(container).toValidateA11y();
});

it('a11y: split-primary variant', async () => {
  const { container } = render(<ButtonDropdown items={items} variant="split-primary" ariaLabel="Actions" />);
  await expect(container).toValidateA11y();
});
