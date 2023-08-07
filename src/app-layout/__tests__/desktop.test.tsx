// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act } from '@testing-library/react';

import {
  describeEachThemeAppLayout,
  drawerWithoutLabels,
  isDrawerClosed,
  renderComponent,
  resizableDrawer,
  singleDrawer,
  singleDrawerOpen,
  manyDrawers,
} from './utils';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import styles from '../../../lib/components/app-layout/styles.css.js';
import notificationStyles from '../../../lib/components/app-layout/notifications/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import { KeyCode } from '../../internal/keycode';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { InternalDrawerProps } from '../../../lib/components/app-layout/drawer/interfaces';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight') || {};

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 100 });
});

afterAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight);
});

describeEachThemeAppLayout(false, () => {
  test('renders breadcrumbs and notifications inside of the main landmark', () => {
    const { wrapper, contentElement } = renderComponent(
      <AppLayout breadcrumbs="breadcrumbs" notifications="notifications" />
    );
    const main = contentElement; //wrapper.getElement().parentElement!.querySelector('main');
    expect(main).toContainElement(wrapper.findNotifications()!.getElement());
    expect(main).toContainElement(wrapper.findBreadcrumbs()!.getElement());
  });

  test('does not close drawer when clicking on content', () => {
    const onNavigationToggle = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout
        navigationOpen={true}
        onNavigationChange={onNavigationToggle}
        navigation={
          <>
            <h1>Navigation</h1>
            <a href="#">Link</a>
          </>
        }
      />
    );
    wrapper.findNavigation()!.find('a')!.click();

    expect(onNavigationToggle).not.toHaveBeenCalled();
  });

  describe('Min and max content width', () => {
    test("has default min content width if one isn't explicitly provided", () => {
      const { wrapper, isUsingGridLayout } = renderComponent(<AppLayout />);

      if (isUsingGridLayout) {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);

        // The default value is specified in the CSS class
        expect(minWidthInGrid).toBe('280px');
        expect(maxWidthInGrid).toBe('');
      } else {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '280px', maxWidth: '' });
      }
    });

    test('sets min and max content width according to the content type', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(<AppLayout contentType="wizard" />);

      if (isUsingGridLayout) {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);

        expect(minWidthInGrid).toBe('280px');
        expect(maxWidthInGrid).toBe('');
      } else {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '280px', maxWidth: '1080px' });
      }
    });

    test('uses the provided content width if one is provided', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(<AppLayout minContentWidth={120} maxContentWidth={650} />);

      if (isUsingGridLayout) {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);
        expect(minWidthInGrid).toBe('120px');
        expect(maxWidthInGrid).toBe('650px');
      } else {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '120px', maxWidth: '650px' });
      }
    });

    // Regression test for AWSUI-8868
    test('uses 0 content width if 0 is provided', () => {
      const { wrapper, isUsingGridLayout } = renderComponent(<AppLayout minContentWidth={0} maxContentWidth={0} />);

      if (isUsingGridLayout) {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);
        expect(minWidthInGrid).toBe('');
        expect(maxWidthInGrid).toBe('');
      } else {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '0', maxWidth: '0' });
      }
    });
  });

  test('does not close navigation via ref', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} />);
    expect(isDrawerClosed(wrapper.findNavigation())).toBe(false);
    act(() => ref!.closeNavigationIfNecessary());
    expect(isDrawerClosed(wrapper.findNavigation())).toBe(false);
  });

  test('Allows notifications to be sticky', () => {
    const { wrapper } = renderComponent(<AppLayout notifications="Test" stickyNotifications={true} />);
    const hasStickyClass = Boolean(wrapper.find(`.${notificationStyles['notifications-sticky']}`));
    const hasVisualRefreshStickyClass = wrapper
      .findNotifications()!
      .getElement()
      .classList.contains(visualRefreshStyles['sticky-notifications']);
    expect(hasStickyClass || hasVisualRefreshStickyClass).toBe(true);
  });

  describe('unfocusable content', () => {
    test('everything is focusable when drawsers are closed', () => {
      const { wrapper } = renderComponent(<AppLayout />);
      expect(wrapper.findByClassName(styles.unfocusable)).toBeFalsy();
    });

    test('everything is focusable when navigation is open', () => {
      const { wrapper } = renderComponent(<AppLayout navigationOpen={true} onNavigationChange={jest.fn()} />);
      expect(wrapper.findByClassName(styles.unfocusable)).toBeFalsy();
    });

    test('everything is focusable when tools is open', () => {
      const { wrapper } = renderComponent(<AppLayout toolsOpen={true} onToolsChange={jest.fn()} />);
      expect(wrapper.findByClassName(styles.unfocusable)).toBeFalsy();
    });
  });

  test('should render drawers desktop triggers container', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);

    expect(wrapper.findDrawersMobileTriggersContainer()).toBeFalsy();
    expect(wrapper.findDrawersDesktopTriggersContainer()).toBeTruthy();
  });

  test('should render an active drawer', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawerOpen} />);

    expect(wrapper.findDrawersMobileTriggersContainer()).toBeFalsy();
    expect(wrapper.findDrawersDesktopTriggersContainer()).toBeTruthy();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('Does not add a label to the toggle and landmark when they are not defined', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawerWithoutLabels} />);
    expect(wrapper.findDrawersTriggers()![0].getElement()).not.toHaveAttribute('aria-label');
    expect(wrapper.findDrawersDesktopTriggersContainer()!.getElement()).not.toHaveAttribute('aria-label');
  });

  test('Adds labels to toggle button and landmark when defined', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    expect(wrapper.findDrawersDesktopTriggersContainer()!.getElement()).toHaveAttribute('aria-label', 'Drawers');
  });

  test(`should toggle drawer on click`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);
    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test(`Moves focus to slider when opened`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...resizableDrawer} />);

    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findDrawersSlider()!.getElement()).toHaveFocus();
  });

  test('should change size via keyboard events on slider handle', () => {
    const onResize = jest.fn();
    const drawers: Required<InternalDrawerProps> = {
      drawers: {
        onResize: ({ detail }) => onResize(detail),
        activeDrawerId: 'security',
        items: resizableDrawer.drawers.items,
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawers} />);
    wrapper.findDrawersSlider()!.keydown(KeyCode.left);

    expect(onResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
  });

  test('should change size via mouse pointer on slider handle', () => {
    const onResize = jest.fn();
    const drawersOpen: Required<InternalDrawerProps> = {
      drawers: {
        onResize: ({ detail }) => onResize(detail),
        activeDrawerId: 'security',
        items: resizableDrawer.drawers.items,
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersOpen} />);
    wrapper.findDrawersSlider()!.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
    const resizeEvent = new MouseEvent('pointermove', { bubbles: true });
    wrapper.findDrawersSlider()!.fireEvent(resizeEvent);
    wrapper.findDrawersSlider()!.fireEvent(new MouseEvent('pointerup', { bubbles: true }));

    expect(onResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
  });

  test('should read relative size on resize handle', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...resizableDrawer} />);

    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findDrawersSlider()!.getElement()).toHaveAttribute('aria-valuenow', '0');
  });

  test('should render overflow item when expected', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...manyDrawers} />);

    expect(wrapper.findDrawersTriggers()!).toHaveLength(1);
  });
});

// In VR we use a custom CSS property so we cannot test the style declaration.
describe('Classic only features', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(false);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
  });

  test('should have width equal to the size declaration', () => {
    const resizableDrawer = {
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
            resizable: true,
            defaultSize: 500,
            content: <span>Security</span>,
            id: 'security',
            trigger: {
              iconName: 'security',
            },
          },
        ],
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...resizableDrawer} />);

    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()!.getElement().style.width).toBe('500px');
  });

  test('should render badge when defined', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...manyDrawers} />);
    expect(wrapper.findDrawersTriggers()[0]!.getElement().children[0]).toHaveClass(iconStyles.badge);
  });
});

describe('VR only features', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(true);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
  });

  test('should add motion class', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...resizableDrawer} />);
    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveClass(styles['with-motion']);
  });

  test('should render badge when defined', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...manyDrawers} />);

    expect(wrapper.findDrawersTriggers()[0]!.getElement()).toHaveClass(visualRefreshStyles.badge);
  });
});
