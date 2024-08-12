// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { viewports } from './constants';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';
// import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();

//Must align with variable in '../../../lib/components/app-layout/visual-refresh/drawers.js';
const VISIBLE_MOBILE_TOOLBAR_TRIGGERS_COUNT = 2;

interface SetupTestOptions {
  splitPanelPosition?: string;
  mobile?: boolean;
  disableContentPaddings?: string;
  visualRefresh?: string;
}
const setupTest = (
  {
    splitPanelPosition = 'bottom',
    mobile = false, //screenSize = viewports.desktop,
    disableContentPaddings = 'false',
    visualRefresh = 'true',
  }: SetupTestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) =>
  useBrowser(mobile ? viewports.mobile : viewports.desktop, async browser => {
    const page = new BasePageObject(browser);
    const params = new URLSearchParams({
      visualRefresh,
      splitPanelPosition,
      disableContentPaddings,
    }).toString();
    await browser.url(`#/light/app-layout/with-drawers?${params}`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });

const drawerIds = Object.values(drawerIdObj);
const mobileDrawerTriggerIds = drawerIds.slice(0, VISIBLE_MOBILE_TOOLBAR_TRIGGERS_COUNT);

describe(`AppLayout toolbar tooltips visualRefresh='true'`, () => {
  test(
    'Shows tooltip correctly for keyboard (tab) interactions on desktop',
    setupTest({ mobile: false }, async page => {
      await page.pause(100);
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      await expect(
        page.isExisting(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`)
      ).resolves.toBeTruthy();
      await expect(
        page.isExisting(`.${visualRefreshStyles['drawers-desktop-triggers-container']}`)
      ).resolves.toBeTruthy();

      drawerIds.map(async (drawerId: string) => {
        //best way to avoid tab navigation errors is to start with a click to open then close the drawer, asserting button is focuses
        await page.pause(100);
        await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`); //opens
        await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`); //close drawer
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
        await expect(
          page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
        ).resolves.toBe(1);
        await page.keys('Space');
        await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
        await page.keys('Tab'); //navigate to close button
        await expect(
          page.isFocused(
            wrapper.findActiveDrawer().findByClassName(visualRefreshStyles['drawer-close-button']).toSelector()
          )
        ).resolves.toBeTruthy();

        //jump back to toolbar and navigate down the triggers
        drawerIds.map(async (nestedDrawerId: string) => {
          await page.pause(100);
          await page.keys('Tab'); //navigate to next button
          await expect(
            page.isFocused(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector())
          ).resolves.toBeTruthy();
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
          await expect(
            page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
          ).resolves.toBe(1);
        });

        //now navigate back up
        [...drawerIds.reverse().slice(1)].map(async (reverseNestedDrawerId: string) => {
          await page.pause(100);
          await page.keys('Shift+Tab'); //navigate to last button
          await expect(
            page.isFocused(wrapper.findDrawerTriggerById(reverseNestedDrawerId).toSelector())
          ).resolves.toBeTruthy();
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
          await expect(
            page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
          ).resolves.toBe(1);
        });

        await page.pause(100);
        await page.keys('Shift+Tab');
        await expect(
          page.isFocused(
            wrapper.findActiveDrawer().findByClassName(visualRefreshStyles['drawer-close-button']).toSelector()
          )
        ).resolves.toBeTruthy();
        await page.keys('Space'); //close drawer

        await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
        await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      });
    })
  );

  test(
    'Shows tooltip correctly for key interactions on mobile',
    setupTest({ mobile: true }, async page => {
      //open via hamburger menu o set focus in the toolbar
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      await expect(
        page.isExisting(`.${visualRefreshStyles[`drawers-mobile-triggers-container`]}`)
      ).resolves.toBeTruthy();

      await page.click(wrapper.findNavigationToggle().toSelector()); //opens navigation drawer
      await page.click(wrapper.findNavigationClose().toSelector()); //close drawer
      await expect(page.isFocused(wrapper.findNavigationToggle().toSelector())).resolves.toBeTruthy();
      await page.keys([
        'Tab', //first and only breadcrumb
        'Tab', //first button
      ]);
      await page.pause(100);
      await expect(
        page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[0]).toSelector())
      ).resolves.toBeTruthy();
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
      await expect(page.getElementsCount(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBe(1);
      await page.keys('Escape');
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      await page.keys('Tab');
      await page.pause(100);
      await expect(
        page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[1]).toSelector())
      ).resolves.toBeTruthy();
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
      await expect(page.getElementsCount(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBe(1);
      await page.keys('Escape');
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      await page.keys(['Shift', 'Tab', 'Shift']);
      await page.pause(100);
      await expect(
        page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[0]).toSelector())
      ).resolves.toBeTruthy();
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
      await expect(page.getElementsCount(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBe(1);
      await page.keys('Enter');
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
    })
  );
});
