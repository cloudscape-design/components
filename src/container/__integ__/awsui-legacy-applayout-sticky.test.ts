// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from '../../app-layout/__integ__/constants';

import appLayoutSelectors from '../../../lib/components/app-layout/test-classes/styles.selectors.js';

const appLayoutWrapper = createWrapper().findAppLayout();
const containerWrapper = appLayoutWrapper.findContentRegion().findContainer();
const containerHeaderSelector = containerWrapper.findHeader().toSelector();
const flashBarSelector = createWrapper().findFlashbar().toSelector();
const demoHeaderSelector = '#h';

const CLASSIC_STICKY_OFFSET_SPACE = 0; // No borders on flashbars or additional padding below
const VISUAL_REFRESH_STICKY_OFFSET_SPACE = 4; // space-xxs - from $offsetTopWithNotifications additional padding

class AppLayoutLegacyStickyPage extends BasePageObject {
  async areNotificationsVisible() {
    const elements = await this.browser.$$(appLayoutWrapper.findNotifications().toSelector());
    if (elements.length === 0) {
      return false;
    }
    return elements[0].isDisplayedInViewport();
  }

  scrollTo(params: { top?: number; left?: number }) {
    return this.elementScrollTo(`.${appLayoutSelectors['disable-body-scroll-root']}`, params);
  }
}

describe.each([
  ['classic', CLASSIC_STICKY_OFFSET_SPACE],
  ['visualRefresh', VISUAL_REFRESH_STICKY_OFFSET_SPACE],
])('In %s', (type, stickyOffset) => {
  function setupTest({ viewport = viewports.desktop }, testFn: (page: AppLayoutLegacyStickyPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new AppLayoutLegacyStickyPage(browser);
      await page.setWindowSize(viewport);
      await browser.url(
        `#/light/app-layout/legacy-table-sticky-notifications/?visualRefresh=${type === 'visualRefresh'}`
      );
      await page.waitForVisible(appLayoutWrapper.findContentRegion().toSelector());
      await testFn(page);
    });
  }

  test(
    'Sticky header is offset by the height of the sticky notifications',
    setupTest({}, async page => {
      const { top: containerTopBefore } = await page.getBoundingBox(containerHeaderSelector);
      const { bottom: flashBarBottomBefore } = await page.getBoundingBox(flashBarSelector);
      expect(containerTopBefore).toBeGreaterThan(flashBarBottomBefore);
      await page.scrollTo({ top: 400 });
      const { top: containerTopAfter } = await page.getBoundingBox(containerHeaderSelector);
      const { bottom: flashBarBottomAfter } = await page.getBoundingBox(flashBarSelector);
      expect(containerTopAfter).toEqual(flashBarBottomAfter + stickyOffset);
    })
  );

  test(
    'Sticky header is scrolled out of view in mobile viewports',
    setupTest({ viewport: viewports.mobile }, async page => {
      const { height: demoPageHeaderHeight } = await page.getBoundingBox(demoHeaderSelector);
      const { top: topBefore } = await page.getBoundingBox(containerHeaderSelector);
      expect(topBefore).toBeGreaterThan(demoPageHeaderHeight);
      await page.scrollTo({ top: 400 });
      const { top: topAfter } = await page.getBoundingBox(containerHeaderSelector);
      expect(topAfter).toBeLessThan(demoPageHeaderHeight);
    })
  );
});
