// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { describeEachAppLayout, renderComponent, singleDrawer, manyDrawers } from './utils';
import createWrapper from '../../../lib/components/test-utils/dom';

import { render } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

describeEachAppLayout(() => {
  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(<AppLayout contentType="form" toolsHide={true} {...singleDrawer} />);
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
    const { wrapper } = renderComponent(<AppLayout contentType="form" toolsHide={true} {...emptyDrawerItems} />);

    expect(wrapper.findDrawersTriggers()!).toHaveLength(0);
  });

  test('renders drawers with the tools', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
  });

  test('should open active drawer on click of overflow item', () => {
    const { container } = render(<AppLayout contentType="form" {...manyDrawers} />);
    const wrapper = createWrapper(container).findAppLayout()!;
    const buttonDropdown = createWrapper(container).findButtonDropdown();

    expect(wrapper.findActiveDrawer()).toBeFalsy();
    buttonDropdown!.openDropdown();
    buttonDropdown!.findItemById('5')!.click();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });
});
