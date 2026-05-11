// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { TestDefinition, TestSuite } from './types';

const screenshotAreaSelector = '.screenshot-area';
const defaultWindowSize = { width: 1600, height: 800 };

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8081';

async function captureScreenshot(
  browser: WebdriverIO.Browser,
  url: string,
  setup?: (page: ScreenshotPageObject) => Promise<void>
): Promise<PNG> {
  await browser.url(url);
  const page = new ScreenshotPageObject(browser);
  await page.waitForVisible(screenshotAreaSelector);
  if (setup) {
    await setup(page);
  }
  const { image } = await page.captureBySelector(screenshotAreaSelector);
  return image;
}

function buildUrl(host: string, path: string, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams(queryParams);
  const qs = params.toString();
  return `${host}/#/${path}${qs ? `?${qs}` : ''}`;
}

function compareImages(newImage: PNG, oldImage: PNG): number {
  const { width, height } = newImage;
  const diff = new PNG({ width, height });
  return pixelmatch(newImage.data, oldImage.data, diff.data, width, height, { threshold: 0.1 });
}

function isTestDefinition(item: TestDefinition | TestSuite): item is TestDefinition {
  return (item as TestDefinition).path !== undefined;
}

export function runTestSuites(suites: Array<TestDefinition | TestSuite>) {
  for (const item of suites) {
    if (isTestDefinition(item)) {
      runSingleTest(item);
    } else {
      describe(item.description, () => {
        runTestSuites(item.tests);
      });
    }
  }
}

function runSingleTest(testDef: TestDefinition) {
  const windowSize = { ...defaultWindowSize, ...testDef.configuration };

  test(
    testDef.description,
    useBrowser(windowSize, async browser => {
      const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
      const newScreenshot = await captureScreenshot(browser, newUrl, testDef.setup);

      const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);
      const oldScreenshot = await captureScreenshot(browser, oldUrl, testDef.setup);
      const diffPixels = compareImages(newScreenshot, oldScreenshot);
      expect(diffPixels).toBe(0);
    })
  );
}
