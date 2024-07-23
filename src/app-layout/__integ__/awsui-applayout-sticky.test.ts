// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

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

function setupTest(
  { viewport = viewports.desktop, theme = 'default' },
  testFn: (page: AppLayoutStickyPage) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new AppLayoutStickyPage(browser);
    await page.setWindowSize(viewport);
    await browser.url(
      `#/light/app-layout/with-sticky-notifications/?visualRefresh=${theme === 'visual-refresh' ? 'true' : 'false'}`
    );
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}
['default', 'visual-refresh'].forEach(theme => {
  test(
    'Notifications can stick',
    setupTest({ theme }, async page => {
      await expect(page.isNotificationVisible()).resolves.toBe(true);
      await page.windowScrollTo({ top: 2000 });
      await expect(page.isNotificationVisible()).resolves.toBe(true);
    })
  );

  test(
    'Sticky state can be disabled',
    setupTest({ theme }, async page => {
      await page.toggleStickiness();
      await expect(page.isNotificationVisible()).resolves.toBe(true);
      await page.windowScrollTo({ top: 2000 });
      await expect(page.isNotificationVisible()).resolves.toBe(false);
    })
  );

  test(
    'Notifications are never sticky in narrow viewports',
    setupTest({ viewport: viewports.mobile, theme }, async page => {
      await expect(page.isNotificationVisible()).resolves.toBe(true);
      await page.windowScrollTo({ top: 2000 });
      await expect(page.isNotificationVisible()).resolves.toBe(false);
    })
  );
});
