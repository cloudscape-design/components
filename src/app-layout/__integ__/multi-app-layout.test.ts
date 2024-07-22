// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

describe.each([[true], [false]])('visualRefresh=%s', visualRefresh => {
  describe.each([[true], [false]])('iframe=%s', iframe => {
    describe('MultiAppLayout simple', () => {
      const mainLayout = createWrapper().find('[data-testid="main-layout"]').findAppLayout();
      const secondaryLayout = createWrapper().find('[data-testid="secondary-layout"]').findAppLayout();
      const setupTest = (
        testFn: (
          page: BasePageObject,
          switchToIframe: (callback: () => Promise<void>) => Promise<void>
        ) => Promise<void>
      ) =>
        useBrowser(async browser => {
          const page = new BasePageObject(browser);
          const switchToIframe = async (callback: () => Promise<void>) => {
            if (!iframe) {
              return callback();
            }
            const iframeEl = await browser.$('#inner-iframe');
            await browser.switchToFrame(iframeEl);
            await callback();
            // go back to top
            await browser.switchToFrame(null);
          };
          await browser.url(
            `#/light/app-layout/multi-layout-${iframe ? 'iframe' : 'simple'}?visualRefresh=${visualRefresh}`
          );
          await switchToIframe(async () => {
            await page.waitForVisible(secondaryLayout.findContentRegion().toSelector());
          });
          await testFn(page, switchToIframe);
        });

      test(
        'navigation panel on the main layout works',
        setupTest(async page => {
          await expect(page.isDisplayed(mainLayout.findNavigationClose().toSelector())).resolves.toBe(true);
          await page.click(mainLayout.findNavigationClose().toSelector());
          await expect(page.isDisplayed(mainLayout.findNavigationClose().toSelector())).resolves.toBe(false);
        })
      );

      test(
        'tools panel the secondary layout works',
        setupTest(async (page, switchToIframe) => {
          await switchToIframe(async () => {
            await expect(page.isDisplayed(secondaryLayout.findToolsClose().toSelector())).resolves.toBe(false);
            await page.click(secondaryLayout.findToolsToggle().toSelector());
            await expect(page.isDisplayed(secondaryLayout.findToolsClose().toSelector())).resolves.toBe(true);
          });
        })
      );
    });
  });
});
