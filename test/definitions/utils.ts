// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { attachment } from 'allure-js-commons';

import { cropAndCompare, parsePng } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../lib/components/test-utils/selectors';
import { OptimizedPageObject, RawScreenshot } from './optimized-page-object';
import { TestDefinition, TestSuite } from './types';

const screenshotAreaSelector = '.screenshot-area';
const defaultWindowSize = { width: 1200, height: 800 };

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8081';

const wrapper = createWrapper();

// ─── Types ───────────────────────────────────────────────────────────────────

interface CropAndCompareResult {
  firstImage: Buffer;
  secondImage: Buffer;
  diffImage: Buffer | null;
  isEqual: boolean;
  diffPixels: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildUrl(host: string, path: string, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams({ motionDisabled: 'true', ...queryParams });
  const qs = params.toString();
  return `${host}#/${path}${qs ? `?${qs}` : ''}`;
}

function isTestDefinition(item: TestDefinition | TestSuite): item is TestDefinition {
  return (item as TestDefinition).path !== undefined;
}

/**
 * Attaches a visual comparison to the Allure report.
 */
async function attachDiffImages(result: CropAndCompareResult, testName: string): Promise<void> {
  const diffPayload = JSON.stringify({
    expected: `data:image/png;base64,${result.secondImage.toString('base64')}`,
    actual: `data:image/png;base64,${result.firstImage.toString('base64')}`,
    diff: result.diffImage ? `data:image/png;base64,${result.diffImage.toString('base64')}` : undefined,
  });

  await attachment(testName, diffPayload, 'application/vnd.allure.image.diff');
}

// ─── Capture functions ───────────────────────────────────────────────────────

/**
 * Navigates to a URL, waits for the screenshot area, and runs setup.
 */
async function preparePage(
  browser: WebdriverIO.Browser,
  page: ScreenshotPageObject,
  url: string,
  testDef: TestDefinition,
  windowSize?: { width?: number; height?: number }
): Promise<void> {
  await browser.setWindowSize(
    windowSize?.width ?? defaultWindowSize.width,
    windowSize?.height ?? defaultWindowSize.height
  );
  await browser.url(url);
  await page.waitForVisible(screenshotAreaSelector);
  await page.waitForJsTimers(100);
  if (testDef.setup) {
    await testDef.setup({ page, wrapper, browser });
  }
}

/**
 * Captures a raw screenshot (base64 + metadata) WITHOUT decoding the PNG.
 * Uses takeElementScreenshot for the screenshot area to avoid full-page capture.
 */
function captureRaw(page: OptimizedPageObject, testDef: TestDefinition): Promise<RawScreenshot> {
  if (testDef.screenshotType === 'viewport') {
    return page.captureViewportRaw();
  }
  return page.captureSelectorRaw(screenshotAreaSelector);
}

/**
 * Compares two raw screenshots. If the compressed bytes are identical,
 * skips the expensive parsePng + cropAndCompare pipeline entirely.
 */
async function compareScreenshots(newRaw: RawScreenshot, oldRaw: RawScreenshot): Promise<CropAndCompareResult> {
  // Fast path: identical compressed PNG bytes → images are the same.
  if (newRaw.rawBase64 === oldRaw.rawBase64) {
    const imageBuffer = Buffer.from(newRaw.rawBase64, 'base64');
    return { firstImage: imageBuffer, secondImage: imageBuffer, diffImage: null, isEqual: true, diffPixels: 0 };
  }

  // Images differ — decode and run pixelmatch to produce a diff image for the Allure report.
  // This only runs for failing tests, so the cost is acceptable.
  const firstPng = await parsePng(newRaw.rawBase64);
  const secondPng = await parsePng(oldRaw.rawBase64);

  // No cropping needed since takeElementScreenshot already produces cropped images.
  const firstScreenshot = {
    image: firstPng,
    offset: { top: 0, left: 0 },
    width: firstPng.width,
    height: firstPng.height,
  };

  const secondScreenshot = {
    image: secondPng,
    offset: { top: 0, left: 0 },
    width: secondPng.width,
    height: secondPng.height,
  };
  return cropAndCompare(firstScreenshot, secondScreenshot);
}

// ─── Test runner ─────────────────────────────────────────────────────────────

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

function registerTest(testDef: TestDefinition, getBrowser: () => WebdriverIO.Browser) {
  test(testDef.description, async () => {
    const tolerance = testDef.pixelDiffTolerance ?? 0;
    const browser = getBrowser();
    const page = new OptimizedPageObject(browser);

    const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
    const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);

    if (testDef.screenshotType === 'permutations') {
      // Capture permutations as raw (no PNG decode)
      await preparePage(browser, page, newUrl, testDef, testDef.configuration);
      const newPerms = await page.capturePermutationsRaw();

      await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
      const oldPerms = await page.capturePermutationsRaw();

      expect(newPerms.length).toBe(oldPerms.length);

      // Compare each permutation individually and attach results.
      const permFailures: number[] = [];
      const attachmentPromises: Promise<void>[] = [];
      for (let i = 0; i < newPerms.length; i++) {
        const permResult = await compareScreenshots(newPerms[i], oldPerms[i]);
        attachmentPromises.push(attachDiffImages(permResult, `Permutation #${i.toString().padStart(3, '0')}`));
        if (permResult.diffPixels > tolerance) {
          permFailures.push(i);
        }
      }
      await Promise.all(attachmentPromises);
      expect(permFailures).toEqual([]);
      return;
    }

    // Non-permutation: single screenshot comparison
    await preparePage(browser, page, newUrl, testDef, testDef.configuration);
    const newRaw = await captureRaw(page, testDef);

    await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
    const oldRaw = await captureRaw(page, testDef);

    const result = await compareScreenshots(newRaw, oldRaw);
    await attachDiffImages(result, testDef.description);
    expect(result.diffPixels).toBeLessThanOrEqual(tolerance);
  });
}
