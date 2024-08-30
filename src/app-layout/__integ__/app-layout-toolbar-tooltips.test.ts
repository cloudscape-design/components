// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { viewports } from './constants';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();
class AppLayoutDrawersPage extends BasePageObject {
  async openFirstDrawer() {
    await this.click(wrapper.findDrawersTriggers().get(1).toSelector());
  }

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
  size?: 'desktop' | 'mobile';
  disableContentPaddings?: string;
  visualRefresh?: string;
}

const drawerIds = Object.values(drawerIdObj);
const VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT = 2; //must match the number in  '../../../lib/components/app-layout/visual-refresh/drawers';
const mobileDrawerTriggerIds = drawerIds.slice(0, VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT);

const setupTest = (
  {
    splitPanelPosition = 'bottom',
    size = 'desktop',
    disableContentPaddings = 'false',
    visualRefresh = 'false',
  }: SetupTestOptions,
  testFn: (page: AppLayoutDrawersPage) => Promise<void>
) =>
  useBrowser(size === 'desktop' ? viewports.desktop : viewports.mobile, async browser => {
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

describe(`theme='visual-refresh'`, () => {
  describe(`desktop`, () => {
    const size = 'desktop';

    test(
      'Shows tooltip correctly for mouse interactions on desktop',
      setupTest({ disableContentPaddings: 'true', visualRefresh: 'true', size }, async page => {
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await expect(
          page.isExisting(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await expect(page.isExisting(`.${visualRefreshStyles['drawers-trigger-overflow']}`)).resolves.toBeFalsy();
        await page.hoverElement(wrapper.findDrawerTriggerById(drawerIds[0]).toSelector());
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();

        for (const drawerId of drawerIds) {
          async () => {
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

            for (const nestedDrawerId of drawerIds) {
              async () => {
                await page.hoverElement(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector());
                await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
                await expect(
                  page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
                ).resolves.toBe(1);
                await page.hoverElement(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`);
                await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
              };
            }

            await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
          };
        }
      })
    );

    test(
      'tooltip shows on focus and hides on blur events',
      setupTest({ disableContentPaddings: 'true', visualRefresh: 'true', size }, async page => {
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await expect(
          page.isExisting(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${visualRefreshStyles['drawers-desktop-triggers-container']}`)
        ).resolves.toBeTruthy();

        for (const drawerId of drawerIds) {
          async () => {
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

            for (const nestedDrawerId of drawerIds) {
              async () => {
                await page.hoverElement(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector());
                await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
                await expect(
                  page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
                ).resolves.toBe(1);
                await page.hoverElement(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`);
                await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
              };
            }

            await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
          };
        }
      })
    );

    test(
      'Shows tooltip correctly for keyboard (tab) interactions on desktop',
      setupTest({ disableContentPaddings: 'true', visualRefresh: 'true', size }, async page => {
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await expect(
          page.isExisting(`.${visualRefreshStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${visualRefreshStyles['drawers-desktop-triggers-container']}`)
        ).resolves.toBeTruthy();

        for (const drawerId of drawerIds) {
          async () => {
            //best way to avoid tab navigation errors is to start with a click to open then close the drawer, asserting button is focuses
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
            for (const nestedDrawerId of drawerIds) {
              async () => {
                await page.keys('Tab'); //navigate to next button
                await expect(
                  page.isFocused(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector())
                ).resolves.toBeTruthy();
                await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
                await expect(
                  page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
                ).resolves.toBe(1);
              };
            }

            //now navigate back up
            for (const reverseNestedDrawerId of [...drawerIds.reverse().slice(1)]) {
              async () => {
                await page.keys('Shift+Tab'); //navigate to last button
                await expect(
                  page.isFocused(wrapper.findDrawerTriggerById(reverseNestedDrawerId).toSelector())
                ).resolves.toBeTruthy();
                await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
                await expect(
                  page.getElementsCount(wrapper.findByClassName(visualRefreshStyles['trigger-tooltip']).toSelector())
                ).resolves.toBe(1);
              };
            }

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
          };
        }
      })
    );
  });

  describe(`mobile`, () => {
    const size = 'mobile';

    test(
      'Shows tooltip correctly for pointer interactions on mobile',
      setupTest({ disableContentPaddings: 'true', visualRefresh: 'true', size }, async page => {
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
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

    test(
      'Shows tooltip correctly for key interactions on mobile',
      setupTest({ disableContentPaddings: 'true', visualRefresh: 'true', size }, async page => {
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
        await expect(
          page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[0]).toSelector())
        ).resolves.toBeTruthy();
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await page.keys('Tab');
        await expect(
          page.isFocused(wrapper.findDrawerTriggerById(mobileDrawerTriggerIds[1]).toSelector())
        ).resolves.toBeTruthy();
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${visualRefreshStyles['trigger-tooltip']}`)).resolves.toBeFalsy();
        await page.keys(['Shift', 'Tab', 'Shift']);
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
});
