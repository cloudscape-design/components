// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import SelectPageObject from './page-objects/select-page';

function setupTest(testFn: (page: SelectPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    await browser.url('/#/light/select/disabled-reason');
    const select = createWrapper().findSelect();
    const page = new SelectPageObject(browser, select);
    await testFn(page);
  });
}

describe('Disabled reasons', () => {
  test(
    'shows disabled reason on hover',
    setupTest(async page => {
      await page.pause(100);
      const select = createWrapper().findSelect();
      await page.clickSelect();
      await page.assertDropdownOpen(true);
      const firstDisabledOption = select.findDropdown().findOption(1);
      await page.hoverElement(firstDisabledOption.toSelector());
      const disabledTooltip = firstDisabledOption.findDisabledReason();
      await page.waitForJsTimers();
      expect(await page.isDisplayed(disabledTooltip.toSelector())).toBe(true);
    })
  );

  test(
    'hides disabled reason when the disabled option is scrolled out of view',
    setupTest(async page => {
      await page.pause(100);
      const select = createWrapper().findSelect();
      await page.clickSelect();
      await page.assertDropdownOpen(true);
      const dropdown = select.findDropdown();
      const firstDisabledOption = select.findDropdown().findOption(1);
      await page.hoverElement(firstDisabledOption.toSelector());
      const disabledTooltipSelector = firstDisabledOption.findDisabledReason().toSelector();
      expect(await page.isDisplayed(disabledTooltipSelector)).toBe(true);
      await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 500 });
      await page.waitForJsTimers();
      expect(await page.isDisplayed(disabledTooltipSelector)).toBe(false);
      await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 0 });
      await page.waitForJsTimers();
      expect(await page.isDisplayed(disabledTooltipSelector)).toBe(true);
    })
  );
});
