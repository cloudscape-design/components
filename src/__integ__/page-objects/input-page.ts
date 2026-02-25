// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

export class InputPage extends BasePageObject {
  selector = '';

  focusInput() {
    return this.click(this.selector);
  }

  getCursorPosition() {
    return this.browser.execute(defaultSelector => {
      return (document.querySelector(defaultSelector) as HTMLInputElement).selectionStart;
    }, this.selector);
  }

  setCursorPosition(startPosition: number, endPosition: number) {
    return this.browser.execute(
      (defaultSelector, startPosition, endPosition) => {
        return (document.querySelector(defaultSelector) as HTMLInputElement).setSelectionRange(
          startPosition,
          endPosition
        );
      },
      defaultSelector,
      startPosition,
      endPosition
    );
  }

  async type(text: string) {
    // `await this.keys(text);` doesn't work as it key presses too quickly and doesn't
    // allow the separator to be appended so the cursor position gets messed up.
    for (let k = 0; k < text.length; k++) {
      await this.keys(text[k]);
    }
  }

  async clearInput() {
    const value = (await this.getValue(defaultSelector)) ?? '';

    if (typeof value === 'string') {
      await this.focusInput();
      await this.keys('End');
      for (let k = 0; k < value.length; k++) {
        await this.keys('Backspace');
      }
    }
  }

  waitForLoad() {
    return this.waitForVisible(defaultSelector);
  }
}
