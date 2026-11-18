// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { getUrlParams } from './utils';

const appLayout = createWrapper().findAppLayout();
const toolbar = appLayout.findToolbar();
const appLayoutBreadcrumbs = appLayout.findBreadcrumbs().findBreadcrumbGroup();
const consumerBreadcrumbs = createWrapper().find('[data-testid="global-nav-header"]').findBreadcrumbGroup();

class HideToolbarPage extends BasePageObject {
  clickTestId(testId: string) {
    return this.click(`[data-testid="${testId}"]`);
  }

  /**
   * Distance from the top of App Layout to the first header of the page content.
   * The content region itself is `display: contents` and has no box to measure.
   */
  async getContentOffset() {
    const { top: rootTop } = await this.getBoundingBox(appLayout.toSelector());
    const { top: contentTop } = await this.getBoundingBox(appLayout.findContentRegion().findHeader().toSelector());
    return contentTop - rootTop;
  }
}

function setupTest(params: Record<string, string>, testFn: (page: HideToolbarPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new HideToolbarPage(browser);
    await browser.url(`#/light/app-layout/global-nav-breadcrumbs?${getUrlParams('refresh-toolbar', params)}`);
    await page.waitForVisible(appLayout.findContentRegion().toSelector());
    await testFn(page);
  });
}

const hiddenToolbarParams = { appLayoutHideToolbar: 'true' };

describe('appLayoutHideToolbar flag', () => {
  test(
    'renders a visible toolbar without the flag',
    setupTest({}, async page => {
      await expect(page.isDisplayed(toolbar.toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(appLayoutBreadcrumbs.toSelector())).resolves.toBe(true);
    })
  );

  test(
    'keeps the toolbar and its breadcrumbs in the DOM but not displayed',
    setupTest(hiddenToolbarParams, async page => {
      await expect(page.isExisting(toolbar.toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(toolbar.toSelector())).resolves.toBe(false);
      await expect(page.isExisting(appLayoutBreadcrumbs.toSelector())).resolves.toBe(true);
      await expect(page.isDisplayed(appLayoutBreadcrumbs.toSelector())).resolves.toBe(false);
    })
  );

  // Global flags are read once on page load, so each toolbar state is measured in its own browser session
  // instead of switching the URL (and relying on a reload) within one session.
  test('does not reserve space for the hidden toolbar', async () => {
    let toolbarHeight = 0;
    let offsetWithToolbar = 0;
    let offsetWithHiddenToolbar = 0;

    await setupTest({}, async page => {
      await expect(page.isDisplayed(toolbar.toSelector())).resolves.toBe(true);
      ({ height: toolbarHeight } = await page.getBoundingBox(toolbar.toSelector()));
      offsetWithToolbar = await page.getContentOffset();
    })();

    await setupTest(hiddenToolbarParams, async page => {
      await expect(page.isDisplayed(toolbar.toSelector())).resolves.toBe(false);
      offsetWithHiddenToolbar = await page.getContentOffset();
    })();

    expect(toolbarHeight).toBeGreaterThan(0);
    // allow 1px for sub-pixel rounding
    expect(Math.abs(offsetWithToolbar - toolbarHeight - offsetWithHiddenToolbar)).toBeLessThanOrEqual(1);
  }, 120_000 /* two browser sessions */);

  test(
    'publishes breadcrumbs to registerBreadcrumbsConsumer and keeps them updated',
    setupTest(hiddenToolbarParams, async page => {
      await page.clickTestId('toggle-nav-header');
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.getText(consumerBreadcrumbs.toSelector())).resolves.toContain('Resource');
      await expect(page.getText(consumerBreadcrumbs.toSelector())).resolves.not.toContain('Level 3');

      await page.clickTestId('append-breadcrumb');
      await page.waitForAssertion(() =>
        expect(page.getText(consumerBreadcrumbs.toSelector())).resolves.toContain('Level 3')
      );
      await expect(page.isDisplayed(toolbar.toSelector())).resolves.toBe(false);
    })
  );

  test(
    'publishes breadcrumbs to a consumer that registers after App Layout rendered',
    setupTest(hiddenToolbarParams, async page => {
      await page.clickTestId('delay-nav-header');
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.getText(consumerBreadcrumbs.toSelector())).resolves.toContain('Resource');
    })
  );
});
