// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { DATA_ATTR_RESOURCE_TYPE, getFunnelNameSelector } from '../../../lib/components/internal/analytics/selectors';
import createWrapper, { BreadcrumbGroupWrapper, ElementWrapper } from '../../../lib/components/test-utils/dom';

import itemStyles from '../../../lib/components/breadcrumb-group/item/styles.css.js';
import styles from '../../../lib/components/breadcrumb-group/styles.css.js';

let mockMobileViewport = false;
jest.mock('@cloudscape-design/component-toolkit', () => {
  return {
    ...jest.requireActual('@cloudscape-design/component-toolkit'),
    useContainerQuery: () => (mockMobileViewport ? [10, () => {}] : [9999, () => {}]),
  };
});
jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  getLogicalBoundingClientRect: () => ({ inlineSize: 50 }),
}));
afterEach(() => {
  mockMobileViewport = false;
});

const renderBreadcrumbGroup = (props: BreadcrumbGroupProps) => {
  const renderResult = render(<BreadcrumbGroup {...props} />);
  return createWrapper(renderResult.container).findBreadcrumbGroup()!;
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

    test('renders with items (mobile)', () => {
      mockMobileViewport = true;
      wrapper = renderBreadcrumbGroup({ items });
      expect(wrapper.getElement().nodeName).toBe('NAV');

      const dropdown = wrapper.findDropdown()!;
      dropdown.openDropdown();
      const links = dropdown.findItems();
      expect(links).toHaveLength(3);

      links.forEach((link, i) => {
        expect(link.getElement()).toHaveTextContent(items[i].text);
        if (i === links.length - 1) {
          // last item should not have an href
          expect(link.getElement().querySelector('a')).toBeFalsy();
        } else {
          expect(link.getElement().querySelector('a')).toHaveAttribute('href', items[i].href);
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
      const wrapper = createWrapper(container).findBreadcrumbGroup()!;
      const getIcons = () => wrapper.findAll(`.${itemStyles.breadcrumb} .${itemStyles.icon}`);
      expect(getIcons()).toHaveLength(2);
      rerender(<BreadcrumbGroup items={items.slice(0, 2)} />);
      rerender(<BreadcrumbGroup items={[]} />);
      rerender(<BreadcrumbGroup items={items.slice()} />);
      expect(getIcons()).toHaveLength(2);
    });

    test('clicking current page in mobile dropdown should close dropdown without events', () => {
      mockMobileViewport = true;
      const onClick = jest.fn();
      const onFollow = jest.fn();
      const { container } = render(<BreadcrumbGroup items={items} onClick={onClick} onFollow={onFollow} />);
      const wrapper = createWrapper(container).findBreadcrumbGroup()!;
      const dropdown = wrapper.findDropdown()!;
      dropdown.openDropdown();
      expect(dropdown.findItems().length).toBe(3);
      dropdown.findItems()[2].click();
      expect(dropdown.findOpenDropdown()).toBeFalsy();
      expect(onClick).not.toHaveBeenCalled();
      expect(onFollow).not.toHaveBeenCalled();
    });
  });

  test.each([[true], [false]])('supports extended items object (mobile: %p)', mobile => {
    mockMobileViewport = mobile;
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
    const wrapper = createWrapper(container).findBreadcrumbGroup()!;
    if (mobile) {
      const dropdown = wrapper.findDropdown()!;
      dropdown.openDropdown();
      dropdown.findItems()[1].click();
    } else {
      wrapper.findBreadcrumbLink(2)!.click();
    }
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

  describe('Ghost breadcrumb group', () => {
    test('has aria-hidden property', () => {
      const breadCrumbGroup = renderBreadcrumbGroup({ items: [] });
      expect(breadCrumbGroup.find(`.${styles.ghost}`)?.getElement()).toHaveAttribute('aria-hidden', 'true');
    });
    test('has tab-index=-1', () => {
      const breadCrumbGroup = renderBreadcrumbGroup({
        items: [
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
        ],
      });
      expect(breadCrumbGroup.find(`.${styles.ghost}`)?.getElement()).toHaveAttribute('tabindex', '-1');
      const anchors = breadCrumbGroup
        .find(`.${styles.ghost}`)!
        .findAll('a')
        .map(wrapper => wrapper.getElement());
      anchors.forEach(anchor => {
        expect(anchor).toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe.each([[true], [false]])('funnel attributes (mobile: %p)', mobile => {
    beforeEach(() => {
      mockMobileViewport = mobile;
    });
    function getElementsText(elements: Array<ElementWrapper>) {
      return Array.from(elements).map(element => element.getElement().textContent);
    }

    function getFunnelNameElements(wrapper: BreadcrumbGroupWrapper) {
      return wrapper.findAll(getFunnelNameSelector());
    }

    function getResourceTypeElements(wrapper: BreadcrumbGroupWrapper) {
      return wrapper.findAll(`[${DATA_ATTR_RESOURCE_TYPE}]`);
    }

    test('should add funnel name and resource type attributes', () => {
      const wrapper = renderBreadcrumbGroup({
        items: [
          { text: 'Home', href: '/home' },
          { text: 'Resource', href: '/resource' },
          { text: 'Name', href: '/resource/name' },
        ],
      });
      expect(getElementsText(getResourceTypeElements(wrapper))).toEqual(['Resource']);
      expect(getElementsText(getFunnelNameElements(wrapper))).toEqual(['Name']);
    });

    test('allows funnel name and resource type to be the same item', () => {
      const wrapper = renderBreadcrumbGroup({
        items: [
          { text: 'Home', href: '/home' },
          { text: 'Page', href: '/page' },
        ],
      });
      expect(getElementsText(getResourceTypeElements(wrapper))).toEqual(['Page']);
      expect(getElementsText(getFunnelNameElements(wrapper))).toEqual(['Page']);
    });

    test('only adds funnel name if there is only one item', () => {
      const wrapper = renderBreadcrumbGroup({
        items: [{ text: 'Home', href: '/home' }],
      });
      expect(getElementsText(getResourceTypeElements(wrapper))).toEqual([]);
      expect(getElementsText(getFunnelNameElements(wrapper))).toEqual(['Home']);
    });
  });
});
