// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../../lib/components/test-utils/selectors';
import AutosuggestPage from './autosuggest-page';

export default class AutosuggestTokensPage extends AutosuggestPage {
  get scope() {
    return '[data-testid="interactive-demo"]';
  }

  private get scopedWrapper() {
    return createWrapper(this.scope).findAutosuggest()!;
  }

  async waitForPageReady() {
    await this.waitForVisible(this.scopedInputSelector);
  }

  getTokenCount(): Promise<number> {
    return this.getElementsCount(this.scopedWrapper.findVisibleTokens().toSelector());
  }

  getTokenLabel(index: number): Promise<string> {
    return this.getText(this.scopedWrapper.findVisibleToken(index)!.toSelector());
  }

  async clickTokenDismiss(index: number) {
    await this.click(this.scopedWrapper.findVisibleToken(index)!.findDismiss().toSelector());
  }

  async getOverflowTriggerText(): Promise<string | null> {
    const triggerSelector = this.scopedWrapper.findOverflowTrigger()!.toSelector();
    const exists = await this.isExisting(triggerSelector);
    if (!exists) {
      return null;
    }
    return this.getText(triggerSelector);
  }

  async clickOverflowTrigger() {
    await this.click(this.scopedWrapper.findOverflowTrigger()!.toSelector());
  }

  async assertOverflowDropdownOpen(isOpen = true) {
    await this.waitForVisible(this.scopedWrapper.findOverflowDropdown()!.toSelector(), isOpen);
  }

  get scopedInputSelector() {
    return `${this.scope} input[role="combobox"]`;
  }

  getInputValue(): Promise<string> {
    return this.getValue(this.scopedInputSelector);
  }

  async focusScopedInput() {
    await this.click(this.scopedInputSelector);
  }

  async assertTokenCount(expected: number) {
    await this.browser.waitUntil(async () => (await this.getTokenCount()) === expected, {
      timeout: 5000,
      timeoutMsg: `Expected ${expected} tokens`,
    });
  }

  async typeAndAddToken(text: string) {
    await this.focusScopedInput();
    await this.keys(text.split(''));
    await this.assertDropdownOpen(true);
    await this.keys(['Enter']);
    await this.browser.waitUntil(async () => (await this.getInputValue()) === '', {
      timeout: 10000,
      timeoutMsg: `Input did not clear after adding token "${text}"`,
    });
    await this.keys(['Escape']);
  }

  get clearButtonSelector() {
    return this.scopedWrapper.findClearButton().toSelector();
  }

  async clickClearButton() {
    await this.click(this.clearButtonSelector);
  }

  isClearButtonVisible() {
    return this.isExisting(this.clearButtonSelector);
  }
}
