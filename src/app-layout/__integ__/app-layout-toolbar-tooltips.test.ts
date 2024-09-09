// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { viewports } from './constants';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';
import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.selectors.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();

class AppLayoutDrawersPage extends BasePageObject {
  async getElementCenter(selector: string) {
    const targetRect = await this.getBoundingBox(selector);
    const x = Math.round(targetRect.left + targetRect.width / 2);
    const y = Math.round(targetRect.top + targetRect.height / 2);
    return { x, y };
  }

  /**
   * This holds the pointer down for an longer than the buttonDownOnElement
   * @param selector
   */
  async pointerDown(selector: string, customDuration = 150) {
    const center = await this.getElementCenter(selector);
    await (await this.browser.$(selector)).moveTo();
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, origin: 'pointer', ...center },
          { type: 'pointerDown', button: 0, duration: customDuration },
          { type: 'pause', duration: 50 },
        ],
      },
    ]);
  }
}

interface SetupTestOptions {
  splitPanelPosition?: string;
  size?: 'desktop' | 'mobile';
  disableContentPaddings?: string;
  theme?: 'visual-refresh' | 'visual-refresh-toolbar';
}

const drawerIds = Object.values(drawerIdObj);
const VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT = 2; //must match the number in  '../../../lib/components/app-layout/visual-refresh/drawers';

describe.each(['visual-refresh', 'visual-refresh-toolbar'] as const)('%s', theme => {
  const drawerIdsToTest = [...(theme === 'visual-refresh-toolbar' ? ['slide-panel'] : []), ...drawerIds];
  const mobileDrawerTriggerIds = drawerIdsToTest.slice(
    0,
    VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT + (theme === 'visual-refresh-toolbar' ? 1 : 0)
  );

  const appliedThemeStyles = theme === 'visual-refresh' ? visualRefreshStyles : toolbarStyles;

  const setupTest = (
    { size = 'desktop', theme = 'visual-refresh' }: SetupTestOptions,
    testFn: (page: AppLayoutDrawersPage) => Promise<void>
  ) =>
    useBrowser(size === 'desktop' ? viewports.desktop : viewports.mobile, async browser => {
      const page = new AppLayoutDrawersPage(browser);
      const params = new URLSearchParams({
        visualRefresh: 'true',
        appLayoutWidget: theme === 'visual-refresh' ? 'false' : 'true',
      }).toString();
      await browser.url(`#/light/app-layout/with-drawers?${params}`);
      await page.waitForVisible(wrapper.findContentRegion().toSelector());
      await testFn(page);
    });

  describe(`desktop`, () => {
    const size = 'desktop';

    test(
      'Shows tooltip correctly for mouse interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIds[0]}"]`;
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys(['Escape']);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.hoverElement(`body`);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.hoverElement(`body`);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly for pointer interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIds[0]}"]`;
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);

        //confirm close on escape
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //pointer up
        await page.buttonUp();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //pointer down again
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        //pointer up
        await page.buttonUp();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly for keyboard (tab) interactions on desktop',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        if (theme === 'visual-refresh-toolbar') {
          //open and close navigation toggle to start focus at a known location
          await expect(page.isExisting(wrapper.findNavigationToggle().toSelector())).resolves.toBeTruthy();
          await page.click(wrapper.findNavigationToggle().toSelector());
          await page.click(wrapper.findNavigationToggle().toSelector());
          await page.keys([
            'Tab', //Home breadcrumb
          ]);
        } else {
          //set focus by clicking open and close
          await page.click(wrapper.findDrawerTriggerById(drawerIdsToTest[0]).toSelector());
          await page.click(wrapper.findDrawerTriggerById(drawerIdsToTest[0]).toSelector());
          await expect(
            page.isFocused(wrapper.findDrawerTriggerById(drawerIdsToTest[0]).toSelector())
          ).resolves.toBeTruthy();
          //move focus away
          await page.keys(['Shift', 'Tab', 'Null']);
        }
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.keys('Tab');
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.keys('Tab');
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Space');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );
  });

  describe(`mobile`, () => {
    const size = 'mobile';

    test(
      'Shows tooltip correctly for mouse interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-mobile-triggers-container`]}`)
        ).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${mobileDrawerTriggerIds[0]}"]`;
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.hoverElement('body');
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.hoverElement('body');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.click(firstDrawerTriggerSelector);
        await page.pause(50);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly for pointer down and up interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-mobile-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await page.pointerDown(`button[data-testid="awsui-app-layout-trigger-${mobileDrawerTriggerIds[1]}"]`);
        await page.pause(50);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.buttonUp();
        await page.pause(50);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly for key interactions on mobile',
      setupTest({ theme, size }, async page => {
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-mobile-triggers-container`]}`)
        ).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${mobileDrawerTriggerIds[0]}"]`;
        const secondDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${mobileDrawerTriggerIds[1]}"]`;
        //set tab focus
        await page.click(firstDrawerTriggerSelector); //open element
        if (theme === 'visual-refresh') {
          //first trigger is a drawer
          await page.keys('Enter'); //close drawer
        } else {
          await page.click(firstDrawerTriggerSelector); //close split panel
        }
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await page.keys(['Shift', 'Tab', 'Null']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeFalsy();
        await page.keys('Tab');
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.keys('Tab');
        await expect(page.isFocused(secondDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Enter');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );
  });
});
