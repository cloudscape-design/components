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

const testIf = (condition: boolean) => (condition ? test : test.skip);

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
  // const toolbarDrawerIds = [...(theme === 'visual-refresh-toolbar' ? ['slide-panel'] : []), ...drawerIds];
  const mobileDrawerTriggerIds = drawerIds.slice(
    0,
    VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT + (theme === 'visual-refresh-toolbar' ? 1 : 0)
  );

  const appliedThemeStyles = theme === 'visual-refresh' ? visualRefreshStyles : toolbarStyles;

  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    const drawersTriggerContainerClassKey = `drawers-${size === 'desktop' ? 'desktop' : 'mobile'}-triggers-container`;
    const drawerIdsToTest = size === 'mobile' ? mobileDrawerTriggerIds : drawerIds; //toolbarDrawerIds;

    test(
      'Shows tooltip correctly on drawer trigger for mouse interactions drawer triggers',
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
      'Shows tooltip correctly on drawer trigger for mouse interactions during drawer actions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.click(`button[aria-label="Security close button"`);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
      })
    );

    test(
      'Removes tooltip from drawer trigger on escape key press after showing from mouse hover',
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
      'Shows tooltip correctly on drawer trigger for pointer interactions',
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
      'Removes tooltip from drawer trigger on escape key press after showing from pointer down',
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
      'Shows tooltip correctly on drawer trigger for keyboard (tab) interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.click(firstDrawerTriggerSelector);
        //close drawer via keys
        await page.keys(size === 'desktop' ? ['Tab', 'Enter'] : ['Enter']); //first focus element is resize in desktop
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate away from drawer triggers
        if (theme === 'visual-refresh-toolbar') {
          await page.keys(['Shift', 'Tab', 'Null']); // to split panel drawer
        }
        await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate back to drawer trigger
        await page.keys(theme === 'visual-refresh-toolbar' ? ['Tab', 'Tab'] : ['Tab']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys(['Shift', 'Tab', 'Null']);
        if (theme === 'visual-refresh-toolbar') {
          await page.keys(['Shift', 'Tab', 'Null']); // one more time to least breadcrumb - be aware if breadcrumb has tooltip
        }
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      //flagged
      'Removes tooltip from drawer trigger on escape key press after showing from keyboard event',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.click(firstDrawerTriggerSelector);
        //close drawer via keys
        await page.keys(size === 'desktop' ? ['Tab', 'Enter'] : ['Enter']); //focus element is resize in desktop
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate away from drawer triggers
        if (theme === 'visual-refresh-toolbar') {
          await page.keys(['Shift', 'Tab', 'Null']); // to split panel drawer
        }
        await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate back to drawer trigger
        await page.keys(theme === 'visual-refresh-toolbar' ? ['Tab', 'Tab'] : ['Tab']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    test(
      'Shows tooltip correctly on drawer trigger for keyboard (tab) interactions after drawer actions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        const secondDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[1]}"]`;
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //close drawer via keys
        await page.keys(size === 'desktop' ? ['Tab', 'Enter'] : ['Enter']); //first focus element is resize in desktop
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.keys(['Tab']);
        await expect(page.isFocused(secondDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys(['Shift', 'Tab', 'Null']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
      })
    );

    testIf(theme === 'visual-refresh-toolbar')(
      'Shows tooltip correctly on split panel trigger for mouse interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.hoverElement(wrapper.findNavigationToggle().toSelector());
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    testIf(theme === 'visual-refresh-toolbar')(
      'Shows tooltip correctly on plit panel trigger for mouse interactions during split-panel actions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;
        const secondDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.click(firstDrawerTriggerSelector); //this could change witf focus fixes
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.hoverElement(secondDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
      })
    );

    testIf(theme === 'visual-refresh-toolbar')(
      'Removes tooltip from split panel trigger on escape key press after showing from mouse hover',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys(['Escape']);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    testIf(theme === 'visual-refresh-toolbar')(
      'Shows tooltip correctly for split panel trigger on pointer interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.buttonUp();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    testIf(theme === 'visual-refresh-toolbar')(
      'Removes tooltip from split panel trigger on escape key press after showing from pointer down',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    testIf(theme === 'visual-refresh-toolbar')(
      'Shows tooltip correctly for split panel trigger for keyboard (tab) interactions',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate away from slide panel
        await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate back to drawer trigger
        await page.keys(['Tab']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys(['Shift', 'Tab', 'Null']);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );

    testIf(theme === 'visual-refresh-toolbar')(
      'Removes tooltip from split panel trigger on escape key press after showing from keyboard event',
      setupTest({ theme, size }, async page => {
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(0);
        await expect(page.isExisting(`.${appliedThemeStyles[drawersTriggerContainerClassKey]}`)).resolves.toBeTruthy();
        const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-slide-panel"]`;
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        await page.click(firstDrawerTriggerSelector);
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate away from slide panel
        await page.keys(['Shift', 'Tab', 'Null']); // to last breadcrumb - be aware if breadcrumb has tooltip
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
        //navigate back to drawer trigger
        await page.keys(['Tab']);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        await expect(page.getElementsCount(`.${tooltipStyles.root}`)).resolves.toBe(1);
        await page.keys('Escape');
        await expect(page.isExisting(`.${tooltipStyles.root}`)).resolves.toBe(false);
      })
    );
  });
});
