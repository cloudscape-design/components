// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();

class AppLayoutStickyPage extends BasePageObject {
  findNotificationByIndex(index: number) {
    return wrapper.findNotifications().findFlashbar().findItems().get(index);
  }

  findStickyTableHeader() {
    return wrapper.findContentRegion().findTable().findHeaderSlot();
  }
}

function setupTest({ viewport = viewports.desktop, url = '' }, testFn: (page: AppLayoutStickyPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new AppLayoutStickyPage(browser);
    await page.setWindowSize(viewport);
    await browser.url(url);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

test(
  'keeps consistent spacing between sticky notifications and table header in visual refresh',
  setupTest({ url: '#/light/app-layout/with-sticky-notifications-and-header?visualRefresh=true' }, async page => {
    await page.windowScrollTo({ top: viewports.desktop.height });

    const { bottom: firstNotificationBottom } = await page.getBoundingBox(page.findNotificationByIndex(1).toSelector());
    const { top: secondNotificationTop, bottom: secondNotificationBottom } = await page.getBoundingBox(
      page.findNotificationByIndex(2).toSelector()
    );
    const { top: tableHeaderTop } = await page.getBoundingBox(page.findStickyTableHeader().toSelector());
    const expected = secondNotificationTop - firstNotificationBottom;
    expect(tableHeaderTop - secondNotificationBottom).toEqual(expected);
  })
);

test(
  'properly restores vertical offset for sticky headers when resizing to mobile and back to desktop',
  setupTest({ url: '#/light/app-layout/with-sticky-notifications-and-header' }, async page => {
    await page.windowScrollTo({ top: viewports.desktop.height });
    const stickyHeaderSelector = wrapper.findContentRegion().findTable().findHeaderSlot().toSelector();
    const { top: oldTop } = await page.getBoundingBox(stickyHeaderSelector);
    await page.setWindowSize(viewports.mobile);
    await page.windowScrollTo({ top: viewports.desktop.height });
    const { top: mobileTop } = await page.getBoundingBox(stickyHeaderSelector);
    expect(mobileTop).not.toEqual(oldTop);
    await page.setWindowSize(viewports.desktop);
    await page.windowScrollTo({ top: viewports.desktop.height });
    const { top: newTop } = await page.getBoundingBox(stickyHeaderSelector);
    expect(newTop).toEqual(oldTop);
  })
);

test(
  'sets sticky notifications offset to zero when notifications are not sticky',
  setupTest({ viewport: { width: 1200, height: 300 }, url: '#/light/app-layout/with-table' }, async page => {
    await page.windowScrollTo({ top: 200 });
    const { bottom: pageHeaderBottom } = await page.getBoundingBox('header');
    const { top: tableHeaderTop } = await page.getBoundingBox(page.findStickyTableHeader().toSelector());
    expect(tableHeaderTop).toEqual(pageHeaderBottom - 1);
  })
);
