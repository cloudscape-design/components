// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT } from '../../../../lib/components/app-layout/visual-refresh/drawers';
import createWrapper from '../../../../lib/components/test-utils/selectors/index';
import { drawerIds as drawerIdObj } from '../../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { drawerItems } from '../../../../lib/dev-pages/pages/app-layout/utils/drawers.js';
import { setupTest } from '../utils';

const wrapper = createWrapper().findAppLayout();
const drawerIds = Object.values(drawerIdObj);

describe('refresh-toolbar', () => {
  //using a theme variable below that will be set when iterating over ['refresh-toolbar', 'refresh']
  const theme = 'refresh-toolbar';
  const mobileDrawerTriggerIds = drawerIds.slice(
    0,
    VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT + 1 //use conditional for 0 when theme is refresh
  );

  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    const drawerIdsToTest = size === 'mobile' ? mobileDrawerTriggerIds : drawerIds; //toolbarDrawerIds;
    const firstDrawerTriggerSelector = wrapper.findDrawerTriggerById(drawerIdsToTest[0]).toSelector();
    const expectedFirstDrawerTriggerTooltipText = drawerItems[0].ariaLabels.drawer;
    const secondDrawerTriggerSelector = wrapper.findDrawerTriggerById(drawerIdsToTest[1]).toSelector();
    const expectedSecondDrawerTriggerTooltipText = drawerItems[0].ariaLabels.drawer;
    const triggerTooltipSelector = wrapper.findDrawerTriggerTooltip().toSelector();

    test(
      'Shows tooltip correctly on drawer trigger for mouse interactions drawer triggers',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await page.hoverElement(wrapper.findNavigationToggle().toSelector());
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly on drawer trigger for mouse interactions during drawer actions',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
      })
    );

    test(
      'Removes tooltip from drawer trigger on escape key press after showing from mouse hover',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
        await page.keys(['Escape']);
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly on drawer trigger for pointer interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.pointerDown(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
        await page.pointerUp();
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'Removes tooltip from drawer trigger on escape key press after showing from pointer down',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
        await page.keys('Escape');
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly on drawer trigger for keyboard (tab) interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.click(firstDrawerTriggerSelector);
        //close drawer via keys
        await page.keys(size === 'desktop' ? ['Tab', 'Enter'] : ['Enter']); //first focus element is resize in desktop
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        //navigate away from drawer triggers
        if (theme === 'refresh-toolbar') {
          await page.keys(['Shift', 'Tab', 'Null']); // to split panel drawer
        }
        await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        //navigate back to drawer trigger
        await page.keys(theme === 'refresh-toolbar' ? ['Tab', 'Tab'] : ['Tab']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
        await page.keys(['Shift', 'Tab', 'Null']);
        if (theme === 'refresh-toolbar') {
          await page.keys(['Shift', 'Tab', 'Null']); // one more time to least breadcrumb - be aware if breadcrumb has tooltip
        }
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'Removes tooltip from drawer trigger on escape key press after showing from keyboard event',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.click(firstDrawerTriggerSelector);
        //close drawer via keys
        await page.keys(size === 'desktop' ? ['Tab', 'Enter'] : ['Enter']); //focus element is resize in desktop

        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        //navigate away from drawer triggers
        if (theme === 'refresh-toolbar') {
          await page.keys(['Shift', 'Tab', 'Null']); // to split panel drawer
        }
        await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        //navigate back to drawer trigger
        await page.keys(theme === 'refresh-toolbar' ? ['Tab', 'Tab'] : ['Tab']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
        await page.keys('Escape');
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly on drawer trigger for keyboard (tab) interactions after drawer actions',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        //close drawer via keys
        await page.keys(size === 'desktop' ? ['Tab', 'Enter'] : ['Enter']); //first focus element is resize in desktop
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.keys(['Tab']);
        await expect(page.isFocused(secondDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedSecondDrawerTriggerTooltipText);
        await page.keys(['Shift', 'Tab', 'Null']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(triggerTooltipSelector)).resolves.toBe(1);
        await expect(page.getText(triggerTooltipSelector)).resolves.toBe(expectedFirstDrawerTriggerTooltipText);
      })
    );
  });
});
