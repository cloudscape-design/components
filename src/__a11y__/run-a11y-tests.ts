// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { findAllPages } from '../__integ__/utils';
import A11yPageObject from './a11y-page-object';

type Theme = string;
type Mode = 'light' | 'dark';

function setupTest(url: string, testFn: (page: A11yPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new A11yPageObject(browser);
    await browser.url(url);
    await page.waitForVisible('main');
    await testFn(page);
  });
}

function urlFormatter(inputUrl: string, theme: Theme, mode: Mode) {
  return `#/${mode}/${inputUrl}?visualRefresh=${theme.indexOf('visual-refresh') !== -1 ? 'true' : 'false'}`;
}

export default function runA11yTests(theme: Theme, mode: Mode, skip: string[] = []) {
  describe(`A11y checks for ${mode} ${theme}`, () => {
    findAllPages()
      .filter(url => url.includes('area-chart'))
      .forEach(inputUrl => {
        const testFunction =
          [
            ...skip,
            'theming/tokens',
            // this page intentionally has issues to test the helper
            'undefined-texts',
          ].indexOf(inputUrl) === -1
            ? test
            : test.skip;
        const url = urlFormatter(inputUrl, theme, mode);
        testFunction(
          url,
          setupTest(url, page => page.assertNoAxeViolations())
        );
      });
  });
}
