// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { parsePng } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { TestDefinition, TestSuite } from '../types';

const screenshotAreaSelector = '.screenshot-area';
const defaultWindowSize = { width: 1600, height: 800 };

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8081';

/**
 * Captures the .screenshot-area element on a focused page.
 * Uses a standard ScreenshotPageObject (no forced scroll-and-merge).
 */
async function captureScreenshotArea(browser: WebdriverIO.Browser, url: string): Promise<PNG> {
  await browser.url(url);
  const page = new ScreenshotPageObject(browser);
  await page.waitForVisible(screenshotAreaSelector);
  const { image } = await page.captureBySelector(screenshotAreaSelector);
  return image;
}

/**
 * Captures the full page as a PNG for permutation pages.
 * Uses fullPageScreenshot which handles pages taller than the viewport.
 */
async function capturePermutations(browser: WebdriverIO.Browser, url: string): Promise<PNG> {
  await browser.url(url);
  const page = new ScreenshotPageObject(browser);
  await page.waitForVisible(screenshotAreaSelector);
  const base64 = await page.fullPageScreenshot();
  return parsePng(base64);
}

async function captureScreenshot(
  browser: WebdriverIO.Browser,
  url: string,
  testDef: TestDefinition,
  setup?: (page: ScreenshotPageObject) => Promise<void>
): Promise<PNG> {
  if (setup) {
    await browser.url(url);
    const page = new ScreenshotPageObject(browser);
    await page.waitForVisible(screenshotAreaSelector);
    await setup(page);
    if (testDef.screenshotType === 'permutations') {
      const base64 = await page.fullPageScreenshot();
      return parsePng(base64);
    }
    const { image } = await page.captureBySelector(screenshotAreaSelector);
    return image;
  }
  if (testDef.screenshotType === 'permutations') {
    return capturePermutations(browser, url);
  }
  return captureScreenshotArea(browser, url);
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
    // useBrowser is not a React hook, despite the name
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBrowser(windowSize, async browser => {
      const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
      const newScreenshot = await captureScreenshot(browser, newUrl, testDef, testDef.setup);

      const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);
      const oldScreenshot = await captureScreenshot(browser, oldUrl, testDef, testDef.setup);
      const diffPixels = compareImages(newScreenshot, oldScreenshot);
      expect(diffPixels).toBe(0);
    })
  );
}

// Export the capture functions for use in custom setup callbacks if needed.
export { captureScreenshotArea, capturePermutations };
