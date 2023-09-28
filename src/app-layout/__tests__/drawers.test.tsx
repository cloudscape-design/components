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

describeEachAppLayout(size => {
  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(<AppLayout contentType="form" toolsHide={true} {...singleDrawer} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
    rerender(<AppLayout />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
  });

  test('should not apply drawers treatment to the tools if the drawers array is empty', () => {
    const emptyDrawerItems = {
      drawers: {
        ariaLabel: 'Drawers',
        items: [],
      },
    };
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...emptyDrawerItems} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    expect(wrapper.findToolsToggle()).toBeTruthy();
  });

  test('should apply drawers treatment to the tools if at least one other drawer is provided', () => {
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...singleDrawer} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
    expect(wrapper.findToolsToggle()).toBeTruthy();
  });

  test('renders drawers with the tools', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Test" {...singleDrawer} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
  });

  // this behavior is no longer supported for compatibility with runtime API
  test.skip('should respect toolsOpen property when merging into drawers', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Tools content" toolsOpen={true} {...singleDrawer} />);

    expect(wrapper.findDrawerTriggerById(TOOLS_DRAWER_ID)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Tools content');
  });

  test('should fire tools change event when closing tools panel while drawers are present', () => {
    const onToolsChange = jest.fn();
    const { wrapper } = renderComponent(
      <AppLayout tools="Tools content" onToolsChange={event => onToolsChange(event.detail)} {...singleDrawer} />
    );

    wrapper.findToolsToggle().click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: true });

    onToolsChange.mockClear();
    wrapper.findToolsClose().click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: false });
  });

  // drawers render full screen on mobile sizes, switching open drawers does not work there
  if (size === 'desktop') {
    test('should fire tools close event when switching from tools to another drawer', () => {
      const onToolsChange = jest.fn();
      const { wrapper } = renderComponent(
        <AppLayout
          tools="Tools content"
          toolsOpen={true}
          onToolsChange={event => onToolsChange(event.detail)}
          {...singleDrawer}
        />
      );

      wrapper.findDrawerTriggerById('security')!.click();
      expect(onToolsChange).toHaveBeenCalledWith({ open: false });
    });

    test('should fire tools open event when switching from another drawer to tools', () => {
      const onToolsChange = jest.fn();
      const { wrapper } = renderComponent(
        <AppLayout
          tools="Tools content"
          toolsOpen={false}
          onToolsChange={event => onToolsChange(event.detail)}
          {...singleDrawerOpen}
        />
      );
      wrapper.findToolsToggle().click();
      expect(onToolsChange).toHaveBeenCalledWith({ open: true });
    });
  }

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
