// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import EventsAutosuggestPage from './page-objects/events-autosuggest-page';

describe.each<boolean>([false, true])('Autosuggest events (expandToViewport=%s)', expandToViewport => {
  function setupTest(testFn: (page: EventsAutosuggestPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new EventsAutosuggestPage(browser, expandToViewport);
      await browser.url(`/#/light/autosuggest/events?expandToViewport=${expandToViewport}`);
      await testFn(page);
    });
  }

  test(
    'should fire change event when selecting suggestions with ENTER',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['opt']);
      await page.clearEventList();

      await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await page.assertEventsFired(['onChange']);
    })
  );

  test(
    'should allow entering spaces after focusing a dropdown item',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['opt']);
      await page.clearEventList();

      await page.keys(['ArrowDown', 'Space']);
      await page.assertEventsFired(['onChange']);
      await expect(page.getAutosuggestValue()).resolves.toEqual('opt ');
    })
  );

  test(
    'should fire change event when selecting suggestions with mouse',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['opt']);
      await page.clearEventList();

      await page.clickOption(1);
      await page.assertEventsFired(['onChange']);
    })
  );

  test(
    'should not blur when closing dropdown with ESC',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['o', 'ArrowDown', 'Escape', 'Escape']);
      await page.assertEventsFired(['onFocus', 'onChange', 'onChange']);
    })
  );

  test(
    'should blur when tabbing out while dropdown is open',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['o']);
      await page.clearEventList();

      await page.keys(['Tab', 'Tab']);
      await page.assertEventsFired(['onBlur']);
    })
  );

  test(
    'should fire change and blur when tabbing out after changing a selected option',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['o', 'ArrowDown', 'ArrowDown', 'Enter']);
      await page.clearEventList();

      await page.keys(['b', 'Tab', 'Tab']);
      await page.assertEventsFired(['onChange', 'onBlur']);
    })
  );

  test(
    'should fire only one change event when selecting option with mouse then leaving',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['opt']);
      await page.clearEventList();

      await page.clickOption(1);
      await page.focusOutsideInput();
      await page.assertEventsFired(['onChange', 'onBlur']);
    })
  );

  test(
    'should fire only one change event when selecting option with keyboard then leaving',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['opt']);
      await page.clearEventList();

      await page.keys(['ArrowDown', 'Enter']);
      await page.focusOutsideInput();
      await page.assertEventsFired(['onChange', 'onBlur']);
    })
  );

  test(
    'should fire correct events for select, clear blur',
    setupTest(async page => {
      await page.focusInput();
      await page.keys(['opt']);
      await page.clickOption(1);
      await page.clearEventList();

      await page.clickClearInput();
      await page.assertEventsFired(['onChange']);
      await page.clearEventList();

      await page.focusOutsideInput();
      await page.assertEventsFired(['onBlur']);
    })
  );
});
