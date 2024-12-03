// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import ButtonDropdownPage from '../../__integ__/page-objects/button-dropdown-page';

test(
  'follow external link in button dropdown group',
  useBrowser(async browser => {
    const page = new ButtonDropdownPage('ButtonDropdown4', browser);
    await browser.url('#/light/button-dropdown/simple');
    await page.waitForVisible(page.getTrigger());
    await page.openDropdown();
    await expect(page.isDropdownOpen()).resolves.toBe(true);
    await page.click('[data-testid=states]');
    await page.click('[data-testid=external]');

    expect(await browser.getWindowHandles()).toHaveLength(2);
  })
);

test(
  'focuses on correct button-dropdown when the two are opened one after another',
  useBrowser(async browser => {
    const page1 = new ButtonDropdownPage('ButtonDropdown3', browser);
    const page2 = new ButtonDropdownPage('ButtonDropdown1', browser);
    await browser.url('#/light/button-dropdown/simple');

    await page1.waitForVisible(page1.getTrigger());
    await page1.openDropdown();
    await page2.openDropdown();

    await expect(page2.getFocusedElementText()).resolves.toBe('Option 1');
    await expect(page2.getHighlightedElementText()).resolves.toBe('Option 1');
  })
);

test(
  'focus on first menu item when dropdown is opened',
  useBrowser(async browser => {
    const page = new ButtonDropdownPage('ButtonDropdown1', browser);
    await browser.url('#/light/button-dropdown/simple');

    await page.waitForVisible(page.getTrigger());
    await page.openDropdown();

    await expect(page.getFocusedElementText()).resolves.toBe('Option 1');
    await expect(page.getHighlightedElementText()).resolves.toBe('Option 1');
  })
);

test(
  'focus stays on the trigger on mobiles',
  useBrowser(async browser => {
    const page = new ButtonDropdownPage('ButtonDropdown1', browser);
    await browser.url('#/light/button-dropdown/simple');

    await page.setWindowSize({ width: 400, height: 800 });
    await page.waitForVisible(page.getTrigger());
    await page.openDropdown();

    await expect(page.getFocusedElementText()).resolves.toBe('Two');
  })
);

test(
  'pressing arrow-down after the dropdown was opened moves the focus to the next item',
  useBrowser(async browser => {
    const page = new ButtonDropdownPage('ButtonDropdown3', browser);
    await browser.url('#/light/button-dropdown/simple');

    await page.waitForVisible(page.getTrigger());
    await page.openDropdown();
    await page.keys('ArrowDown');

    await expect(page.getFocusedElementText()).resolves.toBe('Restart');
    await expect(page.getHighlightedElementText()).resolves.toBe('Restart');
  })
);
