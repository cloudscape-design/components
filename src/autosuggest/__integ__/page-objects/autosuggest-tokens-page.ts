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
    return `${this.scope} [class*="token-overflow-pill"]:not([aria-hidden])`;
  }

  readonly overflowDropdownSelector = '[role="dialog"][aria-modal="true"]';

  async waitForPageReady() {
    await this.waitForVisible(this.wrapper.findNativeInput().toSelector());
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

  getInputValue(): Promise<string> {
    return this.getValue(this.wrapper.findNativeInput().toSelector());
  }

  async assertTokenCount(expected: number) {
    await this.browser.waitUntil(async () => (await this.getTokenCount()) === expected, {
      timeout: 2000,
      timeoutMsg: `Expected ${expected} tokens`,
    });
  }

  async typeAndAddToken(text: string) {
    await this.focusInput();
    await this.keys(text.split(''));
    // Press Enter to select the "Use <text>" enteredTextLabel item, adding the token
    await this.keys(['Enter']);
  }
}
