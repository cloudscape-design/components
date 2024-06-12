// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { strict as assert } from 'assert';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import { SelectWrapper } from '../../../../lib/components/test-utils/selectors';

export default class SelectPageObject<Wrapper extends SelectWrapper = SelectWrapper> extends BasePageObject {
  constructor(
    browser: ConstructorParameters<typeof BasePageObject>[0],
    protected wrapper: Wrapper
  ) {
    super(browser);
  }

  async clickSelect() {
    await this.click(this.wrapper.findTrigger().toSelector());
  }

  async focusSelect() {
    const selector = this.wrapper.findTrigger().toSelector();
    await this.browser.execute(selector => {
      document.querySelector<HTMLElement>(selector)!.focus();
    }, selector);
  }

  async clickOption(optionNumber: number, expandToViewport?: boolean) {
    await this.click(
      this.wrapper.findDropdown({ expandToViewport: !!expandToViewport }).findOption(optionNumber).toSelector()
    );
  }

  async selectOptionUsingDrag(optionNumber: number) {
    const triggerSelector = this.wrapper.findTrigger().toSelector();
    // actions API does not work when element is not in the viewport
    await (await this.browser.$(triggerSelector)).scrollIntoView();

    await this.buttonDownOnElement(triggerSelector);
    const { left, width, top, height } = await this.getBoundingBox(
      this.wrapper.findDropdown().findOption(optionNumber).toSelector()
    );
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
          // drag mouse to the option and then release
          { type: 'pointerMove', duration: 100, x: Math.round(left + width / 2), y: Math.round(top + height / 2) },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await this.browser.releaseActions();
  }

  isDropdownOpen() {
    return this.isExisting(this.wrapper.findDropdown().findOpenDropdown().toSelector());
  }

  async assertDropdownOpen(isOpen: boolean) {
    await assert.equal(await this.isDropdownOpen(), isOpen, `Select dropdown should ${isOpen ? '' : 'not '} be open`);
  }

  async ensureDropdownOpen() {
    const dropdownOpen = await this.isDropdownOpen();
    if (!dropdownOpen) {
      await this.clickSelect();
    }
  }

  async assertPlaceholderDisplayed() {
    await assert.equal(
      await this.isExisting(this.wrapper.findPlaceholder().toSelector()),
      true,
      'Placeholder should exist'
    );
  }

  async assertHighlightedOption(isDisplayed: boolean) {
    assert.equal(
      await this.isExisting(this.wrapper.findDropdown().findHighlightedOption().toSelector()),
      isDisplayed,
      `There should ${isDisplayed ? '' : 'not '} be a highlighted option`
    );
  }

  async clickOptionInGroup(groupNumber: number, optionNumber: number) {
    await this.click(this.wrapper.findDropdown().findOptionInGroup(groupNumber, optionNumber).toSelector());
  }

  getHighlightedOptionLabel() {
    return this.getText(this.wrapper.findDropdown().findHighlightedOption().findLabel().toSelector());
  }

  getDropdownOptionCount() {
    return this.getElementsCount(this.wrapper.findDropdown().findOptions().toSelector());
  }

  async getTriggerLabel() {
    const triggerSelector = this.wrapper.findTrigger().toSelector();
    const triggerExists = await this.isExisting(triggerSelector);
    return triggerExists ? this.getText(triggerSelector) : null;
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
