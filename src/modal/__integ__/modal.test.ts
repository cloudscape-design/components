// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

test(
  'Should focus input after opening the modal',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/with-input-focus');
    await page.click('#open-modal');
    const inputSelector = createWrapper().findInput('#input').findNativeInput().toSelector();
    await expect(page.isFocused(inputSelector)).resolves.toBe(true);
  })
);

test.each(['destructible', 'controlled'])(`should reset focus to previously active element (%s)`, name =>
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/focus-restoration');
    await page.click(`#${name}`);
    await page.keys('Enter');
    await expect(page.isFocused(`#${name}`)).resolves.toBe(true);
  })()
);

test(
  'should not move focus to the modal close button when content focus gets lost',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/focus-restoration');

    // Open modal
    await page.click('#destructible');

    // Select 5th "Remove" button
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await page.keys(['Tab', 'Tab', 'Tab']);
    await expect(page.getFocusedElementText()).resolves.toBe('Remove');

    // Remove attributes until focus moves away from the "Remove" button.
    do {
      await page.keys(['Enter']);
    } while ((await page.getFocusedElementText()) === 'Remove');

    // Expected the focus to go to the body but not the first focusable element of the modal.
    await expect(page.isFocused('body')).resolves.toBe(true);
  })
);

test(
  'should not let the sticky footer cover focused elements',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/scroll-padding');

    // Open modal
    await page.click('[data-testid="modal-trigger"]');
    const modal = createWrapper().findModal();
    const modalContent = modal.findContent();
    const footerSelector = modal.findFooter().toSelector();
    for (let i = 0; i < 100; i++) {
      page.keys('Tab');
      const input = modalContent
        .findAll('div')
        .get(i + 1)
        .find('input');
      const inputSelector = input.toSelector();
      expect(await page.isFocused(inputSelector)).toBe(true);
      const inputBox = await page.getBoundingBox(inputSelector);
      const footerBox = await page.getBoundingBox(footerSelector);
      const inputCenter = inputBox.top + inputBox.height / 2;
      expect(inputCenter).toBeLessThan(footerBox.top);
    }
  })
);

test(
  'should not let content with z-index overlap footer',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/modal/vertical-scroll');

    // Open modal
    await page.click('[data-testid="modal-trigger"]');
    const modal = createWrapper().findModal();
    const footerSelector = modal.findFooter().toSelector();

    // this will throw an error if the footer is overlapped by the content
    await page.click(footerSelector);
  })
);

test(
  'renders modal in async root',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    const modal = createWrapper().findModal();
    await browser.url('#/light/modal/async-modal-root');

    // Open modal
    await page.click('[data-testid="modal-trigger"]');
    // wait for async modal to appear
    await page.waitForVisible(modal.toSelector());

    await expect(page.isExisting('#async-modal-root')).resolves.toBe(true);

    await page.click(modal.findDismissButton().toSelector());
    await expect(page.isExisting('#async-modal-root')).resolves.toBe(false);
  })
);
