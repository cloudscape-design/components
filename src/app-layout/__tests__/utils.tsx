// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import { SplitPanelProps } from '../../../lib/components/split-panel';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { findUpUntil } from '../../../lib/components/internal/utils/dom';
import styles from '../../../lib/components/app-layout/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import testutilStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import { InternalDrawerProps, DrawerItem } from '../../../lib/components/app-layout/drawer/interfaces';
import { IconProps } from '../../../lib/components/icon/interfaces';

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

  const contentElement = isUsingGridLayout
    ? wrapper.getElement()
    : wrapper.findByClassName(styles['layout-wrapper'])!.getElement();

  return { wrapper, rerender, isUsingGridLayout, contentElement, container };
}

export function describeDesktopAppLayout(callback: () => void) {
  describe('Desktop', () => {
    beforeEach(() => {
      (useMobile as jest.Mock).mockReturnValue(false);
    });
    callback();
  });
}

export function describeMobileAppLayout(callback: () => void) {
  describe('Mobile', () => {
    beforeEach(() => {
      (useMobile as jest.Mock).mockReturnValue(true);
    });
    callback();
  });
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
      callback(theme);
    });
  }
}

export function describeEachAppLayout(callback: (size) => void) {
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

export const singleDrawer: Required<InternalDrawerProps> = {
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

const getDrawerItem = (id: string, iconName: IconProps.Name) => {
  return {
    ariaLabels: {
      closeButton: `${id} close button`,
      content: `${id} drawer content`,
      triggerButton: `${id} trigger button`,
      resizeHandle: `${id} resize handle`,
    },
    content: <span>{id}</span>,
    id,
    trigger: {
      iconName,
    },
  };
};

const manyDrawersArray = [...Array(100).keys()].map(item => item.toString());

export const manyDrawers: Required<InternalDrawerProps> = {
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
        badge: true,
        id: 'security',
        trigger: {
          iconName: 'security',
        },
      },
      ...manyDrawersArray.map(item => getDrawerItem(item, 'security')),
    ],
  },
};

export const singleDrawerOpen: Required<InternalDrawerProps> = {
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

export const resizableDrawer: Required<InternalDrawerProps> = {
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

export const drawerWithoutLabels: Required<InternalDrawerProps> = {
  drawers: {
    items: [
      {
        content: <span>Security</span>,
        id: 'security',
        trigger: {
          iconName: 'security',
        },
      } as DrawerItem,
    ],
  },
};
