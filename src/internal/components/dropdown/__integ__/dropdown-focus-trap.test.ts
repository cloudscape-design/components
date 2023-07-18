// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { DropdownPageObject } from './dropdown-page-object';

interface PageSettings {
  expandToViewport: boolean;
  disableHeader?: boolean;
  disableContent?: boolean;
  disableFooter?: boolean;
}

function setupTest(settings: PageSettings, testFn: (page: DropdownPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(settings)) {
      query.set(key, value);
    }
    await browser.url(`#/light/dropdown/focus-trap?${query.toString()}`);
    const page = new DropdownPageObject('test-target', browser);
    await page.waitForVisible(page.getDropdown());
    await page.click(page.getTrigger());
    await testFn(page);
  });
}

describe.each([false, true])('Dropdown focus trap', expandToViewport => {
  test(
    'focus is forward-circled between trigger, header, content and footer',
    setupTest({ expandToViewport }, async page => {
      await expect(page.getFocusedElementText()).resolves.toBe('Trigger');
      await page.keys(['Tab', 'Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('header-2');
      await page.keys(['Tab', 'Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('content-2');
      await page.keys(['Tab', 'Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('footer-2');
      await page.keys(['Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('Trigger');
    })
  );

  test(
    'focus is forward-circled between trigger and footer',
    setupTest({ expandToViewport, disableHeader: true, disableContent: true }, async page => {
      await expect(page.getFocusedElementText()).resolves.toBe('Trigger');
      await page.keys(['Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('footer-1');
      await page.keys(['Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('footer-2');
      await page.keys(['Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('Trigger');
    })
  );

  test(
    'focus is not backward-circled',
    setupTest({ expandToViewport, disableHeader: true, disableContent: true }, async page => {
      await expect(page.getFocusedElementText()).resolves.toBe('Trigger');
      await page.keys(['Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('footer-1');
      await page.keys(['Tab']);
      await expect(page.getFocusedElementText()).resolves.toBe('footer-2');
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.getFocusedElementText()).resolves.toBe('footer-1');
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.getFocusedElementText()).resolves.toBe('Trigger');
      await page.keys(['Shift', 'Tab', 'Null']);
      await expect(page.getFocusedElementText()).resolves.not.toBe('Trigger');
      await expect(page.getFocusedElementText()).resolves.not.toBe('footer-1');
      await expect(page.getFocusedElementText()).resolves.not.toBe('footer-2');
    })
  );
});
