// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import DateRangePickerWrapper from '../../../../lib/components/test-utils/selectors/date-range-picker';
import DropdownWrapper from '../../../../lib/components/test-utils/selectors/internal/dropdown';

export default class DateRangePickerPage extends BasePageObject {
  public dateRangePickerWrapper: DateRangePickerWrapper;
  public dateRangePickerTrigger: string;
  private readonly expandToViewport: boolean;

  constructor(
    daterangepickerSelector: string,
    browser: ConstructorParameters<typeof BasePageObject>[0],
    expandToViewport = false
  ) {
    super(browser);
    this.dateRangePickerWrapper = new DateRangePickerWrapper(daterangepickerSelector);
    this.dateRangePickerTrigger = this.dateRangePickerWrapper.findTrigger().toSelector();
    this.expandToViewport = expandToViewport;
  }

  findDropdown() {
    return this.dateRangePickerWrapper.findDropdown({ expandToViewport: this.expandToViewport });
  }

  async getDropdownBoundingBox() {
    const dropDown = new DropdownWrapper('');
    const boundingBox = await this.getBoundingBox(await dropDown.findOpenDropdown().toSelector());
    return boundingBox;
  }

  async getTriggerBoundingBox() {
    const boundingBox = await this.getBoundingBox(this.dateRangePickerTrigger);
    return boundingBox;
  }

  async waitForLoad() {
    await this.waitForVisible(this.dateRangePickerWrapper.toSelector());
  }

  async focusTrigger() {
    await this.focusPrevElement();
    await this.keys('Tab');
  }

  getTriggerText() {
    return this.getText(this.dateRangePickerTrigger);
  }

  isTriggerFocused() {
    return this.isFocused(this.dateRangePickerTrigger);
  }

  isNextButtonFocused() {
    return this.isFocused(this.findDropdown().findNextButton().toSelector());
  }

  async focusPrevElement() {
    await this.click('#focus-dismiss-helper');
  }

  isPrevElementFocused() {
    return this.isFocused('#focus-dismiss-helper');
  }

  getHeaderContent() {
    return this.getText(this.findDropdown().findHeader().toSelector());
  }

  async clickPreviousMonth() {
    await this.click(this.findDropdown().findPreviousButton().toSelector());
  }

  async clickOutside() {
    await this.click('#outside-click-target');
  }

  isDropdownOpen() {
    return this.isExisting(this.findDropdown().toSelector());
  }

  isDropdownFocused() {
    return this.isFocused(this.findDropdown().toSelector());
  }

  isPreviousMonthButtonFocused() {
    return this.isFocused(this.findDropdown().findPreviousMonthButton().getElement());
  }

  async clickDate(grid: 'left' | 'right', row: 1 | 2 | 3 | 4 | 5 | 6, column: 1 | 2 | 3 | 4 | 5 | 6 | 7) {
    await this.click(this.findDropdown().findDateAt(grid, row, column).toSelector());
  }

  async clickRange(rangeKey: string) {
    await this.click(this.findDropdown().findRelativeRangeRadioGroup().findInputByValue(rangeKey).toSelector());
  }

  async clickApplyButton() {
    await this.click(this.findDropdown().findApplyButton().toSelector());
  }

  async isModeFocused() {
    const selectedSegment = await this.findDropdown()
      .findSelectionModeSwitch()
      .findModesAsSegments()
      .findSelectedSegment()
      .toSelector();

    return this.isFocused(selectedSegment);
  }
}
