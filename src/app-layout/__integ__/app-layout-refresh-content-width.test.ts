// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { scrollbarThickness } from '../../__integ__/scrollbars';
import { Theme } from '../../__integ__/utils';
import { viewports } from './constants';
import { getUrlParams } from './utils';

const wrapper = createWrapper().findAppLayout();

class AppLayoutRefreshNotoficationsPage extends BasePageObject {
  async setDrawersOpen() {
    await this.click(createWrapper().findButton('[data-test-id="button_set-drawers-open"]').toSelector());
  }
  async setContentType(contentType: string) {
    await this.click(createWrapper().findButton(`[data-test-id="button_type-${contentType}"]`).toSelector());
  }
  async setContentWidthTo400() {
    await this.click(createWrapper().findButton('[data-test-id="button_width-400"]').toSelector());
  }
  async setContentWidthToMaxValue() {
    await this.click(createWrapper().findButton('[data-test-id="button_width-number-max_value"]').toSelector());
  }
  async getContentWidth() {
    const box = await this.getBoundingBox(wrapper.find('[data-test-id="content"]').toSelector());
    return box.width;
  }
  async getNavigationWidth() {
    const box = await this.getBoundingBox(wrapper.findNavigation().toSelector());
    return box.width;
  }
  async getToolsWidth() {
    const box = await this.getBoundingBox(wrapper.findTools().toSelector());
    return box.width;
  }
}

describe.each(['refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest(viewportWidth: number, testFn: (page: AppLayoutRefreshNotoficationsPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new AppLayoutRefreshNotoficationsPage(browser);
      await page.setWindowSize({ ...viewports.desktop, width: viewportWidth });
      await browser.url(`#/light/app-layout/refresh-content-width/?${getUrlParams(theme)}`);
      await page.waitForVisible(wrapper.findContentRegion().toSelector());
      await testFn(page);
    });
  }

  const borderThickness = 1;

  // In Visual Refresh with the old app layout, if the navigation has a scrollbar, the scrollbar thickness is added to the navigation slot's width.
  const navigationBorderOffset = theme === 'refresh' ? borderThickness + scrollbarThickness : 0;
  const drawerBorderOffset = theme === 'refresh' ? borderThickness + scrollbarThickness : borderThickness;

  describe('Default width per contentType', () => {
    const testCases = [
      { viewPortWidth: 1920, navigationWidth: 280, contentWidth: 1280, toolsWidth: 290 }, // XXXS - L breakpoint
      { viewPortWidth: 1921, navigationWidth: 280, contentWidth: 1440, toolsWidth: 290 }, // L -XL breakpoint
      { viewPortWidth: 2541, navigationWidth: 280, contentWidth: 1620, toolsWidth: 290 }, // XL - > XXL breakpoint
    ];

    testCases.forEach(({ viewPortWidth, navigationWidth, contentWidth, toolsWidth }) => {
      for (const contentType of ['default', 'form', 'wizard']) {
        test(
          `Browser viewPortWidth ${viewPortWidth}: contentType '${contentType}' has default width for content, navigation and tools slot.`,
          setupTest(viewPortWidth, async page => {
            await page.setContentType(contentType);
            await expect(page.getContentWidth()).resolves.toBe(theme === 'refresh' ? contentWidth : 1620);

            // Open the drawers and check their width
            await page.setDrawersOpen();
            await expect(page.getNavigationWidth()).resolves.toBe(navigationWidth + navigationBorderOffset);
            await expect(page.getToolsWidth()).resolves.toBe(toolsWidth + drawerBorderOffset);
          })
        );
      }
    });

    for (const contentType of ['table', 'cards']) {
      test(
        `ContentType '${contentType}' uses the full available horizontal width.`,
        setupTest(2000, async page => {
          await page.setContentType(contentType);
          await expect(page.getContentWidth()).resolves.toBeGreaterThan(1830);
        })
      );
    }

    test(
      'Use the full available width when maxContentWidth is set to Number.MAX_VALUE',
      setupTest(3000, async page => {
        await page.setContentWidthToMaxValue();
        await expect(page.getContentWidth()).resolves.toBeGreaterThan(2830);
      })
    );

    test(
      'Content could have a width of 400 when maxContentWidth is set to 400',
      setupTest(2000, async page => {
        await page.setContentWidthTo400();
        await expect(page.getContentWidth()).resolves.toBe(400);
      })
    );
  });
});
