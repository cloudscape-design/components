// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RawScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../lib/components/test-utils/selectors';

const nativeInputSelector = createWrapper().findAutosuggest().findNativeInput().toSelector();

/**
 * Extended page object for visual regression tests.
 */
export default class VisualTestPageObject extends RawScreenshotPageObject {
  /**
   * Dispatches a focusin event on all autosuggest native inputs to open their dropdowns.
   * Uses focusin (which bubbles) because React's event delegation listens for it.
   */
  async focusInputs(): Promise<void> {
    await this.waitForVisible(nativeInputSelector);
    await this.browser.execute(function (selector: string) {
      document.querySelectorAll(selector).forEach(function (input) {
        input.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));
      });
    }, nativeInputSelector);
    await this.waitForJsTimers(500);
  }
}
