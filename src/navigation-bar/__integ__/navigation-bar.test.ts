// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { createWrapper } from '@cloudscape-design/test-utils-core/selectors';

import '../../../lib/components/test-utils/selectors';

const primaryBar = createWrapper().find('[data-testid="primary-bar"]')!;
const secondaryBar = createWrapper().find('[data-testid="secondary-bar"]')!;
const stickyPrimary = createWrapper().find('[data-testid="sticky-primary"]')!;
const stickySecondary = createWrapper().find('[data-testid="sticky-secondary"]')!;
const stickyTable = createWrapper().findTable('[data-testid="sticky-table"]')!;

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

  describe('sticky stacking', () => {
    test(
      'table sticky header top offset equals combined height of both sticky nav bars',
      setupTest(async page => {
        // Measure the rendered heights of both sticky bars
        const primaryHeight = await page.browser.$(stickyPrimary.toSelector()).then(el => el.getSize('height'));
        const secondaryHeight = await page.browser.$(stickySecondary.toSelector()).then(el => el.getSize('height'));
        const expectedOffset = primaryHeight + secondaryHeight;

        // Get the table's sticky header element and check its top style
        const tableHeaderSelector = stickyTable.findHeaderRow().toSelector();
        const topValue = await page.browser.$(tableHeaderSelector).then(el => el.getCSSProperty('top'));

        // The table header's top should equal the combined nav bar heights
        expect(parseFloat(topValue.value)).toBeCloseTo(expectedOffset, 0);
      })
    );

    test(
      'sticky primary bar stacks at top:0, secondary stacks below primary',
      setupTest(async page => {
        const primaryTop = await page.browser
          .$(stickyPrimary.toSelector())
          .then(el => el.getCSSProperty('inset-block-start'));
        const primaryHeight = await page.browser.$(stickyPrimary.toSelector()).then(el => el.getSize('height'));
        const secondaryTop = await page.browser
          .$(stickySecondary.toSelector())
          .then(el => el.getCSSProperty('inset-block-start'));

        expect(parseFloat(primaryTop.value)).toBe(0);
        expect(parseFloat(secondaryTop.value)).toBeCloseTo(primaryHeight, 0);
      })
    );
  });
});
