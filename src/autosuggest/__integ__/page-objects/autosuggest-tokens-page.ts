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
    return this.getElementsCount(this.scopedWrapper.findInlineTokens().toSelector());
  }

  getTokenLabel(index: number): Promise<string> {
    return this.getText(this.scopedWrapper.findInlineToken(index)!.toSelector());
  }

  async clickTokenDismiss(index: number) {
    await this.click(this.scopedWrapper.findInlineToken(index)!.findDismiss().toSelector());
  }

  async getOverflowPillText(): Promise<string | null> {
    const pillSelector = this.scopedWrapper.findOverflowPill()!.toSelector();
    const exists = await this.isExisting(pillSelector);
    if (!exists) {
      return null;
    }
    return this.getText(pillSelector);
  }

  async clickOverflowPill() {
    await this.click(this.scopedWrapper.findOverflowPill()!.toSelector());
  }

  async assertOverflowDropdownOpen(isOpen = true) {
    await this.waitForVisible(this.scopedWrapper.findOverflowPanel()!.toSelector(), isOpen);
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
    return `${this.scope} [class*="input-icon-end"] button`;
  }

  async clickClearButton() {
    await this.click(this.clearButtonSelector);
  }

  isClearButtonVisible() {
    return this.isExisting(this.clearButtonSelector);
  }
}
