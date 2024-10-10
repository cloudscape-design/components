// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();
class AppLayoutToolsViewPage extends BasePageObject {
  async openTools() {
    await this.click(wrapper.findToolsToggle().toSelector());
  }

  async closeTools() {
    await this.click(wrapper.findToolsClose().toSelector());
  }
}

describe.each(['classic', 'refresh', 'refresh-toolbar'] as const)('%s', theme => {
  function setupTest(testFn: (page: AppLayoutToolsViewPage) => Promise<void>, path: string) {
    return useBrowser(async browser => {
      const page = new AppLayoutToolsViewPage(browser);
      const url = `#/light/app-layout/${path}`;
      await page.setWindowSize(viewports.desktop);
      const params = new URLSearchParams({
        visualRefresh: `${theme.startsWith('refresh')}`,
        appLayoutToolbar: `${theme === 'refresh-toolbar'}`,
      });
      await browser.url(`${url}?${params.toString()}`);
      await page.waitForVisible(wrapper.findContentRegion().toSelector());
      await testFn(page);
    });
  }

  test(
    'tools is displayed properly with split panel',
    setupTest(async page => {
      await expect(page.isDisplayed(wrapper.findTools().toSelector())).resolves.toBe(theme === 'classic');
      await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(false);
      await page.openTools();
      await expect(page.isDisplayed(wrapper.findTools().toSelector())).resolves.toBe(true);
      await page.closeTools();
      await expect(page.isDisplayed(wrapper.findTools().toSelector())).resolves.toBe(theme === 'classic');
      await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(false);
    }, 'with-split-panel')
  );
});
