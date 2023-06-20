// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { describeEachAppLayout, drawersConfigurations, renderComponent } from './utils';
import AppLayout from '../../../lib/components/app-layout';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

describeEachAppLayout(() => {
  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(
      <AppLayout contentType="form" {...drawersConfigurations.singleDrawer} />
    );
    expect(wrapper.findDrawersTriggers()!).toHaveLength(1);
    rerender(<AppLayout />);
    expect(wrapper.findDrawersTriggers()!).toHaveLength(0);
  });

  test('should not render drawers if drawer items are empty', () => {
    const emptyDrawerItems = {
      drawers: {
        ariaLabel: 'Drawers',
        items: [],
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...emptyDrawerItems} />);

    expect(wrapper.findDrawersTriggers()!).toHaveLength(0);
  });
});
