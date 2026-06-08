// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const select = createWrapper().findSelect();
// The dev page renders the consumer's <button> as a direct child of the wrapper.
const customTriggerButton = select.findCustomTrigger().find('button');

function setup(testFn: (browser: WebdriverIO.Browser) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('/#/light/select/render-custom-trigger');
    await browser.waitUntil(() => browser.$(customTriggerButton.toSelector()).isExisting(), {
      timeout: 5_000,
      timeoutMsg: 'Custom trigger button never appeared on the dev page',
    });
    await testFn(browser);
  });
}

describe('Select renderCustomTrigger', () => {
  test(
    'click on the custom trigger opens the dropdown',
    setup(async browser => {
      // Closed initially.
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(false);

      await browser.$(customTriggerButton.toSelector()).click();
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(true);
    })
  );

  test(
    'clicking the custom trigger again closes the dropdown',
    setup(async browser => {
      await browser.$(customTriggerButton.toSelector()).click();
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(true);

      await browser.$(customTriggerButton.toSelector()).click();
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(false);
    })
  );

  test(
    'selecting an option closes the dropdown and updates the trigger label',
    setup(async browser => {
      // Initial label reflects the first option ("Create a case") — the dev page initialises selectedOption to options[0].
      await expect(browser.$(customTriggerButton.toSelector()).getText()).resolves.toContain('Create a case');

      await browser.$(customTriggerButton.toSelector()).click();
      // Click the second option ("AI assist, then create a case").
      await browser.$(select.findDropdown().findOption(2).toSelector()).click();

      // Dropdown closes after selection.
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(false);
      // Trigger label updates.
      await expect(browser.$(customTriggerButton.toSelector()).getText()).resolves.toContain('AI assist');
    })
  );

  test(
    'Enter key on focused custom trigger opens the dropdown (native button behavior)',
    setup(async browser => {
      // Focus the custom trigger via keyboard tabbing from document body.
      await browser.execute((selector: string) => {
        document.querySelector<HTMLButtonElement>(selector)!.focus();
      }, customTriggerButton.toSelector());

      await browser.keys(['Enter']);
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(true);
    })
  );

  test(
    'Space key on focused custom trigger opens the dropdown (native button behavior)',
    setup(async browser => {
      await browser.execute((selector: string) => {
        document.querySelector<HTMLButtonElement>(selector)!.focus();
      }, customTriggerButton.toSelector());

      await browser.keys(['Space']);
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(true);
    })
  );

  test(
    'Escape closes the dropdown',
    setup(async browser => {
      await browser.$(customTriggerButton.toSelector()).click();
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(true);

      await browser.keys(['Escape']);
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(false);
    })
  );

  test(
    'focus returns to the custom trigger after the dropdown closes',
    setup(async browser => {
      await browser.$(customTriggerButton.toSelector()).click();
      await expect(browser.$(select.findDropdown().findOpenDropdown().toSelector()).isExisting()).resolves.toBe(true);

      await browser.keys(['Escape']);

      // The custom <button> we render in the dev page should be the active element.
      const focusedSelector = await browser.execute((selector: string) => {
        const expected = document.querySelector<HTMLButtonElement>(selector);
        return expected !== null && document.activeElement === expected;
      }, customTriggerButton.toSelector());
      expect(focusedSelector).toBe(true);
    })
  );

  test(
    'aria-expanded reflects the dropdown open state on the consumer element',
    setup(async browser => {
      await expect(browser.$(customTriggerButton.toSelector()).getAttribute('aria-expanded')).resolves.toBe('false');

      await browser.$(customTriggerButton.toSelector()).click();
      await expect(browser.$(customTriggerButton.toSelector()).getAttribute('aria-expanded')).resolves.toBe('true');

      await browser.keys(['Escape']);
      await expect(browser.$(customTriggerButton.toSelector()).getAttribute('aria-expanded')).resolves.toBe('false');
    })
  );

  test(
    'aria-haspopup="listbox" is set on the consumer element (consumer contract)',
    setup(async browser => {
      await expect(browser.$(customTriggerButton.toSelector()).getAttribute('aria-haspopup')).resolves.toBe('listbox');
    })
  );
});
