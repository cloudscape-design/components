// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RawScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

export default class VisualTestPageObject extends RawScreenshotPageObject {
  /**
   * Dispatches a focusin event on all input elements in the page to open their dropdowns.
   * Uses focusin (which bubbles) because React's event delegation listens for it.
   */
  async focusInputs(): Promise<void> {
    await this.browser.execute(function () {
      document.querySelectorAll('input').forEach(function (input) {
        input.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));
      });
    });
    await this.waitForJsTimers(500);
  }
}
