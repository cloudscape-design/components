// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../../lib/components/test-utils/selectors';
import { AppLayoutDrawersPage, setupTest } from '../utils';

const wrapper = createWrapper().findAppLayout();

describe('refresh-toolbar', () => {
  const theme = 'refresh-toolbar';

  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    //matches drawerItems[0].id from '../../../../lib/dev-pages/pages/app-layout/utils/drawers';
    const firstDrawerId = 'security';
    const firstDrawerTriggerSelector = wrapper.findDrawerTriggerById(firstDrawerId).toSelector();
    const splitPanelTriggerSelector = wrapper.findSplitPanelOpenButton().toSelector();
    const tooltipSelector = wrapper.findDrawerTriggerTooltip().toSelector();
    const expectedTooltipText = 'Open panel';

    describe.each(['bottom', 'side'] as const)('splitPanelPosition=%s', splitPanelPosition => {
      test(
        'Shows tooltip correctly on split panel trigger for mouse interactions',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
          await page.hoverElement(splitPanelTriggerSelector);
          await expect(page.getText(tooltipSelector)).resolves.toBe(expectedTooltipText);
          await expect(page.getElementsCount(tooltipSelector)).resolves.toBe(1);
          await page.hoverElement(wrapper.findNavigationToggle().toSelector());
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
        })
      );

      test(
        'Shows tooltip correctly on split panel trigger for mouse interactions during split-panel actions',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
          await page.click(splitPanelTriggerSelector);
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
          await page.click(splitPanelTriggerSelector); //this could change witf focus fixes
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
          await page.hoverElement(firstDrawerTriggerSelector);
          await expect(page.getElementsCount(tooltipSelector)).resolves.toBe(1);
          await page.hoverElement(splitPanelTriggerSelector);
          await expect(page.getElementsCount(tooltipSelector)).resolves.toBe(1);
        })
      );

      test(
        'Removes tooltip from split panel trigger on escape key press after showing from mouse hover',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
          await page.hoverElement(splitPanelTriggerSelector);
          await expect(page.getText(tooltipSelector)).resolves.toBe(expectedTooltipText);
          await expect(page.getElementsCount(tooltipSelector)).resolves.toBe(1);
          await page.keys(['Escape']);
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
        })
      );

      test(
        'Shows tooltip correctly for split panel trigger for keyboard (tab) interactions',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
          await page.click(wrapper.findToolbar().toSelector());
          await page.keys(['Tab', 'Tab']);
          await expect(page.isFocused(splitPanelTriggerSelector)).resolves.toBe(true);
          await expect(page.getText(tooltipSelector)).resolves.toBe(expectedTooltipText);
          await expect(page.getElementsCount(tooltipSelector)).resolves.toBe(1);
          await page.keys(['Shift', 'Tab']);
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
        })
      );

      test(
        'Removes tooltip from split panel trigger on escape key press after showing from keyboard event',
        setupTest({ theme, size, splitPanelPosition }, async (page: AppLayoutDrawersPage) => {
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
          await page.click(wrapper.findToolbar().toSelector());
          await page.keys(['Tab', 'Tab']);
          await expect(page.isFocused(splitPanelTriggerSelector)).resolves.toBe(true);
          await expect(page.getText(tooltipSelector)).resolves.toBe(expectedTooltipText);
          await expect(page.getElementsCount(tooltipSelector)).resolves.toBe(1);
          await page.keys('Escape');
          await expect(page.isExisting(tooltipSelector)).resolves.toBe(false);
        })
      );
    });
  });
});
