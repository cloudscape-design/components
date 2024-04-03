// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import {
  describeEachAppLayout,
  renderComponent,
  testDrawer,
  manyDrawers,
  manyDrawersWithBadges,
  findActiveDrawerLandmark,
} from './utils';

import { act } from '@testing-library/react';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn().mockReturnValue(true),
}));

const testIf = (condition: boolean) => (condition ? test : test.skip);

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

describeEachAppLayout(size => {
  test(`should not render drawer when it is not defined`, () => {
    const { wrapper, rerender } = renderComponent(<AppLayout toolsHide={true} drawers={[testDrawer]} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
    rerender(<AppLayout />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
  });

  test('should not apply drawers treatment to the tools if the drawers array is empty', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[]} />);

    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    expect(wrapper.findToolsToggle()).toBeFalsy();
  });

  test('ignores tools when drawers API is used', () => {
    const { wrapper } = renderComponent(<AppLayout tools="Test" drawers={[testDrawer]} />);

    expect(wrapper.findToolsToggle()).toBeFalsy();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('should open active drawer on click of overflow item', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);
    const buttonDropdown = wrapper.findDrawersOverflowTrigger();

    expect(wrapper.findActiveDrawer()).toBeFalsy();
    buttonDropdown!.openDropdown();
    buttonDropdown!.findItemById('5')!.click();
    expect(wrapper.findActiveDrawer()).toBeTruthy();
  });

  test('renders correct aria-label on overflow menu', () => {
    const ariaLabels: AppLayoutProps.Labels = {
      drawersOverflow: 'Overflow drawers',
      drawersOverflowWithBadge: 'Overflow drawers (Unread notifications)',
    };
    const { wrapper, rerender } = renderComponent(<AppLayout drawers={manyDrawers} ariaLabels={ariaLabels} />);
    const buttonDropdown = wrapper.findDrawersOverflowTrigger();

    expect(buttonDropdown!.findNativeButton().getElement()).toHaveAttribute('aria-label', 'Overflow drawers');

    rerender(<AppLayout drawers={manyDrawersWithBadges} ariaLabels={ariaLabels} />);
    expect(buttonDropdown!.findNativeButton().getElement()).toHaveAttribute(
      'aria-label',
      'Overflow drawers (Unread notifications)'
    );
  });

  test('renders aria-labels', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    expect(wrapper.findDrawerTriggerById('security')!.getElement()).toHaveAttribute(
      'aria-label',
      'Security trigger button'
    );
    wrapper.findDrawerTriggerById('security')!.click();
    expect(findActiveDrawerLandmark(wrapper)!.getElement()).toHaveAttribute('aria-label', 'Security drawer content');
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute('aria-label', 'Security close button');
  });

  test('renders resize only on resizable drawer', () => {
    const { wrapper } = renderComponent(
      <AppLayout
        drawers={[
          testDrawer,
          {
            ...testDrawer,
            id: 'security-resizable',
            resizable: true,
          },
        ]}
      />
    );

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
    const { wrapper } = renderComponent(
      <AppLayout
        ref={newRef => (ref = newRef)}
        activeDrawerId={testDrawer.id}
        drawers={[testDrawer]}
        onDrawerChange={() => {}}
      />
    );
    expect(wrapper.findActiveDrawer()).toBeTruthy();
    act(() => ref!.focusActiveDrawer());
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveFocus();
  });

  test('moves focus on focusToolsClose if tools are rendered as part of drawers', () => {
    let ref: AppLayoutProps.Ref | null = null;
    const { wrapper, rerender } = renderComponent(
      <AppLayout
        ref={newRef => (ref = newRef)}
        activeDrawerId={null}
        drawers={[testDrawer]}
        onDrawerChange={() => {}}
        tools={<div>Tools</div>}
      />
    );
    expect(wrapper.findActiveDrawer()).toBeFalsy();
    rerender(
      <AppLayout
        ref={newRef => (ref = newRef)}
        activeDrawerId={testDrawer.id}
        drawers={[testDrawer]}
        onDrawerChange={() => {}}
        tools={<div>Tools</div>}
      />
    );
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveFocus();
    act(() => ref!.focusToolsClose());
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveFocus();
  });

  test('registers public drawers api', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  testIf(size !== 'mobile')('aria-controls points to an existing drawer id', () => {
    const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
    const drawerTrigger = wrapper.findDrawerTriggerById('security')!;
    expect(drawerTrigger!.getElement()).not.toHaveAttribute('aria-controls');

    drawerTrigger.click();
    expect(drawerTrigger!.getElement()).toHaveAttribute('aria-controls', 'security');
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveAttribute('id', 'security');
  });
});
