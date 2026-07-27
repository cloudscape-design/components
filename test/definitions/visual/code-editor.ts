// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import VisualTestPageObject from '../page-object';
import { TestSuite } from '../types';

async function waitForAceTheme(page: VisualTestPageObject) {
  // Each test gets a fresh browser session, so CSP is always correct.
  // Ace loads asynchronously — wait for it to initialize and apply the theme.
  const browser = (page as any).browser;
  try {
    await browser.waitUntil(
      () =>
        browser.execute(() => {
          const el: HTMLElement | null = document.querySelector(
            '.ace_editor.ace-dawn, .ace_editor.ace-tomorrow-night-bright'
          );
          return el !== null && el.offsetHeight > 0;
        }),
      { timeout: 30000, timeoutMsg: 'Ace editor with theme class not found or not visible within 30s' }
    );
  } catch (e) {
    // Capture a debug screenshot and page state on failure
    const screenshot = await browser.takeScreenshot();
    const debugInfo = await browser.execute(() => {
      const ace = document.querySelector('.ace_editor');
      const classes = ace ? ace.className : 'NO .ace_editor ELEMENT FOUND';
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      const csp = cspMeta ? cspMeta.getAttribute('content') : 'NO CSP META TAG';
      const url = location.href;
      return { classes, csp, url, bodyHTML: document.body.innerHTML.slice(0, 2000) };
    });
    const { attachment } = await import('allure-js-commons');
    await attachment('debug-screenshot-on-failure', Buffer.from(screenshot, 'base64'), 'image/png');
    await attachment('debug-page-state', JSON.stringify(debugInfo, null, 2), 'application/json');
    throw e;
  }
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
