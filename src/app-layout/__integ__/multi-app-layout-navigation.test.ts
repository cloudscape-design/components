// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { getUrlParams } from './utils';

const theme = 'refresh-toolbar';

class PageObject extends BasePageObject {
  clickHref(href: string) {
    return this.click(`[href="${href}"]`);
  }

  isToolsToggleActive() {
    return this.isExisting(`${createWrapper().findAppLayout().findToolsToggle().toSelector()}[aria-expanded="true"]`);
  }
}

describe('Multi app layout navigation', () => {
  describe.each([[true], [false]])('iframe=%s', iframe => {
    const mainLayout = createWrapper().find('[data-testid="main-layout"]').findAppLayout();
    const secondaryLayout = createWrapper().find('[data-testid="secondary-layout"]').findAppLayout();
    const setupTest = (testFn: (page: PageObject) => Promise<void>) =>
      useBrowser(async browser => {
        const page = new PageObject(browser);
        await browser.url(
          `#/light/app-layout/multi-layout-with-hidden-instances${iframe ? '-iframe' : ''}?${getUrlParams(theme)}`
        );
        await testFn(page);
      });

    test(
      'should clean up and restore previous route state',
      setupTest(async page => {
        await page.click(mainLayout.findToolsToggle().toSelector());
        await expect(page.isToolsToggleActive()).resolves.toBe(true);
        await page.runInsideIframe('#page1', !!iframe, async () => {
          await expect(page.isClickable(secondaryLayout.findTools().toSelector())).resolves.toEqual(true);
        });

        await page.clickHref('page2');
        await expect(page.isToolsToggleActive()).resolves.toBe(false);
        await page.runInsideIframe('#page2', !!iframe, async () => {
          await expect(page.isClickable(secondaryLayout.findTools().toSelector())).resolves.toEqual(false);
        });

        await page.clickHref('page1');
        await expect(page.isToolsToggleActive()).resolves.toBe(true);
        await page.runInsideIframe('#page1', !!iframe, async () => {
          await expect(page.isClickable(secondaryLayout.findTools().toSelector())).resolves.toEqual(true);
        });
      })
    );
  });
});
