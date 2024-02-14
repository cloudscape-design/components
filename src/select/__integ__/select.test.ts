// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import SelectPageObject from './page-objects/select-page';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

test(
  'allows filtering for options which have labels with spaces',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new BasePageObject(browser);
    const select = createWrapper().findSelect('#simple_select');
    const optionsSelector = select.findDropdown().findOptions().toSelector();
    await page.click(select.findTrigger().toSelector());
    await page.keys('option 1');
    await expect(await browser.$$(optionsSelector)).toHaveLength(1);
  })
);

test(
  'closes the dropdown only after the mouse button is released',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const select = createWrapper().findSelect('#simple_select');
    const page = new SelectPageObject(browser, select);
    await page.clickSelect();
    await page.buttonDownOnElement(select.findDropdown().findOptionByValue('1').toSelector());
    await page.assertDropdownOpen(true);
    await page.buttonUp();
    await page.assertDropdownOpen(false);
  })
);

test(
  'should support drag-to-select interaction',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const select = createWrapper().findSelect('#simple_select');
    const page = new SelectPageObject(browser, select);
    await expect(page.getTriggerLabel()).resolves.toEqual('Choose option');
    await page.selectOptionUsingDrag(2);
    await expect(page.getTriggerLabel()).resolves.toEqual('Option 2');
  })
);

test(
  'should allow selecting text in the filtering input',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const select = createWrapper().findSelect('#simple_select');
    const page = new SelectPageObject(browser, select);
    await page.clickSelect();
    await page.click(select.findFilteringInput().toSelector());
    await page.keys('selectme');
    await page.doubleClick(select.findFilteringInput().toSelector());
    await expect(page.getSelectedText()).resolves.toEqual('selectme');
  })
);

test(
  'input aria-activedescendant is same as highlighted option id',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const wrapper = createWrapper().findSelect('#simple_select');
    const page = new SelectPageObject(browser, wrapper);
    await page.focusSelect();
    await page.keys(['Space', 'ArrowDown']);
    const highlightedOptionId = await page.getElementProperty(
      wrapper.findDropdown({ expandToViewport: true })!.findHighlightedOption()!.toSelector(),
      'id'
    );
    const activedescendant = await page.getElementAttribute(
      wrapper.findFilteringInput().findNativeInput().toSelector(),
      'aria-activedescendant'
    );
    await expect(activedescendant).toEqual(highlightedOptionId);
  })
);

test(
  'cuts the dropdown to fit the viewport [inside containers with overflow:hidden]',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new BasePageObject(browser);
    const select = createWrapper().findSelect('#select_overflow');
    const triggerSelector = select.findTrigger().toSelector();
    const optionsSelector = select.findDropdown().findOpenDropdown().toSelector();
    await page.click(triggerSelector);
    const { height: smallestContainerHeight } = await page.getBoundingBox('#smallest_container');
    const { height: triggerHeight } = await page.getBoundingBox(triggerSelector);
    const { height: actualDropdownHeight } = await page.getBoundingBox(optionsSelector);
    const availableDropdownHeight = smallestContainerHeight - triggerHeight;
    expect(actualDropdownHeight).toBeLessThan(availableDropdownHeight);
    const { top: containerScrollTop } = await page.getElementScroll('#smallest_container');
    expect(containerScrollTop).toBe(0);
  })
);

test(
  'allows the select to be opened and closed using space',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new SelectPageObject(browser, createWrapper().findSelect('#select_native_search_simple'));
    await page.focusSelect();
    await page.keys(['Space']);
    await page.waitForAssertion(() => page.assertDropdownOpen(true));
    await page.keys(['ArrowDown', 'Space']);
    await page.waitForAssertion(() => page.assertDropdownOpen(false));
  })
);

test(
  'allows the select to be closed and reopened using space',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new SelectPageObject(browser, createWrapper().findSelect('#select_native_search_simple'));
    await page.focusSelect();
    await page.keys(['Space', 'ArrowDown', 'Space']);
    await page.waitForAssertion(() => page.assertDropdownOpen(false));
    await page.keys(['Space']);
    await page.waitForAssertion(() => page.assertDropdownOpen(true));
  })
);

test(
  'allows to focus the first item by pressing down arrow key',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new SelectPageObject(browser, createWrapper().findSelect('#simple_select'));
    await page.focusSelect();
    await page.keys(['Space']);
    await page.waitForAssertion(() => page.assertDropdownOpen(true));
    await page.keys(['ArrowDown']);
    expect(await page.getHighlightedOptionLabel()).toBe('Option 1');
  })
);

test(
  'allows to focus the last item by pressing up arrow key',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new SelectPageObject(browser, createWrapper().findSelect('#simple_select'));
    await page.focusSelect();
    await page.keys(['Space']);
    await page.waitForAssertion(() => page.assertDropdownOpen(true));
    await page.keys(['ArrowUp']);
    expect(await page.getHighlightedOptionLabel()).toBe('Option 2');
  })
);

test(
  'allows the select to be closed with space and reopened using mouse',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new SelectPageObject(browser, createWrapper().findSelect('#select_native_search_simple'));
    await page.focusSelect();
    await page.keys(['Space', 'ArrowDown', 'Space']);
    await page.waitForAssertion(() => page.assertDropdownOpen(false));
    await page.clickSelect();
    await page.waitForAssertion(() => page.assertDropdownOpen(true));
  })
);

test(
  'keeps simple select in focus after item was selected',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new SelectPageObject(browser, createWrapper().findSelect('#simple_select'));
    await page.focusSelect();
    await page.keys(['Space', 'ArrowDown', 'Enter']);
    await expect(page.isFocused('#simple_select button')).resolves.toBeTruthy();
  })
);

test(
  'keeps expanded select in focus after item was selected',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test');
    const page = new SelectPageObject(browser, createWrapper().findSelect('#expanded_select'));
    await page.focusSelect();
    await page.keys(['Space', 'ArrowDown', 'Enter']);
    await expect(page.isFocused('#expanded_select button')).resolves.toBeTruthy();
  })
);

test(
  'should not scroll when opening select upwards with scroll margin',
  useBrowser(async browser => {
    await browser.url('/#/light/select/select.test.scroll-padding');
    const page = new SelectPageObject(browser, createWrapper().findSelect());
    await page.setWindowSize({ width: 800, height: 250 });
    await page.windowScrollTo({ top: 25 });
    await page.clickSelect();
    await expect(page.getWindowScroll()).resolves.toEqual({ top: 25, left: 0 });
  })
);
