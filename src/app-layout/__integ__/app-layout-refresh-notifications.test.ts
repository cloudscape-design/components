// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();

class AppLayoutRefreshNotoficationsPage extends BasePageObject {
  async setMaxContentWidth(width: string) {
    await this.click(createWrapper().findButton(`.width-${width}`).toSelector());
  }
  async toggleNavigation() {
    await this.click(createWrapper().findButton('.navigation-toggle').toSelector());
  }
  async toggleTools() {
    await this.click(createWrapper().findButton('.tools-toggle').toSelector());
  }
  private async getNotificationsWidth() {
    const box = await this.getBoundingBox(wrapper.findNotifications().findFlashbar().toSelector());
    return box.width;
  }
  private async getContentWidth() {
    const box = await this.getBoundingBox(wrapper.find('.content').toSelector());
    return box.width;
  }
  async assertNotificationsWidth(comparison = 0) {
    const contentWidth = await this.getContentWidth();
    if (comparison < 0) {
      expect(this.getNotificationsWidth()).resolves.toBeLessThan(contentWidth);
    } else if (comparison > 0) {
      expect(this.getNotificationsWidth()).resolves.toBeGreaterThan(contentWidth);
    } else {
      expect(this.getNotificationsWidth()).resolves.toEqual(contentWidth);
    }
  }
}

function setupTest(
  { viewport = viewports.desktop, removeNotifications = false },
  testFn: (page: AppLayoutRefreshNotoficationsPage) => Promise<void>
) {
  return useBrowser(async browser => {
    const page = new AppLayoutRefreshNotoficationsPage(browser);
    await page.setWindowSize(viewport);
    await browser.url(
      `#/light/app-layout/notifications-refresh/?visualRefresh=true${removeNotifications ? `&removeNotifications` : ''}`
    );
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

describe('Notifications have the same width as content', () => {
  test(
    'upon rendering',
    setupTest({}, async page => {
      await page.assertNotificationsWidth();
    })
  );
  test(
    'with smaller maxContentWidth',
    setupTest({}, async page => {
      await page.setMaxContentWidth('400');
      await page.assertNotificationsWidth();
    })
  );
  test(
    'after opening navigation',
    setupTest({}, async page => {
      await page.setMaxContentWidth('400');
      await page.toggleNavigation();
      await page.assertNotificationsWidth();
    })
  );
  test(
    'after opening tools',
    setupTest({}, async page => {
      await page.setMaxContentWidth('400');
      await page.toggleTools();
      await page.assertNotificationsWidth();
    })
  );
  test(
    'after opening navigation and tools',
    setupTest({}, async page => {
      await page.setMaxContentWidth('400');
      await page.toggleNavigation();
      await page.toggleTools();
      await page.assertNotificationsWidth();
    })
  );
  test(
    'in mobile view',
    setupTest({ viewport: viewports.mobile }, async page => {
      await page.assertNotificationsWidth();
    })
  );
});

describe('Notifications have smaller width than content', () => {
  test(
    'with larger maxContentWidth',
    setupTest({}, async page => {
      await page.setMaxContentWidth('2000');
      await page.assertNotificationsWidth(-1);
    })
  );
  test(
    'with a max content width of 800, after opening navigation and tools',
    setupTest({}, async page => {
      await page.setMaxContentWidth('800');
      await page.toggleNavigation();
      await page.toggleTools();
      await page.assertNotificationsWidth(-1);
    })
  );
});
