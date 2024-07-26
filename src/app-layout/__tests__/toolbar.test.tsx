// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable simple-import-sort/imports */
import React from 'react';

import { describeEachAppLayout, manyDrawers, renderComponent } from './utils';

import AppLayout from '../../../lib/components/app-layout';
import SplitPanel from '../../../lib/components/split-panel';
import { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';

import appLayoutToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.css.js';

function findToolbar(wrapper: AppLayoutWrapper) {
  return wrapper.findByClassName(appLayoutToolbarStyles['universal-toolbar'])?.getElement();
}

// no-op function to suppress controllability warnings
function noop() {}

describe('toolbar mode only features', () => {
  describeEachAppLayout({ themes: ['refresh-toolbar'] }, ({ size }) => {
    test('does not render the toolbar when all panels are hidden', () => {
      const { wrapper } = renderComponent(<AppLayout navigationHide={true} toolsHide={true} />);
      expect(findToolbar(wrapper)).toBeFalsy();
    });

    test('renders toggle buttons when drawers are closed', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationOpen={false} toolsOpen={false} onNavigationChange={noop} onToolsChange={noop} />
      );
      expect(findToolbar(wrapper)).toBeTruthy();
      expect(findToolbar(wrapper)).toContainElement(wrapper.findNavigationToggle().getElement());
      expect(findToolbar(wrapper)).toContainElement(wrapper.findToolsToggle().getElement());
    });

    test('does not render navigation toggle button for open state', () => {
      const { wrapper } = renderComponent(<AppLayout navigationOpen={true} onNavigationChange={noop} />);
      expect(findToolbar(wrapper)).toBeTruthy();
      expect(wrapper.findNavigationToggle()).toBeFalsy();
    });

    test('renders toolbar with split panel trigger', () => {
      const { wrapper } = renderComponent(
        <AppLayout splitPanel={<SplitPanel header="Testing">Dummy for testing</SplitPanel>} />
      );
      expect(findToolbar(wrapper)).toBeTruthy();
      expect(findToolbar(wrapper)).toContainElement(wrapper.findSplitPanelOpenButton()!.getElement());
    });

    test('renders toolbar with split panel trigger in active state', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          splitPanelOpen={true}
          splitPanel={<SplitPanel header="Testing">Dummy for testing</SplitPanel>}
          onSplitPanelToggle={noop}
        />
      );
      expect(findToolbar(wrapper)).toBeTruthy();
      expect(findToolbar(wrapper)).toContainElement(wrapper.findSplitPanelOpenButton()!.getElement());
      expect(wrapper.findSplitPanelOpenButton()!.getElement()).toHaveAttribute('aria-expanded', 'true');
    });

    // skip on desktop because requires element queries to work
    (size === 'mobile' ? describe : describe.skip)('multiple drawers', () => {
      test('renders multiple toggle buttons', () => {
        const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);
        expect(findToolbar(wrapper)).toBeTruthy();
        expect(findToolbar(wrapper)).toContainElement(wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement());
        expect(wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement()).toHaveAttribute(
          'aria-expanded',
          'false'
        );
      });

      test('renders multiple toggle buttons with an active drawer', () => {
        const { wrapper } = renderComponent(
          <AppLayout activeDrawerId={manyDrawers[0].id} drawers={manyDrawers} onDrawerChange={noop} />
        );
        expect(findToolbar(wrapper)).toBeTruthy();
        expect(findToolbar(wrapper)).toContainElement(wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement());
        expect(wrapper.findDrawerTriggerById(manyDrawers[0].id)!.getElement()).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });
});
