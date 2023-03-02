// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import ButtonDropdown, { ButtonDropdownProps } from '../../../lib/components/button-dropdown';
import createWrapper, { IconWrapper } from '../../../lib/components/test-utils/dom';

const renderButtonDropdown = (props: Parameters<typeof ButtonDropdown>[0]) => {
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
