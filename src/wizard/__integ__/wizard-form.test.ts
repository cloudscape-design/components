// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('/#/light/wizard/wizard-form/');
    const page = new BasePageObject(browser);
    await page.waitForVisible('#increase-counter');
    await testFn(page);
  });
}

test(
  'Counter in wizard form content is not reset upon wizard re-render',
  setupTest(async page => {
    await page.click('#increase-counter');
    await expect(page.getText('#counter')).resolves.toBe('1');
    await page.click('#set-loading');
    await expect(page.getText('#counter')).resolves.toBe('1');
  })
);
