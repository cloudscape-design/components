// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import AppLayout from '../../../lib/components/app-layout';
import { highContrastHeaderClassName } from '../../../lib/components/internal/utils/content-header-utils';
import { describeEachAppLayout, renderComponent } from './utils';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.css.js';
import toolbarSkeletonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';

const hasHighContrastContext = (element: HTMLElement) =>
  findUpUntil(element, el => el.classList.contains(highContrastHeaderClassName));

describeEachAppLayout({ themes: ['refresh', 'refresh-toolbar'], sizes: ['desktop'] }, ({ theme }) => {
  describe('headerVariant', () => {
    test('default', () => {
      const { wrapper } = renderComponent(<AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" />);
      expect(hasHighContrastContext(wrapper.findNotifications()!.getElement())).toBeFalsy();
      expect(hasHighContrastContext(wrapper.findBreadcrumbs()!.getElement())).toBeFalsy();
      if (theme === 'refresh') {
        expect(
          hasHighContrastContext(wrapper.findByClassName(visualRefreshStyles.background)!.getElement())
        ).toBeFalsy();
      } else {
        expect(
          hasHighContrastContext(wrapper.findByClassName(toolbarSkeletonStyles['toolbar-container'])!.getElement())
        ).toBeFalsy();
      }
    });

    test('high-contrast', () => {
      const { wrapper } = renderComponent(
        <AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" headerVariant="high-contrast" />
      );
      expect(hasHighContrastContext(wrapper.findNotifications()!.getElement())).toBeTruthy();
      if (theme === 'refresh') {
        // For refresh toolbar, high-contrast header is not implemented in contentHeader slot, or in conjunction with ContentLayout
        expect(hasHighContrastContext(wrapper.findBreadcrumbs()!.getElement())).toBeTruthy();
        expect(
          hasHighContrastContext(wrapper.findByClassName(visualRefreshStyles.background)!.getElement())
        ).toBeTruthy();
      } else {
        // the toolbar should not have the high-contrast context
        expect(hasHighContrastContext(wrapper.findBreadcrumbs()!.getElement())).toBeFalsy();
        expect(
          hasHighContrastContext(wrapper.findByClassName(toolbarSkeletonStyles['toolbar-container'])!.getElement())
        ).toBeFalsy();
      }
    });
  });
});

describeEachAppLayout({ themes: ['refresh', 'refresh-toolbar'], sizes: ['mobile'] }, ({ theme }) => {
  describe('headerVariant', () => {
    test('default', () => {
      const { wrapper } = renderComponent(
        <AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" content="aaa" />
      );
      if (theme === 'refresh') {
        expect(wrapper.findByClassName(visualRefreshStyles['mobile-toolbar'])!.getElement()).not.toHaveClass(
          highContrastHeaderClassName
        );
      }
    });

    test('high-contrast', () => {
      const { wrapper } = renderComponent(
        <AppLayout notifications="Notifications" breadcrumbs="Breadcrumbs" headerVariant="high-contrast" />
      );
      if (theme === 'refresh') {
        expect(wrapper.findByClassName(visualRefreshStyles['mobile-toolbar'])!.getElement()).toHaveClass(
          highContrastHeaderClassName
        );
      } else {
        expect(
          hasHighContrastContext(wrapper.findByClassName(toolbarSkeletonStyles['toolbar-container'])!.getElement())
        ).toBeFalsy();
      }
    });
  });
});
