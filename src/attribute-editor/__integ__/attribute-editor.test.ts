// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const attributeEditorWrapper = createWrapper().findAttributeEditor();

class AttributeEditorPage extends BasePageObject {
  addAttribute() {
    return this.click(attributeEditorWrapper.findAddButton().toSelector());
  }

  removeAttribute(row: number) {
    return this.click(attributeEditorWrapper.findRow(row).findRemoveButton().toSelector());
  }

  getItemsCount() {
    return this.getElementsCount(attributeEditorWrapper.findRows().toSelector());
  }

  getFieldCount(row: number) {
    return this.getElementsCount(attributeEditorWrapper.findRow(row).findFields().toSelector());
  }

  getFieldValue(row: number, fieldIndex: number) {
    return this.getValue(
      attributeEditorWrapper.findRow(row).findField(fieldIndex).findControl().findInput().findNativeInput().toSelector()
    );
  }

  async hasFieldLabel(row: number, fieldIndex: number) {
    const boundingBox = await this.getBoundingBox(
      attributeEditorWrapper.findRow(row).findField(fieldIndex).findLabel().toSelector()
    );

    return boundingBox.left >= 0;
  }

  hasFieldError(row: number, fieldIndex: number) {
    return this.isExisting(attributeEditorWrapper.findRow(row).findField(fieldIndex).findError().toSelector());
  }

  hasFieldWarning(row: number, fieldIndex: number) {
    return this.isExisting(attributeEditorWrapper.findRow(row).findField(fieldIndex).findWarning().toSelector());
  }

  isFieldInputFocussed(row: number, fieldIndex: number) {
    return this.isFocused(
      attributeEditorWrapper.findRow(row).findField(fieldIndex).findControl().findInput().findNativeInput().toSelector()
    );
  }

  isFieldInfoLinkFocussed(row: number, fieldIndex: number) {
    return this.isFocused(attributeEditorWrapper.findRow(row).findField(fieldIndex).findInfo().findLink().toSelector());
  }

  isRemoveButtonFocussed(row: number) {
    return this.isFocused(attributeEditorWrapper.findRow(row).findRemoveButton().toSelector());
  }

  isAddButtonFocussed() {
    return this.isFocused(attributeEditorWrapper.findAddButton().toSelector());
  }

  focusFieldInput(row: number, fieldIndex: number) {
    return this.click(
      attributeEditorWrapper.findRow(row).findField(fieldIndex).findControl().findInput().findNativeInput().toSelector()
    );
  }

  async typeIntoFieldInput(row: number, fieldIndex: number, value: string) {
    await this.focusFieldInput(row, fieldIndex);
    return this.keys(value);
  }

  async setDesktopViewport() {
    // set viewport bigger than x-small
    await this.setWindowSize({ width: 992, height: 600 });
  }

  async setMobileViewport() {
    await this.setWindowSize({ width: 400, height: 600 });
  }
}

const setupTest = (testFn: (page: AttributeEditorPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new AttributeEditorPage(browser);
    await browser.url('#/light/attribute-editor/simple');
    await page.waitForVisible(attributeEditorWrapper.findAddButton().toSelector());
    await testFn(page);
  });
};

describe('Attribute Editor', () => {
  test(
    'initial rendering',
    setupTest(async page => {
      await expect(page.getItemsCount()).resolves.toBe(2);
      await expect(page.getFieldCount(1)).resolves.toBe(2);
      await expect(page.getFieldCount(2)).resolves.toBe(2);

      await expect(page.getFieldValue(1, 1)).resolves.toBe('bla');
      await expect(page.getFieldValue(1, 2)).resolves.toBe('foo');
      await expect(page.getFieldValue(2, 1)).resolves.toBe('bar');
      await expect(page.getFieldValue(2, 2)).resolves.toBe('yam');
    })
  );

  test(
    'shows extra field labels when transitioned to mobile',
    setupTest(async page => {
      await expect(page.hasFieldLabel(1, 1)).resolves.toBe(true);
      await expect(page.hasFieldLabel(1, 2)).resolves.toBe(true);

      await expect(page.hasFieldLabel(2, 1)).resolves.toBe(false);
      await expect(page.hasFieldLabel(2, 2)).resolves.toBe(false);

      await page.setMobileViewport();

      await expect(page.hasFieldLabel(1, 1)).resolves.toBe(true);
      await expect(page.hasFieldLabel(1, 2)).resolves.toBe(true);

      await expect(page.hasFieldLabel(2, 1)).resolves.toBe(true);
      await expect(page.hasFieldLabel(2, 2)).resolves.toBe(true);

      await page.setDesktopViewport();

      await expect(page.hasFieldLabel(1, 1)).resolves.toBe(true);
      await expect(page.hasFieldLabel(1, 2)).resolves.toBe(true);

      await expect(page.hasFieldLabel(2, 1)).resolves.toBe(false);
      await expect(page.hasFieldLabel(2, 2)).resolves.toBe(false);
    })
  );

  test(
    'can edit a new attribute',
    setupTest(async page => {
      await page.addAttribute();

      await expect(page.getItemsCount()).resolves.toBe(3);
      await expect(page.getFieldValue(3, 1)).resolves.toBe('');
      await expect(page.getFieldValue(3, 2)).resolves.toBe('');

      await page.typeIntoFieldInput(3, 1, 'new key');
      await page.typeIntoFieldInput(3, 2, 'new value');

      await expect(page.getFieldValue(3, 1)).resolves.toBe('new key');
      await expect(page.getFieldValue(3, 2)).resolves.toBe('new value');
    })
  );

  test(
    'can edit an existing attribute',
    setupTest(async page => {
      await page.typeIntoFieldInput(1, 1, '-edited');
      await expect(page.getFieldValue(1, 1)).resolves.toBe('bla-edited');
    })
  );

  test(
    'can delete an attribute',
    setupTest(async page => {
      await page.removeAttribute(1);
      await expect(page.getItemsCount()).resolves.toBe(1);
      await expect(page.getFieldValue(1, 1)).resolves.toBe('bar');
      await expect(page.getFieldValue(1, 2)).resolves.toBe('yam');
    })
  );

  test(
    'displays an error message',
    setupTest(async page => {
      await expect(page.hasFieldError(1, 1)).resolves.toBe(false);
      await expect(page.hasFieldError(1, 2)).resolves.toBe(false);

      await page.typeIntoFieldInput(1, 2, 'Home Aws Cloud');

      await expect(page.hasFieldError(1, 1)).resolves.toBe(false);
      await expect(page.hasFieldError(1, 2)).resolves.toBe(true);
    })
  );

  test(
    'displays a warning message',
    setupTest(async page => {
      await expect(page.hasFieldWarning(1, 1)).resolves.toBe(false);
      await expect(page.hasFieldWarning(1, 2)).resolves.toBe(false);

      await page.typeIntoFieldInput(1, 2, '*');

      await expect(page.hasFieldWarning(1, 1)).resolves.toBe(false);
      await expect(page.hasFieldWarning(1, 2)).resolves.toBe(true);
    })
  );

  test(
    'displays only the error message when both error and warning text exist',
    setupTest(async page => {
      await expect(page.hasFieldError(1, 2)).resolves.toBe(false);
      await expect(page.hasFieldWarning(1, 2)).resolves.toBe(false);

      await page.typeIntoFieldInput(1, 2, 'longtext*');

      await expect(page.hasFieldError(1, 2)).resolves.toBe(true);
      await expect(page.hasFieldWarning(1, 2)).resolves.toBe(false);
    })
  );

  test(
    'keyboard navigation works as expected on desktop',
    setupTest(async page => {
      // Row 1
      await page.focusFieldInput(1, 1);
      await expect(page.isFieldInputFocussed(1, 1)).resolves.toBe(true);

      await page.keys('Tab');
      await expect(page.isFieldInfoLinkFocussed(1, 2)).resolves.toBe(true);

      await page.keys('Tab');
      await expect(page.isFieldInputFocussed(1, 2)).resolves.toBe(true);

      await page.keys('Tab');
      await expect(page.isRemoveButtonFocussed(1)).resolves.toBe(true);

      await page.keys('Tab');

      // Row 2
      // Desktop screensize there are no labels shown so we expect to tab to the next input
      await expect(page.isFieldInputFocussed(2, 1)).resolves.toBe(true);

      await page.keys('Tab');
      await expect(page.isFieldInputFocussed(2, 2)).resolves.toBe(true);

      await page.keys('Tab');
      await expect(page.isRemoveButtonFocussed(2)).resolves.toBe(true);

      await page.keys('Tab');
      await expect(page.isAddButtonFocussed()).resolves.toBe(true);
    })
  );
});
