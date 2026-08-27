// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RawScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

/**
 * Extended page object for visual regression tests.
 * Adds helper methods that were available in the IntegrationTests page object.
 */
export default class VisualTestPageObject extends RawScreenshotPageObject {
  /**
   * Dispatches a focusin event on all input elements to open their dropdowns.
   * Uses focusin (which bubbles) because React's event delegation listens for it.
   * Targets native `input` elements to avoid dependency on test-utils selectors
   * which may differ between the PR and baseline builds.
   */
  async focusInputs(): Promise<void> {
    await this.waitForVisible('input');
    await this.browser.execute(function () {
      document.querySelectorAll('input').forEach(function (input) {
        input.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));
      });
    });
    await this.waitForJsTimers(500);
  }
}
