// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { findAllPages } from '../__integ__/utils';
import { getUrlParams } from '../app-layout/__integ__/utils';
import A11yPageObject from './a11y-page-object';

const EXCLUDED_PAGES = [
  // Test page for an app layout nested inside another through an iframe.
  // Not a use case that's encouraged.
  'app-layout/multi-layout-global-drawer-child-layout',
];

describe('A11y checks for app layout toolbar', () => {
  findAllPages()
    .filter(page => page.startsWith('app-layout') && !EXCLUDED_PAGES.includes(page))
    .forEach(inputUrl => {
      const url = `#/light/${inputUrl}?${getUrlParams('refresh-toolbar')}`;
      test(
        `${url}`,
        useBrowser(async browser => {
          const page = new A11yPageObject(browser);
          await browser.url(url);
          await page.waitForVisible('main');
          await page.assertNoAxeViolations();
        })
      );
    });
});
