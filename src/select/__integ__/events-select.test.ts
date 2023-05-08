// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import EventsSelectPage from './page-objects/events-select-page';
import createWrapper from '../../../lib/components/test-utils/selectors';

function setupTest(
  testFn: (page: EventsSelectPage) => Promise<void>,
  expandToViewport?: boolean,
  enableFiltering?: boolean
) {
  return useBrowser(async browser => {
    const wrapper = createWrapper().findSelect();
    const page = new EventsSelectPage(browser, wrapper);
    await browser.url('/#/light/select/select.test.events');
    if (expandToViewport) {
      await page.expandToViewport();
    }
    if (enableFiltering) {
      await page.enableFiltering();
    }
    await testFn(page);
  });
}

describe.each<[boolean, boolean]>([
  [true, true],
  [true, false],
  [false, true],
  [false, false],
])('Select events (expandToViewport=%s enableFiltering=%s)', (expandToViewport, enableFiltering) => {
  test(
    'should fire change event when selecting options with ENTER',
    setupTest(
      async page => {
        await page.focusSelect();
        await page.keys(['ArrowDown', 'ArrowDown', 'Enter']);
        await page.assertEventsFired(['onFocus', 'onChange']);
      },
      expandToViewport,
      enableFiltering
    )
  );

  if (!enableFiltering) {
    test(
      'should fire change event when selecting options with SPACE',
      setupTest(
        async page => {
          await page.focusSelect();
          await page.keys('ArrowDown');
          // make sure there is an extra react render between these two keys
          await page.keys('Space');
          await page.assertEventsFired(['onFocus', 'onChange']);
        },
        expandToViewport,
        enableFiltering
      )
    );
  }

  test(
    'should fire change event when selecting options with mouse',
    setupTest(
      async page => {
        await page.focusSelect();
        await page.keys(['ArrowDown']);
        await page.clearEventList();

        await page.clickOption(1, expandToViewport);
        await page.assertEventsFired(['onChange']);
      },
      expandToViewport,
      enableFiltering
    )
  );

  test(
    'should fire only one change event when selecting option with mouse then leaving',
    setupTest(
      async page => {
        await page.focusSelect();
        await page.keys(['ArrowDown']);
        await page.clearEventList();

        await page.clickOption(1, expandToViewport);
        await page.focusOutsideInput();
        await page.assertEventsFired(['onChange', 'onBlur']);
      },
      expandToViewport,
      enableFiltering
    )
  );

  test(
    'should fire only one change event when selecting option with keyboard then leaving',
    setupTest(
      async page => {
        await page.focusSelect();
        await page.keys(['ArrowDown']);
        await page.clearEventList();

        await page.keys(['Enter']);
        await page.focusOutsideInput();
        await page.assertEventsFired(['onChange', 'onBlur']);
      },
      expandToViewport,
      enableFiltering
    )
  );

  test(
    'should not blur when closing dropdown with ESC',
    setupTest(
      async page => {
        await page.focusSelect();
        await page.keys(['ArrowDown', 'Escape']);
        await page.assertEventsFired(['onFocus']);
      },
      expandToViewport,
      enableFiltering
    )
  );

  test(
    'should blur when tabbing out while dropdown is open',
    setupTest(
      async page => {
        await page.focusSelect();
        await page.keys(['ArrowDown']);
        await page.clearEventList();

        // With expandToViewport, focus is returned back to the trigger.
        if (expandToViewport) {
          await page.keys(['Tab']);
          await page.assertEventsFired([]);
        }

        await page.keys(['Tab']);
        await page.assertEventsFired(['onBlur']);
      },
      expandToViewport,
      enableFiltering
    )
  );
});
