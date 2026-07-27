// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { TestSuite } from '../types';

async function waitForAceTheme(page: VisualTestPageObject) {
  // Force a full page reload so that the CSP meta tag is re-evaluated
  // with the code-editor hash (which adds worker-src: blob:).
  // Without this, hash-only navigation from a prior test leaves the old CSP
  // in place and ace's web worker is blocked.
  const browser = (page as any).browser;
  // Navigate away and back to guarantee a fresh document load.
  // Unlike location.reload(), this is synchronous from WebdriverIO's
  // perspective — the subsequent browser.url() won't execute until
  // about:blank has fully loaded, ensuring no stale DOM races.
  const currentUrl = await browser.getUrl();
  await browser.url('about:blank');
  await browser.url(currentUrl);
  await page.waitForVisible('.screenshot-area');
  await page.waitForAssertion(async () => {
    const found = await browser.execute(() => {
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
