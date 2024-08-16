// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { viewports } from './constants';

import visualRefreshToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();
const testIf = (condition: boolean) => (condition ? test : test.skip);

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

describe(`AppLayout toolbar tooltips visualRefresh='true' mouse interactions`, () => {
  describe.each([true, false])('visualRefreshToolbar=%s', visualRefreshToolbar => {
    testIf(visualRefreshToolbar)(
      'Shows tooltip correctly for mouse interactions on desktop',
      setupTest({ mobile: false, visualRefreshToolbar }, async page => {
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await expect(
          page.isExisting(`.${visualRefreshToolbarStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${visualRefreshToolbarStyles['drawers-trigger-overflow']}`)
        ).resolves.toBeFalsy();
        await page.hoverElement(wrapper.findDrawerTriggerById(drawerIds[0]).toSelector());
        await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeTruthy();

        for (const drawerId of drawerIds) {
          async () => {
            await page.pause(100);
            await page.hoverElement(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
            await expect(
              page.getElementsCount(wrapper.findByClassName(visualRefreshToolbarStyles['trigger-tooltip']).toSelector())
            ).resolves.toBe(1);
            await page.hoverElement(`.${visualRefreshToolbarStyles[`drawers-desktop-triggers-container`]}`);
            await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
            await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`);
            await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
            await page.hoverElement(`.${visualRefreshToolbarStyles[`drawers-desktop-triggers-container`]}`);
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();

            for (const nestedDrawerId of drawerIds) {
              async () => {
                await page.pause(100);
                await page.hoverElement(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector());
                await expect(
                  page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)
                ).resolves.toBeTruthy();
                await expect(
                  page.getElementsCount(
                    wrapper.findByClassName(visualRefreshToolbarStyles['trigger-tooltip']).toSelector()
                  )
                ).resolves.toBe(1);
                await page.hoverElement(`.${visualRefreshToolbarStyles[`drawers-desktop-triggers-container`]}`);
                await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
              };
            }

            await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.isExisting(`.${visualRefreshToolbarStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
          };
        }

        //TODO add split panel trigger interactions
      })
    );
  });
});
