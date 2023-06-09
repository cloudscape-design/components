// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act } from 'react-dom/test-utils';

import { describeEachThemeAppLayout, isDrawerClosed, drawersConfigurations, renderComponent } from './utils';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import styles from '../../../lib/components/app-layout/styles.css.js';
import notificationStyles from '../../../lib/components/app-layout/notifications/styles.css.js';
import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';

jest.mock('../../../lib/components/internal/hooks/container-queries/use-container-query', () => ({
  useContainerQuery: () => [1300, () => {}],
}));

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
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.singleDrawer} />);

    expect(wrapper.findDrawersMobileTriggersContainer()).toBeFalsy();
    expect(wrapper.findDrawersDesktopTriggersContainer()).toBeTruthy();
  });

  test('should render an active drawer', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.singleDrawerOpen} />);

    expect(wrapper.findDrawersMobileTriggersContainer()).toBeFalsy();
    expect(wrapper.findDrawersDesktopTriggersContainer()).toBeTruthy();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('Does not add a label to the toggle and landmark when they are not defined', () => {
    const drawersClosed = {
      drawers: {
        items: drawersConfigurations.drawersItemsWithoutLabels,
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersClosed} />);
    expect(wrapper.findDrawersTriggers()![0].getElement()).not.toHaveAttribute('aria-label');
    expect(wrapper.findDrawersDesktopTriggersContainer()!.getElement()).not.toHaveAttribute('aria-label');
  });

  test('Adds labels to toggle button and landmark when defined', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.singleDrawer} />);
    expect(wrapper.findDrawersTriggers()![0].getElement()).toHaveAttribute('aria-label', 'Security trigger button');
    expect(wrapper.findDrawersDesktopTriggersContainer()!.getElement()).toHaveAttribute('aria-label', 'Drawers');
  });

  test(`should toggle drawer on click`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.singleDrawer} />);
    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });

  test(`Moves focus to slider when opened`, () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...drawersConfigurations.resizableDrawer} />);

    act(() => wrapper.findDrawersTriggers()![0].click());
    expect(wrapper.findDrawersSlider()!.getElement()).toHaveFocus();
  });
});
