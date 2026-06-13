// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { attachment } from 'allure-js-commons';

import { ScreenshotPageObject, ScreenshotWithOffset } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../lib/components/test-utils/selectors';
import { instrumentedCropAndCompare, InstrumentedPageObject } from './instrumented-page-object';
import { TestDefinition, TestSuite } from './types';

const screenshotAreaSelector = '.screenshot-area';
const defaultWindowSize = { width: 1200, height: 800 };

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8081';

const wrapper = createWrapper();

function buildUrl(host: string, path: string, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams({ motionDisabled: 'true', ...queryParams });
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
  windowSize?: { width?: number; height?: number }
): Promise<void> {
  await browser.setWindowSize(
    windowSize?.width ?? defaultWindowSize.width,
    windowSize?.height ?? defaultWindowSize.height
  );
  await browser.url(url);
  await page.waitForVisible(screenshotAreaSelector);
  if (testDef.setup) {
    return testDef.setup({ page, wrapper, browser });
  }
}

/**
 * Captures a screenshot based on the test's screenshotType.
 */
function capture(page: ScreenshotPageObject, testDef: TestDefinition): Promise<ScreenshotWithOffset> {
  if (testDef.screenshotType === 'viewport') {
    return page.captureViewport();
  }
  return page.captureBySelector(screenshotAreaSelector);
}

function registerTest(testDef: TestDefinition, getBrowser: () => WebdriverIO.Browser) {
  test(testDef.description, async () => {
    const testStart = performance.now();
    const browser = getBrowser();
    const page = new InstrumentedPageObject(browser);
    page.setLabel(testDef.description);

    const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
    const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);

    let t = performance.now();
    await preparePage(browser, page, newUrl, testDef, testDef.configuration);
    console.log(`  ⏱ [${testDef.description}] preparePage(new): ${(performance.now() - t).toFixed(0)}ms`);

    t = performance.now();
    const newScreenshot = await capture(page, testDef);
    console.log(`  ⏱ [${testDef.description}] capture(new): ${(performance.now() - t).toFixed(0)}ms`);

    t = performance.now();
    await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
    console.log(`  ⏱ [${testDef.description}] preparePage(old): ${(performance.now() - t).toFixed(0)}ms`);

    t = performance.now();
    const oldScreenshot = await capture(page, testDef);
    console.log(`  ⏱ [${testDef.description}] capture(old): ${(performance.now() - t).toFixed(0)}ms`);

    t = performance.now();
    const result = await instrumentedCropAndCompare(newScreenshot, oldScreenshot);
    console.log(
      `  ⏱ [${testDef.description}] cropAndCompare: ${(performance.now() - t).toFixed(0)}ms (diffPixels=${result.diffPixels})`
    );

    if (testDef.screenshotType === 'permutations') {
      if (result.diffPixels === 0) {
        console.log(
          `  ⏱ [${testDef.description}] TOTAL: ${(performance.now() - testStart).toFixed(0)}ms (pass, no permutation re-capture needed)`
        );
        return;
      }

      t = performance.now();
      await preparePage(browser, page, newUrl, testDef, testDef.configuration);
      const newPermutations = await page.capturePermutations();
      console.log(`  ⏱ [${testDef.description}] capturePermutations(new): ${(performance.now() - t).toFixed(0)}ms`);

      t = performance.now();
      await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
      const oldPermutations = await page.capturePermutations();
      console.log(`  ⏱ [${testDef.description}] capturePermutations(old): ${(performance.now() - t).toFixed(0)}ms`);

      expect(newPermutations.length).toBe(oldPermutations.length);
      const permFailures: number[] = [];
      const attachmentPromises: Promise<void>[] = [];

      t = performance.now();
      for (let i = 0; i < newPermutations.length; i++) {
        const permResult = await instrumentedCropAndCompare(newPermutations[i], oldPermutations[i]);
        attachmentPromises.push(attachDiffImages(permResult, `Permutation #${i + 1}`));
        if (permResult.diffPixels !== 0) {
          permFailures.push(i);
        }
      }
      console.log(
        `  ⏱ [${testDef.description}] comparePermutations(${newPermutations.length}): ${(performance.now() - t).toFixed(0)}ms`
      );

      t = performance.now();
      await Promise.all(attachmentPromises);
      console.log(
        `  ⏱ [${testDef.description}] attachPermutations(${newPermutations.length}): ${(performance.now() - t).toFixed(0)}ms`
      );

      console.log(`  ⏱ [${testDef.description}] TOTAL: ${(performance.now() - testStart).toFixed(0)}ms`);
      expect(permFailures).toEqual([]);
      return;
    }

    // Always attach for visibility in the Allure report.
    t = performance.now();
    await attachDiffImages(result, testDef.description);
    console.log(`  ⏱ [${testDef.description}] attachDiffImages: ${(performance.now() - t).toFixed(0)}ms`);

    console.log(`  ⏱ [${testDef.description}] TOTAL: ${(performance.now() - testStart).toFixed(0)}ms`);
    expect(result.diffPixels).toBe(0);
  });
}
