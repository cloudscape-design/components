// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '../../../lib/components/app-layout';
import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';
import { getFunnelKeySelector } from '../../../lib/components/internal/analytics/selectors';
import { describeEachAppLayout, renderComponent } from './utils';

import skeletonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.selectors.js';

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
      expect(wrapper.findToolbar()).toBeFalsy();
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
      rerender(<AppLayout navigation="test nav" navigationOpen={false} onNavigationChange={noop} />);
      expect(wrapper.findByClassName(skeletonStyles.navigation)).toBeFalsy();
      rerender(<AppLayout navigation="test nav" navigationOpen={true} onNavigationChange={noop} />);
      expect(wrapper.findByClassName(skeletonStyles.navigation)).toBeTruthy();
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
  });
});
