// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import A11yPageObject from './a11y-page-object';

test(
  'undefined texts finder works',
  useBrowser(async browser => {
    const page = new A11yPageObject(browser);
    await browser.url('#/dark/undefined-texts');
    await page.waitForVisible('main');
    await expect(page.getUndefinedTexts()).resolves.toEqual([
      'This page contains undefined strings',
      'aria-label: undefined button',
      'class: undefined',
    ]);
  })
);
