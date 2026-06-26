// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { attachment, step } from 'allure-js-commons';

import createWrapper from '../../lib/components/test-utils/selectors';
import { RawScreenshotPageObject } from './raw-screenshot-page-object';
import {
  captureSingleScreenshot,
  compareScreenshots,
  CropAndCompareResult,
  screenshotAreaSelector,
} from './screenshot-utils';
import { TestDefinition, TestSuite } from './types';
const defaultWindowSize = { width: 1200, height: 800 };

const tolerance = 0;

// NEW_HOST serves the PR's pages, OLD_HOST serves the baseline (main) pages.
const newHost = process.env.NEW_HOST || 'http://localhost:8080';
const oldHost = process.env.OLD_HOST || 'http://localhost:8080';

const wrapper = createWrapper();

function buildUrl(host: string, path: string, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams({ motionDisabled: 'true', ...queryParams });
  const qs = params.toString();
  return `${host}#/${path}?${qs}`;
}

function isTestDefinition(item: TestDefinition | TestSuite): item is TestDefinition {
  return (item as TestDefinition).path !== undefined;
}

// Attaches a visual comparison to the Allure report.
async function attachDiffImages(result: CropAndCompareResult, testName: string): Promise<void> {
  const diffPayload = JSON.stringify({
    expected: `data:image/png;base64,${result.secondImage.toString('base64')}`,
    actual: `data:image/png;base64,${result.firstImage.toString('base64')}`,
    diff: result.diffImage ? `data:image/png;base64,${result.diffImage.toString('base64')}` : undefined,
  });

  await attachment(testName, diffPayload, 'application/vnd.allure.image.diff');
}

async function preparePage(
  browser: WebdriverIO.Browser,
  page: RawScreenshotPageObject,
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
    const page = new RawScreenshotPageObject(browser);

    const newUrl = buildUrl(newHost, testDef.path, testDef.queryParams);
    const oldUrl = buildUrl(oldHost, testDef.path, testDef.queryParams);

    if (testDef.screenshotType === 'permutations') {
      await preparePage(browser, page, newUrl, testDef, testDef.configuration);
      const newPermutations = await page.capturePermutations();

      await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
      const oldPermutations = await page.capturePermutations();

      expect(newPermutations.length).toBe(oldPermutations.length);

      // Compare each permutation individually, wrapping each in an Allure step.
      let failures = 0;
      for (let i = 0; i < newPermutations.length; i++) {
        const id = newPermutations[i].id || '';
        const index = `#${(i + 1).toString().padStart(3, '0')}`;
        await step(`Permutation ${index}`, async () => {
          const permResult = await compareScreenshots(newPermutations[i], oldPermutations[i]);
          await attachDiffImages(permResult, index);
          if (permResult.diffPixels > tolerance) {
            failures++;
            throw new Error(`Permutation ${index} differs by ${permResult.diffPixels} pixels\n${id}`);
          }
        });
      }
      expect(failures).toBe(0);
      return;
    }

    // Non-permutation: single screenshot comparison
    await preparePage(browser, page, newUrl, testDef, testDef.configuration);
    const newRaw = await captureSingleScreenshot(page, testDef);

    await preparePage(browser, page, oldUrl, testDef, testDef.configuration);
    const oldRaw = await captureSingleScreenshot(page, testDef);

    const result = await compareScreenshots(newRaw, oldRaw);
    await attachDiffImages(result, testDef.description);
    expect(result.diffPixels).toBeLessThanOrEqual(tolerance);
  });
}
