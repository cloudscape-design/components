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

interface SetupTestOptions {
  splitPanelPosition?: string;
  size?: 'desktop' | 'mobile';
  disableContentPaddings?: string;
  theme?: 'visual-refresh' | 'visual-refresh-toolbar' | 'classic';
}

const drawerIds = Object.values(drawerIdObj);
const VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT = 2; //must match the number in  '../../../lib/components/app-layout/visual-refresh/drawers';

const setupTest = (
  { size = 'desktop', theme = 'visual-refresh' }: SetupTestOptions,
  testFn: (page: BasePageObject) => Promise<void>
) =>
  useBrowser(size === 'desktop' ? viewports.desktop : viewports.mobile, async browser => {
    const page = new BasePageObject(browser);
    const params = new URLSearchParams({
      visualRefresh: theme === 'classic' ? 'false' : 'true',
      appLayoutWidget: theme === 'visual-refresh' ? 'false' : 'true',
    }).toString();
    await browser.url(`#/light/app-layout/with-drawers?${params}`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });

describe('theme = classic', () => {
  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    const mobileDrawerTriggerIds = drawerIds.slice(0, VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT);
    const drawerIdsToTest = [...(size === 'mobile' ? mobileDrawerTriggerIds : drawerIds)];

    test(
      'No tooltip showing for mouse interactions',
      setupTest({ size, theme: 'classic' }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'No tooltip showing for pointer interactions',
      setupTest({ size, theme: 'classic' }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'No tooltip showing for keyboard (tab) interactions',
      setupTest({ size, theme: 'classic' }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        //set focus by clicking open and close
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.click(firstDrawerTriggerSelector);
        (await size) === 'mobile' ? page.keys('Enter') : page.click(firstDrawerTriggerSelector);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        //move focus away
        await page.keys(['Shift', 'Tab', 'Null']);

        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.keys('Tab');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );
  });
});

describe.each(['visual-refresh', 'visual-refresh-toolbar'] as const)('%s', theme => {
  const toolbarDrawerIds = [...(theme === 'visual-refresh-toolbar' ? ['slide-panel'] : []), ...drawerIds];
  const mobileDrawerTriggerIds = toolbarDrawerIds.slice(
    0,
    VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT + (theme === 'visual-refresh-toolbar' ? 1 : 0)
  );

  const appliedThemeStyles = theme === 'visual-refresh' ? visualRefreshStyles : toolbarStyles;

  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    const drawersTriggerContainerClassKey = `drawers-${size === 'desktop' ? 'desktop' : 'mobile'}-triggers-container`;
    const drawerIdsToTest = size === 'mobile' ? mobileDrawerTriggerIds : toolbarDrawerIds;

    test(
      'Shows tooltip correctly for mouse interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.hoverElement(wrapper.findNavigationToggle().toSelector());
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Removes tooltip on escape key press after showing from mouse hover',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys(['Escape']);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly for pointer interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.buttonUp();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Removes tooltip on escape key press after showing from pointer down',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly for keyboard (tab) interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;

        //navigate to buttons different depending on size and theme
        if (size === 'desktop') {
          if (theme === 'visual-refresh-toolbar') {
            //open and close navigation toggle to start focus at a known location
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
        } else {
          await page.click(firstDrawerTriggerSelector);
          await page.keys('Enter'); //close drawer
          await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
          //move focus away
          await page.keys(['Shift', 'Tab', 'Null']);
        }
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.keys('Tab');
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys(['Shift', 'Tab', 'Null']);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Removes tooltip on escape key press after showing from keyboard event',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;

        //navigate to buttons different depending on size and theme
        if (size === 'desktop') {
          if (theme === 'visual-refresh-toolbar') {
            //open and close navigation toggle to start focus at a known location
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
        } else {
          await page.click(firstDrawerTriggerSelector);
          await page.keys('Enter'); //close drawer
          await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
          //move focus away
          await page.keys(['Shift', 'Tab', 'Null']);
        }
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.keys('Tab');
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );
  });
});
