// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { TestSuite } from '../types';

async function waitForAceTheme(page: VisualTestPageObject) {
  await page.waitForAssertion(async () => {
    const found = await (page as any).browser.execute(() => {
      const el: HTMLElement | null = document.querySelector(
        '.ace_editor.ace-dawn, .ace_editor.ace-tomorrow-night-bright'
      );
      return el !== null && el.offsetHeight > 0;
    });
    if (!found) {
      throw new Error('Ace editor with theme class not found or not visible');
    }
  });
}

const suite: TestSuite = {
  description: 'Code editor',
  componentName: 'code-editor',
  tests: [
    {
      description: 'simple',
      path: 'code-editor/simple',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await waitForAceTheme(page);
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
        await waitForAceTheme(page);
      },
    },
    {
      description: 'permutations',
      path: 'code-editor/permutations',
      screenshotType: 'permutations',
      setup: async ({ page }) => {
        await waitForAceTheme(page);
        await page.waitForVisible('.ace_gutter-cell.ace_gutter-active-line.ace_error');
      },
    },
    {
      description: 'listens to mode change',
      path: 'code-editor/simple',
      screenshotType: 'screenshotArea',
      setup: async ({ page }) => {
        await waitForAceTheme(page);
        await page.click('#mode-toggle');
      },
    },
    {
      description: 'compare simple on small screen',
      path: 'code-editor/simple',
      screenshotType: 'screenshotArea',
      configuration: { width: 360 },
      setup: async ({ page }) => {
        await waitForAceTheme(page);
      },
    },
  ],
};

export default suite;
