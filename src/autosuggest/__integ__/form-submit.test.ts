// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper, { AutosuggestWrapper } from '../../../lib/components/test-utils/selectors';

class FormSubmitPageObject extends BasePageObject {
  isDropdownOpen(wrapper: AutosuggestWrapper) {
    return this.isDisplayed(wrapper.findDropdown().findOpenDropdown().toSelector());
  }

  isFormSubmitted() {
    return this.isDisplayed('[data-testid="submit-message"]');
  }
}

function setupTest(testFn: (page: FormSubmitPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new FormSubmitPageObject(browser);
    await browser.url('#/light/autosuggest/form-submit');
    await testFn(page);
  });
}

test(
  'Should submit form on double enter key',
  setupTest(async page => {
    const autosuggestNoKeydown = createWrapper().findAutosuggest('[data-testid="autosuggest-no-keydown"]');
    await page.click(autosuggestNoKeydown.findNativeInput().toSelector());
    await expect(page.isDropdownOpen(autosuggestNoKeydown)).resolves.toBe(true);
    await page.keys('Enter');
    // first key closes the dropdown
    await expect(page.isDropdownOpen(autosuggestNoKeydown)).resolves.toBe(false);
    await expect(page.isFormSubmitted()).resolves.toBe(false);
    await page.keys('Enter');
    // second key submits the form
    await expect(page.isDropdownOpen(autosuggestNoKeydown)).resolves.toBe(false);
    await expect(page.isFormSubmitted()).resolves.toBe(true);
  })
);

test(
  'Should allow preventing form submission',
  setupTest(async page => {
    const autosuggestWithKeydown = createWrapper().findAutosuggest('[data-testid="autosuggest-with-keydown"]');
    await page.click(autosuggestWithKeydown.findNativeInput().toSelector());
    await expect(page.isDropdownOpen(autosuggestWithKeydown)).resolves.toBe(true);
    await page.keys('Enter');
    // first key closes the dropdown
    await expect(page.isDropdownOpen(autosuggestWithKeydown)).resolves.toBe(false);
    await expect(page.isFormSubmitted()).resolves.toBe(false);
    await page.keys('Enter');
    // second key tries to submit the form, but it is prevented
    await expect(page.isDropdownOpen(autosuggestWithKeydown)).resolves.toBe(false);
    await expect(page.isFormSubmitted()).resolves.toBe(false);
  })
);
