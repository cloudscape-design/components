// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findSideNavigation();

describe('SideNavigation', () => {
  describe('Expandable Link Group', () => {
    it(
      'stays expanded after opening with enter key',
      useBrowser(async browser => {
        await browser.url('#/light/side-navigation/integration');
        const page = new BasePageObject(browser);

        const expandableLinkGroupWrapper = wrapper.findItemByIndex(2);
        const linkSelector = wrapper.findItemByIndex(1).findLink().toSelector();
        const toggleButtonSelector = wrapper.findItemByIndex(2).findExpandableLinkGroup().findExpandIcon().toSelector();
        const expandedSelector = expandableLinkGroupWrapper
          .findExpandableLinkGroup()
          .findExpandedContent()
          .toSelector();

        await page.waitForVisible(toggleButtonSelector);

        // Toggle expand open and close to gain focus.
        await page.click(toggleButtonSelector);
        await page.click(toggleButtonSelector);

        // Tab to header link and press enter.
        await page.keys(['Tab', 'Enter']);

        // Click on the first link outside link group to "reset" it.
        await page.click(linkSelector);

        expect(page.isExisting(expandedSelector)).toBeTruthy();
      })
    );
  });
});
