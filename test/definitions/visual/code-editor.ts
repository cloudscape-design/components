// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const ACE_SELECTOR = '.ace_editor.ace-dawn, .ace_editor.ace-tomorrow-night-bright';

const suite: TestSuite = {
  description: 'Code editor',
  componentName: 'code-editor',
  tests: [
    {
      description: 'simple',
      path: 'code-editor/simple',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.waitForVisible(ACE_SELECTOR);
      },
    },
    {
      description: 'error',
      path: 'code-editor/error',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'loading',
      path: 'code-editor/loading',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'theme resolution',
      path: 'code-editor/themes',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.waitForVisible(ACE_SELECTOR);
      },
    },
    {
      description: 'permutations',
      path: 'code-editor/permutations',
      screenshotType: 'permutations',
      setup: async ({ page }) => {
        await page.waitForVisible(ACE_SELECTOR + ' .ace_error');
        await page.waitForVisible('.ace_gutter-cell.ace_gutter-active-line.ace_error');
      },
    },
    {
      description: 'listens to mode change',
      path: 'code-editor/simple',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await page.waitForVisible(ACE_SELECTOR);
        await page.click('#mode-toggle');
      },
    },
    {
      description: 'compare simple on small screen',
      path: 'code-editor/simple',
      screenshotType: 'screenshotArea',
      configuration: { width: 360 },
      setup: async ({ page }) => {
        await page.waitForVisible(ACE_SELECTOR);
      },
    },
  ],
};

export default suite;
