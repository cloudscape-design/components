// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import styles from '../../../lib/components/content-layout/styles.selectors.js';
// import createWrapper from '../../../lib/components/test-utils/selectors';

// const wrapper = createWrapper();

class ContentLayoutPageObject extends BasePageObject {
  async isOverlapEnabled() {
    const backgroundElement = await this.browser.$(`.${styles.background}`);
    const classes = await backgroundElement.getAttribute('class');
    return !classes.includes(styles['is-overlap-disabled']);
  }

  async toggleHeaderPresent() {
    const headerPresentCheckbox = await this.browser.$('#header-present-checkbox');
    await headerPresentCheckbox.click();
  }
}

describe('Content layout', () => {
  test(
    'content overlaps the header by default',
    useBrowser(async browser => {
      await browser.url('#/light/content-layout/dark-header-main');

      const page = new ContentLayoutPageObject(browser);

      await expect(page.isOverlapEnabled()).resolves.toBe(true);
    })
  );

  test(
    'content does not overlaps the header if disableOverlap is set',
    useBrowser(async browser => {
      await browser.url('#/light/content-layout/dark-header-no-overlap');

      const page = new ContentLayoutPageObject(browser);

      await expect(page.isOverlapEnabled()).resolves.toBe(false);
    })
  );

  test(
    'content does not overlap the header if there is no header',
    useBrowser(async browser => {
      await browser.url('#/light/content-layout/dark-header-main');

      const page = new ContentLayoutPageObject(browser);

      await page.toggleHeaderPresent();

      await expect(page.isOverlapEnabled()).resolves.toBe(false);
    })
  );
});
