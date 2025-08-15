// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../../../lib/components/test-utils/selectors';

import selectors from '../../../../lib/components/flashbar/styles.selectors.js';

export const flashbar = createWrapper().findFlashbar();

export class FlashbarBasePage extends BasePageObject {
  async toggleCollapsedState() {
    const selector = this.getNotificationBar();
    await this.click(selector);
    await this.pause(500);
  }

  countFlashes() {
    return this.getElementsCount(createWrapper().findFlashbar().findItems().toSelector());
  }

  getNotificationBar() {
    return createWrapper().findFlashbar().findByClassName(selectors['notification-bar']).toSelector();
  }

  getExpandButton() {
    return createWrapper().findFlashbar().findByClassName(selectors.button).toSelector();
  }

  getDismissButton() {
    return createWrapper().findFlashbar().findByClassName(selectors['dismiss-button']).toSelector();
  }

  isDismissButtonFocused() {
    const dismissButton = this.getDismissButton();
    return this.isFocused(dismissButton);
  }

  isFlashDismissButtonFocused(index: number) {
    const dismissButton = flashbar.findItems().get(index).findDismissButton().toSelector();
    return this.isFocused(dismissButton);
  }

  async isFlashFocused(index: number) {
    const flash = flashbar.findItems().get(index);
    const container = flash.findByClassName(selectors['flash-focus-container']).toSelector();
    const containerFocused = await this.isFocused(container);
    const dismissButtonFocused = await this.isFlashDismissButtonFocused(index);
    return containerFocused || dismissButtonFocused;
  }
}
