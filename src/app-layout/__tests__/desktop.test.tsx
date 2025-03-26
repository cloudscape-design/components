// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import { KeyCode } from '../../internal/keycode';
import {
  describeEachAppLayout,
  getActiveDrawerWidth,
  manyDrawers,
  renderComponent,
  testDrawer,
  testDrawerWithoutLabels,
} from './utils';

import drawerStyles from '../../../lib/components/app-layout/drawer/styles.css.js';
import notificationStyles from '../../../lib/components/app-layout/notifications/styles.css.js';
import styles from '../../../lib/components/app-layout/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import visualRefreshToolbarNotificationStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/notifications/styles.css.js';
import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

describeEachAppLayout({ sizes: ['desktop'] }, ({ theme }) => {
  test('renders breadcrumbs and notifications inside of the main landmark', () => {
    const { wrapper } = renderComponent(<AppLayout breadcrumbs="breadcrumbs" notifications="notifications" />);
    const mains = document.querySelectorAll('main');
    expect(mains).toHaveLength(1);
    const main = mains[0];
    expect(main).toContainElement(wrapper.findNotifications()!.getElement());
    if (theme === 'refresh-toolbar') {
      expect(main).not.toContainElement(wrapper.findBreadcrumbs()!.getElement());
    } else {
      expect(main).toContainElement(wrapper.findBreadcrumbs()!.getElement());
    }
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
      const { wrapper } = renderComponent(<AppLayout />);

      if (theme === 'classic') {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '280px', maxWidth: '' });
      } else {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);

        // The default value is specified in the CSS class
        expect(minWidthInGrid).toBe(theme === 'refresh' ? '280px' : '');
        expect(maxWidthInGrid).toBe('');
      }
    });

    test('sets min and max content width according to the content type', () => {
      const { wrapper } = renderComponent(<AppLayout contentType="wizard" />);

      if (theme === 'classic') {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '280px', maxWidth: '1080px' });
      } else {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);
        expect(minWidthInGrid).toBe(theme === 'refresh' ? '280px' : '');
        expect(maxWidthInGrid).toBe('');
      }
    });

    test('uses the provided content width if one is provided', () => {
      const { wrapper } = renderComponent(<AppLayout minContentWidth={120} maxContentWidth={650} />);

      if (theme === 'classic') {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '120px', maxWidth: '650px' });
      } else {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);
        expect(minWidthInGrid).toBe(theme === 'refresh' ? '120px' : '');
        expect(maxWidthInGrid).toBe('650px');
      }
    });

    // Regression test for AWSUI-8868
    test('uses 0 content width if 0 is provided', () => {
      const { wrapper } = renderComponent(<AppLayout minContentWidth={0} maxContentWidth={0} />);

      if (theme === 'classic') {
        expect(wrapper.findContentRegion().getElement()).toHaveStyle({ minWidth: '0', maxWidth: '0' });
      } else {
        const minWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.minContentWidth);
        const maxWidthInGrid = wrapper.getElement().style.getPropertyValue(customCssProps.maxContentWidth);
        expect(minWidthInGrid).toBe('');
        expect(maxWidthInGrid).toBe('');
      }
    });
  });

  test('does not close navigation via ref', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} />);
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
    act(() => ref!.closeNavigationIfNecessary());
    expect(wrapper.findOpenNavigationPanel()).toBeTruthy();
  });

  test('Allows notifications to be sticky', () => {
    const { wrapper } = renderComponent(<AppLayout notifications="Test" stickyNotifications={true} />);
    const stickyNotificationsClassName = {
      classic: notificationStyles['notifications-sticky'],
      refresh: visualRefreshStyles['sticky-notifications'],
      'refresh-toolbar': visualRefreshToolbarNotificationStyles['sticky-notifications'],
    }[theme];
    expect(wrapper.findByClassName(stickyNotificationsClassName)).not.toBeNull();
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
    const { wrapper } = renderComponent(
      <AppLayout activeDrawerId={testDrawer.id} drawers={[testDrawer]} onDrawerChange={() => {}} />
    );

    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test(`should toggle drawer on click`, () => {
    const { wrapper } = renderComponent(<AppLayout toolsHide={true} drawers={[testDrawer]} />);
    wrapper.findDrawersTriggers()![0].click();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    wrapper.findDrawersTriggers()![0].click();
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test(`Moves focus to slider when opened`, () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[{ ...testDrawer, resizable: true }]} />);

    wrapper.findDrawerTriggerById('security')!.click();
    expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveFocus();
  });

  test('should change size via keyboard events on slider handle', () => {
    const onDrawerItemResize = jest.fn();
    const testDrawerResizable: AppLayoutProps.Drawer = {
      ...testDrawer,
      resizable: true,
      onResize: event => onDrawerItemResize(event.detail),
    };

    const { wrapper } = renderComponent(
      <AppLayout activeDrawerId={testDrawerResizable.id} drawers={[testDrawerResizable]} />
    );
    wrapper.findActiveDrawerResizeHandle()!.keydown(KeyCode.left);

    expect(onDrawerItemResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
  });

  test('should change size via mouse pointer on slider handle', () => {
    const onDrawerItemResize = jest.fn();
    const testDrawerResizable: AppLayoutProps.Drawer = {
      ...testDrawer,
      resizable: true,
      onResize: event => onDrawerItemResize(event.detail),
    };
    const { wrapper } = renderComponent(
      <AppLayout activeDrawerId={testDrawerResizable.id} drawers={[testDrawerResizable]} />
    );
    wrapper.findActiveDrawerResizeHandle()!.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
    const resizeEvent = new MouseEvent('pointermove', { bubbles: true });
    wrapper.findActiveDrawerResizeHandle()!.fireEvent(resizeEvent);
    wrapper.findActiveDrawerResizeHandle()!.fireEvent(new MouseEvent('pointerup', { bubbles: true }));

    expect(onDrawerItemResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'security' });
  });

  test('should read relative size on resize handle', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[{ ...testDrawer, resizable: true }]} />);

    wrapper.findDrawerTriggerById(testDrawer.id)!.click();
    expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveAttribute('aria-valuenow', '0');
  });

  test('should render overflow item when expected', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);

    expect(wrapper.findDrawersTriggers()!.length).toBeLessThan(100);
  });

  test('Renders aria-controls on toggle only when active', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).not.toHaveAttribute('aria-controls');
    wrapper.findDrawerTriggerById('security')!.click();
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute('aria-controls', 'security');
  });

  test('should render badge when defined', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);

    expect(wrapper.findDrawerTriggerById(manyDrawers[0].id, { hasBadge: true })).toBeTruthy();
    expect(wrapper.findDrawerTriggerById(manyDrawers[1].id, { hasBadge: false })).toBeTruthy();
  });

  test('should return null when searching for a non-existing drawer with hasBadge condition', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);

    expect(wrapper.findDrawerTriggerById('non-existing', { hasBadge: true })).toBeNull();
    expect(wrapper.findDrawerTriggerById('non-existing', { hasBadge: false })).toBeNull();
  });

  test('should have width equal to the size declaration', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[{ ...testDrawer, resizable: true, defaultSize: 500 }]} />);

    wrapper.findDrawersTriggers()![0].click();
    expect(getActiveDrawerWidth(wrapper)).toEqual('500px');
  });
});

describeEachAppLayout({ themes: ['classic'], sizes: ['desktop'] }, () => {
  test(`should toggle single drawer on click of container`, () => {
    const { wrapper } = renderComponent(
      <AppLayout toolsHide={true} drawers={[testDrawer]} ariaLabels={{ drawers: 'Drawers' }} />
    );
    fireEvent.click(screen.getByLabelText('Drawers', { selector: '[role=region]' }));
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Drawers', { selector: '[role=region]' }));
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test(`should not toggle many drawers on click of container`, () => {
    const { wrapper } = renderComponent(
      <AppLayout toolsHide={true} drawers={manyDrawers} ariaLabels={{ drawers: 'Drawers' }} />
    );
    fireEvent.click(screen.getByLabelText('Drawers', { selector: '[role=region]' }));
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test('renders roles only when aria labels are not provided (classic)', () => {
    const { wrapper } = renderComponent(<AppLayout navigationHide={true} drawers={[testDrawerWithoutLabels]} />);
    const drawersAside = within(wrapper.findByClassName(drawerStyles['drawer-closed'])!.getElement()).getByRole(
      'region'
    );

    expect(wrapper.findDrawerTriggerById(testDrawer.id)!.getElement()).not.toHaveAttribute('aria-label');
    expect(drawersAside).not.toHaveAttribute('aria-label');
    expect(wrapper.findByClassName(drawerStyles['drawer-triggers-wrapper'])!.getElement()).toHaveAttribute(
      'role',
      'toolbar'
    );
  });

  test('renders roles and aria labels when provided (classic)', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} ariaLabels={{ drawers: 'Drawers' }} />);
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

describeEachAppLayout({ themes: ['refresh', 'refresh-toolbar'], sizes: ['desktop'] }, ({ theme }) => {
  const styles = theme === 'refresh' ? visualRefreshStyles : toolbarStyles;
  test('renders roles only when aria labels are not provided', () => {
    const { wrapper } = renderComponent(<AppLayout navigationHide={true} drawers={[testDrawerWithoutLabels]} />);

    expect(wrapper.findDrawerTriggerById(testDrawer.id)!.getElement()).not.toHaveAttribute('aria-label');
    expect(wrapper.findByClassName(styles['drawers-desktop-triggers-container'])!.getElement()).not.toHaveAttribute(
      'aria-label'
    );
    expect(wrapper.findByClassName(styles['drawers-trigger-content'])!.getElement()).toHaveAttribute('role', 'toolbar');
  });

  test('renders roles and aria labels when provided', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} ariaLabels={{ drawers: 'Drawers' }} />);

    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    expect(wrapper.findByClassName(styles['drawers-desktop-triggers-container'])!.getElement()).toHaveAttribute(
      'aria-label',
      'Drawers'
    );
    expect(wrapper.findByClassName(styles['drawers-trigger-content'])!.getElement()).toHaveAttribute('role', 'toolbar');
  });
});
