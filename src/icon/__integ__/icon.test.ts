// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/icon/styles.selectors.js';

const dynamicIconSelector = createWrapper().findIcon('#dynamic-test-2').toSelector();
const staticIconSelector = createWrapper().findIcon('#static-test').toSelector();
const removedIconSelector = createWrapper().findIcon('#visibility-test-1').toSelector();
const hiddenIconSelector = createWrapper().findIcon('#visibility-test-2').toSelector();

const dynamicHeightInput = '#height-input';

class IconSizeInherit extends BasePageObject {
  async toggleMode() {
    await this.click('label=Visual refresh');
  }

  async toggleVisibility() {
    await this.click('#visibility-toggle');
  }

  async getHeight(selector: string) {
    return (await this.getBoundingBox(selector)).height;
  }

  async hasSize(className: string, selector: string = dynamicIconSelector) {
    const classes = await this.getElementAttribute(selector, 'class');
    return classes.indexOf(styles[className]) !== -1;
  }
}

describe('Icon', () => {
  const setupTest = (testFn: (page: IconSizeInherit) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new IconSizeInherit(browser);
      await browser.url('#/light/icon/size-inherit');
      await page.waitForVisible(dynamicIconSelector);
      // The default theme is VR by default, so we toggle once to go to classic mode
      await page.toggleMode();
      await testFn(page);
    });
  };
  test(
    'Should update icon height and size on runtime change',
    setupTest(async page => {
      await page.setValue(dynamicHeightInput, 20);
      await expect(page.getHeight(dynamicIconSelector)).resolves.toEqual(20);
      await expect(page.hasSize('size-normal')).resolves.toBe(true);

      await page.setValue(dynamicHeightInput, 26);
      await expect(page.getHeight(dynamicIconSelector)).resolves.toEqual(26);
      await expect(page.hasSize('size-medium')).resolves.toBe(true);
    })
  );
  test(
    'Should update icon height and size on visual mode change',
    setupTest(async page => {
      await expect(page.getHeight(staticIconSelector)).resolves.toEqual(22);
      await expect(page.hasSize('size-normal', staticIconSelector)).resolves.toBe(true);

      await page.toggleMode();

      await expect(page.getHeight(staticIconSelector)).resolves.toEqual(24);
      await expect(page.hasSize('size-medium', staticIconSelector)).resolves.toBe(true);
    })
  );
  test(
    'Hidden icon should have correct height and size after becoming visible',
    setupTest(async page => {
      await expect(page.isExisting(removedIconSelector)).resolves.toBe(false);
      await page.toggleVisibility();
      await expect(page.isExisting(removedIconSelector)).resolves.toBe(true);
      await expect(page.isExisting(hiddenIconSelector)).resolves.toBe(true);

      await expect(page.getHeight(removedIconSelector)).resolves.toEqual(36);
      await expect(page.hasSize('size-big', removedIconSelector)).resolves.toBe(true);

      await expect(page.getHeight(hiddenIconSelector)).resolves.toEqual(27);
      await expect(page.hasSize('size-medium', hiddenIconSelector)).resolves.toBe(true);
    })
  );
});
