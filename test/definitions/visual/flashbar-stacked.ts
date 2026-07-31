// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Flashbar stacked notifications',
  componentName: 'flashbar',
  tests: [380, 450, 600, 1200].flatMap<TestDefinition>(width => [
    {
      description: `${width}px, collapsed`,
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width },
    },
    {
      description: `${width}px, collapsed, notifications bar button focused`,
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width },
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
      },
    },
    {
      description: `${width}px, expanded`,
      path: 'flashbar/collapsible.visual-tests',
      screenshotType: 'screenshotArea',
      configuration: { width },
      setup: async ({ page }) => {
        await page.click('#focus-target');
        await page.focusNextElement();
        await page.keys(['Space']);
        await page.pause(500);
      },
    },
  ]),
};

export default suite;
