// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { mergeProps, SharedProps } from '../../../lib/components/app-layout/visual-refresh-toolbar/multi-layout';

describe('mergeMultiAppLayoutProps', () => {
  const mockParentNavigationToggle = jest.fn();
  const mockParentActiveDrawerChange = jest.fn();
  const mockParentActiveGlobalDrawerChange = jest.fn();
  const mockParentSplitPanelToggle = jest.fn();
  const ownProps: SharedProps = {
    forceDeduplicationType: 'primary',
    ariaLabels: {
      navigation: 'Navigation',
      drawers: 'Drawers',
    },
    navigation: <div>Navigation</div>,
    navigationOpen: true,
    navigationFocusRef: React.createRef(),
    onNavigationToggle: mockParentNavigationToggle,
    breadcrumbs: <div>Breadcrumbs</div>,
    activeDrawerId: 'drawer1',
    drawers: [
      {
        id: 'drawer1',
        ariaLabels: { drawerName: 'Drawer 1' },
        content: <div>Drawer 1 Content</div>,
      },
    ],
    onActiveDrawerChange: mockParentActiveDrawerChange,
    drawersFocusRef: React.createRef(),
    splitPanel: <div>Split Panel</div>,
    splitPanelToggleProps: {
      displayed: false,
      active: false,
      position: 'bottom',
      controlId: 'test',
      ariaLabel: 'test',
    },
    splitPanelFocusRef: React.createRef(),
    onSplitPanelToggle: mockParentSplitPanelToggle,
  };

  const additionalPropsBase: Partial<SharedProps>[] = [
    {
      ariaLabels: {
        navigation: 'New Navigation',
      },
      drawers: [
        {
          id: 'drawer2',
          ariaLabels: { drawerName: 'Drawer 2' },
          content: <div>Drawer 2 Content</div>,
        },
      ],
      activeDrawerId: 'drawer2',
      activeGlobalDrawersIds: ['drawer-global'],
      globalDrawers: [
        {
          id: 'drawer-global',
          ariaLabels: { drawerName: 'Global Drawer' },
          content: <div>Global Drawer Content</div>,
        },
      ],
      onActiveGlobalDrawersChange: mockParentActiveGlobalDrawerChange,
    },
    {
      splitPanelToggleProps: {
        displayed: false,
        active: false,
        position: 'bottom',
        controlId: 'test',
        ariaLabel: 'test',
      },
    },
  ];

  it('should merge ownProps and additionalProps correctly', () => {
    const result = mergeProps(ownProps, additionalPropsBase);

    expect(result).toEqual({
      //asserting new aria labels overwrite existing yet preserve others
      ariaLabels: {
        navigation: 'New Navigation',
        drawers: 'Drawers',
      },
      hasNavigation: true,
      navigationOpen: true,
      navigationFocusRef: ownProps.navigationFocusRef,
      onNavigationToggle: mockParentNavigationToggle,
      hasBreadcrumbsPortal: true,
      hasSplitPanel: true,
      splitPanelToggleProps: {
        displayed: false,
        active: false,
        position: 'bottom',
        controlId: 'test',
        ariaLabel: 'test',
      },
      splitPanelFocusRef: ownProps.splitPanelFocusRef,
      onSplitPanelToggle: mockParentSplitPanelToggle,
      //asserting the ownProps drawer is not overwritten
      activeDrawerId: ownProps.activeDrawerId,
      drawers: ownProps.drawers,
      drawersFocusRef: ownProps.drawersFocusRef,
      onActiveDrawerChange: mockParentActiveDrawerChange,
      activeGlobalDrawersIds: ['drawer-global'],
      globalDrawers: [
        {
          id: 'drawer-global',
          ariaLabels: { drawerName: 'Global Drawer' },
          content: <div>Global Drawer Content</div>,
        },
      ],
      onActiveGlobalDrawersChange: mockParentActiveGlobalDrawerChange,
    });
  });

  it('should return null if no fields are defined, except ariaLabels', () => {
    const result = mergeProps({ ariaLabels: {} } as SharedProps, []);

    expect(result).toBeNull();
  });
});
