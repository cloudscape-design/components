// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import AutosuggestPage from './page-objects/autosuggest-page';
import createWrapper from '../../../lib/components/test-utils/selectors';

function setupTest(testFn: (page: AutosuggestPage) => Promise<void>, url = '/#/light/autosuggest/simple') {
  return useBrowser(async browser => {
    const page = new AutosuggestPage(browser);
    await browser.url(url);
    await testFn(page);
  });
}

describe(`Simple Autosuggest`, () => {
  test(
    'should display suggestion list with items when typed a matching letter',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['o']);
      await page.assertDropdownOpen();
      await page.assertVisibleOptions(4);
    })
  );

  test(
    'should not open dropdown when read-only',
    setupTest(async page => {
      await page.click('#set-read-only');
      await page.focusInput();
      await page.assertDropdownOpen(false);
    })
  );

  test(
    'should hide suggestion list when typing new entry and hitting "enter"',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['Option 4']);
      await page.keys(['Enter']);
      await page.assertDropdownOpen(false);
    })
  );

  test(
    'should hide suggestion list when typing existing entry and hitting "enter"',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['Option 1']);
      await page.keys(['Enter']);
      await page.assertDropdownOpen(false);
    })
  );

  test(
    'should hide suggestion list when selecting an existing option with mouse',
    setupTest(async page => {
      await page.focusInput();
      await page.clickOption(1);
      await page.assertDropdownOpen(false);
    })
  );

  test(
    'should keep the suggestion list open after clearing the input',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['o']);
      await page.assertDropdownOpen();
      await page.keys(['Backspace']);
      await page.assertDropdownOpen();
    })
  );

  test(
    'should display the empty suggestion list when the value is empty and there are no options',
    setupTest(async page => {
      await page.click('#remove-options');
      await page.focusInput();
      await expect(page.getDropdownText()).resolves.toEqual('Nothing found');
    })
  );

  test(
    'should handle whitespace properly',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['option ']);
      await page.assertDropdownOpen();
      await page.assertVisibleOptions(3);
    })
  );

  test(
    'should move selection to the suggestion list from keyboard',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['option']);
      await page.keys(['ArrowDown']);
      await page.assertHighlightedOptionContains('Use: option');
      await page.keys(['ArrowDown']);
      await page.assertHighlightedOptionContains('Option 0');
    })
  );

  test(
    'should move selection to the suggestion list from keyboard from bottom to top',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['option']);
      await page.keys(['ArrowUp']);
      await page.assertHighlightedOptionContains('Option');
      await page.keys(['ArrowUp']);
      await page.assertHighlightedOptionContains('Option 2');
    })
  );

  test(
    'should use input from suggestion list when selected with enter',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['option']);
      await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await page.assertInputValue('Option 0');
    })
  );

  test(
    'should allow selecting text in the input',
    setupTest(async page => {
      await page.focusInput();
      await page.keys('selectme');
      const wrapper = createWrapper().findAutosuggest();
      await page.doubleClick(wrapper.findNativeInput().toSelector());
      await expect(page.getSelectedText()).resolves.toEqual('selectme');
    })
  );

  test(
    'should lock focus when recovery link is present',
    setupTest(async page => {
      await page.focusInput();
      const wrapper = createWrapper().findAutosuggest();
      const inputSelector = wrapper.findNativeInput().toSelector();
      const dropdownSelector = wrapper.findDropdown({ expandToViewport: true }).toSelector();
      const recoveryButtonSelector = wrapper.findErrorRecoveryButton({ expandToViewport: true }).toSelector();

      await expect(page.isFocused(inputSelector)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(recoveryButtonSelector)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(inputSelector)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(recoveryButtonSelector)).resolves.toBe(true);
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.isFocused(inputSelector)).resolves.toBe(true);
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.isExisting(dropdownSelector)).resolves.toBe(false);
    }, '/#/light/autosuggest/recovery-test')
  );
});
