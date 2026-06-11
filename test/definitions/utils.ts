// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { attachment } from 'allure-js-commons';

import { cropAndCompare, parsePng } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject, ScreenshotWithOffset } from '@cloudscape-design/browser-test-tools/page-objects';

import { TestDefinition, TestSuite } from './types';

const screenshotAreaSelector = '.screenshot-area';
const defaultWindowSize = { width: 1600, height: 800 };

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8081';

interface RawCapture {
  /** The raw base64-encoded PNG string from WebDriver (before decoding). */
  rawBase64: string;
  /** The fully parsed screenshot with offset metadata (lazily resolved). */
  screenshot: () => Promise<ScreenshotWithOffset>;
}

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
 * Uses the `application/vnd.allure.image.diff` content type which Allure renders
 * as a side-by-side/overlay comparison widget.
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
 * Attaches a single screenshot to the Allure report for passing tests
 * where both hosts produced identical images.
 */
async function attachScreenshot(rawBase64: string, testName: string): Promise<void> {
  const imageBuffer = Buffer.from(rawBase64, 'base64');
  await attachment(testName, imageBuffer, 'image/png');
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
 * Captures a screenshot and returns both the raw PNG base64 and the parsed result.
 * Having the raw base64 allows a fast byte-equality check before expensive pixel decoding.
 */
async function captureRaw(
  browser: WebdriverIO.Browser,
  page: ScreenshotPageObject,
  url: string,
  testDef: TestDefinition,
  windowSize: { width: number; height: number } | undefined
): Promise<RawCapture> {
  if (windowSize) {
    await browser.setWindowSize(windowSize.width, windowSize.height);
  }
  await browser.url(url);
  await page.waitForVisible(screenshotAreaSelector);
  if (testDef.setup) {
    await testDef.setup(page);
  }

  if (testDef.screenshotType === 'viewport') {
    const { height, width } = await page.getViewportSize();
    const rawBase64 = await browser.takeScreenshot();
    return {
      rawBase64,
      screenshot: async () => {
        const image = await parsePng(rawBase64);
        return { image, offset: { top: 0, left: 0 }, height, width };
      },
    };
  }

  // screenshotArea / permutations — capture by selector with viewportOnly
  const box = await page.getBoundingBox(screenshotAreaSelector);
  const rawBase64 = await browser.takeScreenshot();
  return {
    rawBase64,
    screenshot: async () => {
      const image = await parsePng(rawBase64);
      return { image, offset: { top: box.top, left: box.left }, height: box.height, width: box.width };
    },
  };
}

function registerTest(testDef: TestDefinition, getBrowser: () => WebdriverIO.Browser) {
  test(testDef.description, async () => {
    const browser = getBrowser();
    const windowSize = testDef.configuration ? { ...defaultWindowSize, ...testDef.configuration } : undefined;
    const page = new ScreenshotPageObject(browser);

    const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
    const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);

    const newCapture = await captureRaw(browser, page, newUrl, testDef, windowSize);
    const oldCapture = await captureRaw(browser, page, oldUrl, testDef, windowSize);

    // Fast path: if the raw PNG bytes are identical, the images are guaranteed
    // to be the same. This skips the expensive crop + pixelmatch decode path
    // for the common case (no visual difference).
    if (newCapture.rawBase64 === oldCapture.rawBase64) {
      await attachScreenshot(newCapture.rawBase64, testDef.description);
      return;
    }

    // Raw bytes differ — could be a real diff or just offset/crop differences.
    // Fall through to full pixel comparison.
    const result = await cropAndCompare(await newCapture.screenshot(), await oldCapture.screenshot());

    // Always attach the comparison for visibility in the report.
    await attachDiffImages(result, testDef.description);

    if (result.diffPixels === 0) {
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
        const permResult = await cropAndCompare(newPermutations[i], oldPermutations[i]);
        if (permResult.diffPixels !== 0) {
          await attachDiffImages(permResult, `${testDef.description} [permutation ${i}]`);
        }
        expect(permResult.diffPixels).toBe(0);
      }
      return;
    }

    // For screenshotArea and viewport types, the diff is a real failure.
    expect(result.diffPixels).toBe(0);
  });
}
