// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/popover/container-test');
    await testFn(page);
  });
};

test(
  'Popover position is updated when track changes',
  setupTest(async page => {
    await page.hoverElement('#p1');
    const p11 = (await page.getBoundingBox('#content-p1')).left;

    await page.hoverElement('#p2');
    const p21 = (await page.getBoundingBox('#content-p2')).left;

    await page.hoverElement('#p1');
    const p12 = (await page.getBoundingBox('#content-p1')).left;

    expect(p11).toEqual(p12);
    expect(p21).toBeGreaterThan(p12);
  })
);
