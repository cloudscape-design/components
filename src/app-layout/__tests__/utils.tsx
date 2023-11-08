// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import { SplitPanelProps } from '../../../lib/components/split-panel';
import createWrapper, { AppLayoutWrapper, ElementWrapper } from '../../../lib/components/test-utils/dom';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { findUpUntil } from '../../../lib/components/internal/utils/dom';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import testutilStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import { BetaDrawersProps } from '../../../lib/components/app-layout/drawer/interfaces';
import { IconProps } from '../../../lib/components/icon/interfaces';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
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
  const isUsingMobile = !!wrapper.findByClassName(testutilStyles['mobile-bar']);

  return { wrapper, rerender, isUsingGridLayout, isUsingMobile, container };
}

export function describeEachThemeAppLayout(isMobile: boolean, callback: (theme: string) => void) {
  for (const theme of ['refresh', 'classic']) {
    describe(`${isMobile ? 'Mobile' : 'Desktop'}, Theme=${theme}`, () => {
      beforeEach(() => {
        (useMobile as jest.Mock).mockReturnValue(isMobile);
        (useVisualRefresh as jest.Mock).mockReturnValue(theme === 'refresh');
      });
      afterEach(() => {
        (useMobile as jest.Mock).mockReset();
        (useVisualRefresh as jest.Mock).mockReset();
      });
      test('mocks applied correctly', () => {
        const { isUsingGridLayout, isUsingMobile } = renderComponent(<AppLayout />);
        expect(isUsingGridLayout).toEqual(theme === 'refresh');
        expect(isUsingMobile).toEqual(isMobile);
      });
      callback(theme);
    });
  }
}

export function describeEachAppLayout(callback: (size: 'desktop' | 'mobile') => void) {
  for (const theme of ['refresh', 'classic']) {
    for (const size of ['desktop', 'mobile'] as const) {
      describe(`Theme=${theme}, Size=${size}`, () => {
        beforeEach(() => {
          (useMobile as jest.Mock).mockReturnValue(size === 'mobile');
          (useVisualRefresh as jest.Mock).mockReturnValue(theme === 'refresh');
        });
        afterEach(() => {
          (useMobile as jest.Mock).mockReset();
          (useVisualRefresh as jest.Mock).mockReset();
        });
        test('mocks applied correctly', () => {
          const { isUsingGridLayout, isUsingMobile } = renderComponent(<AppLayout />);
          expect(isUsingGridLayout).toEqual(theme === 'refresh');
          expect(isUsingMobile).toEqual(size === 'mobile');
        });
        callback(size);
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
    // Classic implementation
    !!trigger.findByClassName(iconStyles.badge)
  );
}

export function getActiveDrawerWidth(wrapper: AppLayoutWrapper): string {
  const drawerElement = wrapper.findActiveDrawer()!.getElement();
  const value = drawerElement.style.getPropertyValue(customCssProps.drawerSize);
  // Visual refresh implementation
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

export const singleDrawer: { drawers: BetaDrawersProps } = {
  drawers: {
    ariaLabel: 'Drawers',
    items: [
      {
        ariaLabels: {
          closeButton: 'Security close button',
          content: 'Security drawer content',
          triggerButton: 'Security trigger button',
          resizeHandle: 'Security resize handle',
        },
        content: <span>Security</span>,
        id: 'security',
        trigger: {
          iconName: 'security',
        },
      },
    ],
  },
};

const getDrawerItem = (id: string, iconName: IconProps.Name, badge: boolean) => {
  return {
    ariaLabels: {
      closeButton: `${id} close button`,
      content: `${id} drawer content`,
      triggerButton: `${id} trigger button`,
      resizeHandle: `${id} resize handle`,
    },
    content: <span>{id}</span>,
    badge,
    id,
    trigger: {
      iconName,
    },
  };
};

const manyDrawersArray = [...Array(100).keys()].map(item => item.toString());

export const manyDrawers: { drawers: BetaDrawersProps } = {
  drawers: {
    ariaLabel: 'Drawers',
    overflowAriaLabel: 'Overflow drawers',
    overflowWithBadgeAriaLabel: 'Overflow drawers (Unread notifications)',
    items: [
      {
        ariaLabels: {
          closeButton: 'Security close button',
          content: 'Security drawer content',
          triggerButton: 'Security trigger button',
          resizeHandle: 'Security resize handle',
        },
        content: <span>Security</span>,
        badge: true,
        id: 'security',
        trigger: {
          iconName: 'security',
        },
      },
      ...manyDrawersArray.map(item => getDrawerItem(item, 'security', false)),
    ],
  },
};

export const manyDrawersWithBadges: { drawers: BetaDrawersProps } = {
  drawers: {
    ariaLabel: 'Drawers',
    overflowAriaLabel: 'Overflow drawers',
    overflowWithBadgeAriaLabel: 'Overflow drawers (Unread notifications)',
    items: [...manyDrawersArray.map(item => getDrawerItem(item, 'security', true))],
  },
};

export const singleDrawerOpen: { drawers: BetaDrawersProps } = {
  drawers: {
    ariaLabel: 'Drawers',
    activeDrawerId: 'security',
    items: [
      {
        ariaLabels: {
          closeButton: 'Security close button',
          content: 'Security drawer content',
          triggerButton: 'Security trigger button',
          resizeHandle: 'Security resize handle',
        },
        content: <span>Security</span>,
        id: 'security',
        trigger: {
          iconName: 'security',
        },
      },
    ],
  },
};

export const resizableDrawer: { drawers: BetaDrawersProps } = {
  drawers: {
    ariaLabel: 'Drawers',
    items: [
      {
        ariaLabels: {
          closeButton: 'Security close button',
          content: 'Security drawer content',
          triggerButton: 'Security trigger button',
          resizeHandle: 'Security resize handle',
        },
        resizable: true,
        content: <span>Security</span>,
        id: 'security',
        trigger: {
          iconName: 'security',
        },
      },
    ],
  },
};

export const drawerWithoutLabels: { drawers: BetaDrawersProps } = {
  drawers: {
    items: [
      {
        content: <span>Security</span>,
        id: 'security',
        trigger: {
          iconName: 'security',
        },
      } as BetaDrawersProps['items'][number],
    ],
  },
};

export const singleDrawerPublic: Array<AppLayoutProps.Drawer> = [
  {
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
  },
];
