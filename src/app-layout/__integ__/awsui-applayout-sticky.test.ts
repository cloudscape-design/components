// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';
import { getUrlParams, testIf, Theme } from './utils';

const wrapper = createWrapper().findAppLayout();
const stickyToggleSelector = createWrapper().findFlashbar().findItems().get(1).findActionButton().toSelector();

class AppLayoutStickyPage extends BasePageObject {
  async isNotificationVisible() {
    const elements = await this.browser.$$(wrapper.findNotifications().toSelector());
    if (elements.length === 0) {
      return false;
    }
    return elements[0].isDisplayedInViewport();
  }

  async toggleStickiness() {
    await this.click(stickyToggleSelector);
  }
}

describe.each(['classic', 'refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest({ viewport = viewports.desktop }, testFn: (page: AppLayoutStickyPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new AppLayoutStickyPage(browser);
      await page.setWindowSize(viewport);
      await browser.url(`#/light/app-layout/with-sticky-notifications/?${getUrlParams(theme)}`);
      await page.waitForVisible(wrapper.findContentRegion().toSelector());
      await testFn(page);
    });
  }
  test(
    'Notifications can stick',
    setupTest({}, async page => {
      await expect(page.isNotificationVisible()).resolves.toBe(true);
      await page.windowScrollTo({ top: 2000 });
      await expect(page.isNotificationVisible()).resolves.toBe(true);
    })
  );

  test(
    'Sticky state can be disabled',
    setupTest({}, async page => {
      await page.toggleStickiness();
      await expect(page.isNotificationVisible()).resolves.toBe(true);
      await page.windowScrollTo({ top: 2000 });
      await expect(page.isNotificationVisible()).resolves.toBe(false);
    })
  );

  // TODO: Implement in toolbar
  testIf(theme !== 'refresh-toolbar')(
    'Notifications are never sticky in narrow viewports',
    setupTest({ viewport: viewports.mobile }, async page => {
      await expect(page.isNotificationVisible()).resolves.toBe(true);
      await page.windowScrollTo({ top: 2000 });
      await expect(page.isNotificationVisible()).resolves.toBe(false);
    })
  );
});
