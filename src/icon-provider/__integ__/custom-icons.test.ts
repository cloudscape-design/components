// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

const pageUrl = '#/light/icon-provider/custom-icons/custom-icons';

class CustomIconsPage extends BasePageObject {
  svgInside(testId: string) {
    return `[data-testid="${testId}"] svg`;
  }
}

function setupTest(testFn: (page: CustomIconsPage) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url(pageUrl);
    const page = new CustomIconsPage(browser);
    await page.waitForVisible('h1');
    await testFn(page);
  });
}

describe('IconProvider custom icons', () => {
  test(
    'renders custom icons via Icon component',
    setupTest(async page => {
      await expect(page.isExisting(page.svgInside('icon-rocket'))).resolves.toBe(true);
      await expect(page.isExisting(page.svgInside('icon-zap'))).resolves.toBe(true);
    })
  );

  test(
    'renders custom icons inside Button component',
    setupTest(async page => {
      await expect(page.isExisting(page.svgInside('button-rocket'))).resolves.toBe(true);
      await expect(page.isExisting(page.svgInside('button-zap'))).resolves.toBe(true);
    })
  );

  test(
    'built-in icons still render alongside custom icons',
    setupTest(async page => {
      await expect(page.isExisting(page.svgInside('icon-add-plus'))).resolves.toBe(true);
      await expect(page.isExisting(page.svgInside('icon-settings'))).resolves.toBe(true);
      await expect(page.isExisting(page.svgInside('button-search'))).resolves.toBe(true);
    })
  );

  test(
    'custom icons inherit through nested providers',
    setupTest(async page => {
      // Rocket is from the parent provider, close is overridden in the nested provider
      await expect(page.isExisting(page.svgInside('nested-icon-rocket'))).resolves.toBe(true);
      await expect(page.isExisting(page.svgInside('nested-icon-close'))).resolves.toBe(true);
    })
  );

  test(
    'null reset removes custom icons and restores built-in icons',
    setupTest(async page => {
      // Custom icon "rocket" has no built-in default, so no SVG should render
      await expect(page.isExisting(page.svgInside('reset-icon-rocket'))).resolves.toBe(false);
      // Built-in icon "close" should be restored to its default
      await expect(page.isExisting(page.svgInside('reset-icon-close'))).resolves.toBe(true);
    })
  );
});
