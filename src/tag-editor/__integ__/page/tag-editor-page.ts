// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../../../lib/components/test-utils/selectors';

const tagEditorWrapper = createWrapper().findTagEditor();

interface Request {
  key: string;
  resolve(response: string[]): void;
  reject(reason: string): void;
}

interface ExtendedWindow extends Window {
  __pendingKeyRequests: Request[];
  __pendingValueRequests: Request[];
}
declare const window: ExtendedWindow;

const findAutosuggest = (row: number, column: number) =>
  tagEditorWrapper.findRow(row).findField(column).findControl().findAutosuggest();
const findKeyAutosuggest = (row: number) => findAutosuggest(row, 1);
const findValueAutosuggest = (row: number) => findAutosuggest(row, 2);

const DEBOUNCE_FILTERING_DELAY = 200;

export default class TagEditorPage extends BasePageObject {
  focusTagEditor() {
    return this.click('#btnFocus');
  }

  focusKey(row: number) {
    return this.click(findKeyAutosuggest(row).toSelector());
  }

  addTag() {
    return this.click(tagEditorWrapper.findAddButton().toSelector());
  }

  changeLocale(locale: string) {
    return this.browser.execute(function (locale) {
      return document.dispatchEvent(new CustomEvent('onlocalechange', { detail: { value: locale } }));
    }, locale);
  }

  resolveKeys(result: string[]) {
    return this.browser.execute(function (result) {
      const pendingRequests = window.__pendingKeyRequests.length;
      window.__pendingKeyRequests.forEach(p => p.resolve(result));
      window.__pendingKeyRequests = [];
      return pendingRequests;
    }, result);
  }

  rejectKeys(reason: string) {
    return this.browser.execute(function (reason) {
      const pendingRequests = window.__pendingKeyRequests.length;
      window.__pendingKeyRequests.forEach(p => p.reject(reason));
      window.__pendingKeyRequests = [];
      return pendingRequests;
    }, reason);
  }

  resolveValues(result: string[]) {
    return this.browser.execute(function (result) {
      const pendingRequests = window.__pendingValueRequests.length;
      window.__pendingValueRequests.forEach(p => p.resolve(result));
      window.__pendingValueRequests = [];
      return pendingRequests;
    }, result);
  }

  rejectValues(reason: string) {
    return this.browser.execute(function (reason) {
      const pendingRequests = window.__pendingValueRequests.length;
      window.__pendingValueRequests.forEach(p => p.reject(reason));
      window.__pendingValueRequests = [];
      return pendingRequests;
    }, reason);
  }

  async selectKeyFromDropdown(row: number, keyIndex: number) {
    const dropdownItemSelector = findKeyAutosuggest(row).findDropdown().findOption(keyIndex).toSelector();
    await this.waitForVisible(dropdownItemSelector);
    return this.click(dropdownItemSelector);
  }

  removeTag(row: number) {
    return this.click(tagEditorWrapper.findRow(row).findRemoveButton().toSelector());
  }

  findUndoButton(row: number) {
    return tagEditorWrapper.findRow(row).findUndoButton().toSelector();
  }

  undoTagRemoval(row: number) {
    return this.click(this.findUndoButton(row));
  }

  async searchKey(key: string, row: number) {
    await this.click(findKeyAutosuggest(row).findNativeInput().toSelector());
    return this.keys(key);
  }

  async searchValue(key: string, row: number) {
    await this.click(findValueAutosuggest(row).findNativeInput().toSelector());
    return this.keys(key);
  }

  getTagKey(row: number) {
    return this.getValue(findKeyAutosuggest(row).findNativeInput().toSelector());
  }

  getTagValue(row: number) {
    return this.getValue(findValueAutosuggest(row).findNativeInput().toSelector());
  }

  isKeyFocussed(row: number) {
    return this.isFocused(findKeyAutosuggest(row).findNativeInput().toSelector());
  }

  isValueFocussed(row: number) {
    return this.isFocused(findValueAutosuggest(row).findNativeInput().toSelector());
  }

  isUndoFocussed(row: number) {
    return this.isFocused(this.findUndoButton(row));
  }

  isRemoveButtonFocussed(row: number) {
    return this.isFocused(tagEditorWrapper.findRow(row).findRemoveButton().toSelector());
  }

  async isKeyLoading(row: number) {
    await this.pause(DEBOUNCE_FILTERING_DELAY);
    return this.isExisting(findKeyAutosuggest(row).findDropdown().findFooterRegion().findSpinner().toSelector());
  }

  getKeyLoadingText(row: number) {
    return this.getText(findKeyAutosuggest(row).findDropdown().findFooterRegion().toSelector());
  }

  getValueLoadingText(row: number) {
    return this.getText(findValueAutosuggest(row).findDropdown().findFooterRegion().toSelector());
  }

  getKeyError(row: number) {
    return this.getText(tagEditorWrapper.findRow(row).findField(1).findError().toSelector());
  }

  getRowHeaders(row: number) {
    return this.getElementsText(tagEditorWrapper.findRow(row).findFormField().findLabel().toSelector());
  }

  hasKeyError(row: number) {
    return this.isExisting(tagEditorWrapper.findRow(row).findField(1).findError().toSelector());
  }

  hasValueError(row: number) {
    return this.isExisting(tagEditorWrapper.findRow(row).findField(2).findError().toSelector());
  }

  hasKeyLoadingError(row: number) {
    return this.isExisting(findKeyAutosuggest(row).findDropdown().findFooterRegion().toSelector());
  }

  async isValueLoading(row: number) {
    await this.pause(DEBOUNCE_FILTERING_DELAY);
    return this.isExisting(findValueAutosuggest(row).findDropdown().findFooterRegion().findSpinner().toSelector());
  }

  hasValueLoadingError(row: number) {
    return this.isExisting(findValueAutosuggest(row).findDropdown().findFooterRegion().toSelector());
  }

  isMarkedForRemoval(row: number) {
    return this.isExisting(this.findUndoButton(row));
  }

  getKeySuggestionsCount(row: number) {
    return this.getElementsCount(findKeyAutosuggest(row).findDropdown().findOptions().toSelector());
  }

  getValueSuggestionsCount(row: number) {
    return this.getElementsCount(findValueAutosuggest(row).findDropdown().findOptions().toSelector());
  }

  getTagCount() {
    return this.getElementsCount(tagEditorWrapper.findRows().toSelector());
  }

  async getTag(row: number) {
    const key = await this.getValue(findKeyAutosuggest(row).findNativeInput().toSelector());

    const markedForRemoval = await this.isMarkedForRemoval(row);
    let value;
    if (!markedForRemoval) {
      value = await this.getValue(findValueAutosuggest(row).findNativeInput().toSelector());
    }

    return { key, value, markedForRemoval };
  }

  async getTags() {
    const elements = await this.browser.$$(tagEditorWrapper.findRows().toSelector());
    const tags = [];
    for (let index = 1; index <= elements.length; index++) {
      tags.push(await this.getTag(index));
    }
    return tags;
  }
}
