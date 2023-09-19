// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//import * as React from 'react';
//import { AnchorNavigationWrapper } from '../../../lib/components/test-utils/dom';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findAnchorNavigation();

class AnchorNavigationPage extends BasePageObject {
  async getElementYPosition(elementSelector: string) {
    const position = await this.browser.$(elementSelector).getLocation('y');
    return position;
  }
}

describe('AnchorNavigation', () => {
  function setupTest(testFn: (page: AnchorNavigationPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new AnchorNavigationPage(browser);
      await browser.url('#/light/anchor-navigation/basic');
      await testFn(page);
    });
  }

  test(
    'AnchorNavigation is defined',
    setupTest(async () => {
      return expect(await wrapper).toBeTruthy();
    })
  );

  test(
    'the first anchor item is active on initial render',
    setupTest(async page => {
      const firstAnchor = wrapper.findAnchorByIndex(0).findLink();
      return expect(await page.getElementAttribute(firstAnchor.toSelector(), 'aria-current')).toBe('true');
    })
  );

  test(
    'the correct aria-labelledby attribute is applied',
    setupTest(async page => {
      return expect(await page.getElementAttribute(wrapper.toSelector(), 'aria-labelledby')).toBe('anchor-nav-heading');
    })
  );

  test(
    'clicking in a anchor link makes the respective anchor item active',
    setupTest(async page => {
      // Get element position in page
      const targetAnchorLink = await wrapper.findAnchorLinkByHref('#section-1-1-1');
      expect(await page.getElementAttribute(targetAnchorLink.toSelector(), 'aria-current')).toBeNull;
      await page.click(targetAnchorLink.toSelector());
      await page.waitForVisible('#section-1-1-1');
      return expect(await page.getElementAttribute(targetAnchorLink.toSelector(), 'aria-current')).toBe('true');
    })
  );

  test(
    'scrolling to a section makes the respective anchor item active',
    setupTest(async page => {
      const sectionSelector = '#section-1-2';
      await page.windowScrollTo({ top: await page.getElementYPosition(sectionSelector) });
      await page.waitForVisible(sectionSelector);
      const targetAnchorLink = await wrapper.findAnchorLinkByHref(sectionSelector);
      return expect(await page.getElementAttribute(targetAnchorLink.toSelector(), 'aria-current')).toBe('true');
    })
  );

  test(
    'scrolling to the end of the page makes the last anchor item active',
    setupTest(async page => {
      const lastAnchorLink = await wrapper.findAnchorLinkByHref('#section-1-2-1-1');
      await page.windowScrollTo({ top: 99999 }); // Very high value to ensure we are scrolled to the end
      return expect(await page.getElementAttribute(lastAnchorLink.toSelector(), 'aria-current')).toBe('true');
    })
  );
});
