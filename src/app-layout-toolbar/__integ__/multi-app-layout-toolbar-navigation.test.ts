// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

class PageObject extends BasePageObject {
  clickHref(href: string) {
    return this.click(`[href="${href}"]`);
  }
}

describe('Multi page layout navigation', () => {
  const mainLayout = createWrapper().find('[data-testid="main-layout"]').findAppLayout();
  const secondaryLayout = createWrapper().find('[data-testid="secondary-layout"]').findAppLayout();
  const setupTest = (testFn: (page: PageObject) => Promise<void>) =>
    useBrowser(async browser => {
      const page = new PageObject(browser);
      await browser.url('#/light/app-layout-toolbar/multi-layout-with-hidden-instances');
      await testFn(page);
    });

  test(
    'should keep toolbars and breadcrumbs state independently in both layouts',
    setupTest(async page => {
      expect(await page.isExisting(mainLayout.findBreadcrumbs().toSelector())).toBeFalsy();
      await page.runInsideIframe('#page1', true, async () => {
        await expect(page.getText(secondaryLayout.findBreadcrumbs().toSelector())).resolves.toContain('page1');
      });

      await page.clickHref('page2');
      expect(await page.isExisting(mainLayout.findBreadcrumbs().toSelector())).toBeFalsy();
      await page.runInsideIframe('#page1', true, async () => {
        await expect(page.getText(secondaryLayout.findBreadcrumbs().toSelector())).resolves.toBeFalsy();
      });

      await page.clickHref('page3');
      expect(await page.isExisting(mainLayout.findBreadcrumbs().toSelector())).toBeFalsy();
      await page.runInsideIframe('#page3', true, async () => {
        await expect(page.getText(secondaryLayout.findBreadcrumbs().toSelector())).resolves.toContain('page3');
      });

      await page.clickHref('page1');
      expect(await page.isExisting(mainLayout.findBreadcrumbs().toSelector())).toBeFalsy();
      await page.runInsideIframe('#page1', true, async () => {
        await expect(page.getText(secondaryLayout.findBreadcrumbs().toSelector())).resolves.toContain('page1');
      });
    })
  );
});
