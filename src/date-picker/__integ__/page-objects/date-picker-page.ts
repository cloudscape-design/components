// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import DatePickerWrapper from '../../../../lib/components/test-utils/selectors/date-picker';
import DropdownWrapper from '../../../../lib/components/test-utils/selectors/internal/dropdown';
import styles from '../../../../lib/components/date-picker/styles.selectors.js';

export default class DatePickerPage extends BasePageObject {
  public datePickerWrapper: DatePickerWrapper;
  public datePickerInput: string;
  public sourceInput: string;
  private readonly expandToViewport: boolean;

  constructor(
    private datepickerId: string,
    browser: ConstructorParameters<typeof BasePageObject>[0],
    expandToViewport = false
  ) {
    super(browser);
    this.datePickerWrapper = new DatePickerWrapper(datepickerId);
    this.datePickerInput = this.datePickerWrapper.findNativeInput().toSelector();
    this.sourceInput = createWrapper().findInput().findNativeInput().toSelector();
    this.expandToViewport = expandToViewport;
  }

  findCalendar() {
    return this.datePickerWrapper.findCalendar({ expandToViewport: this.expandToViewport });
  }

  findDialog() {
    const wrapper = this.expandToViewport ? createWrapper() : this.datePickerWrapper;
    return wrapper.find('[role=dialog]');
  }

  async getDropdownBoundingBox() {
    const dropDown = new DropdownWrapper('');
    const boundingBox = await this.getBoundingBox(await dropDown.findOpenDropdown().toSelector());
    return boundingBox;
  }

  async getInputBoundingBox() {
    const boundingBox = await this.getBoundingBox(this.datePickerInput);
    return boundingBox;
  }

  async setSmallWindowSize() {
    await this.setWindowSize({ width: 800, height: 250 });
  }

  async waitForLoad() {
    await this.waitForVisible(this.datePickerWrapper.toSelector());
  }

  async focusInput() {
    await this.click(this.datePickerInput);
  }

  isInputFocused() {
    return this.isFocused(this.datePickerInput);
  }

  isOpenButtonFocused() {
    return this.isFocused(this.datePickerWrapper.findOpenCalendarButton().toSelector());
  }

  isNextButtonFocused() {
    return this.isFocused(this.findCalendar().findNextButton().toSelector());
  }

  getInputText() {
    return this.getValue(this.datePickerInput);
  }

  async clickOutside() {
    await this.click('#focus-dismiss-helper');
  }

  async focusToContent() {
    await this.keys('ArrowDown');
  }

  getHeaderContent() {
    return this.getText(this.findCalendar().findHeader().toSelector());
  }

  async clickHeaderContent() {
    await this.click(this.findCalendar().findHeader().toSelector() + ' > div');
  }

  async clickPreviousMonth() {
    await this.click(this.findCalendar().findPreviousButton().toSelector());
  }

  isDropdownOpen() {
    return this.isExisting(this.findCalendar().toSelector());
  }

  isDropdownFocused() {
    return this.isFocused(this.findDialog().toSelector());
  }

  getCursorPosition() {
    return this.browser.execute(
      selector => document.querySelector<HTMLInputElement>(selector)!.selectionStart,
      this.datePickerInput
    );
  }

  isPreviousMonthButtonFocused() {
    return this.isFocused(this.findCalendar().findPreviousButton().getElement());
  }

  isDateFocused() {
    return this.isFocused(this.findCalendar().findSelectedDate().getElement());
  }

  isDateSelected() {
    return this.isExisting(this.findCalendar().findSelectedDate().getElement());
  }

  async clickDate(row: number, column: number) {
    await this.click(this.findCalendar().findDateAt(row, column).toSelector());
  }

  private inputToWebdriverKeyCodes(value: string): string[] {
    return value.split('').map(char => {
      const parsed = parseInt(char);
      if (parsed >= 0 && parsed < 10) {
        return `Digit${char}`;
      }
      return char;
    });
  }

  async setInputValue(value: string, triggerBlur = true) {
    await this.focusInput();

    for (let k = 0; k < value.length; k++) {
      await this.keys(value[k]);
    }

    if (triggerBlur) {
      await this.clickOutside();
    }
  }

  async pasteText(keys: string) {
    // Paste text by typing it into a different input,
    // then copying & pasting into the DatePicker
    await this.click(this.sourceInput);
    await this.keys(keys);
    await this.browser.execute(input => {
      // select all
      document.querySelector<HTMLInputElement>(input)!.select();
    }, this.sourceInput);
    await this.keys(['Control', 'Insert', 'Null']);
    await this.click(this.datePickerInput);
    await this.keys(['Shift', 'Insert', 'Null']);
  }

  async clickDateInput() {
    const selector = this.datePickerWrapper.find(`.${styles['date-picker-input']}`).toSelector();
    await this.click(selector);
  }

  async clickOpenCalendar() {
    const selector = this.datePickerWrapper.findOpenCalendarButton().toSelector();
    await this.click(selector);
  }
}
