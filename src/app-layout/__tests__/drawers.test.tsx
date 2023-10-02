// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { describeEachAppLayout, renderComponent, singleDrawer, manyDrawers, findActiveDrawerLandmark } from './utils';
import createWrapper from '../../../lib/components/test-utils/dom';

import { render } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';
import { InternalDrawerProps } from '../../../lib/components/app-layout/drawer/interfaces';

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
    expect(wrapper.findToolsToggle()).toBeFalsy();
  });

  test('ignores tools when drawers API is used', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Test" {...singleDrawer} />);

    expect(wrapper.findToolsToggle()).toBeFalsy();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
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

  test('renders aria-labels', async () => {
    const { wrapper } = await renderComponent(<AppLayout contentType="form" {...singleDrawer} />);
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    wrapper.findDrawerTriggerById('security')!.click();
    expect(findActiveDrawerLandmark(wrapper)!.getElement()).toHaveAttribute('aria-label', 'Security drawer content');
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute('aria-label', 'Security close button');
  });

  test('renders resize only on resizable drawer', async () => {
    const drawers: Required<InternalDrawerProps> = {
      drawers: {
        items: [
          singleDrawer.drawers.items[0],
          {
            ...singleDrawer.drawers.items[0],
            id: 'security-resizable',
            resizable: true,
          },
        ],
      },
    };
    const { wrapper } = await renderComponent(<AppLayout contentType="form" {...drawers} />);

    wrapper.findDrawerTriggerById('security')!.click();
    expect(wrapper.findActiveDrawerResizeHandle()).toBeFalsy();

    wrapper.findDrawerTriggerById('security-resizable')!.click();
    if (size === 'desktop') {
      expect(wrapper.findActiveDrawerResizeHandle()).toBeTruthy();
      expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveAttribute(
        'aria-label',
        'Security resize handle'
      );
    } else {
      expect(wrapper.findActiveDrawerResizeHandle()).toBeFalsy();
    }
  });
});
