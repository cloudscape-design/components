// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';

class RuntimeContentPage extends BasePageObject {
  async rerenderAlerts() {
    await this.click(createWrapper().findCheckbox('[data-testid="unmount-all"]').findNativeInput().toSelector());
    await this.keys(['Space']);
  }
}

function setupTest(testFn: (page: RuntimeContentPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new RuntimeContentPage(browser);
    await browser.url('#/light/alert/runtime-content/?autofocus=true');
    await page.waitForVisible('.screenshot-area');
    await testFn(page);
  });
}

test(
  'should focus the alert',
  setupTest(async page => {
    await page.rerenderAlerts();

    await expect(page.getFocusedElementText()).resolves.toEqual(expect.stringContaining('---REPLACEMENT---'));
    // (make sure entire page isn't focused)
    await expect(page.getFocusedElementText()).resolves.toEqual(expect.not.stringContaining('Header'));
  })
);
