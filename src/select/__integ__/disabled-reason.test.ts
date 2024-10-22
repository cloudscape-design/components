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

  describe('hides disabled reason when the disabled option is scrolled out of view', () => {
    test(
      'by scrolling down from the top',
      setupTest(async page => {
        const select = createWrapper().findSelect();
        await page.clickSelect();
        await page.assertDropdownOpen(true);
        const dropdown = select.findDropdown();
        const disabledOption = select.findDropdown().findOption(1);
        const disabledOptionToolipSelector = disabledOption.findDisabledReason().toSelector();

        await page.hoverElement(disabledOption.toSelector());
        expect(await page.isDisplayed(disabledOptionToolipSelector)).toBe(true);
        await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 500 });
        await page.waitForJsTimers();
        expect(await page.isDisplayed(disabledOptionToolipSelector)).toBe(false);
        await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 0 });
        await page.waitForJsTimers();
        expect(await page.isDisplayed(disabledOptionToolipSelector)).toBe(true);
      })
    );

    test(
      'by scrolling up from the bottom',
      setupTest(async page => {
        const select = createWrapper().findSelect();
        await page.clickSelect();
        await page.assertDropdownOpen(true);
        const dropdown = select.findDropdown();
        const disabledOption = select.findDropdown().findOption(50);
        const disabledOptionToolipSelector = disabledOption.findDisabledReason().toSelector();

        await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 1000 });
        await page.hoverElement(disabledOption.toSelector());
        expect(await page.isDisplayed(disabledOptionToolipSelector)).toBe(true);
        await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 500 });
        await page.waitForJsTimers();
        expect(await page.isDisplayed(disabledOptionToolipSelector)).toBe(false);
        await page.elementScrollTo(dropdown.findOptionsContainer().toSelector(), { top: 1000 });
        await page.waitForJsTimers();
        expect(await page.isDisplayed(disabledOptionToolipSelector)).toBe(true);
      })
    );
  });
});
