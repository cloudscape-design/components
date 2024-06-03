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

const renderWithTrigger = (props: ButtonDropdownProps, triggerName: string) => {
  const renderResult = render(<ButtonDropdown {...props}>{triggerName}</ButtonDropdown>);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const items: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1', description: 'Item 1 description' },
  { id: 'i2', text: 'item2', description: 'Item 2 description', checked: true, itemType: 'checkbox' },
  {
    text: 'category1',
    items: [
      { id: 'i3', text: 'item3' },
      { id: 'i4', text: 'item4' },
    ],
  },
  { id: 'i5', text: 'item5' },
  {
    text: 'category2',
    items: [
      { id: 'i6', text: 'item6' },
      { id: 'i7', text: 'item7', checked: false, itemType: 'checkbox' },
    ],
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

    it('auto-labels dropdown with trigger title', () => {
      const wrapper = renderWithTrigger({ ...props }, 'Actions');
      wrapper.openDropdown();

      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).toHaveAccessibleName('Actions');
    });

    it('uses aria-label as accessible name for dropdown if presented', () => {
      const wrapper = renderWithTrigger({ ...props, ariaLabel: 'Custom label' }, 'Actions');
      wrapper.openDropdown();

      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).toHaveAccessibleName('Custom label');
    });

    it('does not auto-label dropdown with icon trigger', () => {
      const wrapper = renderButtonDropdown({ ...props, variant: 'icon' });
      wrapper.openDropdown();
      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).not.toHaveAttribute('aria-labelledby');
    });
    it('passes aria-label to icon trigger', () => {
      const wrapper = renderButtonDropdown({ ...props, variant: 'icon', ariaLabel: 'Button trigger' });
      wrapper.openDropdown();
      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).toHaveAccessibleName('Button trigger');
    });

    it('does not auto-label dropdown with inline icon trigger', () => {
      const wrapper = renderButtonDropdown({ ...props, variant: 'inline-icon' });
      wrapper.openDropdown();
      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).not.toHaveAttribute('aria-labelledby');
    });
    it('passes aria-label to inline icon trigger', () => {
      const wrapper = renderButtonDropdown({ ...props, variant: 'inline-icon', ariaLabel: 'Button trigger' });
      wrapper.openDropdown();
      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).toHaveAccessibleName('Button trigger');
    });

    it('uses aria-label to label dropdown menu in a button with main action', () => {
      const wrapper = renderButtonDropdown({
        ...props,
        mainAction: { text: 'Main action', ariaLabel: 'Main action aria label' },
        ariaLabel: 'Actions',
      });
      wrapper.openDropdown();
      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).toHaveAccessibleName('Actions');
    });
    it('does not auto-label dropdown in a button with main action', () => {
      const wrapper = renderButtonDropdown({
        ...props,
        mainAction: { text: 'Main action', ariaLabel: 'Main action aria label' },
      });
      wrapper.openDropdown();
      const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;
      expect(menuElement.getElement()).not.toHaveAccessibleName();
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

it('a11y: with main action', async () => {
  const { container } = render(
    <ButtonDropdown mainAction={{ text: 'Main action' }} items={items} ariaLabel="Actions" />
  );
  await expect(container).toValidateA11y();
});

it('a11y: checkbox role and state', () => {
  const { container } = render(
    <ButtonDropdown mainAction={{ text: 'Main action' }} items={items} ariaLabel="Actions" />
  );
  const wrapper = createWrapper(container).findButtonDropdown()!;
  wrapper.openDropdown();
  const menuElement = wrapper.findOpenDropdown()!.find('[role="menu"]')!;

  // Should have 2 elements with the menucheckboxitem role
  const menuCheckboxItems = menuElement.findAll('[role="menuitemcheckbox"]');
  expect(menuCheckboxItems.length).toBe(2);

  // Should have 5 elements with the menuitem role
  const menuItems = menuElement.findAll('[role="menuitem"]');
  expect(menuItems.length).toBe(5);

  // Checkbox state should be reflected in aria-checked.
  expect(menuCheckboxItems[0].getElement()).toHaveAttribute('aria-checked', 'true');
  expect(menuCheckboxItems[1].getElement()).toHaveAttribute('aria-checked', 'false');
  // Action menu items should not have aria-checked set.
  expect(menuItems[0].getElement()).not.toHaveAttribute('aria-checked');
  expect(menuItems[1].getElement()).not.toHaveAttribute('aria-checked');
  expect(menuItems[2].getElement()).not.toHaveAttribute('aria-checked');
  expect(menuItems[3].getElement()).not.toHaveAttribute('aria-checked');
  expect(menuItems[4].getElement()).not.toHaveAttribute('aria-checked');
});
