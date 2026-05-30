// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { cropAndCompare } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject, ScreenshotWithOffset } from '@cloudscape-design/browser-test-tools/page-objects';

import { TestDefinition, TestSuite } from './types';

const screenshotAreaSelector = '.screenshot-area';
const defaultWindowSize = { width: 1600, height: 800 };

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8081';

function buildUrl(host: string, path: string, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams(queryParams);
  const qs = params.toString();
  return `${host}/#/${path}${qs ? `?${qs}` : ''}`;
}

function isTestDefinition(item: TestDefinition | TestSuite): item is TestDefinition {
  return (item as TestDefinition).path !== undefined;
}

/**
 * Registers all test suites with a single shared browser session per worker.
 * This avoids the per-test session creation overhead.
 */
export function runTestSuites(suites: Array<TestDefinition | TestSuite>) {
  let browser: WebdriverIO.Browser;

  beforeAll(async () => {
    const { default: getBrowserCreator } = await import('@cloudscape-design/browser-test-tools/browser');
    const creator = getBrowserCreator('ChromeHeadlessIntegration', 'local', {
      seleniumUrl: 'http://localhost:9515',
    });
    browser = await creator.getBrowser({ width: defaultWindowSize.width, height: defaultWindowSize.height });
  });

  afterAll(async () => {
    await browser?.deleteSession();
  });

  registerSuites(suites, () => browser);
}

function registerSuites(suites: Array<TestDefinition | TestSuite>, getBrowser: () => WebdriverIO.Browser) {
  for (const item of suites) {
    if (isTestDefinition(item)) {
      registerTest(item, getBrowser);
    } else {
      describe(item.description, () => {
        registerSuites(item.tests, getBrowser);
      });
    }
  }
}

/**
 * Captures a screenshot based on the test's screenshotType.
 */
async function capture(
  browser: WebdriverIO.Browser,
  page: ScreenshotPageObject,
  url: string,
  testDef: TestDefinition,
  windowSize: { width: number; height: number } | undefined
): Promise<ScreenshotWithOffset> {
  if (windowSize) {
    await browser.setWindowSize(windowSize.width, windowSize.height);
  }
  await browser.url(url);
  await page.waitForVisible(screenshotAreaSelector);
  if (testDef.setup) {
    await testDef.setup(page);
  }
  if (testDef.screenshotType === 'viewport') {
    return page.captureViewport();
  }
  return page.captureBySelector(screenshotAreaSelector, { viewportOnly: true });
}

function registerTest(testDef: TestDefinition, getBrowser: () => WebdriverIO.Browser) {
  test(testDef.description, async () => {
    const browser = getBrowser();
    const windowSize = testDef.configuration ? { ...defaultWindowSize, ...testDef.configuration } : undefined;
    const page = new ScreenshotPageObject(browser);

    const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
    const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);

    const newScreenshot = await capture(browser, page, newUrl, testDef, windowSize);
    const oldScreenshot = await capture(browser, page, oldUrl, testDef, windowSize);
    const { diffPixels } = await cropAndCompare(newScreenshot, oldScreenshot);

    if (diffPixels === 0) {
      return;
    }

    // For permutations pages, a screenshot-area diff might be a false positive
    // caused by content extending beyond the viewport. Re-capture using the
    // full capturePermutations strategy which resizes the window to fit all
    // content and returns individual permutation crops for precise comparison.
    if (testDef.screenshotType === 'permutations') {
      if (windowSize) {
        await browser.setWindowSize(windowSize.width, windowSize.height);
      }
      await browser.url(newUrl);
      await page.waitForVisible(screenshotAreaSelector);
      if (testDef.setup) {
        await testDef.setup(page);
      }
      const newPermutations = await page.capturePermutations();

      if (windowSize) {
        await browser.setWindowSize(windowSize.width, windowSize.height);
      }
      await browser.url(oldUrl);
      await page.waitForVisible(screenshotAreaSelector);
      if (testDef.setup) {
        await testDef.setup(page);
      }
      const oldPermutations = await page.capturePermutations();

      expect(newPermutations.length).toBe(oldPermutations.length);
      for (let i = 0; i < newPermutations.length; i++) {
        const { diffPixels: permDiff } = await cropAndCompare(newPermutations[i], oldPermutations[i]);
        expect(permDiff).toBe(0);
      }
      return;
    }

    // For screenshotArea and viewport types, the diff is a real failure.
    expect(diffPixels).toBe(0);
  });
}
