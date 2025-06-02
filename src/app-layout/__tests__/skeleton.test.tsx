// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';
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

jest.mock('../../../lib/components/internal/widgets', () => ({
  createWidgetizedComponent: createWidgetizedComponentMock,
}));

describeEachAppLayout({ themes: ['refresh-toolbar'], skipInitialTest: true }, () => {
  it('renders complete component by default', async () => {
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
    expect(wrapper.findNotifications()).toBeTruthy();
    await waitFor(() => {
      expect(wrapper.findTools()).toBeTruthy();
    });
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
      expect(wrapper.findNotifications()).toBeFalsy();
      expect(wrapper.findTools()).toBeFalsy();
      expect(wrapper.findContentRegion()).toBeTruthy();
    });
  });
});
