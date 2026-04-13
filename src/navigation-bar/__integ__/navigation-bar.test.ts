// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { createWrapper } from '@cloudscape-design/test-utils-core/selectors';

import '../../../lib/components/test-utils/selectors';

const primaryBar = createWrapper().find('[data-testid="primary-bar"]')!;
const secondaryBar = createWrapper().find('[data-testid="secondary-bar"]')!;

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    await browser.url('#/light/navigation-bar/integ');
    const page = new BasePageObject(browser);
    await page.waitForVisible(primaryBar.toSelector());
    await testFn(page);
  });
};

describe('NavigationBar', () => {
  test(
    'renders primary bar as nav element with aria-label',
    setupTest(async page => {
      const tagName = await page.browser.$(primaryBar.toSelector()).then(el => el.getTagName());
      expect(tagName).toBe('nav');
      const ariaLabel = await page.browser.$(primaryBar.toSelector()).then(el => el.getAttribute('aria-label'));
      expect(ariaLabel).toBe('Primary navigation');
    })
  );

  test(
    'renders secondary bar as nav element with aria-label',
    setupTest(async page => {
      const tagName = await page.browser.$(secondaryBar.toSelector()).then(el => el.getTagName());
      expect(tagName).toBe('nav');
      const ariaLabel = await page.browser.$(secondaryBar.toSelector()).then(el => el.getAttribute('aria-label'));
      expect(ariaLabel).toBe('Page toolbar');
    })
  );

  test(
    'primary bar contains start and end content',
    setupTest(async page => {
      await expect(page.getText(primaryBar.toSelector())).resolves.toContain('App Name');
    })
  );

  test(
    'secondary bar contains start and end content',
    setupTest(async page => {
      await expect(page.getText(secondaryBar.toSelector())).resolves.toContain('Toolbar content');
    })
  );
});
