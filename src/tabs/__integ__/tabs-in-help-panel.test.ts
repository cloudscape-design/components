// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const appLayoutWrapper = createWrapper().findAppLayout();
const tabsWrapper = createWrapper().findTabs();

const setupTest = (visualRefresh = false, testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url(`#/light/tabs/in-app-layout-help-panel/?${visualRefresh ? 'visualRefresh=true' : ''}`);
    await page.waitForVisible(appLayoutWrapper.findContentRegion().toSelector());
    await testFn(page);
  });
};

[false, true].forEach(visualRefresh =>
  describe(`visualRefresh=${visualRefresh}`, () => {
    test(
      'closes the tools drawer upon clicking on the toggle in large viewports',
      setupTest(visualRefresh, async page => {
        await expect(page.isDisplayed(tabsWrapper.toSelector())).resolves.toBe(true);
        await page.click(appLayoutWrapper.findToolsClose().toSelector());
        await expect(page.isDisplayed(tabsWrapper.toSelector())).resolves.toBe(false);
      })
    );

    test(
      'closes the tools drawer upon clicking on the toggle in small viewports',
      setupTest(visualRefresh, async page => {
        await page.setWindowSize({ width: 500, height: 1000 });
        await expect(page.isDisplayed(tabsWrapper.toSelector())).resolves.toBe(true);
        await page.click(appLayoutWrapper.findToolsClose().toSelector());
        await expect(page.isDisplayed(tabsWrapper.toSelector())).resolves.toBe(false);
      })
    );
  })
);
