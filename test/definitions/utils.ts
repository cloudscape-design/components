// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { attachment } from 'allure-js-commons';

import { cropAndCompare } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject, ScreenshotWithOffset } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../lib/components/test-utils/selectors';
import { TestDefinition, TestSuite } from './types';

const screenshotAreaSelector = '.screenshot-area';
const defaultWindowSize = { width: 1200, height: 800 };

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8081';

const wrapper = createWrapper();

function buildUrl(host: string, path: string, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams(queryParams);
  const qs = params.toString();
  return `${host}/#/${path}${qs ? `?${qs}` : ''}`;
}

function isTestDefinition(item: TestDefinition | TestSuite): item is TestDefinition {
  return (item as TestDefinition).path !== undefined;
}

/**
 * Attaches a visual comparison to the Allure report using the built-in image diff viewer.
 */
async function attachDiffImages(
  result: { firstImage: Buffer; secondImage: Buffer; diffImage: Buffer | null },
  testName: string
): Promise<void> {
  const diffPayload = JSON.stringify({
    expected: `data:image/png;base64,${result.secondImage.toString('base64')}`,
    actual: `data:image/png;base64,${result.firstImage.toString('base64')}`,
    diff: result.diffImage ? `data:image/png;base64,${result.diffImage.toString('base64')}` : undefined,
  });

  await attachment(testName, diffPayload, {
    contentType: 'application/vnd.allure.image.diff',
    fileExtension: 'imagediff',
  } as any);
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
 * Navigates to a URL, waits for the screenshot area, and runs any setup interactions.
 */
async function preparePage(
  browser: WebdriverIO.Browser,
  page: ScreenshotPageObject,
  url: string,
  testDef: TestDefinition,
  windowSize: { width: number; height: number } | undefined
): Promise<void> {
  if (windowSize) {
    await browser.setWindowSize(windowSize.width, windowSize.height);
  }
  await browser.url(url);
  await page.waitForVisible(screenshotAreaSelector);
  if (testDef.setup) {
    await testDef.setup(page, wrapper);
  }
}

/**
 * Captures a screenshot based on the test's screenshotType.
 */
function capture(page: ScreenshotPageObject, testDef: TestDefinition): Promise<ScreenshotWithOffset> {
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

    // For permutations, go directly to capturePermutations (no extra navigation).
    if (testDef.screenshotType === 'permutations') {
      await preparePage(browser, page, newUrl, testDef, windowSize);
      const newPermutations = await page.capturePermutations();

      await preparePage(browser, page, oldUrl, testDef, windowSize);
      const oldPermutations = await page.capturePermutations();

      expect(newPermutations.length).toBe(oldPermutations.length);
      const permFailures: number[] = [];
      const attachmentPromises: Promise<void>[] = [];
      for (let i = 0; i < newPermutations.length; i++) {
        const permResult = await cropAndCompare(newPermutations[i], oldPermutations[i]);
        attachmentPromises.push(attachDiffImages(permResult, `Permutation #${i + 1}`));
        if (permResult.diffPixels !== 0) {
          permFailures.push(i);
        }
      }
      await Promise.all(attachmentPromises);
      expect(permFailures).toEqual([]);
      return;
    }

    // For screenshotArea and viewport: capture from both hosts and compare.
    await preparePage(browser, page, newUrl, testDef, windowSize);
    const newScreenshot = await capture(page, testDef);

    await preparePage(browser, page, oldUrl, testDef, windowSize);
    const oldScreenshot = await capture(page, testDef);

    const result = await cropAndCompare(newScreenshot, oldScreenshot);

    // Always attach for visibility in the Allure report.
    await attachDiffImages(result, testDef.description);

    expect(result.diffPixels).toBe(0);
  });
}
