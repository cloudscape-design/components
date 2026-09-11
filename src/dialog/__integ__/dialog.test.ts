// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const dialogSelector = wrapper.findDialog().toSelector();
const dismissButtonSelector = wrapper.findDialog().findDismissButton().toSelector();
const triggerSelector = wrapper.findButton('[data-testid="dialog-trigger"]').toSelector();
const focusTargetSelector = wrapper.findButton('[data-testid="focus-target"]').toSelector();

class DialogPage extends BasePageObject {
  async dismissDialog() {
    await this.click(dismissButtonSelector);
  }
}

describe('Dialog focus restoration', () => {
  test(
    'moves focus into Dialog and returns it to the trigger',
    useBrowser(async browser => {
      await browser.url('#/light/dialog/simple');
      const page = new DialogPage(browser);
      await page.waitForVisible(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForVisible(dialogSelector);
      await expect(page.isFocused(dismissButtonSelector)).resolves.toBe(true);
      await page.dismissDialog();

      await expect(page.isFocused(triggerSelector)).resolves.toBe(true);
    })
  );

  test(
    'consumer restores focus when the trigger is removed',
    useBrowser(async browser => {
      await browser.url('#/light/dialog/simple?removeTrigger=true');
      const page = new DialogPage(browser);
      await page.waitForVisible(triggerSelector);

      await page.click(triggerSelector);
      await page.waitForVisible(dialogSelector);
      await page.dismissDialog();

      await expect(page.isFocused(focusTargetSelector)).resolves.toBe(true);
    })
  );

  test(
    'consumer restores focus after programmatic opening',
    useBrowser(async browser => {
      await browser.url('#/light/dialog/simple?dialogOpen=true&removeTrigger=true');
      const page = new DialogPage(browser);
      await page.waitForVisible(dialogSelector);

      await page.dismissDialog();

      await expect(page.isFocused(focusTargetSelector)).resolves.toBe(true);
    })
  );
});
