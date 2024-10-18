// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  mergeMultiAppLayoutProps,
  SharedMultiAppLayoutProps,
} from '../../../lib/components/app-layout/visual-refresh-toolbar/multi-layout';

describe('mergeMultiAppLayoutProps', () => {
  const mockParentNavigationToggle = jest.fn();
  const mockParentActiveDrawerChange = jest.fn();
  const mockParentSplitPanelToggle = jest.fn();
  const ownProps: SharedMultiAppLayoutProps = {
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

  const additionalPropsBase: Partial<SharedMultiAppLayoutProps>[] = [
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
    const result = mergeMultiAppLayoutProps(ownProps, additionalPropsBase);

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
    });
  });

  it('should return null if no fields are defined, except ariaLabels', () => {
    const result = mergeMultiAppLayoutProps({ ariaLabels: {} } as SharedMultiAppLayoutProps, []);

    expect(result).toBeNull();
  });
});
