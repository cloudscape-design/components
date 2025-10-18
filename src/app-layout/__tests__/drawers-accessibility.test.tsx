// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { within } from '@testing-library/react';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import { AppLayoutWrapper, ElementWrapper } from '../../../lib/components/test-utils/dom';
import {
  describeEachAppLayout,
  findActiveDrawerLandmark,
  manyDrawers,
  manyDrawersWithBadges,
  renderComponent,
  testDrawer,
  testDrawerWithoutLabels,
} from './utils';

import classicDrawerStyles from '../../../lib/components/app-layout/drawer/styles.css.js';
import testUtilStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';
import visualRefreshRefactoredStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [100, () => {}],
}));

describeEachAppLayout(({ theme, size }) => {
  function findDrawerTriggersRoot(wrapper: AppLayoutWrapper) {
    if (theme === 'refresh-toolbar') {
      return wrapper.findByClassName(toolbarStyles['universal-toolbar-drawers'])!;
    }
    if (size === 'mobile') {
      return wrapper.findByClassName(testUtilStyles['mobile-bar'])!;
    }
    if (theme === 'classic') {
      return wrapper.findByClassName(classicDrawerStyles['drawer-closed'])!;
    }
    return wrapper.findByClassName(visualRefreshRefactoredStyles['drawers-desktop-triggers-container'])!;
  }
  function findDrawersRegion(wrapper: ElementWrapper) {
    if (theme === 'refresh' && size === 'desktop') {
      return wrapper;
    }
    return wrapper.find('[role=region]')!;
  }

  describe('Aria labels', () => {
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

    test('overflow menu item have aria-role set to `menuitem`', () => {
      const { wrapper } = renderComponent(<AppLayout drawers={manyDrawers} />);
      const buttonDropdown = wrapper.findDrawersOverflowTrigger();

      buttonDropdown!.openDropdown();

      const countItems = buttonDropdown!.findItems();
      const countRoleMenuItemRole = buttonDropdown!
        .findOpenDropdown()!
        .find('[role="menu"]')!
        .findAll('[role="menuitem"]');

      expect(countItems.length).toBe(countRoleMenuItemRole.length);
    });

    test('renders aria-labels', () => {
      const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
      expect(wrapper.findDrawerTriggerById(testDrawer.id)!.getElement()).toHaveAttribute(
        'aria-label',
        'Security trigger button'
      );
      wrapper.findDrawerTriggerById(testDrawer.id)!.click();
      expect(findActiveDrawerLandmark(wrapper)!.getElement()).toHaveAttribute('aria-label', 'Security drawer content');
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute(
        'aria-label',
        'Security close button'
      );
    });

    // on mobile resize drawer does not exist
    (size === 'desktop' ? test : test.skip)('renders resize area label', () => {
      const { wrapper } = renderComponent(<AppLayout drawers={[{ ...testDrawer, resizable: true }]} />);

      wrapper.findDrawerTriggerById(testDrawer.id)!.click();
      expect(wrapper.findActiveDrawerResizeHandle()).toBeTruthy();
      expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveAttribute(
        'aria-label',
        'Security resize handle'
      );
    });

    test('renders drawer aria-labels', () => {
      const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
      expect(wrapper.findDrawerTriggerById(testDrawer.id)!.getElement()).toHaveAttribute(
        'aria-label',
        'Security trigger button'
      );
      wrapper.findDrawerTriggerById(testDrawer.id)!.click();
      expect(findActiveDrawerLandmark(wrapper)!.getElement()).toHaveAttribute('aria-label', 'Security drawer content');
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute(
        'aria-label',
        'Security close button'
      );
    });

    test('Renders aria-expanded only on toggle', () => {
      const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
      const drawerTrigger = wrapper.findDrawerTriggerById(testDrawer.id)!;

      expect(drawerTrigger.getElement()).toHaveAttribute('aria-expanded', 'false');
      expect(drawerTrigger.getElement()).toHaveAttribute('aria-haspopup', 'true');

      drawerTrigger.click();
      expect(drawerTrigger.getElement()).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-expanded');
      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-haspopup');
    });

    test('Close button does have a label if it is defined', () => {
      const { wrapper } = renderComponent(
        <AppLayout activeDrawerId={testDrawer.id} drawers={[testDrawer]} onDrawerChange={() => {}} />
      );

      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute(
        'aria-label',
        'Security close button'
      );
    });

    test('Close button does not render a label if is not defined', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          activeDrawerId={testDrawerWithoutLabels.id}
          drawers={[testDrawerWithoutLabels]}
          onDrawerChange={() => {}}
        />
      );

      expect(wrapper.findActiveDrawerCloseButton()!.getElement()).not.toHaveAttribute('aria-label');
    });

    (theme !== 'classic' ? test : test.skip)('aria-controls points to existing drawer id', () => {
      const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} />);
      const drawerTrigger = wrapper.findDrawerTriggerById(testDrawer.id)!;
      expect(drawerTrigger.getElement()).not.toHaveAttribute('aria-controls');

      drawerTrigger.click();
      expect(drawerTrigger.getElement()).toHaveAttribute('aria-controls', 'security');
      expect(wrapper.findActiveDrawer()!.getElement()).toHaveAttribute('id', 'security');
    });

    test('renders roles only when aria labels are not provided', () => {
      const { wrapper } = renderComponent(<AppLayout navigationHide={true} drawers={[testDrawerWithoutLabels]} />);
      expect(wrapper.findDrawerTriggerById(testDrawer.id)!.getElement()).not.toHaveAttribute('aria-label');

      const drawerTogglesRoot = findDrawerTriggersRoot(wrapper);
      const drawersAside = findDrawersRegion(drawerTogglesRoot);
      expect(drawersAside.getElement()).not.toHaveAttribute('aria-label');
      expect(within(drawersAside.getElement()).getByRole('toolbar')).toHaveAttribute(
        'aria-orientation',
        size === 'mobile' || theme === 'refresh-toolbar' ? 'horizontal' : 'vertical'
      );
    });

    test('renders roles and aria labels when provided', () => {
      const { wrapper } = renderComponent(<AppLayout drawers={[testDrawer]} ariaLabels={{ drawers: 'Drawers' }} />);
      expect(wrapper.findDrawerTriggerById(testDrawer.id)!.getElement()).toHaveAttribute(
        'aria-label',
        'Security trigger button'
      );

      const drawerTogglesRoot = findDrawerTriggersRoot(wrapper);
      const drawersAside = findDrawersRegion(drawerTogglesRoot);
      expect(drawersAside.getElement()).toHaveAttribute('aria-label', 'Drawers');
      expect(within(drawersAside.getElement()).getByRole('toolbar')).toHaveAttribute(
        'aria-orientation',
        size === 'mobile' || theme === 'refresh-toolbar' ? 'horizontal' : 'vertical'
      );
    });
  });
});
