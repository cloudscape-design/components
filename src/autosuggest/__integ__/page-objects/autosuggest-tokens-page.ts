// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AutosuggestPage from './autosuggest-page';

export default class AutosuggestTokensPage extends AutosuggestPage {
  // All selectors are scoped to the interactive demo instance so that
  // pre-seeded tokens in scenario rows don't contaminate counts.
  get scope() {
    return '[data-testid="interactive-demo"]';
  }

  get tokenTriggerSelector() {
    return `${this.scope} [class*="token-trigger"]`;
  }

  get tokenListSelector() {
    return `${this.scope} [class*="token-trigger"] [class*="token-list"]`;
  }

  get overflowPillSelector() {
    return `${this.scope} [class*="token-overflow-pill"]:not([data-measure-pill])`;
  }

  readonly overflowDropdownSelector = '[class*="overflow-panel"]';

  async waitForPageReady() {
    await this.waitForVisible(this.scopedInputSelector);
  }

  tokenSelector(index: number) {
    // token-list > span (wrapper, no role) :nth-child(N) > span[role] (InternalToken root)
    return `${this.tokenListSelector} > span:nth-child(${index}) > span[role]`;
  }

  tokenDismissSelector(index: number) {
    return `${this.tokenSelector(index)} button`;
  }

  getTokenCount(): Promise<number> {
    return this.getElementsCount(`${this.tokenListSelector} span[role]`);
  }

  getTokenLabel(index: number): Promise<string> {
    return this.getText(this.tokenSelector(index));
  }

  async clickTokenDismiss(index: number) {
    await this.click(this.tokenDismissSelector(index));
  }

  async getOverflowPillText(): Promise<string | null> {
    const exists = await this.isExisting(this.overflowPillSelector);
    if (!exists) {
      return null;
    }
    return this.getText(this.overflowPillSelector);
  }

  async clickOverflowPill() {
    await this.click(this.overflowPillSelector);
  }

  async assertOverflowDropdownOpen(isOpen = true) {
    await this.waitForVisible(this.overflowDropdownSelector, isOpen);
  }

  // Scoped selector for the native input inside the interactive demo.
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
