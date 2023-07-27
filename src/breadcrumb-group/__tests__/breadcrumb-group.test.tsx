// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, act } from '@testing-library/react';
import styles from '../../../lib/components/breadcrumb-group/styles.css.js';
import itemStyles from '../../../lib/components/breadcrumb-group/item/styles.css.js';
import TestI18nProvider from '../../../lib/components/i18n/testing';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import createWrapper, { BreadcrumbGroupWrapper } from '../../../lib/components/test-utils/dom';

const renderBreadcrumbGroup = (props: BreadcrumbGroupProps) => {
  const renderResult = render(<BreadcrumbGroup {...props} />);
  return createWrapper(renderResult.container).findBreadcrumbGroup(`.${styles['breadcrumb-group']}`)!;
};

describe('BreadcrumbGroup Component', () => {
  test('has no aria-label by default', () => {
    const breadCrumbGroup = renderBreadcrumbGroup({ items: [] }).getElement();
    expect(breadCrumbGroup).not.toHaveAttribute('aria-label');
  });

  test('can set an aria-label', () => {
    const breadCrumbGroup = renderBreadcrumbGroup({ items: [], ariaLabel: 'Breadcrumbs' }).getElement();
    expect(breadCrumbGroup).toHaveAttribute('aria-label', 'Breadcrumbs');
  });

  test('with zero items', () => {
    const breadCrumbGroup = renderBreadcrumbGroup({ items: [] });
    expect(breadCrumbGroup.findBreadcrumbLinks()).toHaveLength(0);
  });

  describe('using items property', () => {
    let wrapper: BreadcrumbGroupWrapper;
    let items: BreadcrumbGroupProps.Item[];
    beforeEach(() => {
      items = [
        {
          text: 'Item 1',
          href: '/#1',
        },
        {
          text: 'Item 2',
          href: '/#3',
        },
        {
          text: 'Item 3',
          href: '/#3',
        },
      ];
      wrapper = renderBreadcrumbGroup({ items });
    });

    test('renders with items', () => {
      expect(wrapper.getElement().nodeName).toBe('NAV');

      const links = wrapper.findBreadcrumbLinks();
      expect(links).toHaveLength(3);

      links.forEach((link, i) => {
        expect(link.getElement()).toHaveTextContent(items[i].text);
        if (i === links.length - 1) {
          // last item should not have an href
          expect(link.getElement()).not.toHaveAttribute('href', items[i].href);
        } else {
          expect(link.getElement()).toHaveAttribute('href', items[i].href);
        }
      });
    });

    test('has ellipsis', () => {
      expect(wrapper.findDropdown()!.findNativeButton()).not.toBe(null);
      expect(wrapper.findByClassName(styles.ellipsis)!.getElement()).toBeInTheDocument();
    });

    test('dropdown button has aria-label', () => {
      const nativeButton = wrapper.findDropdown()?.findNativeButton();
      expect(nativeButton?.getElement()).toHaveAttribute('aria-label', 'Show path');
    });

    test('can set aria-label to dropdown buttons', () => {
      wrapper = renderBreadcrumbGroup({ items, expandAriaLabel: 'Custom Show path label' });
      expect(wrapper.findDropdown()?.findNativeButton().getElement()).toHaveAttribute(
        'aria-label',
        'Custom Show path label'
      );
    });

    test('has proper aria-expanded state on ellipsis button', () => {
      const button = wrapper.findDropdown()?.findNativeButton();

      expect(button?.getElement()).toHaveAttribute('aria-expanded', 'false');
      act(() => button?.click());
      expect(button?.getElement()).toHaveAttribute('aria-expanded', 'true');
    });

    test('test-utils findBreadcrumbLink selector properly skip ellipsis item', () => {
      for (let index = 1; index <= items.length; index++) {
        expect(wrapper.findBreadcrumbLink(index)!.getElement()).toHaveTextContent(`Item ${index}`);
      }
    });

    test('test-utils findBreadcrumbLink selector properly finds non-link items in short lists', () => {
      const { container } = render(<BreadcrumbGroup items={[items[0], items[1]]} />);
      const breadcrumbs = createWrapper(container).findBreadcrumbGroup()!;

      expect(breadcrumbs.findBreadcrumbLink(1)?.getElement()).toHaveTextContent(items[0].text);
      expect(breadcrumbs.findBreadcrumbLink(2)?.getElement()).toHaveTextContent(items[1].text);
    });

    // Test for AWSUI-6738
    test('all the icons stay visible when changing the items', () => {
      const { container, rerender } = render(<BreadcrumbGroup items={items} />);
      const wrapper = createWrapper(container).findBreadcrumbGroup(`.${styles['breadcrumb-group']}`)!;
      const getIcons = () => wrapper.findAll(`.${itemStyles.icon}`);
      expect(getIcons()).toHaveLength(2);
      rerender(<BreadcrumbGroup items={items.slice(0, 2)} />);
      rerender(<BreadcrumbGroup items={[]} />);
      rerender(<BreadcrumbGroup items={items.slice()} />);
      expect(getIcons()).toHaveLength(2);
    });
  });

  test('supports extended items object', () => {
    interface ExtendedItem extends BreadcrumbGroupProps.Item {
      metadata: number;
    }
    const onClick: (item: ExtendedItem) => void = jest.fn();
    const items: ExtendedItem[] = [
      { href: '/home', text: 'Home', metadata: 1 },
      { href: '/distributions', text: 'Distributions', metadata: 2 },
      { href: '/distributions/create', text: 'Creaate', metadata: 3 },
    ];
    const { container } = render(
      <BreadcrumbGroup
        items={items}
        onClick={event => {
          event.preventDefault(); // suppress JSDOM warning on page navigation
          onClick(event.detail.item);
        }}
      />
    );
    const wrapper = createWrapper(container).findBreadcrumbGroup(`.${styles['breadcrumb-group']}`)!;
    wrapper.findBreadcrumbLink(2)!.click();
    expect(onClick).toHaveBeenCalledWith(items[1]);
  });

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
      const element = renderBreadcrumbGroup({
        items: [
          { text: '1', href: 'javascript:void(0)' },
          { text: '2', href: 'javascript:void(0)' },
        ],
      });
      expect((element.findBreadcrumbLink(1)!.getElement() as HTMLAnchorElement).href).toBe('javascript:void(0)');
      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() => renderBreadcrumbGroup({ items: [{ text: '', href: "javascript:alert('Hello!')" }] })).toThrow(
        'A javascript: URL was blocked as a security precaution.'
      );

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `[AwsUi] [BreadcrumbGroup] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello!')".`
      );
    });
  });

  describe('i18n', () => {
    test('supports providing expandAriaLabel from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider messages={{ 'breadcrumb-group': { expandAriaLabel: 'Custom show path' } }}>
          <BreadcrumbGroup
            items={[
              { text: 'Item 1', href: '/#1' },
              { text: 'Item 2', href: '/#3' },
              { text: 'Item 3', href: '/#3' },
            ]}
          />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findBreadcrumbGroup()!;
      expect(wrapper.findDropdown()?.findNativeButton().getElement()).toHaveAttribute('aria-label', 'Custom show path');
    });
  });
});
