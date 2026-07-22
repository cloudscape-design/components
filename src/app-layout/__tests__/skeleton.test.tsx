// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { BeforeMainSlotSkeleton } from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/skeleton-parts';
import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';
import { getFunnelKeySelector } from '../../../lib/components/internal/analytics/selectors';
import { describeEachAppLayout, renderComponent } from './utils';

import testutilStyles from '../../../lib/components/app-layout/test-classes/styles.selectors.js';
import navStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/navigation/styles.selectors.js';
import skeletonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.selectors.js';
import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.selectors.js';

let widgetMockEnabled = false;
function createWidgetizedComponentMock(Implementation: React.ComponentType, Skeleton: React.ComponentType) {
  return () => {
    return function Widgetized(props: any) {
      if (!widgetMockEnabled) {
        return <Implementation {...props} />;
      }
      if (Skeleton) {
        return <Skeleton {...props} />;
      }
      return null;
    };
  };
}

jest.mock('../../../lib/components/internal/widgets', () => ({
  createWidgetizedComponent: createWidgetizedComponentMock,
}));

describeEachAppLayout({ themes: ['refresh-toolbar'] }, () => {
  it('renders complete component by default', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        navigation="test nav"
        notifications="test notifications"
        breadcrumbs={<BreadcrumbGroup items={[{ text: 'Home', href: '' }]} />}
        tools="test tools"
      />
    );
    expect(wrapper.findToolbar()).toBeTruthy();
    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findBreadcrumbs()).toBeTruthy();
    expect(wrapper.find(getFunnelKeySelector('funnel-name'))).toBeTruthy();
    expect(wrapper.findNotifications()).toBeTruthy();
    expect(wrapper.findTools()).toBeTruthy();
    expect(wrapper.findContentRegion()).toBeTruthy();
  });

  describe('in loading state', () => {
    beforeEach(() => {
      widgetMockEnabled = true;
    });
    afterEach(() => {
      widgetMockEnabled = false;
    });

    it('renders skeleton parts only', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          navigation="test nav"
          notifications="test notifications"
          breadcrumbs={<BreadcrumbGroup items={[{ text: 'Home', href: '' }]} />}
          tools="test tools"
        />
      );
      expect(wrapper.findToolbar()).toBeTruthy(); // Needed for SSR
      expect(wrapper.findNavigation()).toBeFalsy();
      expect(wrapper.findBreadcrumbs()).toBeTruthy(); // Needed for SSR
      expect(wrapper.find(getFunnelKeySelector('funnel-name'))).toBeTruthy();
      expect(wrapper.findNotifications()).toBeFalsy();
      expect(wrapper.findTools()).toBeFalsy();
      expect(wrapper.findContentRegion()).toBeTruthy();
      expect(wrapper.getElement()).toHaveStyle({ blockSize: `calc(100vh - 0px)` });
    });

    it('the navigationOpen state can be controlled', () => {
      const noop = () => {};
      const { wrapper, rerender } = renderComponent(
        <AppLayout navigation="test nav" navigationOpen={true} onNavigationChange={noop} />
      );
      // cannot use wrapper.findNavigation() because our public test utils resolve to nothing in skeleton state
      expect(wrapper.findByClassName(skeletonStyles.navigation)).toBeTruthy();
      expect(wrapper.findByClassName(skeletonStyles['panel-hidden'])).toBeFalsy();
      rerender(<AppLayout navigation="test nav" navigationOpen={false} onNavigationChange={noop} />);
      expect(wrapper.findByClassName(skeletonStyles.navigation)).toBeTruthy();
      expect(wrapper.findByClassName(skeletonStyles['panel-hidden'])).toBeTruthy();
      rerender(<AppLayout navigation="test nav" navigationOpen={true} onNavigationChange={noop} />);
      expect(wrapper.findByClassName(skeletonStyles.navigation)).toBeTruthy();
      expect(wrapper.findByClassName(skeletonStyles['panel-hidden'])).toBeFalsy();
    });

    it('toolbar can render conditionally', () => {
      const { wrapper, rerender } = renderComponent(<AppLayout navigationHide={true} toolsHide={true} />);
      // cannot use wrapper.findToolbar() because our public test utils resolve to nothing in skeleton state
      expect(wrapper.findByClassName(skeletonStyles['toolbar-container'])).toBeFalsy();
      rerender(<AppLayout navigationHide={false} toolsHide={false} breadcrumbs="dummy" />);
      expect(wrapper.findByClassName(skeletonStyles['toolbar-container'])).toBeTruthy();
      rerender(<AppLayout navigationHide={true} toolsHide={true} />);
      expect(wrapper.findByClassName(skeletonStyles['toolbar-container'])).toBeFalsy();
    });

    it('renders navigation trigger in skeleton', () => {
      const { wrapper } = renderComponent(<AppLayout navigation="test nav" />);
      expect(wrapper.findNavigationToggle()).toBeTruthy();
    });

    it('skeleton toolbar has correct classes for SSR compatibility', () => {
      const { wrapper } = renderComponent(<AppLayout breadcrumbs="test breadcrumbs" />);
      const toolbarContainer = wrapper.findByClassName(skeletonStyles['toolbar-container']);
      expect(toolbarContainer).toBeTruthy();
      expect(toolbarContainer!.getElement()).toHaveClass(toolbarStyles['universal-toolbar']);
      expect(toolbarContainer!.getElement()).toHaveClass(testutilStyles.toolbar);
    });
  });
});

// The navigation branches of the skeleton depend on `toolbarProps.navigationCollapsible`, which the
// full app layout does not provide while the widget is still loading (the skeleton is shown before
// the state that computes it exists). These render the skeleton part directly to cover those branches.
describe('BeforeMainSlotSkeleton navigation', () => {
  const appLayoutProps = { navigation: <div>nav content</div> } as any;

  function renderSkeleton(toolbarProps: any) {
    const { container } = render(
      <BeforeMainSlotSkeleton toolbarProps={toolbarProps} appLayoutProps={appLayoutProps} appLayoutState={{} as any} />
    );
    return container;
  }

  it('shows the collapsed rail when closed with collapse behavior', () => {
    const container = renderSkeleton({ hasNavigation: true, navigationOpen: false, navigationCollapsible: true });
    expect(container.querySelector(`.${skeletonStyles['navigation-collapsed']}`)).toBeTruthy();
    expect(container.querySelector(`.${skeletonStyles['panel-hidden']}`)).toBeFalsy();
    expect(container.querySelector(`.${navStyles['is-navigation-collapsed']}`)).toBeTruthy();
  });

  it('hides the panel when closed without collapse behavior', () => {
    const container = renderSkeleton({ hasNavigation: true, navigationOpen: false, navigationCollapsible: false });
    expect(container.querySelector(`.${skeletonStyles['panel-hidden']}`)).toBeTruthy();
    expect(container.querySelector(`.${skeletonStyles['navigation-collapsed']}`)).toBeFalsy();
    expect(container.querySelector(`.${navStyles['is-navigation-collapsed']}`)).toBeFalsy();
  });

  it('does not apply collapsed rail classes when the navigation is open', () => {
    const container = renderSkeleton({ hasNavigation: true, navigationOpen: true, navigationCollapsible: true });
    expect(container.querySelector(`.${skeletonStyles['navigation-collapsed']}`)).toBeFalsy();
    expect(container.querySelector(`.${navStyles['is-navigation-collapsed']}`)).toBeFalsy();
    expect(container.querySelector(`.${navStyles['is-navigation-open']}`)).toBeTruthy();
  });
});
