// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { describeEachAppLayout, renderComponent, singleDrawer, manyDrawers, singleDrawerOpen } from './utils';
import createWrapper from '../../../lib/components/test-utils/dom';

import { render } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';
import { TOOLS_DRAWER_ID } from '../../../lib/components/app-layout/utils/use-drawers';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

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

  test('renders drawers with the tools', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Test" {...singleDrawer} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
  });

  test('should respect toolsOpen property when merging into drawers', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Tools content" toolsOpen={true} {...singleDrawer} />);

    expect(wrapper.findDrawerTriggerById(TOOLS_DRAWER_ID)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Tools content');
  });

  test('activeDrawerId has priority over toolsOpen', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Tools content" toolsOpen={true} {...singleDrawerOpen} />);

    expect(wrapper.findDrawerTriggerById(TOOLS_DRAWER_ID)!.getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Security');
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
