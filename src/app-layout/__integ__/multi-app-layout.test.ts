// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { getUrlParams, Theme } from './utils';

const iframeId = '#inner-iframe';

describe.each(['classic', 'refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  describe.each([[true], [false]])('iframe=%s', iframe => {
    describe('MultiAppLayout simple', () => {
      const mainLayout = createWrapper().find('[data-testid="main-layout"]').findAppLayout();
      const secondaryLayout = createWrapper().find('[data-testid="secondary-layout"]').findAppLayout();
      const setupTest = (testFn: (page: BasePageObject) => Promise<void>) =>
        useBrowser(async browser => {
          const page = new BasePageObject(browser);
          await browser.url(`#/light/app-layout/multi-layout-${iframe ? 'iframe' : 'simple'}?${getUrlParams(theme)}`);
          await page.runInsideIframe(iframeId, !!iframe, async () => {
            await page.waitForVisible(secondaryLayout.findContentRegion().toSelector());
          });
          await testFn(page);
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
        setupTest(async page => {
          await page.runInsideIframe(iframeId, !!iframe, async () => {
            await expect(page.isDisplayed(secondaryLayout.findToolsClose().toSelector())).resolves.toBe(false);
          });
          if (theme === 'refresh-toolbar') {
            await page.click(mainLayout.findToolsToggle().toSelector());
          } else {
            await page.runInsideIframe(iframeId, !!iframe, async () => {
              await page.click(secondaryLayout.findToolsToggle().toSelector());
            });
          }
          await page.runInsideIframe(iframeId, !!iframe, async () => {
            await expect(page.isDisplayed(secondaryLayout.findToolsClose().toSelector())).resolves.toBe(true);
          });
        })
      );

      test(
        'secondary layout does not vertically overflow the primary one',
        setupTest(async page => {
          // Provide enough height for all page elements to fit without overflow
          const outerBrowserWindowHeight = 1400;
          await page.setWindowSize({ width: 1200, height: outerBrowserWindowHeight });

          // Retrieve the actual viewport size, excluding browser UI
          const { height: innerViewportSize } = await page.getViewportSize();

          const { bottom: mainLayoutBottom } = await page.getBoundingBox(mainLayout.toSelector());
          expect(mainLayoutBottom).toBeLessThanOrEqual(innerViewportSize);

          await page.runInsideIframe(iframeId, !!iframe, async () => {
            const { bottom: secondaryLayoutBottom } = await page.getBoundingBox(secondaryLayout.toSelector());
            expect(secondaryLayoutBottom).toBeLessThanOrEqual(innerViewportSize);
            expect(secondaryLayoutBottom).toBeLessThanOrEqual(mainLayoutBottom);
          });
        })
      );
    });
  });
});
