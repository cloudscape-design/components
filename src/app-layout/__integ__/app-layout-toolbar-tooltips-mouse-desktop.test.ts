// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { viewports } from './constants';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();

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

describe(`AppLayout toolbar tooltips visualRefresh='true' mouse interactions`, () => {
  test(
    'Shows tooltip correctly for mouse interactions on desktop',
    setupTest({ mobile: false }, async page => {
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      await expect(
        page.isExisting(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`)
      ).resolves.toBeTruthy();
      await expect(page.isExisting(`.${visualRefreshStyles['drawers-trigger-overflow']}`)).resolves.toBeFalsy();
      await page.hoverElement(wrapper.findDrawerTriggerById(drawerIds[0]).toSelector());
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();

      drawerIds.map(async (drawerId: string) => {
        await page.pause(100);
        await page.hoverElement(wrapper.findDrawerTriggerById(drawerId).toSelector());
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
        await expect(
          page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
        ).resolves.toBe(1);
        await page.hoverElement(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`);
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`);
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
        await page.hoverElement(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`);
        await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();

        drawerIds.map(async (nestedDrawerId: any) => {
          await page.pause(100);
          await page.hoverElement(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector());
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
          await expect(
            page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
          ).resolves.toBe(1);
          await page.hoverElement(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`);
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        });

        await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
        await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
        await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      });
    })
  );
});
