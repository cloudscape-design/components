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

const isSafari = process.env.BROWSER === 'safari';

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
 * This avoids the per-test session creation overhead that made tests slow.
 * Safari runs with maxWorkers: 1, so there's only ever one session.
 */
export function runTestSuites(suites: Array<TestDefinition | TestSuite>) {
  let browser: WebdriverIO.Browser;

  beforeAll(async () => {
    const { default: getBrowserCreator } = await import('@cloudscape-design/browser-test-tools/browser');
    const browserName = isSafari ? 'Safari' : 'ChromeHeadlessIntegration';
    const seleniumUrl = isSafari ? 'http://localhost:4444' : 'http://localhost:9515';
    const creator = getBrowserCreator(browserName, 'local', { seleniumUrl });
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
  const windowSize = { ...defaultWindowSize, ...testDef.configuration };

  test(testDef.description, async () => {
    const browser = getBrowser();
    await browser.setWindowSize(windowSize.width, windowSize.height);
    const page = new ScreenshotPageObject(browser);

    const capture = async (host: string) => {
      await browser.url(buildUrl(host, testDef.path, testDef.queryParams));
      await page.waitForVisible(screenshotAreaSelector);
      if (testDef.setup) {
        await testDef.setup(page);
      }
      return testDef.screenshotType === 'permutations'
        ? page.capturePermutations()
        : page.captureBySelector(screenshotAreaSelector);
    };

    const newScreenshots = await capture(newHost);
    const oldScreenshots = await capture(oldHost);

    const newArr: ScreenshotWithOffset[] = Array.isArray(newScreenshots) ? newScreenshots : [newScreenshots];
    const oldArr: ScreenshotWithOffset[] = Array.isArray(oldScreenshots) ? oldScreenshots : [oldScreenshots];

    expect(newArr.length).toBe(oldArr.length);
    for (let i = 0; i < newArr.length; i++) {
      const { diffPixels } = await cropAndCompare(newArr[i], oldArr[i]);
      expect(diffPixels).toBe(0);
    }
  });
}
