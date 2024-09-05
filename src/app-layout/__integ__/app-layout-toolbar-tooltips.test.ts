// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { viewports } from './constants';

import visualRefreshStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';
import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.selectors.js';
import toolbarTriggerButtonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.selectors.js';
import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();
class AppLayoutDrawersPage extends BasePageObject {
  async openFirstDrawer() {
    await this.click(wrapper.findDrawersTriggers().get(1).toSelector());
  }

  async confirmOneTooltipShowing(tooltipWrapperStyles: { [key: string]: string }): Promise<boolean> {
    const triggerWrapperClassAppliedCount = await this.getElementsCount(
      `.${tooltipWrapperStyles['trigger-wrapper-tooltip-visible']}`
    );
    const triggerTooltipClassAppliedCount = await this.getElementsCount(`.${tooltipWrapperStyles['trigger-tooltip']}`);
    const triggerTooltipRootClassAppliedCount = await this.getElementsCount(`.${tooltipStyles.root}`);

    return (
      triggerWrapperClassAppliedCount === 1 &&
      triggerTooltipClassAppliedCount === 1 &&
      triggerTooltipRootClassAppliedCount === 1
    );
  }

  async confirmNoTooltipShowing(tooltipWrapperStyles: { [key: string]: string }): Promise<boolean> {
    const triggerWrapperClassApplied = await this.isExisting(
      `.${tooltipWrapperStyles['trigger-wrapper-tooltip-visible']}`
    );
    const triggerTooltipClassApplied = await this.isExisting(`.${tooltipWrapperStyles['trigger-tooltip']}`);
    const triggerTooltipRootClassApplied = await this.isExisting(`.${tooltipStyles.root}`);

    return !triggerWrapperClassApplied && !triggerTooltipClassApplied && !triggerTooltipRootClassApplied;
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
  const appliedTriggerStyles = theme === 'visual-refresh' ? visualRefreshStyles : toolbarTriggerButtonStyles;
  const setupTest = (
    {
      splitPanelPosition = 'bottom',
      size = 'desktop',
      disableContentPaddings = 'false',
      theme = 'visual-refresh',
    }: SetupTestOptions,
    testFn: (page: AppLayoutDrawersPage) => Promise<void>
  ) =>
    useBrowser(size === 'desktop' ? viewports.desktop : viewports.mobile, async browser => {
      const page = new AppLayoutDrawersPage(browser);
      const params = new URLSearchParams({
        visualRefresh: 'true',
        splitPanelPosition,
        disableContentPaddings,
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
      setupTest({ disableContentPaddings: 'true', theme, size }, async page => {
        await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await expect(page.isExisting(`.${appliedThemeStyles['drawers-trigger-overflow']}`)).resolves.toBeFalsy();

        for (const drawerId of drawerIdsToTest) {
          async () => {
            //hover
            await page.hoverElement(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //confirm close on escape
            await page.keys('Escape');
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //hover elsewhere
            await page.hoverElement(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`);
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //hover again
            await page.hoverElement(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //hover elsewhere
            await page.hoverElement(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`);
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //open drawer
            await page.click(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
            //hover elsewhere
            await page.hoverElement(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`);
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();

            for (const nestedDrawerId of drawerIdsToTest) {
              async () => {
                //hover while drawer open
                await page.hoverElement(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector());
                await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
                //hover elsewhere
                await page.hoverElement(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`);
                await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
              };
            }

            await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
          };
        }
      })
    );

    test(
      'Shows tooltip correctly for pointer interactions',
      setupTest({ disableContentPaddings: 'true', theme, size }, async page => {
        await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await expect(page.isExisting(`.${appliedThemeStyles['drawers-trigger-overflow']}`)).resolves.toBeFalsy();

        for (const drawerId of drawerIdsToTest) {
          async () => {
            //pointer down
            await page.pointerDown(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //confirm close on escape
            await page.keys('Escape');
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //pointer up
            await page.pointerUp();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //pointer down again
            await page.pointerDown(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //pointer up
            await page.pointerUp();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            //open drawer
            await page.click(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();

            for (const nestedDrawerId of drawerIdsToTest) {
              async () => {
                //pointer down while drawer open
                await page.pointerDown(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector());
                await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
                //pointer up
                await page.pointerUp();
                await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
              };
            }

            await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
          };
        }
      })
    );

    test(
      'Shows tooltip correctly for keyboard (tab) interactions on desktop',
      setupTest({ disableContentPaddings: 'true', theme, size }, async page => {
        await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-desktop-triggers-container`]}`)
        ).resolves.toBeTruthy();
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
          await page.pause(50);
          await expect(
            page.isFocused(wrapper.findDrawerTriggerById(drawerIdsToTest[0]).toSelector())
          ).resolves.toBeFalsy();
          await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
        }

        for (const drawerId of drawerIdsToTest) {
          async () => {
            await page.keys('Tab');
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.keys('Escape');
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.keys('Space');
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();

            const hasResizeToggle = await page.isExisting(wrapper.findActiveDrawerResizeHandle().toSelector());
            if (hasResizeToggle) {
              await page.keys('Tab'); //navigate from resize to close
            }
            await expect(page.isFocused(wrapper.findActiveDrawerCloseButton().toSelector())).resolves.toBeTruthy();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();

            //jump back to toolbar and navigate down the triggers
            for (const nestedDrawerId of drawerIdsToTest) {
              async () => {
                await page.keys('Tab'); //navigate to next button
                await expect(
                  page.isFocused(wrapper.findDrawerTriggerById(nestedDrawerId).toSelector())
                ).resolves.toBeTruthy();
                await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
              };
            }

            //now navigate back up
            for (const reverseNestedDrawerId of [...drawerIdsToTest.reverse().slice(1)]) {
              async () => {
                await page.keys(['Shift', 'Tab', 'Null']); //navigate to last button
                await expect(
                  page.isFocused(wrapper.findDrawerTriggerById(reverseNestedDrawerId).toSelector())
                ).resolves.toBeTruthy();
                await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
              };
            }

            await page.keys(['Shift', 'Tab', 'Null']);
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await expect(page.isFocused(wrapper.findActiveDrawerCloseButton().toSelector())).resolves.toBeTruthy();
            await page.keys('Space'); //close drawer

            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
          };
        }
      })
    );
  });

  describe(`mobile`, () => {
    const size = 'mobile';

    test(
      'Shows tooltip correctly for mouse interactions',
      setupTest({ disableContentPaddings: 'true', theme, size }, async page => {
        await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-mobile-triggers-container`]}`)
        ).resolves.toBeTruthy();

        for (const drawerId of mobileDrawerTriggerIds) {
          async () => {
            await expect(page.isExisting(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await page.hoverElement(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.hoverElement(wrapper.toSelector());
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`);
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
            await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
          };
        }
      })
    );

    test(
      'Shows tooltip correctly for pointer interactions',
      setupTest({ disableContentPaddings: 'true', theme, size }, async page => {
        await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-mobile-triggers-container`]}`)
        ).resolves.toBeTruthy();

        for (const drawerId of mobileDrawerTriggerIds) {
          async () => {
            await expect(page.isExisting(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await page.pointerDown(wrapper.findDrawerTriggerById(drawerId).toSelector());
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.pointerUp();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.click(`button[data-testid='awsui-app-layout-trigger-${drawerId}']`);
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
            await page.click(wrapper.findActiveDrawerCloseButton().toSelector());
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
          };
        }
      })
    );

    test(
      'Shows tooltip correctly for key interactions on mobile',
      setupTest({ disableContentPaddings: 'true', theme, size }, async page => {
        //open via hamburger menu o set focus in the toolbar
        await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
        await expect(
          page.isExisting(`.${appliedThemeStyles[`drawers-mobile-triggers-container`]}`)
        ).resolves.toBeTruthy();
        await page.click(`button[aria-label="Open navigation"]`); //opens navigation drawer
        await page.click(wrapper.findNavigationClose().toSelector());
        await expect(page.isFocused(`button[aria-label="Open navigation"]`)).resolves.toBe(theme === 'visual-refresh'); //todo fix navigation focus here
        await page.keys([
          'Tab', //icon within nav button
          'Tab', //home breadcrumb
        ]);
        for (const drawerId of mobileDrawerTriggerIds) {
          async () => {
            await page.keys('Tab');
            await expect(page.isFocused(wrapper.findDrawerTriggerById(drawerId).toSelector())).resolves.toBeTruthy();
            await expect(page.confirmOneTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.keys('Escape');
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await page.keys('Enter');
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeTruthy();
            await page.keys('Enter');
            await expect(page.isExisting(wrapper.findActiveDrawer().toSelector())).resolves.toBeFalsy();
            await expect(page.confirmNoTooltipShowing(appliedTriggerStyles)).resolves.toBeTruthy();
          };
        }
      })
    );
  });
});
