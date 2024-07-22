// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import TopNavigationWrapper from '../../../../lib/components/test-utils/dom/top-navigation/1.0-beta';
import TopNavigation, { TopNavigationProps } from '../../../../lib/components/top-navigation/1.0-beta';

export const I18N_STRINGS: TopNavigationProps.I18nStrings = {
  searchIconAriaLabel: 'Search',
  searchDismissIconAriaLabel: 'Close search',
  overflowMenuTriggerText: 'More',
};

type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

const renderTopNavigation = (props: PickPartial<TopNavigationProps, 'i18nStrings'>) => {
  const { container } = render(<TopNavigation i18nStrings={I18N_STRINGS} {...props} />);
  return new TopNavigationWrapper(container.querySelector<HTMLElement>(`.${TopNavigationWrapper.rootSelector}`)!);
};

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

  describe('for the identity', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({ identity: { href: 'javascript:void(0)' } });
      expect((element.findIdentityLink().getElement() as HTMLAnchorElement).href).toBe('javascript:void(0)');

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() => renderTopNavigation({ identity: { href: "javascript:alert('Hello from the identity!')" } })).toThrow(
        'A javascript: URL was blocked as a security precaution.'
      );

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from the identity!')".`
      );
    });
  });

  describe('for a utility button', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({
        identity: { href: '#' },
        utilities: [{ type: 'button', href: 'javascript:void(0)' }],
      });
      expect(element.findUtility(1)!.findButtonLinkType()!.getElement().href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderTopNavigation({ identity: { href: "javascript:alert('Hello from the utility button!')" } })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from the utility button!')".`
      );
    });
  });

  describe('for a utility menu item', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({
        identity: { href: '#' },
        utilities: [{ type: 'menu-dropdown', items: [{ id: 'test', text: 'test', href: 'javascript:void(0)' }] }],
      });
      const dropdown = element.findUtility(1)!.findMenuDropdownType()!;
      act(() => {
        dropdown.openDropdown();
      });

      expect(dropdown.findItemById('test')!.find<HTMLAnchorElement>('a')!.getElement().href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderTopNavigation({
          identity: { href: '#' },
          utilities: [
            {
              type: 'menu-dropdown',
              items: [{ id: 'test', text: 'test', href: "javascript:alert('Hello from a utility menu item!')" }],
            },
          ],
        })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from a utility menu item!')".`
      );
    });
  });

  describe('for a nested utility menu item', () => {
    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTopNavigation({
        identity: { href: '#' },
        utilities: [
          {
            type: 'menu-dropdown',
            items: [
              {
                id: 'outer-menu-item',
                text: 'outer menu item',
                items: [{ id: 'test', text: 'nested menu item', href: 'javascript:void(0)' }],
              },
            ],
          },
        ],
      });
      const dropdown = element.findUtility(1)!.findMenuDropdownType()!;
      act(() => {
        dropdown.openDropdown();
      });
      expect(dropdown.findItemById('test')!.find<HTMLAnchorElement>('a')!.getElement().href).toBe('javascript:void(0)');

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderTopNavigation({
          identity: { href: '#' },
          utilities: [
            {
              type: 'menu-dropdown',
              items: [
                {
                  id: 'outer-menu-item',
                  text: 'outer menu item',
                  items: [
                    {
                      id: 'test',
                      text: 'nested menu item',
                      href: "javascript:alert('Hello from a nested utility menu item!')",
                    },
                  ],
                },
              ],
            },
          ],
        })
      ).toThrow('A javascript: URL was blocked as a security precaution.');

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [TopNavigation] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello from a nested utility menu item!')".`
      );
    });
  });
});
