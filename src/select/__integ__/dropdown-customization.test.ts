// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import SelectPageObject from './page-objects/select-page';

function setup(selectId: string, testFn: (page: SelectPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const wrapper = createWrapper().findSelect(selectId);
    const page = new SelectPageObject(browser, wrapper);
    await page.setWindowSize({ width: 950, height: 600 });
    await browser.url('/#/light/select/dropdown-customization');
    await page.waitForVisible(wrapper.findTrigger().toSelector());
    await testFn(page);
  });
}

describe('Select dropdown-customization: interactive footer keyboard reachability', () => {
  // Mode (a): dialog context (filteringType='auto'). On open, focus lands on the
  // filtering input; a single Tab should move focus forward to the footer button
  // (no header/filtering-actions on this variant), and the dropdown must stay open.
  test(
    'dialog context: Tab from filtering input reaches the interactive footer button and keeps the dropdown open',
    setup('#footer-dialog', async page => {
      const wrapper = createWrapper().findSelect('#footer-dialog');
      const footerButton = wrapper.findDropdownFooter().findButton().toSelector();

      await page.click(wrapper.findTrigger().toSelector());
      await page.assertDropdownOpen(true);
      // focus starts on the filtering input
      await expect(page.isFocused(wrapper.findFilteringInput().findNativeInput().toSelector())).resolves.toBe(true);

      // Tabbing to the footer button
      await page.keys(['Tab']);
      await expect(page.isFocused(footerButton)).resolves.toBe(true);
      await page.assertDropdownOpen(true);
    })
  );

  // Mode (b): plain listbox (filteringType='none', default listbox role). On open,
  // focus moves into the open dropdown (the options list), not onto the trigger and
  // not onto a filter input (there is none). This is the empirical question the unit
  // tests could not answer: does Tab from there reach the footer button, or close the
  // dropdown? Result: a single Tab lands on the footer button with the dropdown still
  // open, so interactive footers are keyboard-reachable in plain listbox mode too --
  // dropdownRole='dialog' is not required for footer reachability.
  test(
    'plain listbox: Tab reaches the interactive footer button and keeps the dropdown open',
    setup('#footer-listbox', async page => {
      const wrapper = createWrapper().findSelect('#footer-listbox');
      const footerButton = wrapper.findDropdownFooter().findButton().toSelector();

      await page.click(wrapper.findTrigger().toSelector());
      await page.assertDropdownOpen(true);

      // Tabbing to the footer button
      await page.keys(['Tab']);
      await expect(page.isFocused(footerButton)).resolves.toBe(true);
      await page.assertDropdownOpen(true);
    })
  );
});

describe('Select dropdown-customization: interactive header keyboard reachability', () => {
  // The custom header renders ABOVE the filter input and the options list, so a header
  // control precedes the on-open focus position in tab order. Reaching it is therefore a
  // Shift+Tab (backward) path, not the footer's forward Tab. The empirical question: does
  // Shift+Tab land on the header button and keep the dropdown open, or escape to the
  // trigger (closing the dropdown)?

  // Mode (a): dialog context (filteringType='auto'). On open, focus is on the filtering
  // input; the header button sits before it, so a single Shift+Tab should reach it.
  test(
    'dialog context: Shift+Tab from filtering input reaches the interactive header button and keeps the dropdown open',
    setup('#header-dialog', async page => {
      const wrapper = createWrapper().findSelect('#header-dialog');
      const headerButton = wrapper.findDropdownHeader().findButton().toSelector();

      await page.click(wrapper.findTrigger().toSelector());
      await page.assertDropdownOpen(true);
      // focus starts on the filtering input
      await expect(page.isFocused(wrapper.findFilteringInput().findNativeInput().toSelector())).resolves.toBe(true);

      // Shift+Tab back to the header button
      await page.keys(['Shift', 'Tab']);
      await expect(page.isFocused(headerButton)).resolves.toBe(true);
      await page.assertDropdownOpen(true);
    })
  );

  // Mode (b): plain listbox (filteringType='none'). On open, focus moves into the open
  // dropdown (the options list); the header button precedes it, so a single Shift+Tab
  // should reach it with the dropdown still open.
  test(
    'plain listbox: Shift+Tab reaches the interactive header button and keeps the dropdown open',
    setup('#header-listbox', async page => {
      const wrapper = createWrapper().findSelect('#header-listbox');
      const headerButton = wrapper.findDropdownHeader().findButton().toSelector();

      await page.click(wrapper.findTrigger().toSelector());
      await page.assertDropdownOpen(true);

      // Shift+Tab back to the header button
      await page.keys(['Shift', 'Tab']);
      await expect(page.isFocused(headerButton)).resolves.toBe(true);
      await page.assertDropdownOpen(true);
    })
  );
});
