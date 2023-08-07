// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { describeEachAppLayout, renderComponent, singleDrawer, defineClientHeight, manyDrawers } from './utils';
import { act, screen } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

defineClientHeight(100);

describeEachAppLayout(() => {
  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);
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

  test('renderds drawers with the tools', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Test" {...singleDrawer} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
  });

  test('should open active drawer on click of overflow item', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...manyDrawers} />);
    expect(wrapper.findActiveDrawer()).toBeFalsy();
    act(() => screen.getByLabelText('Overflow drawer triggers').click());
    act(() => screen.getAllByRole('menuitem')[0].click());
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });
});
