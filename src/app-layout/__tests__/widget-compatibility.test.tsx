// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { AppLayoutInternals } from '../../../lib/components/app-layout/visual-refresh-toolbar/interfaces';
import {
  AppLayoutToolbarImplementation,
  ToolbarProps,
} from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar';
import createWrapper from '../../../lib/components/test-utils/dom';

import testUtilsStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import splitPanelTestUtilStyles from '../../../lib/components/split-panel/test-classes/styles.selectors.js';

const wrapper = createWrapper();

function renderNewAppLayout({
  appLayoutInternals,
  toolbarProps,
}: {
  appLayoutInternals?: Partial<AppLayoutInternals>;
  toolbarProps?: Partial<ToolbarProps>;
}) {
  render(
    <AppLayoutToolbarImplementation
      appLayoutInternals={
        {
          breadcrumbs: 'breadcrumbs',
          discoveredBreadcrumbs: null,
          verticalOffsets: { toolbar: 0, notifications: 0, header: 0 },
          isMobile: false,
          toolbarState: 'show',
          setToolbarState: () => {},
          setToolbarHeight: () => {},
          ...appLayoutInternals,
        } as AppLayoutInternals
      }
      toolbarProps={{
        ariaLabels: {},
        activeDrawerId: null,
        drawers: [],
        drawersFocusRef: { current: null },
        onActiveDrawerChange: () => {},
        hasNavigation: true,
        navigationOpen: false,
        navigationFocusRef: { current: null },
        onNavigationToggle: () => {},
        hasSplitPanel: true,
        splitPanelFocusRef: { current: null },
        splitPanelToggleProps: { displayed: true, ariaLabel: '', controlId: '', position: 'side', active: false },
        onSplitPanelToggle: () => {},
        ...toolbarProps,
      }}
    />
  );
}

test('renders visual refresh toolbar with navigation using toolbarProps', () => {
  const onNavigationToggle = jest.fn();
  renderNewAppLayout({ toolbarProps: { onNavigationToggle } });
  wrapper.findByClassName(testUtilsStyles['navigation-toggle'])!.click();
  expect(onNavigationToggle).toHaveBeenCalled();
});

test('renders visual refresh toolbar with split panel trigger using toolbarProps', () => {
  const onSplitPanelToggle = jest.fn();
  renderNewAppLayout({ toolbarProps: { onSplitPanelToggle } });
  wrapper.findByClassName(splitPanelTestUtilStyles['open-button'])!.click();
  expect(onSplitPanelToggle).toHaveBeenCalled();
});
