// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import ButtonDropdownWrapper from '../../../lib/components/test-utils/selectors/button-dropdown';

const wrapper = createWrapper();
export default class ButtonDropdownPage extends BasePageObject {
  constructor(
    private id: string,
    browser: ConstructorParameters<typeof BasePageObject>[0]
  ) {
    super(browser);
    this.id = id;
  }
  public getDropdownCheckMessage() {
    return this.getText('#testDropdownMessage');
  }
  public openDropdown() {
    return this.click(this.findButtonDropdown().findNativeButton().toSelector());
  }
  public isDropdownOpen() {
    return this.isExisting(this.getOpenDropdown());
  }
  public findButtonDropdown(): ButtonDropdownWrapper {
    return wrapper.findButtonDropdown(`#${this.id}`);
  }
  public getOpenDropdown(): string {
    return this.findButtonDropdown().findOpenDropdown().toSelector();
  }
  public getTrigger(): string {
    return this.findButtonDropdown().findNativeButton().toSelector();
  }
  public getItem(itemId: string) {
    return this.findButtonDropdown().findItemById(itemId).toSelector();
  }

  public getCategoryItem(itemId: string) {
    return this.findButtonDropdown().findExpandableCategoryById(itemId).toSelector();
  }

  public toggleGroup(itemId: string) {
    return this.click(this.findButtonDropdown().findExpandableCategoryById(itemId).toSelector());
  }

  public getItemCount(itemId: string) {
    return this.getElementsCount(this.findButtonDropdown().findItemById(itemId).toSelector());
  }
  public getAllItemsCount() {
    return this.getElementsCount(this.findButtonDropdown().findItems().toSelector());
  }

  public getHighlightedElementText() {
    const element = this.findButtonDropdown().findHighlightedItem();
    return this.getText(element.toSelector());
  }

  public async focusOnTheTrigger() {
    await this.browser.execute(trigger => {
      document.querySelector<HTMLElement>(trigger)!.focus();
    }, this.getTrigger());
  }
  public getLocation() {
    return this.browser.execute(() => document.location.href);
  }
}
