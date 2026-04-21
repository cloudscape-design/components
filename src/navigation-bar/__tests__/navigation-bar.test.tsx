// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { getVisualContextClassname } from '../../../lib/components/internal/components/visual-context';
import NavigationBar, { NavigationBarProps } from '../../../lib/components/navigation-bar';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/navigation-bar/styles.selectors.js';

function renderNavigationBar(props: Partial<NavigationBarProps> = {}) {
  const { container } = render(<NavigationBar {...props} />);
  return createWrapper(container).findNavigationBar()!;
}

describe('NavigationBar', () => {
  describe('Basic rendering', () => {
    test('renders as a nav element', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement().tagName).toBe('NAV');
    });

    test('renders empty bar when no content provided', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.findContent()).toBeNull();
    });

    test('renders content', () => {
      const wrapper = renderNavigationBar({ content: <span>Hello</span> });
      expect(wrapper.findContent()!.getElement()).toHaveTextContent('Hello');
    });
  });

  describe('Variants', () => {
    test('defaults to primary variant', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).toHaveClass(styles['variant-primary']);
    });

    test('applies secondary variant class', () => {
      const wrapper = renderNavigationBar({ variant: 'secondary' });
      expect(wrapper.getElement()).toHaveClass(styles['variant-secondary']);
    });

    test('primary variant applies top-navigation visual context', () => {
      const wrapper = renderNavigationBar({ variant: 'primary' });
      expect(wrapper.getElement()).toHaveClass(getVisualContextClassname('top-navigation'));
    });

    test('secondary variant applies app-layout-toolbar visual context', () => {
      const wrapper = renderNavigationBar({ variant: 'secondary' });
      expect(wrapper.getElement()).toHaveClass(getVisualContextClassname('app-layout-toolbar'));
    });
  });

  describe('Placement', () => {
    test('defaults to block-start placement', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).toHaveClass(styles['placement-block-start']);
    });

    test.each(['block-start', 'block-end', 'inline-start', 'inline-end'] as const)(
      'applies %s placement class',
      placement => {
        const wrapper = renderNavigationBar({ placement });
        expect(wrapper.getElement()).toHaveClass(styles[`placement-${placement}`]);
      }
    );
  });

  describe('Accessibility', () => {
    test('applies ariaLabel to nav element', () => {
      const wrapper = renderNavigationBar({ ariaLabel: 'Main navigation' });
      expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('i18nStrings.ariaLabel overrides ariaLabel prop', () => {
      const wrapper = renderNavigationBar({
        ariaLabel: 'Prop label',
        i18nStrings: { ariaLabel: 'I18n label' },
      });
      expect(wrapper.getElement()).toHaveAttribute('aria-label', 'I18n label');
    });

    test('no aria-label when neither prop is provided', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).not.toHaveAttribute('aria-label');
    });
  });

  describe('Custom properties', () => {
    test('passes data attributes to root element', () => {
      const { container } = render(<NavigationBar data-testid="my-nav" />);
      expect(container.querySelector('[data-testid="my-nav"]')).toBeTruthy();
    });

    test('passes className to root element', () => {
      const { container } = render(<NavigationBar className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeTruthy();
    });
  });

  describe('disablePadding', () => {
    test('does not apply disable-padding class by default', () => {
      const wrapper = renderNavigationBar();
      expect(wrapper.getElement()).not.toHaveClass(styles['disable-padding']);
    });

    test('applies disable-padding class when disablePadding={true}', () => {
      const wrapper = renderNavigationBar({ disablePadding: true });
      expect(wrapper.getElement()).toHaveClass(styles['disable-padding']);
    });
  });

  describe('sticky offset management', () => {
    const originalResizeObserver = global.ResizeObserver;
    let lastObserverCb: ResizeObserverCallback | null = null;
    const allObserverCbs: ResizeObserverCallback[] = [];

    beforeEach(() => {
      lastObserverCb = null;
      allObserverCbs.length = 0;
      global.ResizeObserver = class MockResizeObserver {
        constructor(cb: ResizeObserverCallback) {
          lastObserverCb = cb;
          allObserverCbs.push(cb);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
      global.ResizeObserver = originalResizeObserver;
      document.body.style.removeProperty('--awsui-sticky-vertical-top-offset');
    });

    function triggerHeight(cb: ResizeObserverCallback, height: number) {
      cb([{ contentRect: { height } } as unknown as ResizeObserverEntry], {} as ResizeObserver);
    }

    test('sets --awsui-sticky-vertical-top-offset when sticky', () => {
      const { unmount } = render(<NavigationBar sticky={true} ariaLabel="nav" />);
      act(() => triggerHeight(lastObserverCb!, 60));
      expect(document.body.style.getPropertyValue('--awsui-sticky-vertical-top-offset')).toBe('60px');
      unmount();
    });

    test('does not set offset when not sticky', () => {
      const { unmount } = render(<NavigationBar sticky={false} ariaLabel="nav" />);
      // Variable should not be set to a non-zero value
      const value = document.body.style.getPropertyValue('--awsui-sticky-vertical-top-offset');
      expect(value === '' || value === '0px').toBe(true);
      unmount();
    });

    test('does not set offset for vertical placements', () => {
      const { unmount } = render(<NavigationBar sticky={true} placement="inline-start" ariaLabel="nav" />);
      expect(document.body.style.getPropertyValue('--awsui-sticky-vertical-top-offset')).toBe('');
      unmount();
    });

    test('cleans up offset on unmount', () => {
      const { unmount } = render(<NavigationBar sticky={true} ariaLabel="nav" />);
      act(() => triggerHeight(lastObserverCb!, 60));
      unmount();
      expect(document.body.style.getPropertyValue('--awsui-sticky-vertical-top-offset')).toBe('0px');
    });
  });
});
