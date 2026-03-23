// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { AppLayoutWrapper } from '../../../lib/components/test-utils/selectors';
import { getUrlParams } from './utils';

const wrapper = createWrapper().findAppLayout();
const findDrawerById = (wrapper: AppLayoutWrapper, id: string) => {
  return wrapper.find(`[data-testid="awsui-app-layout-drawer-${id}"]`);
};
const findDrawerTriggerById = (wrapper: AppLayoutWrapper, id: string) => {
  return wrapper.find(`[data-testid="awsui-app-layout-trigger-${id}"]`);
};

describe('Visual refresh toolbar only', () => {
  class PageObject extends BasePageObject {
    async getDrawerWidth(drawerId: string) {
      const { width } = await this.getBoundingBox(findDrawerById(wrapper, drawerId)!.toSelector());

      return width;
    }

    hasHorizontalScroll() {
      return this.browser.execute(() => document.body.scrollWidth - document.body.clientWidth > 0);
    }
  }
  function setupTest(testFn: (page: PageObject) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new PageObject(browser);

      await browser.url(
        `#/light/app-layout/sidecar-demo?${getUrlParams('refresh-toolbar', {
          hasDrawers: 'false',
          hasTools: 'true',
          splitPanelPosition: 'side',
        })}`
      );
      await page.waitForVisible(wrapper.findDrawerTriggerById('bolt-global').toSelector(), true);
      await testFn(page);
    });
  }

  test(
    'programmatical AI drawer resize should not exceed its max size',
    setupTest(async page => {
      const aiDrawerId = 'ai-panel';
      await page.click(findDrawerTriggerById(wrapper, aiDrawerId).toSelector());

      await expect(page.isClickable(findDrawerById(wrapper, aiDrawerId)!.toSelector())).resolves.toBe(true);

      await page.click(findDrawerById(wrapper, aiDrawerId).findButton('.resize-to-max-width').toSelector());

      const { width: viewportWidth } = await page.getViewportSize();
      const drawerWidth = await page.getDrawerWidth(aiDrawerId);
      expect(drawerWidth).toBeLessThan(viewportWidth);
    })
  );

  test(
    'The AI drawer should not make the page overflow when it is at max size and the nav panel opens',
    setupTest(async page => {
      const aiDrawerId = 'ai-panel';
      await page.click(findDrawerTriggerById(wrapper, aiDrawerId).toSelector());

      await expect(page.isClickable(findDrawerById(wrapper, aiDrawerId)!.toSelector())).resolves.toBe(true);

      await page.click(wrapper.findNavigationToggle().toSelector());
      await page.click(findDrawerById(wrapper, aiDrawerId).findButton('.resize-to-max-width').toSelector());
      await page.click(wrapper.findNavigationToggle().toSelector());

      await expect(page.hasHorizontalScroll()).resolves.toBe(false);
    })
  );
});
