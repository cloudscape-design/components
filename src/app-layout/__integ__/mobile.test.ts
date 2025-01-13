// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';
import { testIf } from './utils';

const wrapper = createWrapper().findAppLayout();

describe.each(['classic', 'visual-refresh', 'visual-refresh-toolbar'] as const)('%s', theme => {
  class MobileTestingPage extends BasePageObject {
    async visit(pageName: string) {
      const params = new URLSearchParams({
        visualRefresh: `${theme.startsWith('visual-refresh')}`,
        appLayoutToolbar: `${theme === 'visual-refresh-toolbar'}`,
      });
      await this.browser.url(`#/light/app-layout/${pageName}?${params.toString()}`);
      await this.waitForVisible(wrapper.toSelector());
    }

    isContentClickable() {
      // cannot assert on findContentRegion selector, because it has `display:contents` and fails to detect as clickable
      return this.isClickable(wrapper.findContentRegion().findContainer().toSelector());
    }

    getViewportWidths() {
      return this.browser.execute(() => [document.documentElement.scrollWidth, window.innerWidth]);
    }
  }

  function setupTest(testFn: (page: MobileTestingPage) => Promise<void>) {
    return useBrowser(viewports.mobile, async browser => {
      const page = new MobileTestingPage(browser);
      await testFn(page);
    });
  }

  describe.each([
    'default',
    'disable-paddings',
    'multi-layout-simple',
    'with-split-panel',
    'with-table',
    'with-wizard-and-table',
  ])('%s', pageName => {
    test(
      'should not render horizontal scrollbar on mobile',
      setupTest(async page => {
        await page.visit(pageName);
        const [documentWidth, windowWidth] = await page.getViewportWidths();
        expect(documentWidth).toBeLessThanOrEqual(windowWidth);
      })
    );
  });

  test(
    'main content is clickable by defaults',
    setupTest(async page => {
      await page.visit('with-fixed-header-footer');
      await expect(page.isContentClickable()).resolves.toEqual(true);
      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toEqual(false);
      await expect(page.isClickable(wrapper.findTools().toSelector())).resolves.toEqual(false);
      await expect(page.isClickable('#h')).resolves.toEqual(true);
      await expect(page.isClickable('#f')).resolves.toEqual(true);
    })
  );

  testIf(theme !== 'visual-refresh-toolbar')(
    'header and footer should be clickable when nav panel is open',
    setupTest(async page => {
      await page.visit('with-fixed-header-footer');
      await page.click(wrapper.findNavigationToggle().toSelector());
      await expect(page.isContentClickable()).resolves.toEqual(false);
      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toEqual(true);
      await expect(page.isClickable('#h')).resolves.toEqual(true);
      await expect(page.isClickable('#f')).resolves.toEqual(true);
    })
  );

  testIf(theme !== 'visual-refresh-toolbar')(
    'header and footer should be clickable when nav panel is open in scrolled to the bottom state',
    setupTest(async page => {
      await page.visit('with-fixed-header-footer');
      await page.windowScrollTo({ top: viewports.mobile.height });
      await page.click(wrapper.findNavigationToggle().toSelector());
      await expect(page.isContentClickable()).resolves.toEqual(false);
      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toEqual(true);
      await expect(page.isClickable('#h')).resolves.toEqual(true);
      await expect(page.isClickable('#f')).resolves.toEqual(true);
    })
  );

  testIf(theme !== 'visual-refresh-toolbar')(
    'header and footer should be clickable when tools panel is open',
    setupTest(async page => {
      await page.visit('with-fixed-header-footer');
      await page.click(wrapper.findToolsToggle().toSelector());
      await expect(page.isContentClickable()).resolves.toEqual(false);
      await expect(page.isClickable(wrapper.findTools().toSelector())).resolves.toEqual(true);
      await expect(page.isClickable('#h')).resolves.toEqual(true);
      await expect(page.isClickable('#f')).resolves.toEqual(true);
    })
  );
});
