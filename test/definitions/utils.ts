// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { cropAndCompare } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

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

function registerTest(testDef: TestDefinition, getBrowser: () => WebdriverIO.Browser) {
  test(testDef.description, async () => {
    const browser = getBrowser();
    // Only resize if the test needs a non-default window size.
    if (testDef.configuration) {
      const windowSize = { ...defaultWindowSize, ...testDef.configuration };
      await browser.setWindowSize(windowSize.width, windowSize.height);
    }
    const page = new ScreenshotPageObject(browser);

    const capture = async (host: string) => {
      await browser.url(buildUrl(host, testDef.path, testDef.queryParams));
      await page.waitForVisible(screenshotAreaSelector);
      if (testDef.setup) {
        await testDef.setup(page);
      }
      // For screenshotArea pages the element fits in the viewport, so we use
      // viewportOnly to avoid the expensive scroll-and-merge full-page capture.
      // Permutations pages can be taller than the viewport and need the full strategy.
      const viewportOnly = testDef.screenshotType !== 'permutations';
      return page.captureBySelector(screenshotAreaSelector, { viewportOnly });
    };

    const newScreenshot = await capture(newHost);
    const oldScreenshot = await capture(oldHost);

    const { diffPixels } = await cropAndCompare(newScreenshot, oldScreenshot);
    expect(diffPixels).toBe(0);
  });
}
