// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';
import { getUrlParams, Theme } from './utils';

import testutilStyles from '../../../lib/components/app-layout/test-classes/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();
const mobileSelector = `.${testutilStyles['mobile-bar']}`;

class AppLayoutPage extends BasePageObject {
  async visit(url: string) {
    await this.browser.url(url);
    await this.waitForVisible(wrapper.findContentRegion().toSelector());
  }

  getNavPosition() {
    return this.getBoundingBox(wrapper.findNavigation().findSideNavigation().findHeaderLink().toSelector());
  }

  getContentPosition() {
    return this.getBoundingBox(wrapper.findContentRegion().find('h1').toSelector());
  }
}

describe.each(['classic', 'refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest(
    { viewport = viewports.desktop, pageName = 'default', extraParams = {} },
    testFn: (page: AppLayoutPage) => Promise<void>
  ) {
    return useBrowser(async browser => {
      const page = new AppLayoutPage(browser);
      await page.setWindowSize(viewport);
      await page.visit(`#/light/app-layout/${pageName}?${getUrlParams(theme, extraParams)}`);
      await testFn(page);
    });
  }

  test(
    'renders initial state with default content type',
    setupTest({}, async page => {
      if (theme !== 'refresh-toolbar') {
        await expect(page.isDisplayed(wrapper.findNavigationToggle().toSelector())).resolves.toBe(false);
        await expect(page.isDisplayed(wrapper.findToolsToggle().toSelector())).resolves.toBe(true);
      } else {
        await expect(page.isDisplayed(wrapper.findNavigationToggle().toSelector())).resolves.toBe(true);
        await expect(page.isDisplayed(wrapper.findToolsToggle().toSelector())).resolves.toBe(true);
      }
      await expect(page.isDisplayed(wrapper.findNavigationClose().toSelector())).resolves.toBe(true);
      await expect(page.isExisting(wrapper.findOpenNavigationPanel().toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(false);
      await expect(page.isExisting(wrapper.findOpenToolsPanel().toSelector())).resolves.toBe(false);
      await expect(page.isDisplayed(wrapper.findSplitPanel().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'renders initial state with wizard content type',
    setupTest({ pageName: 'with-wizard' }, async page => {
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
    'breadcrumbs preservation state works as expected',
    setupTest({ viewport: viewports.desktop, pageName: 'stateful' }, async page => {
      await page.click('#breadcrumbs-button');
      await expect(page.getText('#breadcrumbs-text')).resolves.toBe('Clicked: 1');
      await page.setWindowSize(viewports.mobile);
      await expect(page.getText('#breadcrumbs-text')).resolves.toBe(
        `Clicked: ${
          //can preserve breadcrumbs on refresh-toolbar
          theme === 'refresh-toolbar' ? '1' : '0'
        }`
      );
    })
  );

  test(
    'preserves navigation inner state when drawer closes and opens',
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

  test(
    'maintains consistent content top offset between initially empty notifications and dynamically dismissed',
    setupTest({ pageName: 'with-notifications', extraParams: { disableNotifications: 'true' } }, async page => {
      // get reference offset on a page with notifications disabled
      const { top: expectedOffset } = await page.getBoundingBox('[data-testid="content-root"]');
      // visit the same page with notifications enabled to compare
      await page.visit(
        `#/light/app-layout/with-notifications?${getUrlParams(theme, { disableNotifications: 'false' })}`
      );
      await page.click(wrapper.findNotifications().findFlashbar().findItems().get(1).findDismissButton().toSelector());
      await expect(page.isExisting(wrapper.findNotifications().findFlashbar().toSelector())).resolves.toBe(true);
      await expect(
        page.getElementsCount(wrapper.findNotifications().findFlashbar().findItems().toSelector())
      ).resolves.toBe(0);
      const { top: contentTop } = await page.getBoundingBox('[data-testid="content-root"]');
      expect(contentTop).toEqual(expectedOffset);
    })
  );
});
