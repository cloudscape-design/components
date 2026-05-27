// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { cropAndCompare } from '@cloudscape-design/browser-test-tools/image-utils';
import { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

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
    useBrowser(windowSize, async browser => {
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

      const newArr = Array.isArray(newScreenshots) ? newScreenshots : [newScreenshots];
      const oldArr = Array.isArray(oldScreenshots) ? oldScreenshots : [oldScreenshots];

      expect(newArr.length).toBe(oldArr.length);
      for (let i = 0; i < newArr.length; i++) {
        const { diffPixels } = await cropAndCompare(newArr[i], oldArr[i]);
        expect(diffPixels).toBe(0);
      }
    })
  );
}
