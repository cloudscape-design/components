// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { setGlobalFlag } from '@cloudscape-design/component-toolkit/internal/testing';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { findUpUntil } from '../../../lib/components/internal/utils/dom';
import { SplitPanelProps } from '../../../lib/components/split-panel';
import createWrapper, { AppLayoutWrapper, ElementWrapper } from '../../../lib/components/test-utils/dom';

import testutilStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import visualRefreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';
import visualRefreshToolbarTriggerButtonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';

// Mock element queries result. Note that in order to work, this mock should be applied first, before the AppLayout is required
jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  isMotionDisabled: jest.fn().mockReturnValue(true),
  useDensityMode: jest.fn().mockReturnValue('comfortable'),
  useReducedMotion: jest.fn().mockReturnValue(true),
}));

export function renderComponent(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;

  const isUsingGridLayout = wrapper.getElement().classList.contains(visualRefreshStyles.layout);

  return { wrapper, rerender, isUsingGridLayout, container };
}

type Theme = 'refresh' | 'refresh-toolbar' | 'classic';
type Size = 'desktop' | 'mobile';

interface AppLayoutTestConfig {
  themes: Array<Theme>;
  sizes: Array<Size>;
}

type AppLayoutTestSuite = (config: { theme: Theme; size: Size }) => void;

const defaultTestConfig: AppLayoutTestConfig = {
  themes: ['classic', 'refresh', 'refresh-toolbar'],
  sizes: ['desktop', 'mobile'],
};

export function describeEachAppLayout(callback: AppLayoutTestSuite): void;
export function describeEachAppLayout(config: Partial<AppLayoutTestConfig>, callback: AppLayoutTestSuite): void;
export function describeEachAppLayout(
  ...args: [AppLayoutTestSuite] | [Partial<AppLayoutTestConfig>, AppLayoutTestSuite]
) {
  const config = args.length === 1 ? defaultTestConfig : { ...defaultTestConfig, ...args[0] };
  const callback = args.length === 1 ? args[0] : args[1];

  for (const theme of config.themes) {
    for (const size of config.sizes) {
      describe(`Theme=${theme}, Size=${size}`, () => {
        beforeEach(() => {
          (useMobile as jest.Mock).mockReturnValue(size === 'mobile');
          (useVisualRefresh as jest.Mock).mockReturnValue(theme !== 'classic');
          setGlobalFlag('appLayoutWidget', theme === 'refresh-toolbar');
        });
        afterEach(() => {
          (useMobile as jest.Mock).mockReset();
          (useVisualRefresh as jest.Mock).mockReset();
          setGlobalFlag('appLayoutWidget', undefined);
        });
        test('mocks applied correctly', () => {
          const { wrapper } = renderComponent(<AppLayout />);
          expect(!!wrapper.matches(`.${visualRefreshStyles.layout}`)).toEqual(theme === 'refresh');
          expect(!!wrapper.matches(`.${visualRefreshToolbarStyles.root}`)).toEqual(theme === 'refresh-toolbar');
          expect(!!wrapper.findByClassName(testutilStyles['mobile-bar'])).toEqual(size === 'mobile');
        });
        callback({ theme, size });
      });
    }
  }
}

export function isDrawerClosed(drawer: ElementWrapper) {
  // The visibility class name we are attaching to the wrapping element,
  // however the test-util points to the inner element, which has the scrollbar
  return !!findUpUntil(drawer.getElement(), element => element.classList.contains(testutilStyles['drawer-closed']));
}

export function findActiveDrawerLandmark(wrapper: AppLayoutWrapper) {
  const drawer = wrapper.findActiveDrawer();
  if (!drawer) {
    return null;
  }
  // <aside> tag is rendered differently in classic and refresh designs
  if (drawer.getElement().tagName === 'ASIDE') {
    return drawer;
  }
  return drawer.find('aside');
}

export function isDrawerTriggerWithBadge(wrapper: AppLayoutWrapper, triggerId: string) {
  const trigger = wrapper.findDrawerTriggerById(triggerId)!;
  return (
    // Visual refresh implementation
    trigger.getElement().classList.contains(visualRefreshStyles.badge) ||
    // Visual refresh toolbar implementation
    trigger.getElement().classList.contains(visualRefreshToolbarTriggerButtonStyles.badge) ||
    // Classic implementation
    !!trigger.findByClassName(iconStyles.badge)
  );
}

export function getActiveDrawerWidth(wrapper: AppLayoutWrapper): string {
  const drawerElement = wrapper.findActiveDrawer()!.getElement();
  let value = drawerElement.style.getPropertyValue(customCssProps.drawerSize);
  // Visual refresh implementation
  if (value) {
    return value;
  }
  // Visual refresh toolbar implementation
  value = wrapper.getElement()!.style.getPropertyValue(customCssProps.toolsWidth);
  if (value) {
    return value;
  }
  // Classic implementation
  return drawerElement.style.width;
}

export const splitPanelI18nStrings: SplitPanelProps.I18nStrings = {
  closeButtonAriaLabel: 'Close panel',
  openButtonAriaLabel: 'Open panel',
  preferencesTitle: 'Preferences',
  preferencesPositionLabel: 'Position',
  preferencesPositionDescription: 'Choose the default split panel position.',
  preferencesPositionSide: 'Side',
  preferencesPositionBottom: 'Bottom',
  preferencesConfirm: 'Confirm',
  preferencesCancel: 'Cancel',
  resizeHandleAriaLabel: 'Resize panel',
};

export const testDrawer: AppLayoutProps.Drawer = {
  ariaLabels: {
    closeButton: 'Security close button',
    drawerName: 'Security drawer content',
    triggerButton: 'Security trigger button',
    resizeHandle: 'Security resize handle',
  },
  content: <span>Security</span>,
  id: 'security',
  trigger: {
    iconName: 'security',
  },
};

export const testDrawerWithoutLabels = {
  ...testDrawer,
  // not allowed by types, but we still would like to test this
  ariaLabels: undefined as unknown as AppLayoutProps.DrawerAriaLabels,
};

const getDrawerItem = (id: string, badge: boolean): AppLayoutProps.Drawer => {
  return {
    ariaLabels: {
      closeButton: `${id} close button`,
      drawerName: `${id} drawer content`,
      triggerButton: `${id} trigger button`,
      resizeHandle: `${id} resize handle`,
    },
    content: <span>{id}</span>,
    badge,
    id,
    trigger: {
      iconName: 'security',
    },
  };
};

export const manyDrawers: Array<AppLayoutProps.Drawer> = [
  getDrawerItem('security', true),
  ...Array.from({ length: 100 }, (_, index) => getDrawerItem(`${index}`, false)),
];

export const manyDrawersWithBadges: Array<AppLayoutProps.Drawer> = Array.from({ length: 100 }, (_, index) =>
  getDrawerItem(`${index}`, true)
);
