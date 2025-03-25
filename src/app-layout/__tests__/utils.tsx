// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { clearVisualRefreshState, setGlobalFlag } from '@cloudscape-design/component-toolkit/internal/testing';
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import { SplitPanelProps } from '../../../lib/components/split-panel';
import createWrapper, { AppLayoutWrapper, ElementWrapper } from '../../../lib/components/test-utils/dom';
import { forceMobileModeSymbol } from '../../internal/hooks/use-mobile';

import testutilStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import visualRefreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';

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

const globalWithFlags = globalThis as any;

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
          globalWithFlags[forceMobileModeSymbol] = size === 'mobile';
          globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => theme !== 'classic';
          setGlobalFlag('appLayoutWidget', theme === 'refresh-toolbar');
        });
        afterEach(() => {
          delete globalWithFlags[forceMobileModeSymbol];
          delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
          setGlobalFlag('appLayoutWidget', undefined);
          clearVisualRefreshState();
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

class AppLayoutDrawerWrapper extends ComponentWrapper {
  isActive(): boolean {
    return this.element.classList.contains(testutilStyles['active-drawer']);
  }
}

export const getGlobalDrawersTestUtils = (wrapper: AppLayoutWrapper) => {
  return {
    findActiveDrawers(): Array<ElementWrapper> {
      return wrapper.findAllByClassName(testutilStyles['active-drawer']);
    },

    findDrawerById(id: string): AppLayoutDrawerWrapper | null {
      const element = wrapper.find(`[data-testid="awsui-app-layout-drawer-${id}"]`);
      return element ? new AppLayoutDrawerWrapper(element.getElement()) : null;
    },

    findGlobalDrawersTriggers(): ElementWrapper<HTMLButtonElement>[] {
      return wrapper.findAllByClassName<HTMLButtonElement>(testutilStyles['drawers-trigger-global']);
    },

    findResizeHandleByActiveDrawerId(id: string): ElementWrapper | null {
      return wrapper.find(
        `.${testutilStyles['active-drawer']}[data-testid="awsui-app-layout-drawer-${id}"] .${testutilStyles['drawers-slider']}`
      );
    },

    findCloseButtonByActiveDrawerId(id: string): ElementWrapper | null {
      return wrapper.find(
        `.${testutilStyles['active-drawer']}[data-testid="awsui-app-layout-drawer-${id}"] .${testutilStyles['active-drawer-close-button']}`
      );
    },

    findFocusModeButtonByActiveDrawerId(id: string): ElementWrapper | null {
      return wrapper.find(
        `.${testutilStyles['active-drawer']}[data-testid="awsui-app-layout-drawer-${id}"] .${testutilStyles['active-drawer-focus-mode-button']}`
      );
    },
  };
};
