// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '../../../lib/components/app-layout';
import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';
import createWrapper from '../../../lib/components/test-utils/dom';
import { getFunnelKeySelector } from '../../internal/analytics/selectors';
import { describeEachAppLayout, renderComponent } from './utils';

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

function createWidgetizedFunctionMock(fn: (args: any[]) => any) {
  return () => {
    return (...args: any[]) => fn(args);
  };
}

jest.mock('../../../lib/components/internal/widgets', () => ({
  createWidgetizedComponent: createWidgetizedComponentMock,
  createWidgetizedFunction: createWidgetizedFunctionMock,
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
      expect(wrapper.findBreadcrumbs()).toBeFalsy();
      expect(createWrapper().find(getFunnelKeySelector('funnel-name'))).toBeTruthy();
      expect(wrapper.findNotifications()).toBeFalsy();
      expect(wrapper.findTools()).toBeFalsy();
      expect(wrapper.findContentRegion()).toBeTruthy();
    });
  });
});
