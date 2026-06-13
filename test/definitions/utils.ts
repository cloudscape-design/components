// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { attachment } from 'allure-js-commons';

import { cropAndCompare, parsePng } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject, ScreenshotWithOffset } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../lib/components/test-utils/selectors';
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

/**
 * A raw screenshot that defers PNG decoding until needed.
 * Allows fast byte-equality comparison on the compressed data.
 */
interface RawScreenshot {
  rawBase64: string;
  offset: { top: number; left: number };
  width: number;
  height: number;
  pixelRatio?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildUrl(host: string, path: string, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams({ motionDisabled: 'true', ...queryParams });
  const qs = params.toString();
  return `${host}/#/${path}${qs ? `?${qs}` : ''}`;
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
  if (testDef.setup) {
    await testDef.setup({ page, wrapper, browser });
  }
}

/**
 * Captures a raw screenshot (base64 + metadata) WITHOUT decoding the PNG.
 * This enables fast comparison on the compressed bytes.
 */
async function captureRaw(
  browser: WebdriverIO.Browser,
  page: ScreenshotPageObject,
  testDef: TestDefinition
): Promise<RawScreenshot> {
  if (testDef.screenshotType === 'viewport') {
    const { height, width } = await page.getViewportSize();
    const rawBase64 = await browser.takeScreenshot();
    return { rawBase64, offset: { top: 0, left: 0 }, width, height };
  }

  // screenshotArea or permutations: full-page screenshot with offset
  const { pixelRatio } = await page.getViewportSize();
  const box = await page.getBoundingBox(screenshotAreaSelector);
  const rawBase64 = await page.fullPageScreenshot();
  return { rawBase64, offset: { top: box.top, left: box.left }, width: box.width, height: box.height, pixelRatio };
}

/**
 * Decodes a RawScreenshot into a ScreenshotWithOffset for cropAndCompare.
 */
async function decodeRaw(raw: RawScreenshot): Promise<ScreenshotWithOffset> {
  const image = await parsePng(raw.rawBase64);
  return { image, offset: raw.offset, width: raw.width, height: raw.height, pixelRatio: raw.pixelRatio };
}

/**
 * Compares two raw screenshots. If the compressed bytes are identical,
 * skips the expensive parsePng + cropAndCompare pipeline entirely.
 */
async function compareScreenshots(newRaw: RawScreenshot, oldRaw: RawScreenshot): Promise<CropAndCompareResult> {
  // Fast path: identical compressed PNG bytes → images are the same.
  // Skips parsePng (~300-1200ms) and packPng (~6000-45000ms).
  if (newRaw.rawBase64 === oldRaw.rawBase64) {
    const imageBuffer = Buffer.from(newRaw.rawBase64, 'base64');
    return { firstImage: imageBuffer, secondImage: imageBuffer, diffImage: null, isEqual: true, diffPixels: 0 };
  }

  // Slow path: decode and do full pixel comparison.
  const [newScreenshot, oldScreenshot] = await Promise.all([decodeRaw(newRaw), decodeRaw(oldRaw)]);
  return cropAndCompare(newScreenshot, oldScreenshot);
}

/**
 * Similar to page.capturePermutations() but returns raw base64 per permutation
 * without decoding the shared full-page PNG upfront. Decoding is deferred until
 * an actual difference is detected.
 */
async function capturePermutationsRaw(
  browser: WebdriverIO.Browser,
  page: ScreenshotPageObject
): Promise<RawScreenshot[]> {
  // Replicates the logic from ScreenshotPageObject.capturePermutations()
  // but keeps the screenshot as raw base64 instead of decoding it.
  await page.windowScrollTo({ top: 0, left: 0 });

  // Fit window height to page content
  const originalWindowSize = await browser.getWindowSize();
  const dims: { viewportHeight: number; pageHeight: number } = await browser.execute(function () {
    return { viewportHeight: window.innerHeight, pageHeight: document.documentElement.scrollHeight };
  });
  const windowUIHeight = originalWindowSize.height - dims.viewportHeight;
  await browser.setWindowSize(originalWindowSize.width, dims.pageHeight + windowUIHeight);

  // Get permutation sizes
  const permutations: Array<{ id: string; width: number; height: number; offset: { top: number; left: number } }> =
    await browser.execute(function () {
      const elements = document.querySelectorAll('[data-testid="permutation"]');
      return Array.from(elements).map(function (el) {
        const rect = el.getBoundingClientRect();
        return {
          id: el.getAttribute('data-permutation-id') || `${rect.top}-${rect.left}`,
          width: rect.width,
          height: rect.height,
          offset: { top: rect.top, left: rect.left },
        };
      });
    });

  if (permutations.length === 0) {
    throw new Error('No permutations found on current page.');
  }

  // Take full page screenshot (raw base64, NOT decoded)
  const rawBase64 = await page.fullPageScreenshot();

  // Restore window size
  await browser.setWindowSize(originalWindowSize.width, originalWindowSize.height);

  // Return one RawScreenshot per permutation — they all share the same rawBase64
  // but have different offsets/sizes for cropping later if needed.
  return permutations.map(p => ({
    rawBase64,
    offset: p.offset,
    width: p.width,
    height: p.height,
  }));
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
    const browser = getBrowser();
    const page = new ScreenshotPageObject(browser);

    const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
    const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);

    if (testDef.screenshotType === 'permutations') {
      // Capture permutations as raw (no PNG decode)
      await preparePage(browser, page, newUrl, testDef, testDef.configuration);
      const newPerms = await capturePermutationsRaw(browser, page);

      await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
      const oldPerms = await capturePermutationsRaw(browser, page);

      expect(newPerms.length).toBe(oldPerms.length);

      // All permutations share the same full-page screenshot raw base64.
      // If the full-page screenshots are byte-identical, ALL permutations pass.
      if (newPerms.length > 0 && newPerms[0].rawBase64 === oldPerms[0].rawBase64) {
        return;
      }

      // Full-page differs — decode and compare individual permutations.
      const permFailures: number[] = [];
      const attachmentPromises: Promise<void>[] = [];
      for (let i = 0; i < newPerms.length; i++) {
        const permResult = await compareScreenshots(newPerms[i], oldPerms[i]);
        if (permResult.diffPixels !== 0) {
          attachmentPromises.push(attachDiffImages(permResult, `Permutation #${i + 1}`));
          permFailures.push(i);
        }
      }
      await Promise.all(attachmentPromises);
      expect(permFailures).toEqual([]);
      return;
    }

    // Non-permutation: single screenshot comparison
    await preparePage(browser, page, newUrl, testDef, testDef.configuration);
    const newRaw = await captureRaw(browser, page, testDef);

    await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
    const oldRaw = await captureRaw(browser, page, testDef);

    const result = await compareScreenshots(newRaw, oldRaw);
    await attachDiffImages(result, testDef.description);
    expect(result.diffPixels).toBe(0);
  });
}
