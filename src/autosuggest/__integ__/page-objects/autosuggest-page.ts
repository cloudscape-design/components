// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../../lib/components/test-utils/selectors';
import InputPage from '../../../input/__integ__/page-objects/input';

export default class AutosuggestPage extends InputPage {
  constructor(browser: ConstructorParameters<typeof InputPage>[0], expandToViewport = false) {
    super(browser);
    this.expandToViewport = expandToViewport;
  }

  private readonly expandToViewport: boolean;
  wrapper = createWrapper('body').findAutosuggest();
  suggestionByIndex = (i: number) => this.findDropdown().findOption(i)!.toSelector();
  dropdownSelector = this.findDropdown().findOpenDropdown().toSelector();
  highlightedOptionSelector = this.findDropdown().findHighlightedOption()!.toSelector();

  private findDropdown() {
    return this.wrapper.findDropdown({ expandToViewport: this.expandToViewport });
  }

  async clickOption(index: number) {
    await this.click(this.suggestionByIndex(index));
  }
  async clickClearInput() {
    await this.click(this.wrapper.findClearButton().toSelector());
  }

  async assertDropdownOpen(isOpen = true) {
    await this.waitForVisible(this.dropdownSelector, isOpen);
  }
  async getDropdownText() {
    await this.waitForVisible(this.dropdownSelector);
    return this.getText(this.dropdownSelector);
  }
  async assertVisibleOptions(numOptions: number) {
    for (let i = 1; i <= numOptions; i++) {
      await this.waitForVisible(this.suggestionByIndex(i));
    }
    await this.waitForVisible(this.suggestionByIndex(numOptions + 1), false);
  }
  async assertHighlightedOptionContains(optionText: string) {
    await this.waitForVisible(this.highlightedOptionSelector);

    const selectedCount = await this.getElementsCount(this.highlightedOptionSelector);
    expect(selectedCount).toBe(1);

    const text = await this.getText(this.highlightedOptionSelector);
    expect(text).toContain(optionText);
  }
  async assertInputValue(expected: string) {
    await this.browser.waitUntil(
      async () => (await this.getValue(this.wrapper.findNativeInput().toSelector())) === expected,
      {
        timeout: 500,
        timeoutMsg: `Input value should be ${expected}`,
      }
    );
  }

  async doubleClick(selector: string) {
    const element = await this.browser.$(selector);
    await element.doubleClick();
  }

  getSelectedText() {
    return this.browser.execute(() => {
      const selection = window.getSelection();
      return selection && selection.toString();
    });
  }
}
