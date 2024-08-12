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

class AppLayoutDrawersPage extends BasePageObject {
  async getElementCenter(selector: string) {
    const targetRect = await this.getBoundingBox(selector);
    const x = Math.round(targetRect.left + targetRect.width / 2);
    const y = Math.round(targetRect.top + targetRect.height / 2);
    return { x, y };
  }

  async pointerDown(selector: string) {
    const center = await this.getElementCenter(selector);
    await (await this.browser.$(selector)).moveTo();
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, origin: 'pointer', ...center },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
        ],
      },
    ]);
  }

  async pointerUp() {
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: 100 },
        ],
      },
    ]);
  }
}

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
  testFn: (page: AppLayoutDrawersPage) => Promise<void>
) =>
  useBrowser(mobile ? viewports.mobile : viewports.desktop, async browser => {
    const page = new AppLayoutDrawersPage(browser);
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
    'Shows tooltip correctly for pointer interactions on mobile',
    setupTest({ mobile: true }, async page => {
      await page.pause(100);
      await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
      await expect(
        page.isExisting(`.${visualRefreshStyles[`drawers-mobile-triggers-container`]}`)
      ).resolves.toBeTruthy();

      for (const drawerId of mobileDrawerTriggerIds) {
        async () => {
          await page.pause(100);
          await expect(page.isExisting(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
          await page.pointerDown(wrapper.findDrawerTriggerById(drawerId).toSelector());
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
          await expect(
            page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
          ).resolves.toBe(1);
          await page.pointerUp();
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
          await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`);
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
          await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
          await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
          await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
          await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        };
      }
    })
  );
});
