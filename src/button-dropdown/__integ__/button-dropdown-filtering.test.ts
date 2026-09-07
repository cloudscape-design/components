// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import ButtonDropdownPage from '../../__integ__/page-objects/button-dropdown-page';

const setupTest = (
  expandToViewport: boolean,
  testFn: (page: ButtonDropdownPage) => Promise<void>,
  id = 'filtering-flat'
) => {
  return useBrowser(async browser => {
    const page = new ButtonDropdownPage(id, browser);
    await browser.url('#/light/button-dropdown/filtering');
    await page.waitForVisible(page.getTrigger());
    if (expandToViewport) {
      await page.click('[data-testid="expand-to-viewport"]');
    }
    await testFn(page);
  });
};

const getFilterInput = (page: ButtonDropdownPage) =>
  page.findButtonDropdown().findFilteringInput()!.findNativeInput().toSelector();

const getClearButton = (page: ButtonDropdownPage) =>
  page.findButtonDropdown().findFilteringInput()!.findClearButton().toSelector();

describe.each([true, false])('Button dropdown filtering (with expandToViewport=%s)', (expandToViewport: boolean) => {
  test(
    'focuses on the input by default',
    setupTest(expandToViewport, async page => {
      await page.clickTrigger();
      const input = getFilterInput(page);
      await page.waitForAssertion(async () => expect(await page.isFocused(input)).toBe(true));
    })
  );

  test(
    'filters when text is typed',
    setupTest(expandToViewport, async page => {
      await page.clickTrigger();
      const input = getFilterInput(page);
      const itemsBefore = await page.getAllItemsCount();

      await page.setValue(input, 'copy');

      const itemsAfter = await page.getAllItemsCount();
      expect(itemsAfter).toBeLessThan(itemsBefore);
      expect(itemsAfter).toBe(1);
    })
  );

  test(
    'tabbing to the clear button and activating it clears the input',
    setupTest(expandToViewport, async page => {
      await page.clickTrigger();
      const input = getFilterInput(page);
      await page.setValue(input, 'copy');

      const clearButton = getClearButton(page);
      await page.waitForVisible(clearButton);

      // Tab moves focus from the input to the clear button without closing the dropdown.
      await page.keys('Tab');
      await expect(page.isFocused(clearButton)).resolves.toBe(true);
      await expect(page.isDropdownOpen()).resolves.toBe(true);

      // Activating the clear button empties the input and keeps the dropdown open.
      await page.keys('Enter');
      await expect(page.getValue(input)).resolves.toBe('');
      await expect(page.isDropdownOpen()).resolves.toBe(true);
    })
  );

  test(
    'shift+tabbing from the clear button to the input keeps the input open',
    setupTest(expandToViewport, async page => {
      await page.clickTrigger();
      const input = getFilterInput(page);
      await page.setValue(input, 'copy');

      const clearButton = getClearButton(page);
      await page.waitForVisible(clearButton);

      await page.keys('Tab');
      await expect(page.isFocused(clearButton)).resolves.toBe(true);

      // Shift+Tab moves focus back to the input, staying within the dropdown.
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.isFocused(input)).resolves.toBe(true);
      await expect(page.isDropdownOpen()).resolves.toBe(true);
    })
  );

  test(
    'tabbing after clear button closes the dropdown',
    setupTest(expandToViewport, async page => {
      await page.clickTrigger();
      const input = getFilterInput(page);
      await page.setValue(input, 'copy');

      const clearButton = getClearButton(page);
      await page.waitForVisible(clearButton);

      await page.keys('Tab');
      await expect(page.isFocused(clearButton)).resolves.toBe(true);

      // Tabbing past the clear button moves focus out of the dropdown, which closes it.
      await page.keys('Tab');
      await page.waitForAssertion(async () => expect(await page.isDropdownOpen()).toBe(false));
    })
  );

  test(
    'clicking the trigger to close the dropdown does not reopen it',
    setupTest(expandToViewport, async page => {
      // Open the dropdown; focus lands on the filter input.
      await page.clickTrigger();
      const input = getFilterInput(page);
      await page.waitForAssertion(async () => expect(await page.isFocused(input)).toBe(true));

      // Click the trigger to close it. This blurs the filter input (focus moves to the
      // trigger) and fires the trigger's click. The focus-leave must not close the dropdown
      // and let the click reopen it — clicking once should close and keep it closed.
      await page.clickTrigger();

      await page.waitForAssertion(async () => expect(await page.isDropdownOpen()).toBe(false));

      // Wait long enough that a close-then-reopen would have re-rendered the open dropdown,
      // then confirm it is (and stays) closed.
      await page.pause(300);
      await expect(page.isDropdownOpen()).resolves.toBe(false);
    })
  );
});
