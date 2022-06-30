// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { PageObject } from './page-object';

describe('use-container-query', () => {
  const setupTest = (testFn: (page: PageObject) => Promise<void>) => {
    return useBrowser(async browser => {
      const page = new PageObject(browser);
      await browser.url('#/light/container-queries');
      await testFn(page);
    });
  };

  test(
    'reports dimensions correctly',
    setupTest(async page => {
      await page.waitForVisible('#test-dimensions');
      await page.setMeasureType('width');
      await page.waitForAssertion(() =>
        expect(page.getElementsText('#test-dimensions')).resolves.toEqual(['width: 300'])
      );
      await page.setMeasureType('height');
      await page.waitForAssertion(() =>
        expect(page.getElementsText('#test-dimensions')).resolves.toEqual(['height: 50'])
      );
    })
  );

  test(
    'reports content-box dimensions when padding is present',
    setupTest(async page => {
      await page.waitForVisible('#test-content-box');
      await page.setMeasureType('width');
      await page.waitForAssertion(() =>
        expect(page.getElementsText('#test-content-box')).resolves.toEqual(['width: 280'])
      );
      await page.setMeasureType('height');
      await page.waitForAssertion(() =>
        expect(page.getElementsText('#test-content-box')).resolves.toEqual(['height: 30'])
      );
    })
  );

  test(
    `re-renders elements as the browser width changes`,
    setupTest(async page => {
      await page.waitForVisible('#test-content-box');
      await page.resizeWindow(649, 500);
      await page.waitForAssertion(() => expect(page.getElementsText('#test-updates')).resolves.toEqual(['width: 649']));
    })
  );
});
