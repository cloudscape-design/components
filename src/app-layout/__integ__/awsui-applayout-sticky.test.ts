// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../../lib/components/test-utils/selectors';
import useBrowser from '../../__integ__/use-browser-with-scrollbars';
import { viewports } from './constants';
import { getUrlParams, Theme } from './utils';

const wrapper = createWrapper().findAppLayout();
const stickyToggleSelector = createWrapper().findFlashbar().findItems().get(1).findActionButton().toSelector();

class AppLayoutStickyPage extends BasePageObject {
  isNotificationVisible() {
    return this.isDisplayedInViewport(wrapper.findNotifications().toSelector());
  }

  async toggleStickiness() {
    await this.click(stickyToggleSelector);
  }
}

describe.each(['classic', 'refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest({ isMobile = false }, testFn: (page: AppLayoutStickyPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new AppLayoutStickyPage(browser);
      await page.setWindowSize(isMobile ? viewports.mobile : viewports.desktop);
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

  test(
    'Notifications are never sticky in narrow viewports',
    setupTest({ isMobile: true }, async page => {
      await expect(page.isNotificationVisible()).resolves.toBe(true);
      await page.windowScrollTo({ top: 2000 });
      await expect(page.isNotificationVisible()).resolves.toBe(false);
    })
  );
});
