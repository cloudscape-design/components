// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ScreenshotBasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

/**
 * Extended page object for visual regression tests.
 * Adds helper methods that were available in the IntegrationTests page object.
 */
export default class VisualTestPageObject extends ScreenshotBasePageObject {
  /**
   * Dispatches a focus event on all input elements in the page.
   * Useful for triggering dropdown opens in permutation pages.
   */
  async focusInputs(): Promise<void> {
    await this.browser.execute(function () {
      Array.prototype.forEach.call(document.querySelectorAll('input'), function (inputElement: HTMLInputElement) {
        const ev = new FocusEvent('focus');
        inputElement.dispatchEvent(ev);
      });
    });
    // Wait until dropdown auto-reposition timeout ends
    await this.waitForJsTimers(500);
  }
}
