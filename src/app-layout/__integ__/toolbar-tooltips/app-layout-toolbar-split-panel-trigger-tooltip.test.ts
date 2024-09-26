// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../../lib/components/test-utils/selectors/index';
import { drawerIds as drawerIdObj } from '../../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT } from '../constants';
import { AppLayoutDrawersPage, setupTest } from '../utils';

import toolbarStyles from '../../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.selectors.js';
import tooltipStyles from '../../../../lib/components/internal/components/tooltip/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();
const drawerIds = Object.values(drawerIdObj);

describe('refresh-toolbar', () => {
  const theme = 'refresh-toolbar';
  const mobileDrawerTriggerIds = drawerIds.slice(
    0,
    VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT + (theme === 'refresh-toolbar' ? 1 : 0)
  );
  const appliedThemeStyles = toolbarStyles; //use visualRefreshStyles when theme === 'refresh'

  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    const drawersTriggerContainerClassKey = `drawers-${size === 'desktop' ? 'desktop' : 'mobile'}-triggers-container`;
    const drawerIdsToTest = size === 'mobile' ? mobileDrawerTriggerIds : drawerIds; //toolbarDrawerIds;
    const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
    const splitPanelTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;

    describe.each(['bottom', 'side'] as const)('splitPanelPosition=%s', splitPanelPosition => {
      test(
        'Shows tooltip correctly on split panel trigger for mouse interactions',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
          await expect(
            page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)
          ).resolves.toBeTruthy();
          await page.hoverElement(splitPanelTriggerSelector);
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
          await page.hoverElement(wrapper.findNavigationToggle().toSelector());
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        })
      );

      test(
        'Shows tooltip correctly on split panel trigger for mouse interactions during split-panel actions',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
          await expect(
            page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)
          ).resolves.toBeTruthy();
          await page.click(splitPanelTriggerSelector);
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
          await page.click(splitPanelTriggerSelector); //this could change witf focus fixes
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
          await page.hoverElement(firstDrawerTriggerSelector);
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
          await page.hoverElement(splitPanelTriggerSelector);
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        })
      );

      test(
        'Removes tooltip from split panel trigger on escape key press after showing from mouse hover',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
          await expect(
            page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)
          ).resolves.toBeTruthy();
          await page.hoverElement(splitPanelTriggerSelector);
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
          await page.keys(['Escape']);
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        })
      );

      test(
        'Shows tooltip correctly for split panel trigger for keyboard (tab) interactions',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
          await expect(
            page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)
          ).resolves.toBeTruthy();
          await page.click(splitPanelTriggerSelector);

          await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBeTruthy();
          //todo - assert the tooltip is not visible. Curently it closes on click then reopened as the UI shifts and causign an unexpected new hover event
          await page.keys(['Tab', 'Tab']);
          await page.isFocused(wrapper.findSplitPanel().findCloseButton().toSelector());
          await page.keys('Enter');
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
          //navigate away from slide panel
          await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
          //navigate back to drawer trigger
          await page.keys(['Tab']);
          await expect(page.isFocused(splitPanelTriggerSelector)).resolves.toBeTruthy();
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
          await page.keys(['Shift', 'Tab', 'Null']);
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        })
      );

      test(
        'Removes tooltip from split panel trigger on escape key press after showing from keyboard event',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
          await expect(
            page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)
          ).resolves.toBeTruthy();
          await page.click(splitPanelTriggerSelector);
          await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBeTruthy();
          //todo - assert the tooltip is not visible. Curently it closes on click then reopened as the UI shifts and causign an unexpected new hover event
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
          await page.click(splitPanelTriggerSelector);
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
          //navigate away from slide panel
          await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
          //navigate back to drawer trigger
          await page.keys(['Tab']);
          await expect(page.isFocused(splitPanelTriggerSelector)).resolves.toBeTruthy();
          await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
          await page.keys('Escape');
          await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        })
      );
    });
  });
});
