// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findFileUpload();

class FileUploadPageObject extends BasePageObject {
  hasOutline(selector: string) {
    return this.browser.execute(selector => {
      const element = document.querySelector(selector);
      return !!element && getComputedStyle(element).outline.includes('2px');
    }, selector);
  }
}

const setupTest = (testFn: (page: FileUploadPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new FileUploadPageObject(browser);
    await browser.url('/#/light/file-upload/test');
    await testFn(page);
  });
};

test(
  'file tokens can be removed',
  setupTest(async page => {
    await expect(page.getElementsCount(wrapper.findFileTokens().toSelector())).resolves.toBe(2);

    await page.click(wrapper.findFileToken(1).findRemoveButton().toSelector());

    await expect(page.getElementsCount(wrapper.findFileTokens().toSelector())).resolves.toBe(1);

    await page.click(wrapper.findFileToken(1).findRemoveButton().toSelector());

    await expect(page.getElementsCount(wrapper.findFileTokens().toSelector())).resolves.toBe(0);
  })
);

test(
  'focus outline is forced on the upload button',
  setupTest(async page => {
    await page.click('#focus-target');
    await page.keys('Tab');

    await expect(page.hasOutline(wrapper.findUploadButton().toSelector())).resolves.toBe(true);
  })
);
