// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const widths = [380, 450, 600, 1200];

const suite: TestSuite = {
  description: 'Flashbar stacked notifications',
  componentName: 'flashbar',
  tests: widths.flatMap<TestDefinition>(width => [
    {
      description: `${width}px, collapsed`,
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
    },
    {
      description: `${width}px, collapsed, notifications bar button focused`,
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: `${width}px, expanded`,
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
      pixelDiffTolerance: 5,
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['Space']);
        await page.waitForJsTimers(500);
      },
    },
  ]),
};

export default suite;
