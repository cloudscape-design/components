// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, screen, within } from '@testing-library/react';

import {
  describeEachThemeAppLayout,
  drawerWithoutLabels,
  isDrawerClosed,
  renderComponent,
  resizableDrawer,
  singleDrawer,
  singleDrawerOpen,
  manyDrawers,
  isDrawerTriggerWithBadge,
  getActiveDrawerWidth,
  singleDrawerPublic,
} from './utils';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import styles from '../../../lib/components/app-layout/styles.css.js';
import notificationStyles from '../../../lib/components/app-layout/notifications/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import drawerStyles from '../../../lib/components/app-layout/drawer/styles.css.js';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import { KeyCode } from '../../internal/keycode';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { BetaDrawersProps } from '../../../lib/components/app-layout/drawer/interfaces';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

describeEachThemeAppLayout(false, () => {
  test('renders breadcrumbs and notifications inside of the main landmark', () => {
    const { wrapper } = renderComponent(<AppLayout breadcrumbs="breadcrumbs" notifications="notifications" />);
    const mains = document.querySelectorAll('main');
    expect(mains).toHaveLength(1);
    const main = mains[0];
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

  test('should render an active drawer', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(singleDrawerOpen as any)} />);

    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test(`should toggle drawer on click`, () => {
    const { wrapper } = renderComponent(<AppLayout toolsHide={true} drawers={singleDrawerPublic} />);
    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test(`Moves focus to slider when opened`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(resizableDrawer as any)} />);

    wrapper.findDrawerTriggerById('security')!.click();
    expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveFocus();
  });

  test('should change size via keyboard events on slider handle', () => {
    const onDrawerItemResize = jest.fn();
    const onResize = jest.fn();
    const drawers: { drawers: BetaDrawersProps } = {
      drawers: {
        activeDrawerId: 'security',
        onResize: ({ detail }) => onResize(detail),
        items: [
          {
            ...resizableDrawer.drawers.items[0],
            onResize: event => onDrawerItemResize(event.detail),
          },
        ],
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(drawers as any)} />);
    wrapper.findActiveDrawerResizeHandle()!.keydown(KeyCode.left);

    expect(onResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
    expect(onDrawerItemResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
  });

  test('should change size via mouse pointer on slider handle', () => {
    const onResize = jest.fn();
    const onDrawerItemResize = jest.fn();
    const drawersOpen: { drawers: BetaDrawersProps } = {
      drawers: {
        onResize: ({ detail }) => onResize(detail),
        activeDrawerId: 'security',
        items: [
          {
            ...resizableDrawer.drawers.items[0],
            onResize: event => onDrawerItemResize(event.detail),
          },
        ],
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(drawersOpen as any)} />);
    wrapper.findActiveDrawerResizeHandle()!.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
    const resizeEvent = new MouseEvent('pointermove', { bubbles: true });
    wrapper.findActiveDrawerResizeHandle()!.fireEvent(resizeEvent);
    wrapper.findActiveDrawerResizeHandle()!.fireEvent(new MouseEvent('pointerup', { bubbles: true }));

    expect(onResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
    expect(onDrawerItemResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
  });

  test('should read relative size on resize handle', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(resizableDrawer as any)} />);

    wrapper.findDrawerTriggerById('security')!.click();
    expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveAttribute('aria-valuenow', '0');
  });

  test('should render overflow item when expected', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(manyDrawers as any)} />);

    expect(wrapper.findDrawersTriggers()!.length).toBeLessThan(100);
  });

  test('Renders aria-controls on toggle only when active', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={singleDrawerPublic} />);
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).not.toHaveAttribute('aria-controls');
    wrapper.findDrawerTriggerById('security')!.click();
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute('aria-controls', 'security');
  });

  test('should render badge when defined', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(manyDrawers as any)} />);

    expect(isDrawerTriggerWithBadge(wrapper, manyDrawers.drawers.items[0].id)).toEqual(true);
    expect(isDrawerTriggerWithBadge(wrapper, manyDrawers.drawers.items[1].id)).toEqual(false);
  });

  test('should have width equal to the size declaration', () => {
    const resizableDrawer: { drawers: BetaDrawersProps } = {
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
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(resizableDrawer as any)} />);

    wrapper.findDrawersTriggers()![0].click();
    expect(getActiveDrawerWidth(wrapper)).toEqual('500px');
  });
});

describe('Classic only features', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(false);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
  });

  test(`should toggle single drawer on click of container`, () => {
    const { wrapper } = renderComponent(<AppLayout toolsHide={true} {...(singleDrawer as any)} />);
    act(() => screen.getByLabelText('Drawers').click());
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    act(() => screen.getByLabelText('Drawers').click());
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test(`should not toggle many drawers on click of container`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" toolsHide={true} {...(manyDrawers as any)} />);
    act(() => screen.getByLabelText('Drawers').click());
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test('renders roles only when aria labels are not provided', () => {
    const { wrapper } = renderComponent(
      <AppLayout navigationHide={true} contentType="form" {...(drawerWithoutLabels as any)} />
    );
    const drawersAside = within(wrapper.findByClassName(drawerStyles['drawer-closed'])!.getElement()).getByRole(
      'region'
    );

    expect(wrapper.findDrawerTriggerById('security')!.getElement()).not.toHaveAttribute('aria-label');
    expect(drawersAside).not.toHaveAttribute('aria-label');
    expect(wrapper.findByClassName(drawerStyles['drawer-triggers-wrapper'])!.getElement()).toHaveAttribute(
      'role',
      'toolbar'
    );
  });

  test('renders roles and aria labels when provided', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={singleDrawerPublic} ariaLabels={{ drawers: 'Drawers' }} />);
    const drawersAside = within(wrapper.findByClassName(drawerStyles['drawer-closed'])!.getElement()).getByRole(
      'region'
    );

    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    expect(drawersAside).toHaveAttribute('aria-label', 'Drawers');
    expect(wrapper.findByClassName(drawerStyles['drawer-triggers-wrapper'])!.getElement()).toHaveAttribute(
      'role',
      'toolbar'
    );
  });
});

describe('VR only features', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(true);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReset();
  });

  test('renders roles only when aria labels are not provided', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(drawerWithoutLabels as any)} />);

    expect(wrapper.findDrawerTriggerById('security')!.getElement()).not.toHaveAttribute('aria-label');
    expect(
      wrapper.findByClassName(visualRefreshStyles['drawers-desktop-triggers-container'])!.getElement()
    ).not.toHaveAttribute('aria-label');
    expect(wrapper.findByClassName(visualRefreshStyles['drawers-trigger-content'])!.getElement()).toHaveAttribute(
      'role',
      'toolbar'
    );
  });

  test('renders roles and aria labels when provided', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={singleDrawerPublic} ariaLabels={{ drawers: 'Drawers' }} />);

    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    expect(
      wrapper.findByClassName(visualRefreshStyles['drawers-desktop-triggers-container'])!.getElement()
    ).toHaveAttribute('aria-label', 'Drawers');
    expect(wrapper.findByClassName(visualRefreshStyles['drawers-trigger-content'])!.getElement()).toHaveAttribute(
      'role',
      'toolbar'
    );
  });
});
