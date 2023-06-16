// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper, { ButtonWrapper, IconWrapper } from '../../../lib/components/test-utils/dom';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';
import { KeyCode } from '../../../lib/components/internal/keycode';

const renderButtonDropdown = (props: Parameters<typeof ButtonDropdown>[0]) => {
  const renderResult = render(<ButtonDropdown {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const renderSplitButtonDropdown = (props: Parameters<typeof ButtonDropdown>[0]) => {
  return renderButtonDropdown({ ariaLabel: 'Actions', ...props, variant: 'split-primary' });
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
];

[false, true].forEach(expandToViewport => {
  describe(`ButtonDropdown Component ${expandToViewport ? 'with portal' : 'without portal'}`, () => {
    (['normal', 'primary', 'icon'] as Array<ButtonDropdownProps['variant']>).forEach(variant => {
      describe(`"${variant}" variant`, () => {
        const props = { expandToViewport, variant };

        test('can be focused through the API', () => {
          let buttonDropdown: ButtonDropdownProps.Ref | null = null;
          const wrapper = renderButtonDropdown({
            ...props,
            id: 'newButtonDropdown',
            items: [],
            ref: el => (buttonDropdown = el),
          });
          const triggerButton = wrapper.findNativeButton().getElement();

          buttonDropdown!.focus();

          expect(document.activeElement).toBe(triggerButton);
        });
        describe('disabled property', () => {
          test('renders button with normal styling by default', () => {
            const wrapper = renderButtonDropdown({ ...props, items });
            const triggerButton = wrapper.findNativeButton().getElement();

            expect(triggerButton).not.toHaveAttribute('disabled');
          });
          test('renders button with disabled styling when true', () => {
            const wrapper = renderButtonDropdown({ ...props, items, disabled: true });
            const triggerButton = wrapper.findNativeButton().getElement();

            expect(triggerButton).toHaveAttribute('disabled');
          });
          test('should not render dropdown items when disabled', () => {
            const wrapper = renderButtonDropdown({ ...props, items, disabled: true });
            wrapper.openDropdown();
            const renderedItems = wrapper.findItems();

            expect(renderedItems.length).toEqual(0);
            expect(wrapper.findOpenDropdown()).toBe(null);
          });
        });
        test('loading property should not render dropdown items when disabled', () => {
          const wrapper = renderButtonDropdown({ ...props, items, loading: true });
          wrapper.openDropdown();
          const renderedItems = wrapper.findItems();

          expect(renderedItems.length).toEqual(0);
          expect(wrapper.findOpenDropdown()).toBe(null);
        });
      });
    });

    describe('"icon" variant', () => {
      it('renders one icon inside the button trigger', () => {
        const wrapper = renderButtonDropdown({ expandToViewport, items, variant: 'icon' });
        expect(wrapper.findNativeButton().findAllByClassName(IconWrapper.rootSelector)).toHaveLength(1);
      });

      it('ignores text label', () => {
        const wrapper = renderButtonDropdown({ expandToViewport, items, variant: 'icon', children: 'Title' });
        expect(wrapper.findNativeButton()!.getElement()).not.toHaveTextContent('Title');
      });
    });
  });
});

describe('ButtonDropdown component', () => {
  describe('URL sanitization', () => {
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });
    afterEach(() => {
      consoleWarnSpy?.mockRestore();
      consoleErrorSpy?.mockRestore();
    });

    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderButtonDropdown({ items: [{ id: 'test', text: 'test', href: 'javascript:void(0)' }] });
      act(() => element.openDropdown());
      expect((element.findItemById('test')!.find('a')!.getElement() as HTMLAnchorElement).href).toBe(
        'javascript:void(0)'
      );
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderButtonDropdown({ items: [{ id: 'test', text: 'test', href: "javascript:alert('Hello!')" }] })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [ButtonDropdown] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello!')".`
      );
    });

    test('should toggle dropdown on clicking the trigger', () => {
      const wrapper = renderButtonDropdown({ items });
      const triggerButton = wrapper.findNativeButton().getElement();
      triggerButton.click();
      expect(wrapper.findOpenDropdown()).toBeTruthy();
      triggerButton.click();
      expect(wrapper.findOpenDropdown()).not.toBeTruthy();
    });
  });
});

describe('"split-primary" variant', () => {
  test('does not render split trigger when 0 items', () => {
    const wrapper = renderSplitButtonDropdown({ items: [] });

    expect(wrapper.findNativeButton()).not.toBe(null);
    expect(wrapper.findSplitButton()).toBe(null);

    wrapper.openDropdown();
    expect(wrapper.findItems()).toHaveLength(0);
  });

  test('does not render split trigger when 1 items', () => {
    const wrapper = renderSplitButtonDropdown({ items: [{ id: '1', text: 'First' }] });

    expect(wrapper.findNativeButton()).not.toBe(null);
    expect(wrapper.findSplitButton()).toBe(null);

    wrapper.openDropdown();
    expect(wrapper.findItems()).toHaveLength(1);
  });

  test('does not render split trigger when the first item is a category', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        {
          id: '1',
          text: 'First',
          items: [
            { id: '1.1', text: 'First in group' },
            { id: '1.2', text: 'Second in group' },
          ],
        },
        {
          id: '2',
          text: 'Second',
        },
      ],
    });

    expect(wrapper.findNativeButton()).not.toBe(null);
    expect(wrapper.findSplitButton()).toBe(null);

    wrapper.openDropdown();
    expect(wrapper.findItems()).toHaveLength(3);
  });

  test('renders split trigger and 1 item in the dropdown when 2 items', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First' },
        { id: '2', text: 'Second' },
      ],
    });

    expect(wrapper.findNativeButton()).not.toBe(null);
    expect(wrapper.findSplitButton()).not.toBe(null);

    wrapper.openDropdown();
    expect(wrapper.findItems()).toHaveLength(1);
  });

  test('split trigger click triggers onItemClick', () => {
    const onItemClick = jest.fn();
    const onItemFollow = jest.fn();
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First' },
        { id: '2', text: 'Second' },
      ],
      onItemClick,
      onItemFollow,
    });

    wrapper.findSplitButton()!.click();

    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: '1' } }));
    expect(onItemFollow).not.toHaveBeenCalled();
  });

  test('split trigger click on external link triggers onItemFollow', () => {
    const onItemClick = jest.fn();
    const onItemFollow = jest.fn();
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First', href: 'https://external.com', external: true },
        { id: '2', text: 'Second' },
      ],
      onItemClick,
      onItemFollow,
    });

    wrapper.findSplitButton()!.click();

    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { id: '1', href: 'https://external.com', external: true, target: '_blank' } })
    );
    expect(onItemFollow).toHaveBeenCalledTimes(1);
    expect(onItemFollow).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { id: '1', href: 'https://external.com', external: true, target: '_blank' } })
    );
  });

  test('split trigger with external link has an icon and dedicated ARIA label', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        {
          id: '1',
          text: 'First',
          href: 'https://external.com',
          external: true,
          externalIconAriaLabel: '(opens in a new tab)',
        },
        { id: '2', text: 'Second' },
      ],
    });

    expect(wrapper.findSplitButton()!.findIcon()).not.toBe(null);
    expect(wrapper.findSplitButton()!.getElement()).toHaveTextContent('First');
    expect(wrapper.findSplitButton()!.getElement()).toHaveAccessibleName('First (opens in a new tab)');
  });

  test('split trigger can be set as disabled', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First', disabled: true },
        { id: '2', text: 'Second' },
      ],
    });

    const splitButton = new ButtonWrapper(wrapper.findSplitButton()!.getElement());
    expect(splitButton.isDisabled()).toBe(true);
  });

  test('disabled state applies to both split- and dropdown triggers', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First' },
        { id: '2', text: 'Second' },
      ],
      disabled: true,
    });

    const splitButton = new ButtonWrapper(wrapper.findSplitButton()!.getElement());
    expect(splitButton.isDisabled()).toBe(true);

    const dropdownTrigger = new ButtonWrapper(wrapper.findNativeButton()!.getElement());
    expect(dropdownTrigger.isDisabled()).toBe(true);
  });

  test('loading state applies to the split button and the dropdown trigger is set as disabled', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First' },
        { id: '2', text: 'Second' },
      ],
      loading: true,
    });

    const splitButton = new ButtonWrapper(wrapper.findSplitButton()!.getElement());
    expect(splitButton.isDisabled()).toBe(true);
    expect(splitButton.findLoadingIndicator()).not.toBe(null);

    const dropdownTrigger = new ButtonWrapper(wrapper.findNativeButton()!.getElement());
    expect(dropdownTrigger.isDisabled()).toBe(true);
    expect(dropdownTrigger.findLoadingIndicator()).toBe(null);
  });

  test('loading text is set once', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First' },
        { id: '2', text: 'Second' },
      ],
      loading: true,
      loadingText: 'Loading...',
    });

    const liveRegions = wrapper.findAllByClassName(liveRegionStyles.root).map(w => w.getElement());
    expect(liveRegions).toHaveLength(1);
    expect(liveRegions[0].textContent).toBe('Loading...');
  });

  test('keyup/keydown events on the split-button do not trigger dropdown to open', () => {
    const wrapper = renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First' },
        { id: '2', text: 'Second' },
      ],
    });

    wrapper.findSplitButton()!.keydown(KeyCode.enter);
    expect(wrapper.findOpenDropdown()).not.toBeTruthy();

    wrapper.findSplitButton()!.keyup(KeyCode.space);
    expect(wrapper.findOpenDropdown()).not.toBeTruthy();
  });

  test('buttons are wrapped in a semantic group', () => {
    renderSplitButtonDropdown({
      items: [
        { id: '1', text: 'First' },
        { id: '2', text: 'Second' },
      ],
      ariaLabel: 'Test actions',
    });

    expect(screen.getByRole('group')).toHaveAccessibleName('Test actions');
    expect(screen.getAllByRole('button')[0]).toHaveAccessibleName('First');
    expect(screen.getAllByRole('button')[1]).toHaveAccessibleName('Test actions');
  });
});
