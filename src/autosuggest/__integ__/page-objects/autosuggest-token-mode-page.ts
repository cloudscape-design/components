// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../../lib/components/test-utils/selectors';
import AutosuggestPage from './autosuggest-page';

export default class AutosuggestTokenModePage extends AutosuggestPage {
  get scope() {
    return '[data-testid="interactive-demo"]';
  }

  private get scopedWrapper() {
    return createWrapper(this.scope).findAutosuggest()!;
  }

  get scopedInputSelector() {
    return `${this.scope} input[role="combobox"]`;
  }

  private get triggerSelector() {
    return this.scopedWrapper.findOverflowTrigger()!.toSelector();
  }

  async waitForPageReady() {
    await this.waitForVisible(this.scopedInputSelector);
  }

  getTokenCount(): Promise<number> {
    return this.getElementsCount(this.scopedWrapper.findVisibleTokens().toSelector());
  }

  async getHiddenCount(): Promise<number> {
    if (!(await this.isExisting(this.triggerSelector))) {
      return 0;
    }
    return Number((await this.getText(this.triggerSelector)).replace('+', ''));
  }

  async waitForTotalTokenCount(expected: number) {
    await this.browser.waitUntil(
      async () => (await this.getTokenCount()) + (await this.getHiddenCount()) === expected,
      { timeout: 5000, timeoutMsg: `Expected ${expected} tokens in total` }
    );
  }

  async waitForOverflowTrigger(isPresent = true) {
    await this.browser.waitUntil(async () => (await this.isExisting(this.triggerSelector)) === isPresent, {
      timeout: 5000,
      timeoutMsg: `Expected the overflow trigger to be ${isPresent ? 'present' : 'absent'}`,
    });
  }

  getVisibleTokenBox(index: number) {
    return this.getBoundingBox(this.scopedWrapper.findVisibleToken(index)!.toSelector());
  }

  getOverflowTriggerBox() {
    return this.getBoundingBox(this.triggerSelector);
  }

  getFieldBox() {
    return this.getBoundingBox(this.scopedWrapper.toSelector());
  }

  getInputBox() {
    return this.getBoundingBox(this.scopedInputSelector);
  }

  async clickTokenDismiss(index: number) {
    await this.click(this.scopedWrapper.findVisibleToken(index)!.findDismiss().toSelector());
  }

  async typeAndAddToken(text: string) {
    await this.click(this.scopedInputSelector);
    await this.keys(text.split(''));
    await this.assertDropdownOpen(true);
    await this.keys(['Enter']);
    await this.browser.waitUntil(async () => (await this.getValue(this.scopedInputSelector)) === '', {
      timeout: 10000,
      timeoutMsg: `Input did not clear after adding token "${text}"`,
    });
    await this.keys(['Escape']);
  }
}
