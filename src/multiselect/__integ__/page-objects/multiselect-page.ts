// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { strict as assert } from 'assert';
import { MultiselectWrapper } from '../../../../lib/components/test-utils/selectors';
import SelectPageObject from '../../../select/__integ__/page-objects/select-page';
import optionStyles from '../../../../lib/components/internal/components/option/styles.selectors.js';
import selectableItemStyles from '../../../../lib/components/internal/components/selectable-item/styles.selectors.js';

export default class MultiselectPageObject extends SelectPageObject<MultiselectWrapper> {
  getOptionInGroup(groupNumber: number, optionNumber: number) {
    return this.wrapper.findDropdown().findOptionInGroup(groupNumber, optionNumber)!.toSelector();
  }

  async clickOptionInGroup(groupNumber: number, optionNumber: number) {
    await this.click(this.getOptionInGroup(groupNumber, optionNumber));
  }

  async assertOptionSelected(groupNumber: number, optionNumber: number, isSelected: boolean) {
    const className = await this.getElementAttribute(this.getOptionInGroup(groupNumber, optionNumber), 'class');
    assert.equal(
      className.indexOf(selectableItemStyles.selected),
      isSelected,
      `Option should be ${isSelected ? '' : 'not '} selected`
    );
  }

  clickTokenToggle() {
    return this.click(this.wrapper.findTokenToggle().toSelector());
  }

  async pressTokenToggle(key: string) {
    const tokenToggleSelector = this.wrapper.findTokenToggle().toSelector();
    await this.browser.execute(tokenToggleSelector => {
      document.querySelector<HTMLElement>(tokenToggleSelector)!.focus();
    }, tokenToggleSelector);
    return this.browser.keys(key);
  }

  async clickTokenDismiss(tokenNumber: number) {
    await this.click(this.wrapper.findToken(tokenNumber)!.findDismiss()!.toSelector());
  }

  getTokenLabels() {
    return this.getElementsText(this.wrapper.findTokens()!.find(`.${optionStyles['label-content']}`)!.toSelector());
  }

  getSelectedOptionLabels() {
    return this.getElementsText(
      this.wrapper.findDropdown().findSelectedOptions()!.find(`.${optionStyles['label-content']}`).toSelector()
    );
  }
}
