// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import {
  describeEachAppLayout,
  renderComponent,
  singleDrawer,
  manyDrawers,
  manyDrawersWithBadges,
  findActiveDrawerLandmark,
  singleDrawerOpen,
  singleDrawerPublic,
} from './utils';
import createWrapper from '../../../lib/components/test-utils/dom';

import { BetaDrawersProps } from '../../../lib/components/app-layout/drawer/interfaces';
import { render, act } from '@testing-library/react';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

describeEachAppLayout(size => {
  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(<AppLayout toolsHide={true} drawers={singleDrawerPublic} />);
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
    const { wrapper } = renderComponent(<AppLayout contentType="form" {...(emptyDrawerItems as any)} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    expect(wrapper.findToolsToggle()).toBeFalsy();
  });

  test('ignores tools when drawers API is used', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Test" drawers={singleDrawerPublic} />);

    expect(wrapper.findToolsToggle()).toBeFalsy();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('should open active drawer on click of overflow item', () => {
    const { container } = render(<AppLayout contentType="form" {...(manyDrawers as any)} />);
    const wrapper = createWrapper(container).findAppLayout()!;
    const buttonDropdown = createWrapper(container).findButtonDropdown();

    expect(wrapper.findActiveDrawer()).toBeFalsy();
    buttonDropdown!.openDropdown();
    buttonDropdown!.findItemById('5')!.click();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('renders correct aria-label on overflow menu', () => {
    const { container, rerender } = render(<AppLayout contentType="form" {...(manyDrawers as any)} />);
    const buttonDropdown = createWrapper(container).findButtonDropdown();

    expect(buttonDropdown!.findNativeButton().getElement()).toHaveAttribute('aria-label', 'Overflow drawers');

    rerender(<AppLayout contentType="form" {...(manyDrawersWithBadges as any)} />);
    expect(buttonDropdown!.findNativeButton().getElement()).toHaveAttribute(
      'aria-label',
      'Overflow drawers (Unread notifications)'
    );
  });

  test('renders aria-labels', async () => {
    const { wrapper } = await renderComponent(<AppLayout drawers={singleDrawerPublic} />);
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    wrapper.findDrawerTriggerById('security')!.click();
    expect(findActiveDrawerLandmark(wrapper)!.getElement()).toHaveAttribute('aria-label', 'Security drawer content');
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute('aria-label', 'Security close button');
  });

  test('renders resize only on resizable drawer', async () => {
    const drawers: { drawers: BetaDrawersProps } = {
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
    const { wrapper } = await renderComponent(<AppLayout contentType="form" {...(drawers as any)} />);

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

  test('focuses drawer close button', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper } = renderComponent(<AppLayout ref={newRef => (ref = newRef)} {...(singleDrawerOpen as any)} />);
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    act(() => ref!.focusActiveDrawer());
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveFocus();
  });

  test('registers public drawers api', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={singleDrawerPublic} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });
});
