// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';
import { getUrlParams, testIf, Theme } from './utils';

const wrapper = createWrapper().findAppLayout();

class AppLayoutStickyPage extends BasePageObject {
  findNotificationByIndex(index: number) {
    return wrapper.findNotifications().findFlashbar().findItems().get(index);
  }

  findStickyTableHeader() {
    return wrapper.findContentRegion().findTable().findHeaderSlot();
  }

  async getAlertTextAndDismiss() {
    const alertText = await this.browser.getAlertText();
    await this.browser.dismissAlert();
    return alertText;
  }
}
describe.each(['classic', 'refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
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
    'correctly stacks table header below notifications in visual refresh',
    setupTest({ url: `#/light/app-layout/with-sticky-notifications-and-header?${getUrlParams(theme)}` }, async page => {
      await page.windowScrollTo({ top: viewports.desktop.height });

      const { bottom: secondNotificationBottom } = await page.getBoundingBox(
        page.findNotificationByIndex(2).toSelector()
      );
      const { top: tableHeaderTop } = await page.getBoundingBox(page.findStickyTableHeader().toSelector());
      expect(tableHeaderTop - secondNotificationBottom).toEqual(0);
    })
  );

  test(
    'properly restores vertical offset for sticky headers when resizing to mobile and back to desktop',
    setupTest({ url: `#/light/app-layout/with-sticky-notifications-and-header?${getUrlParams(theme)}` }, async page => {
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

  testIf(theme === 'classic')(
    'sets sticky notifications offset to zero when notifications are not sticky',
    setupTest(
      { viewport: { width: 1200, height: 300 }, url: '#/light/app-layout/with-table?visualRefresh=false' },
      async page => {
        await page.windowScrollTo({ top: 200 });
        const { bottom: pageHeaderBottom } = await page.getBoundingBox('header');
        const { top: tableHeaderTop } = await page.getBoundingBox(page.findStickyTableHeader().toSelector());
        expect(tableHeaderTop).toEqual(pageHeaderBottom);
      }
    )
  );

  test(
    'should render popover from split panel above sticky header',
    setupTest(
      {
        url: `#/light/app-layout/with-full-page-table-and-split-panel?${getUrlParams(theme)}&splitPanelPosition=side`,
      },
      async page => {
        const popover = createWrapper().findPopover('[data-testid="split-panel"]');
        await page.click(popover.findTrigger().toSelector());
        await page.click(popover.findContent().findButton().toSelector());
        await expect(page.getAlertTextAndDismiss()).resolves.toEqual('It worked');
      }
    )
  );

  test(
    'should render popover from help panel above sticky header',
    setupTest(
      {
        url: `#/light/app-layout/with-full-page-table-and-split-panel?${getUrlParams(theme)}&splitPanelPosition=side`,
      },
      async page => {
        // close split panel which is open by default
        await page.click(wrapper.findSplitPanel().findCloseButton().toSelector());
        // open help panel
        await page.click(wrapper.findToolsToggle().toSelector());
        // do the test
        const popover = createWrapper().findPopover('[data-testid="help-panel"]');
        await page.click(popover.findTrigger().toSelector());
        await page.click(popover.findContent().findButton().toSelector());
        await expect(page.getAlertTextAndDismiss()).resolves.toEqual('It worked');
      }
    )
  );

  test(
    'should not leave any space between page header and sticky header in content layout',
    setupTest(
      {
        url: `#/light/app-layout/with-sticky-header-table-in-content-layout?${getUrlParams(theme)}`,
      },
      async page => {
        const pageHeaderSelector = '#h';
        const tableStickyHeaderSelector = createWrapper().findTable().findHeaderSlot();
        const pageHeaderBottom = (await page.getBoundingBox(pageHeaderSelector)).bottom;
        await page.windowScrollTo({ top: 200 });
        const tableStickyHeaderTop = (await page.getBoundingBox(tableStickyHeaderSelector.toSelector())).top;
        expect(tableStickyHeaderTop).toEqual(pageHeaderBottom);
      }
    )
  );
});
