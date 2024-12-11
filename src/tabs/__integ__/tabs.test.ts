// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/tabs/styles.selectors.js';

const wrapper = createWrapper().findTabs();

const dismissibleWrapper = createWrapper().findTabs('#dismiss-tabs');

const tabsHeaders = ['First tab', 'Second tab', 'Third tab', 'Fourth tab', 'Fifth tab', 'Sixth tab'];

class TabsPage extends BasePageObject {
  async findActiveTabIndex(): Promise<number> {
    const headerText = await this.getText(wrapper.findActiveTab().toSelector());
    for (let i = 0; i < tabsHeaders.length; i++) {
      if (headerText === tabsHeaders[i]) {
        return i;
      }
    }
    return -1;
  }

  async getScrollLeft(): Promise<number> {
    const scrollPosition = await this.getElementScroll(wrapper.find(`.${styles['tabs-header-list']}`).toSelector());
    return scrollPosition.left;
  }

  getMaxScroll(): Promise<number> {
    return this.browser.execute(selector => {
      const element = document.querySelector(selector)!;
      return element.scrollWidth - element.clientWidth;
    }, `.${styles['tabs-header-list']}`);
  }

  paginationButton(direction: string, scrollable = false): string {
    return `.${styles[`pagination-button-${direction}${scrollable ? '-scrollable' : ''}`]}`;
  }

  async hasPaginationButtons(hasThem: boolean) {
    await expect(this.isExisting(this.paginationButton('left'))).resolves.toBe(hasThem);
    await expect(this.isExisting(this.paginationButton('right'))).resolves.toBe(hasThem);
  }

  async focusTabHeader() {
    await this.click('#before');
    await this.keys(['Tab']);
  }

  async toggleSmallSize() {
    await this.click('#size-toggle');
  }

  async navigateTabList(numPositions: number) {
    const direction = numPositions < 0 ? 'ArrowLeft' : 'ArrowRight';
    for (let i = 0; i < Math.abs(numPositions); i++) {
      await this.keys([direction]);
    }
  }

  getUrl() {
    return this.browser.getUrl();
  }
}

const setupTest = (testFn: (page: TabsPage) => Promise<void>, smallViewport = false) => {
  return useBrowser(async browser => {
    const page = new TabsPage(browser);
    await browser.url('#/light/tabs/responsive-integ');
    await page.waitForVisible(wrapper.findTabContent().toSelector());
    if (smallViewport) {
      await page.setWindowSize({ width: 400, height: 1000 });
    }
    await testFn(page);
  });
};

test(
  'displays pagination buttons in small viewports',
  setupTest(async page => {
    await page.hasPaginationButtons(true);
  }, true)
);

test(
  'does not display pagination buttons in large viewports',
  setupTest(async page => {
    await page.hasPaginationButtons(false);
  }, false)
);

test(
  'reacts to changes in container width',
  setupTest(async page => {
    await page.toggleSmallSize();
    await page.hasPaginationButtons(true);
    await page.toggleSmallSize();
    await page.waitForAssertion(() => page.hasPaginationButtons(false));
  })
);

test(
  'keeps selected tab in view upon width change',
  setupTest(async page => {
    await page.click(wrapper.findTabLinkByIndex(6).toSelector());
    await page.toggleSmallSize();
    await page.waitForAssertion(async () =>
      expect(Math.round(await page.getScrollLeft())).toEqual(await page.getMaxScroll())
    );
  })
);

test(
  'adds and removes pagination buttons at the same point',
  setupTest(async page => {
    const { right } = await page.getBoundingBox(wrapper.findTabHeaderContentByIndex(6).toSelector());
    const width = Math.ceil(right);
    await page.setWindowSize({ width: width - 1, height: 1000 });
    await page.hasPaginationButtons(true);
    await page.setWindowSize({ width: width + 1, height: 1000 });
    await page.hasPaginationButtons(false);
  })
);

test(
  'does not scroll when using arrows',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.navigateTabList(1);
    await expect(page.getScrollLeft()).resolves.toBe(0);
  }, true)
);

test(
  'left/right arrow should have aria-disabled when first/last tab is selected',
  setupTest(async page => {
    await page.setWindowSize({ width: 550, height: 1000 });
    await page.hasPaginationButtons(true);
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(false);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(true);
    await page.focusTabHeader();
    // arrows have a focus ring (and a tab stop) even in disabled state
    await page.keys(['Tab']);
    await page.navigateTabList(7);
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(true);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(false);
  })
);

test(
  'scrolls when clicking on left/right pagination buttons',
  setupTest(async page => {
    // This test assumes that one pagination event leads to the end/beginning of the tabs header
    await page.setWindowSize({ width: 550, height: 1000 });
    await page.click(page.paginationButton('right', true));
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(true);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(false);
    await page.click(page.paginationButton('left', true));
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(false);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(true);
  })
);

test(
  'scrolls when using the left/right pagination buttons with the keyboard',
  setupTest(async page => {
    await page.setWindowSize({ width: 550, height: 1000 });
    await page.focusTabHeader();
    // arrows have a focus ring (and a tab stop) even in disabled state
    await page.keys(['Tab', 'Tab', 'Space']);
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(true);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(false);
    await page.keys(['Shift', 'Tab', 'Shift', 'Tab', 'Space']);
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(false);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(true);
  }, true)
);

test(
  'scrolls when pressing pageUp/pageDown',
  setupTest(async page => {
    // This test assumes that one pagination event leads to the end/beginning of the tabs header
    await page.setWindowSize({ width: 550, height: 1000 });
    await page.focusTabHeader();
    // arrows have a focus ring (and a tab stop) even in disabled state
    await page.keys('Tab');
    await page.keys('PageDown');
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(true);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(false);
    await page.keys('PageUp');
    await expect(page.isExisting(page.paginationButton('left', true))).resolves.toBe(false);
    await expect(page.isExisting(page.paginationButton('right', true))).resolves.toBe(true);
  })
);

test(
  'adds pagination buttons upon changing the tabs array',
  setupTest(async page => {
    await page.setWindowSize({ width: 800, height: 1000 });
    await page.hasPaginationButtons(false);
    await page.click('#add-tab');
    await page.hasPaginationButtons(true);
  })
);

test(
  'scrolls active tab into view upon changing the tabs array',
  setupTest(async page => {
    await page.setWindowSize({ width: 500, height: 1000 });
    await page.click(page.paginationButton('right', true));
    await expect(page.getScrollLeft()).resolves.toBeGreaterThan(0);
    await page.click('#add-tab');
    await page.waitForAssertion(() => expect(page.getScrollLeft()).resolves.toBe(0));
  })
);

test(
  'allows to click on dynamically added tabs',
  setupTest(async page => {
    await page.setWindowSize({ width: 500, height: 1000 });
    await page.click('#add-tab');
    await page.click(page.paginationButton('right', true));
    await page.click(wrapper.findTabLinkByIndex(7).toSelector());
    await page.waitForAssertion(async () =>
      expect(await page.isExisting(page.paginationButton('right', true))).toBe(false)
    );
  })
);

test(
  'does not scroll on click if not needed',
  setupTest(async page => {
    await page.click(wrapper.findTabLinkByIndex(2).toSelector());
    await expect(page.getScrollLeft()).resolves.toBe(0);
  }, true)
);

test(
  'scrolls selected tab header into view when focusing',
  setupTest(async page => {
    await page.click(page.paginationButton('right', true));
    await expect(page.getScrollLeft()).resolves.toBeGreaterThan(200);
    await page.click('#before');
    await page.keys(['Tab', 'Tab']); // Type Tab twice in order to navigate past the scroll left button
    await expect(page.getScrollLeft()).resolves.toBe(0);
  }, true)
);

[false, true].forEach(smallViewport => {
  test(
    'has the same arrow left/right keys behavior when paginated',
    setupTest(async page => {
      await page.click('#before');
      await expect(page.findActiveTabIndex()).resolves.toBe(0);
      if (smallViewport) {
        // arrows have a focus ring (and a tab stop) even in disabled state
        await page.keys('Tab');
      }
      await page.keys(['Tab', 'ArrowRight']);
      await expect(page.findActiveTabIndex()).resolves.toBe(1);
      await page.navigateTabList(7);
      await expect(page.findActiveTabIndex()).resolves.toBe(0);
      await page.navigateTabList(-3);
      await expect(page.findActiveTabIndex()).resolves.toBe(5);
      await page.navigateTabList(-1);
      await expect(page.findActiveTabIndex()).resolves.toBe(3);
    }, smallViewport)
  );
  test(
    'has the same arrow home/end keys behavior when paginated',
    setupTest(async page => {
      await page.focusTabHeader();
      if (smallViewport) {
        // arrows have a focus ring (and a tab stop) even in disabled state
        await page.keys('Tab');
      }
      await page.keys(['End']);
      await page.navigateTabList(-2);
      await expect(page.findActiveTabIndex()).resolves.toBe(5);
      await page.keys(['Home']);
      await expect(page.findActiveTabIndex()).resolves.toBe(0);
    }, smallViewport)
  );
});

test(
  'header buttons do not trigger form submission',
  setupTest(async page => {
    const urlBefore = await page.getUrl();
    await page.click(wrapper.find(page.paginationButton('left')).toSelector());
    await page.click(wrapper.find(page.paginationButton('right')).toSelector());
    const urlAfter = await page.getUrl();

    expect(urlAfter).toEqual(urlBefore);
  }, true)
);

test(
  'allows to focus on tab content area',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.keys(['Tab']);
    await expect(page.isFocused(wrapper.findTabContent().toSelector())).resolves.toBe(true);
  })
);

test(
  'verifies focus moves from dismissible to tab content on tab press',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.click(wrapper.findTabLinkByIndex(3).toSelector());
    await page.navigateTabList(1);
    await page.keys(['Tab']);
    await expect(page.isFocused(wrapper.findTabContent().toSelector())).resolves.toBe(true);
  })
);

test(
  'verifies focus moves from non-active tab dismissible/action to active tab content on tab press',
  setupTest(async page => {
    await page.focusTabHeader();
    // Tests focus shifts from dismissible -> active tab content
    await page.click(wrapper.findTabLinkByIndex(1).toSelector());
    await page.navigateTabList(-1);
    await page.keys(['Tab']);
    await expect(page.isFocused(wrapper.findTabContent().toSelector())).resolves.toBe(true);
    // Tests focus shifts from action -> active tab content
    await page.click(wrapper.findTabLinkByIndex(1).toSelector());
    await page.navigateTabList(-2);
    await page.keys(['Tab']);
    await expect(page.isFocused(wrapper.findTabContent().toSelector())).resolves.toBe(true);
  })
);

test(
  'Verifies focus moves to last active tab after dismiss fires',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.navigateTabList(2);
    await page.navigateTabList(-3);
    await page.keys(['Enter']);
    await expect(page.isFocused(wrapper.findTabLinkByIndex(1).toSelector())).resolves.toBe(true);
  })
);

test(
  '(Keyboard) verifies focus moves from dismissible tab to next tab after dismiss fires',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.navigateTabList(7);
    await page.keys(['Enter']);
    await expect(page.isFocused(wrapper.findTabLinkByIndex(4).toSelector())).resolves.toBe(true);
  })
);

test(
  '(Mouse) verifies focus moves from dismissible tab to next tab after dismiss fires',
  setupTest(async page => {
    await page.click(wrapper.findTabLinkByIndex(6).toSelector());
    await page.click(wrapper.findActiveTabDismissibleButton().getElement());
    await expect(page.isFocused(wrapper.findTabLinkByIndex(4).toSelector())).resolves.toBe(true);
  })
);

test(
  'Verifies focus remains on first active tab when dismiss fires',
  setupTest(async page => {
    await page.click(wrapper.findDismissibleButtonByTabIndex(6).toSelector());
    await expect(page.isFocused(wrapper.findTabLinkByIndex(1).toSelector())).resolves.toBe(true);
  })
);

test(
  'verifies dismissible event fires',
  setupTest(async page => {
    await page.click(dismissibleWrapper.findTabLinkByIndex(3).toSelector());
    await page.navigateTabList(1);
    await page.keys(['Enter']);
    await expect(page.isFocused(dismissibleWrapper.findTabLinkByIndex(1).toSelector())).resolves.toBe(true);
  })
);

test(
  'verifies focus moves from action to tab content on tab press',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.click(wrapper.findTabLinkByIndex(6).toSelector());
    await page.navigateTabList(1);
    await page.keys(['Tab']);
    await expect(page.isFocused(wrapper.findTabContent().toSelector())).resolves.toBe(true);
  })
);

test(
  'verifies focus is trapped when action is open',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.click(wrapper.findTabLinkByIndex(6).toSelector());
    await page.navigateTabList(1);
    await page.keys(['Enter']);
    await expect(page.isDisplayed(wrapper.findTabLinkByIndex(6).toSelector())).resolves.toBe(true);
    await page.navigateTabList(2);
    await page.navigateTabList(-3);
    await expect(page.isDisplayed(wrapper.findTabLinkByIndex(6).toSelector())).resolves.toBe(true);
  })
);

test(
  'verifies focus moves to action and dismissible via keyboard',
  setupTest(async page => {
    await page.focusTabHeader();

    const originalTabAction = wrapper.findActiveTabAction();
    const originalTabDismissible = wrapper.findActiveTabDismissibleButton();
    await page.click(wrapper.findTabLinkByIndex(6).toSelector());
    await page.navigateTabList(2);
    const currentTabAction = wrapper.findActiveTabAction();
    const currentTabDismissible = wrapper.findActiveTabDismissibleButton();

    await expect(currentTabAction).not.toBe(originalTabAction);
    await expect(currentTabDismissible).not.toBe(originalTabDismissible);
    await expect(page.isDisplayed(currentTabAction.toSelector())).resolves.toBe(true);
    await expect(page.isDisplayed(currentTabDismissible.toSelector())).resolves.toBe(true);
  })
);

test(
  '(Keyboard) verifies focus does NOT move on a static dismissible tab',
  setupTest(async page => {
    await page.focusTabHeader();
    await page.navigateTabList(3);
    await page.keys(['Enter']);
    await page.navigateTabList(-1);
    await expect(page.isFocused(wrapper.findTabLinkByIndex(3).toSelector())).resolves.toBe(true);
  })
);

test(
  '(Mouse) verifies focus does NOT move on a static dismissible tab',
  setupTest(async page => {
    await page.click(wrapper.findTabLinkByIndex(3).toSelector());
    await page.click(wrapper.findActiveTabDismissibleButton().getElement());
    await page.navigateTabList(-1);
    await expect(page.isFocused(wrapper.findTabLinkByIndex(3).toSelector())).resolves.toBe(true);
  })
);
