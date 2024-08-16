// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { viewports } from './constants';

import visualRefreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.selectors.js';
// import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const testIf = (condition: boolean) => (condition ? test : test.skip);

const wrapper = createWrapper().findAppLayout();

//Must align with variable in '../../../lib/components/app-layout/visual-refresh/drawers.js';
const VISIBLE_MOBILE_TOOLBAR_TRIGGERS_COUNT = 2;

interface SetupTestOptions {
  splitPanelPosition?: string;
  mobile?: boolean;
  disableContentPaddings?: string;
  visualRefresh?: string;
  visualRefreshToolbar?: boolean;
}
const setupTest = (
  {
    splitPanelPosition = 'bottom',
    mobile = false, //screenSize = viewports.desktop,
    disableContentPaddings = 'false',
    visualRefresh = 'true',
    visualRefreshToolbar = false,
  }: SetupTestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) =>
  useBrowser(mobile ? viewports.mobile : viewports.desktop, async browser => {
    const page = new BasePageObject(browser);
    const params = new URLSearchParams({
      visualRefresh,
      splitPanelPosition,
      disableContentPaddings,
      appLayoutWidget: visualRefreshToolbar ? 'true' : 'false',
    }).toString();
    await browser.url(`#/light/app-layout/with-drawers?${params}`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });

const drawerIds = Object.values(drawerIdObj);
const mobileDrawerTriggerIds = drawerIds.slice(0, VISIBLE_MOBILE_TOOLBAR_TRIGGERS_COUNT);

describe(`AppLayout toolbar tooltips visualRefresh='true'`, () => {
  describe.each([true, false])('visualRefreshToolbar=%s', visualRefreshToolbar => {
    testIf(visualRefreshToolbar)(
      'Shows tooltip correctly for keyboard (tab) interactions on desktop',
      setupTest({ mobile: false, visualRefreshToolbar }, async page => {
        await page.pause(100);
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await expect(
          page.isExisting(`.${visualRefreshToolbarStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${visualRefreshToolbarStyles['drawers-desktop-triggers-container']}`)
        ).resolves.toBeTruthy();

        for (const drawerId of drawerIds) {
          async () => {
            //best way to avoid tab navigation errors is to start with a click to open then close the drawer, asserting button is focuses
            await page.pause(100);
            await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`); //opens
            await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`); //close drawer
            await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
            await expect(
              page.getElementsCount(wrapper.findByClassName(visualRefreshToolbarStyles['trigger-tooltip']).toSelector())
            ).resolves.toBe(1);
            await page.keys('Space');
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
            await page.keys('Tab'); //navigate to close button
            await expect(
              page.isFocused(
                wrapper
                  .findActiveDrawer()
                  .findByClassName(visualRefreshToolbarStyles['drawer-close-button'])
                  .toSelector()
              )
            ).resolves.toBeTruthy();

            //jump back to toolbar and navigate down the triggers
            for (const nestedDrawerId of drawerIds) {
              async () => {
                await page.pause(100);
                await page.keys('Tab'); //navigate to next button
                await expect(
                  page.isFocused(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector())
                ).resolves.toBeTruthy();
                await expect(
                  page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)
                ).resolves.toBeTruthy();
                await expect(
                  page.getElementsCount(
                    wrapper.findByClassName(visualRefreshToolbarStyles['trigger-tooltip']).toSelector()
                  )
                ).resolves.toBe(1);
              };
            }

            //now navigate back up
            for (const reverseNestedDrawerId of [...drawerIds.reverse().slice(1)]) {
              async () => {
                await page.pause(100);
                await page.keys('Shift+Tab'); //navigate to last button
                await expect(
                  page.isFocused(wrapper.findDrawerTriggerById(reverseNestedDrawerId).toSelector())
                ).resolves.toBeTruthy();
                await expect(
                  page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)
                ).resolves.toBeTruthy();
                await expect(
                  page.getElementsCount(
                    wrapper.findByClassName(visualRefreshToolbarStyles['trigger-tooltip']).toSelector()
                  )
                ).resolves.toBe(1);
              };
            }

            await page.pause(100);
            await page.keys('Shift+Tab');
            await expect(
              page.isFocused(
                wrapper
                  .findActiveDrawer()
                  .findByClassName(visualRefreshToolbarStyles['drawer-close-button'])
                  .toSelector()
              )
            ).resolves.toBeTruthy();
            await page.keys('Space'); //close drawer

            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
          };
        }
      })
    );

    const tempSkip = true;
    testIf(visualRefreshToolbar && !tempSkip)(
      'Shows tooltip correctly for key interactions on mobile',
      setupTest({ mobile: true, visualRefreshToolbar }, async page => {
        //open via hamburger menu o set focus in the toolbar
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await expect(
          page.isExisting(`.${visualRefreshToolbarStyles[`drawers-mobile-triggers-container`]}`)
        ).resolves.toBeTruthy();

        const numTabPressesUntilNavToggle = 7;
        await expect(page.keys([...Array(numTabPressesUntilNavToggle).fill('Tab')]));

        //todo  remove first tab which is a reset to navigation trigger.  ensure trigger is focused after nav drawer closed
        await expect(page.isFocused(wrapper.findNavigationToggle().toSelector())).resolves.toBeTruthy();

        await page.keys([
          'Tab', //first breatcrumb
          'Tab', //skip second breadcrumb as not a link, on to first drawer-trigger
        ]);

        await page.pause(100);
        await expect(page.isFocused(wrapper.findDrawerTriggerById('side-panel').toSelector())).resolves.toBeTruthy();

        //todo  test side panel focus trigger control

        await page.keys('Tab');
        await expect(
          page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[0]).toSelector())
        ).resolves.toBeTruthy();

        await page.keys('Space');
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await page.keys('Tab');
        await page.pause(100);
        await expect(
          page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[1]).toSelector())
        ).resolves.toBeTruthy();
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await page.keys(['Shift', 'Tab', 'Shift']);
        await page.pause(100);
        await expect(
          page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[0]).toSelector())
        ).resolves.toBeTruthy();
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBe(1);
        await page.keys('Enter');
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      })
    );
  });
});
