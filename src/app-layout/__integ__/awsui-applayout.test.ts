// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import mobileStyles from '../../../lib/components/app-layout/mobile-toolbar/styles.selectors.js';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();
const mobileSelector = `.${mobileStyles['mobile-bar']}`;

class AppLayoutPage extends BasePageObject {
  getNavPosition() {
    return this.getBoundingBox(wrapper.findNavigation().findSideNavigation().findHeaderLink().toSelector());
  }

  getContentPosition() {
    return this.getBoundingBox(wrapper.findContentRegion().find('h1').toSelector());
  }

  async trackResizeObserverErrors() {
    await this.browser.execute(() => {
      // Resize observer errors are not logged into the devtools messages by default
      // https://github.com/w3c/csswg-drafts/issues/5248
      window.addEventListener('error', event => {
        if (event.message.startsWith('ResizeObserver')) {
          console.error(event.message);
        }
      });
    });
  }
}

function setupTest(
  { viewport = viewports.desktop, pageName = 'default', trackResizeObserverErrors = true, visualRefresh = false },
  testFn: (page: AppLayoutPage) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new AppLayoutPage(browser);
    await page.setWindowSize(viewport);
    await browser.url(`#/light/app-layout/${pageName}?visualRefresh=${visualRefresh}`);
    if (trackResizeObserverErrors) {
      await page.trackResizeObserverErrors();
    }
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

for (const visualRefresh of [true, false]) {
  test(
    'renders initial state with default content type',
    setupTest({ visualRefresh }, async page => {
      await expect(page.isDisplayed(wrapper.findNavigationToggle().toSelector())).resolves.toBe(false);
      await expect(page.isDisplayed(wrapper.findNavigationClose().toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(wrapper.findToolsToggle().toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(false);
      await expect(page.isDisplayed(wrapper.findSplitPanel().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'renders initial state with wizard content type',
    setupTest({ pageName: 'with-wizard', visualRefresh }, async page => {
      await expect(page.isDisplayed(wrapper.findNavigationToggle().toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(wrapper.findNavigationClose().toSelector())).resolves.toBe(false);
      await expect(page.isDisplayed(wrapper.findToolsToggle().toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'switches between mobile and desktop modes',
    setupTest({ viewport: viewports.desktop }, async page => {
      await expect(page.isExisting(mobileSelector)).resolves.toBe(false);
      await page.setWindowSize(viewports.mobile);
      await expect(page.isExisting(mobileSelector)).resolves.toBe(true);
      await page.setWindowSize(viewports.desktop);
      await expect(page.isExisting(mobileSelector)).resolves.toBe(false);
    })
  );

  test(
    'preserves inner content state when switching between mobile and desktop',
    setupTest({ viewport: viewports.desktop, pageName: 'stateful' }, async page => {
      await page.click('#content-button');
      await expect(page.getText('#content-text')).resolves.toBe('Clicked: 1');
      await page.setWindowSize(viewports.mobile);
      await expect(page.getText('#content-text')).resolves.toBe('Clicked: 1');
    })
  );

  test(
    'does not preserve breadcrumbs state',
    setupTest({ viewport: viewports.desktop, pageName: 'stateful' }, async page => {
      await page.click('#breadcrumbs-button');
      await expect(page.getText('#breadcrumbs-text')).resolves.toBe('Clicked: 1');
      await page.setWindowSize(viewports.mobile);
      await expect(page.getText('#breadcrumbs-text')).resolves.toBe('Clicked: 0');
    })
  );

  test(
    'preserves inner state when drawer closes and opens',
    setupTest({ pageName: 'stateful' }, async page => {
      await page.click('#navigation-button');
      await expect(page.getText('#navigation-text')).resolves.toBe('Clicked: 1');
      await page.click(wrapper.findNavigationClose().toSelector());
      await page.click(wrapper.findNavigationToggle().toSelector());
      await expect(page.getText('#navigation-text')).resolves.toBe('Clicked: 1');
    })
  );

  test(
    'keeps drawer open state when resizing the screen',
    setupTest({}, async page => {
      await page.click(wrapper.findToolsToggle().toSelector());
      await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
      await page.setWindowSize(viewports.mobile);
      await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'keeps drawer closed state when resizing the screen',
    setupTest({}, async page => {
      await page.click(wrapper.findNavigationClose().toSelector());
      await expect(page.isDisplayed(wrapper.findNavigationClose().toSelector())).resolves.toBe(false);
      await page.setWindowSize(viewports.mobile);
      await expect(page.isDisplayed(wrapper.findNavigationClose().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'scrolling content does not affect drawers',
    setupTest({}, async page => {
      const navBefore = await page.getNavPosition();
      const contentBefore = await page.getContentPosition();
      await page.windowScrollTo({ top: 100 });
      await expect(page.getNavPosition()).resolves.toEqual(navBefore);
      await expect(page.getContentPosition()).resolves.not.toEqual(contentBefore);
    })
  );

  test(
    'scrolling drawer does not affect content',
    setupTest({}, async page => {
      const navBefore = await page.getNavPosition();
      const contentBefore = await page.getContentPosition();
      await page.elementScrollTo(wrapper.findNavigation().toSelector(), { top: 100 });
      await expect(page.getNavPosition()).resolves.not.toEqual(navBefore);
      await expect(page.getContentPosition()).resolves.toEqual(contentBefore);
    })
  );

  test(
    'preserves content scroll position when mobile drawer opens and closes',
    setupTest({ viewport: viewports.mobile }, async page => {
      const contentBefore = await page.getContentPosition();
      await page.click(wrapper.findNavigationToggle().toSelector());
      const navBefore = await page.getNavPosition();
      await page.elementScrollTo(wrapper.findNavigation().toSelector(), { top: 100 });
      await expect(page.getNavPosition()).resolves.not.toEqual(navBefore);
      await page.click(wrapper.findNavigationClose().toSelector());
      await expect(page.getContentPosition()).resolves.toEqual(contentBefore);
    })
  );
}

test(
  'does not render notifications slot when it is empty',
  setupTest({ pageName: 'with-notifications', visualRefresh: true, trackResizeObserverErrors: false }, async page => {
    const { height: originalHeight } = await page.getBoundingBox(wrapper.findNotifications().toSelector());
    expect(originalHeight).toBeGreaterThan(0);
    await page.click(wrapper.findNotifications().findFlashbar().findItems().get(1).findDismissButton().toSelector());
    const { height: newHeight } = await page.getBoundingBox(wrapper.findNotifications().toSelector());
    expect(newHeight).toEqual(0);
  })
);
