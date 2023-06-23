// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper, { ButtonWrapper, IconWrapper } from '../../../lib/components/test-utils/dom';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';
import { KeyCode } from '../../../lib/components/internal/keycode';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const renderButtonDropdown = (
  props: Parameters<typeof ButtonDropdown>[0],
  ref?: React.Ref<ButtonDropdownProps.Ref>
) => {
  const renderResult = render(<ButtonDropdown ref={ref} {...props} />);
  return createWrapper(renderResult.container).findButtonDropdown()!;
};

const renderSplitButtonDropdown = (
  props: Partial<Parameters<typeof ButtonDropdown>[0]>,
  ref?: React.Ref<ButtonDropdownProps.Ref>
) => {
  return renderButtonDropdown(
    { ariaLabel: 'Actions', variant: 'primary', items: [{ id: '1', text: 'First item' }], ...props },
    ref
  );
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

describe('with main action', () => {
  test('main action is not rendered if variant is not "primary"', () => {
    const wrapper = renderSplitButtonDropdown({ mainAction: { text: 'Main' }, variant: 'normal' });

    expect(wrapper.findMainAction()).toBe(null);

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'ButtonDropdown',
      'Main action is only supported for "primary" component variant.'
    );
  });

  test('renders main action', () => {
    const wrapper = renderSplitButtonDropdown({ mainAction: { text: 'Main' } });

    expect(wrapper.findNativeButton()).not.toBe(null);
    expect(wrapper.findMainAction()).not.toBe(null);

    wrapper.openDropdown();
    expect(wrapper.findItems()).toHaveLength(1);
  });

  test('main action onClick is triggered', () => {
    const onClick = jest.fn();
    const onFollow = jest.fn();
    const wrapper = renderSplitButtonDropdown({ mainAction: { text: 'Main', onClick, onFollow } });

    wrapper.findMainAction()!.click();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onFollow).not.toHaveBeenCalled();
  });

  test('main action onFollow is triggered', () => {
    const onClick = jest.fn();
    const onFollow = jest.fn();
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main', onClick, onFollow, href: 'https://external.com' },
    });

    wrapper.findMainAction()!.click();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onFollow).toHaveBeenCalledTimes(1);
  });

  test('main action with external link has an icon and dedicated ARIA label', () => {
    const wrapper = renderSplitButtonDropdown({
      mainAction: {
        text: 'Main',
        href: 'https://external.com',
        external: true,
        externalIconAriaLabel: '(opens in a new tab)',
      },
    });

    expect(wrapper.findMainAction()?.findByClassName(iconStyles.icon)).not.toBe(null);
    expect(wrapper.findMainAction()!.getElement()).toHaveTextContent('Main');
    expect(wrapper.findMainAction()!.getElement()).toHaveAccessibleName('Main (opens in a new tab)');
  });

  test('main action can be set as disabled', () => {
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main', disabled: true },
    });

    const mainAction = new ButtonWrapper(wrapper.findMainAction()!.getElement());
    expect(mainAction.isDisabled()).toBe(true);
  });

  test('main action can be set as loading', () => {
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main', loading: true, loadingText: 'Loading...' },
    });

    expect(wrapper.findMainAction()?.findLoadingIndicator()).not.toBe(null);
    const liveRegion = wrapper.findByClassName(liveRegionStyles.root)!.getElement();
    expect(liveRegion.textContent).toBe('Loading...');
  });

  test('button-dropdown disabled state is only set on the trigger', () => {
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main' },
      disabled: true,
    });

    expect(wrapper.findMainAction()!.isDisabled()).toBe(false);

    const dropdownTrigger = new ButtonWrapper(wrapper.findNativeButton()!.getElement());
    expect(dropdownTrigger.isDisabled()).toBe(true);
  });

  test('button-dropdown loading state is only set on the trigger', () => {
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main' },
      loading: true,
      loadingText: 'Loading...',
    });

    const mainAction = wrapper.findMainAction()!;
    expect(mainAction.isDisabled()).toBe(false);
    expect(mainAction.findLoadingIndicator()).toBe(null);

    const dropdownTrigger = new ButtonWrapper(wrapper.findNativeButton()!.getElement());
    expect(dropdownTrigger.isDisabled()).toBe(true);
    expect(dropdownTrigger.findLoadingIndicator()).not.toBe(null);
    const liveRegion = wrapper.findByClassName(liveRegionStyles.root)!.getElement();
    expect(liveRegion.textContent).toBe('Loading...');
  });

  test('keyup/keydown events on the main action do not trigger dropdown to open', () => {
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main' },
    });

    wrapper.findMainAction()!.keydown(KeyCode.enter);
    expect(wrapper.findOpenDropdown()).not.toBeTruthy();

    wrapper.findMainAction()!.keyup(KeyCode.space);
    expect(wrapper.findOpenDropdown()).not.toBeTruthy();
  });

  test('dropdown is closed upon main action click', () => {
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main' },
    });

    wrapper.openDropdown();
    expect(wrapper.findOpenDropdown()).toBeTruthy();

    wrapper.findMainAction()!.click();
    expect(wrapper.findOpenDropdown()).not.toBeTruthy();
  });

  test('dropdown is not closed is main action click was cancelled', () => {
    const onClick = (event: Event) => event.stopPropagation();
    const wrapper = renderSplitButtonDropdown({
      mainAction: { text: 'Main', onClick },
    });

    wrapper.openDropdown();
    expect(wrapper.findOpenDropdown()).toBeTruthy();

    wrapper.findMainAction()!.click();
    expect(wrapper.findOpenDropdown()).toBeTruthy();
  });

  test('buttons are wrapped in a semantic group', () => {
    renderSplitButtonDropdown({
      mainAction: { text: 'Main' },
      ariaLabel: 'Test actions',
    });

    expect(screen.getByRole('group')).toHaveAccessibleName('Test actions');
    expect(screen.getAllByRole('button')[0]).toHaveAccessibleName('Main');
    expect(screen.getAllByRole('button')[1]).toHaveAccessibleName('Test actions');
  });

  test('ref.focus() focuses the main action', () => {
    const ref = React.createRef<ButtonDropdownProps.Ref>();
    const wrapper = renderSplitButtonDropdown({ mainAction: { text: 'Main' } }, ref);

    ref.current!.focus();

    expect(wrapper.findMainAction()!.getElement()).toHaveFocus();
  });
});
