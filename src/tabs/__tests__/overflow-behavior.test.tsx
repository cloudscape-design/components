// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import Tabs, { TabsProps } from '../../../lib/components/tabs';
import createWrapper from '../../../lib/components/test-utils/dom';

import tabStyles from '../../../lib/components/tabs/styles.css.js';

// Mock IntersectionObserver (not available in jsdom)
let mockObserverCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback) {
    mockObserverCallback = callback;
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

function triggerIntersection(container: HTMLElement, hiddenTabIds: string[]) {
  if (!mockObserverCallback) {
    return;
  }
  const tabItems = Array.from(container.querySelectorAll('[data-tab-id]'));
  const entries = tabItems.map(el => {
    const tabId = (el as HTMLElement).dataset.tabId ?? '';
    return {
      target: el,
      intersectionRatio: hiddenTabIds.includes(tabId) ? 0.5 : 1,
      isIntersecting: !hiddenTabIds.includes(tabId),
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: 0,
    };
  }) as IntersectionObserverEntry[];
  act(() => {
    mockObserverCallback!(entries, {} as IntersectionObserver);
  });
}

beforeEach(() => {
  mockObserverCallback = null;
  (global as any).IntersectionObserver = MockIntersectionObserver;
});

afterEach(() => {
  jest.restoreAllMocks();
});

const tabs: Array<TabsProps.Tab> = [
  { id: 'tab-1', label: 'Tab 1', content: 'Content 1' },
  { id: 'tab-2', label: 'Tab 2', content: 'Content 2' },
  { id: 'tab-3', label: 'Tab 3', content: 'Content 3' },
  { id: 'tab-4', label: 'Tab 4', content: 'Content 4' },
  { id: 'tab-5', label: 'Tab 5', content: 'Content 5' },
];

function renderTabs(props: Partial<TabsProps> = {}) {
  const result = render(
    <Tabs
      tabs={tabs}
      ariaLabel="Test tabs"
      i18nStrings={{ overflowMenuAriaLabel: 'More tabs', scrollLeftAriaLabel: 'Left', scrollRightAriaLabel: 'Right' }}
      {...props}
    />
  );
  return { ...result, wrapper: createWrapper(result.container).findTabs()! };
}

describe('Tabs — overflowBehavior prop', () => {
  describe('default (scroll) behavior', () => {
    it('does not render an overflow dropdown', () => {
      const { wrapper } = renderTabs({ overflowBehavior: 'scroll' });
      expect(wrapper.findOverflowDropdown()).toBeNull();
    });

    it('renders all tabs in the tab list', () => {
      const { wrapper } = renderTabs({ overflowBehavior: 'scroll' });
      expect(wrapper.findTabLinks()).toHaveLength(tabs.length);
    });
  });

  describe('dropdown overflow behavior', () => {
    it('does not render the overflow dropdown when all tabs are visible', () => {
      const { wrapper, container } = renderTabs({ overflowBehavior: 'dropdown' });
      // No hidden tabs → no dropdown
      triggerIntersection(container, []);
      expect(wrapper.findOverflowDropdown()).toBeNull();
    });

    it('renders the overflow dropdown when some tabs are clipped', () => {
      const { wrapper, container } = renderTabs({ overflowBehavior: 'dropdown' });
      triggerIntersection(container, ['tab-4', 'tab-5']);
      expect(wrapper.findOverflowDropdown()).not.toBeNull();
    });

    it('renders all tabs in the tab list regardless of overflow', () => {
      const { wrapper } = renderTabs({ overflowBehavior: 'dropdown' });
      expect(wrapper.findTabLinks()).toHaveLength(tabs.length);
    });

    it('applies the overflow dropdown mode CSS class to the tab list', () => {
      const { container } = renderTabs({ overflowBehavior: 'dropdown' });
      const tabList = container.querySelector('[role="tablist"]');
      // The CSS module class name for dropdown overflow mode
      expect(tabList?.classList.contains(tabStyles['tabs-header-list-dropdown-overflow'])).toBe(true);
    });

    it('does not apply the overflow dropdown CSS class when using scroll mode', () => {
      const { container } = renderTabs({ overflowBehavior: 'scroll' });
      const tabList = container.querySelector('[role="tablist"]');
      expect(tabList?.classList.contains(tabStyles['tabs-header-list-dropdown-overflow'])).toBe(false);
    });

    it('uses the overflowMenuAriaLabel i18n string for the dropdown trigger', () => {
      const { wrapper, container } = renderTabs({
        overflowBehavior: 'dropdown',
        i18nStrings: {
          overflowMenuAriaLabel: 'Show more tabs',
          scrollLeftAriaLabel: 'Left',
          scrollRightAriaLabel: 'Right',
        },
      });
      triggerIntersection(container, ['tab-5']);
      const dropdown = wrapper.findOverflowDropdown();
      expect(dropdown).not.toBeNull();
      const triggerButton = dropdown!.findNativeButton().getElement();
      expect(triggerButton).toHaveAttribute('aria-label', 'Show more tabs');
    });

    it('selecting a tab from the overflow dropdown fires onChange', () => {
      const onChange = jest.fn();
      const { wrapper, container } = renderTabs({ overflowBehavior: 'dropdown', onChange });
      triggerIntersection(container, ['tab-4', 'tab-5']);

      const dropdown = wrapper.findOverflowDropdown();
      expect(dropdown).not.toBeNull();
      dropdown!.openDropdown();
      dropdown!.findItemById('tab-4')!.click();
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: expect.objectContaining({ activeTabId: 'tab-4' }) })
      );
    });
  });

  describe('interface', () => {
    it('accepts overflowBehavior="scroll" without errors', () => {
      expect(() => renderTabs({ overflowBehavior: 'scroll' })).not.toThrow();
    });

    it('accepts overflowBehavior="dropdown" without errors', () => {
      expect(() => renderTabs({ overflowBehavior: 'dropdown' })).not.toThrow();
    });

    it('defaults to scroll behavior when overflowBehavior is not set', () => {
      const { container } = renderTabs();
      const tabList = container.querySelector('[role="tablist"]');
      expect(tabList?.classList.contains(tabStyles['tabs-header-list-dropdown-overflow'])).toBe(false);
    });
  });
});
