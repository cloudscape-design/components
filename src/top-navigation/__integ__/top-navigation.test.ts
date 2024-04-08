// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import '../../../lib/components/test-utils/selectors';
import TopNavigationWrapper from '../../../lib/components/test-utils/selectors/top-navigation';

const wrapper = new TopNavigationWrapper(`.${TopNavigationWrapper.rootSelector}`);

class TopNavigationPage extends BasePageObject {
  getLocation() {
    return this.browser.getUrl();
  }
}

const setupTest = (pageWidth: number, testFn: (page: TopNavigationPage) => Promise<void>) => {
  return useBrowser(async browser => {
    await browser.url('#/light/top-navigation/integ');
    const page = new TopNavigationPage(browser);
    await page.setWindowSize({ width: pageWidth, height: 600 });
    await page.waitForVisible(wrapper.toSelector());
    await testFn(page);
  });
};

describe('Top navigation', () => {
  describe('expanded viewport', () => {
    const pageWidth = 1100;

    test(
      'renders utilities with text',
      setupTest(pageWidth, async page => {
        await expect(page.getText(wrapper.findUtility(1).toSelector())).resolves.toBe('New thing');
        await expect(page.getText(wrapper.findUtility(2).toSelector())).resolves.toBe('Docs ');
        await expect(page.getText(wrapper.findUtility(4).toSelector())).resolves.toBe('John Doe');
      })
    );

    test(
      'respects preventDefault on button onClick handler',
      setupTest(pageWidth, async page => {
        const previousLocation = await page.getLocation();
        await page.click(wrapper.findUtility(3).toSelector());
        await expect(page.getLocation()).resolves.toBe(previousLocation);
      })
    );

    test(
      'renders the contents of the search slot',
      setupTest(pageWidth, async page => {
        await expect(page.isExisting(wrapper.findSearch().findInput().toSelector())).resolves.toBe(true);
      })
    );
  });

  describe('labels hidden', () => {
    const pageWidth = 900;

    test(
      'renders utilities without text if allowed',
      setupTest(pageWidth, async page => {
        await expect(page.getText(wrapper.findUtility(4).toSelector())).resolves.toBe('');

        // New thing shouldn't be collapsed because disableTextCollapse is set.
        await expect(page.getText(wrapper.findUtility(1).toSelector())).resolves.toBe('New thing');

        // Docs shouldn't be collapsed because it doesn't have an icon.
        await expect(page.getText(wrapper.findUtility(2).toSelector())).resolves.toBe('Docs ');
      })
    );
  });

  describe('search hidden', () => {
    const pageWidth = 700;

    test(
      'hides the search slot by default',
      setupTest(pageWidth, async page => {
        await expect(page.isExisting(wrapper.findSearch().findInput().toSelector())).resolves.toBe(false);
      })
    );

    test(
      'renders the search slot when the search utility is clicked',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findSearchButton().toSelector());
        await expect(page.isExisting(wrapper.findSearch().findInput().toSelector())).resolves.toBe(true);
      })
    );

    test(
      'focuses the search input when the search utility is clicked',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findSearchButton().toSelector());
        const searchInput = wrapper.findSearch().findInput().findNativeInput().toSelector();
        await expect(page.isFocused(searchInput)).resolves.toBe(true);
      })
    );

    test(
      'hides the search slot when the search button is clicked again',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findSearchButton().toSelector());
        await expect(page.isExisting(wrapper.findSearch().findInput().toSelector())).resolves.toBe(true);
        await page.click(wrapper.findSearchButton().toSelector());
        await expect(page.isExisting(wrapper.findSearch().findInput().toSelector())).resolves.toBe(false);
      })
    );
  });

  describe('all collapsable utilities collapsed', () => {
    const pageWidth = 400;
    const overflowMenu = wrapper.findOverflowMenu();

    test(
      'focuses utilities with no href in mobile using keyboard navigation',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.click(overflowMenu.findUtility(3).toSelector());
        await page.keys(['Tab', 'Tab']);
        const signOutButton = overflowMenu.findMenuDropdownItemById('signout').toSelector();
        await expect(page.isFocused(signOutButton)).resolves.toBe(true);
      })
    );

    test(
      'collapses all utilities except ones marked "disableUtilityCollapse"',
      setupTest(pageWidth, async page => {
        await expect(page.getElementsCount(wrapper.findUtilities().toSelector())).resolves.toBe(1);
        await expect(
          page.getElementAttribute(wrapper.findUtility(1)!.findButtonLinkType()!.toSelector(), 'aria-label')
        ).resolves.toBe('Notifications');
      })
    );

    test(
      'displays an overflow menu trigger',
      setupTest(pageWidth, async page => {
        await expect(page.getText(wrapper.findOverflowMenuButton().toSelector())).resolves.toBe('More');
      })
    );

    test(
      'renders title and description correctly',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.waitForVisible(overflowMenu.toSelector());
        await expect(page.getText(overflowMenu.findTitle().toSelector())).resolves.toBe('All');

        await page.click(overflowMenu.findUtility(3).toSelector());
        await expect(page.getText(overflowMenu.findTitle().toSelector())).resolves.toBe('John Doe');
        await expect(page.getText(overflowMenu.findDescription().toSelector())).resolves.toBe('john.doe@example.com');
      })
    );

    test(
      'back button navigates back to the utilities menu',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.waitForVisible(overflowMenu.toSelector());
        await page.click(overflowMenu.findUtility(3).toSelector());
        await expect(page.getText(overflowMenu.findTitle().toSelector())).resolves.toBe('John Doe');
        await page.click(overflowMenu.findBackButton().toSelector());
        await expect(page.getText(overflowMenu.findTitle().toSelector())).resolves.toBe('All');
        await expect(page.isFocused(overflowMenu.findUtility(3).toSelector())).resolves.toBe(true);
      })
    );

    test(
      'dismiss button closes the overflow menu and places focus back on menu trigger',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.waitForVisible(overflowMenu.toSelector());
        await page.click(overflowMenu.findDismissButton().toSelector());

        await page.waitForVisible(`:not(${overflowMenu.toSelector()})`);
        await expect(page.isExisting(overflowMenu.toSelector())).resolves.toBe(false);
        await page.waitForJsTimers();
        await expect(page.isFocused(wrapper.findOverflowMenuButton().toSelector())).resolves.toBe(true);
      })
    );

    test(
      'calls onClick on utilities when clicked through the overflow menu',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.waitForVisible(overflowMenu.toSelector());
        await page.click(overflowMenu.findUtility(1).toSelector());

        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.waitForVisible(overflowMenu.toSelector());
        await page.click(overflowMenu.findUtility(2).toSelector());

        await page.waitForVisible(`:not(${overflowMenu.toSelector()})`);
        await expect(page.isExisting(overflowMenu.toSelector())).resolves.toBe(false);

        await expect(page.getText('#events')).resolves.toBe(`{}\n{}`);
        await page.click('#clear');
      })
    );

    test(
      'calls onItemClick on menu dropdown items when clicked through the overflow menu',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.click(overflowMenu.findUtility(3).toSelector());
        await page.click(overflowMenu.findMenuDropdownItemById('signout').toSelector());
        await expect(page.getText('#events')).resolves.toBe(`{"id":"signout"}`); // '"href": undefined' gets stripped during JSON.stringify
        await page.click('#clear');
      })
    );

    test(
      'has expected keyboard interactions',
      setupTest(pageWidth, async page => {
        await page.click(wrapper.findOverflowMenuButton().toSelector());
        await page.click(overflowMenu.findUtility(3).toSelector());
        await page.click(overflowMenu.findMenuDropdownItemById('signout').toSelector());
        await expect(page.getText('#events')).resolves.toBe(`{"id":"signout"}`); // '"href": undefined' gets stripped during JSON.stringify
        await page.click('#clear');
      })
    );
  });
});
