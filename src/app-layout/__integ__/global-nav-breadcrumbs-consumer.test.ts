// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { getUrlParams } from './utils';

const theme = 'refresh-toolbar';

const globalNavHeader = createWrapper().find('[data-testid="global-nav-header"]');
const consumerBreadcrumbs = globalNavHeader.findBreadcrumbGroup();
const appLayoutBreadcrumbs = createWrapper().findAppLayout().findBreadcrumbs();
const mainLayoutBreadcrumbs = createWrapper().find('[data-testid="main-layout"]').findAppLayout().findBreadcrumbs();

class GlobalNavBreadcrumbsPage extends BasePageObject {
  clickTestId(testId: string) {
    return this.click(`[data-testid="${testId}"]`);
  }

  clickHref(href: string) {
    return this.click(`[href="${href}"]`);
  }

  hasConsumerBreadcrumbs() {
    return this.isExisting(consumerBreadcrumbs.toSelector());
  }

  getConsumerBreadcrumbsText() {
    return this.getText(consumerBreadcrumbs.toSelector());
  }

  hasAppLayoutBreadcrumbs() {
    return this.isExisting(appLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
  }

  hasMainLayoutBreadcrumbs() {
    return this.isExisting(mainLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
  }

  /** Number of breadcrumb groups anywhere on the page -- exactly one trail must be visible at a time. */
  getBreadcrumbGroupsCount() {
    return this.getElementsCount(createWrapper().findBreadcrumbGroup().toSelector());
  }
}

function setupTest(
  page: string,
  params: Record<string, string>,
  testFn: (page: GlobalNavBreadcrumbsPage) => Promise<void>
) {
  return useBrowser(async browser => {
    const pageObject = new GlobalNavBreadcrumbsPage(browser);
    await browser.url(`#/light/app-layout/${page}?${getUrlParams(theme, params)}`);
    await pageObject.waitForVisible(createWrapper().findAppLayout().findContentRegion().toSelector());
    await testFn(pageObject);
  });
}

describe('global breadcrumbs consumer', () => {
  test(
    'consumer draws the trail while registered, App Layout resumes when it unmounts',
    setupTest('global-nav-breadcrumbs', {}, async page => {
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Resource');
      // The consumer owns rendering, so App Layout draws nothing and only one trail exists.
      await expect(page.hasAppLayoutBreadcrumbs()).resolves.toBe(false);
      await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1);

      await page.clickTestId('toggle-nav-header');
      await page.waitForVisible(appLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
      await expect(page.hasConsumerBreadcrumbs()).resolves.toBe(false);
      await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1);

      await page.clickTestId('toggle-nav-header');
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.hasAppLayoutBreadcrumbs()).resolves.toBe(false);
    })
  );

  test(
    'the consumer receives producer updates',
    setupTest('global-nav-breadcrumbs', {}, async page => {
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.getConsumerBreadcrumbsText()).resolves.not.toContain('Level 3');

      await page.clickTestId('append-breadcrumb');
      await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Level 3');
    })
  );

  test(
    'declaring external ownership up front stops App Layout drawing at all',
    setupTest('global-nav-breadcrumbs', { breadcrumbsOwnedExternally: 'true' }, async page => {
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.hasAppLayoutBreadcrumbs()).resolves.toBe(false);

      // Without the flag App Layout takes the trail back here; with it, nothing draws at all.
      await page.clickTestId('toggle-nav-header');
      await expect(page.hasConsumerBreadcrumbs()).resolves.toBe(false);
      await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(0);
    })
  );

  describe('with hidden app layout instances in iframes', () => {
    const hiddenInstances = (testFn: (page: GlobalNavBreadcrumbsPage) => Promise<void>) =>
      setupTest('global-nav-breadcrumbs-hidden-instances-iframe', {}, testFn);

    test(
      'only the visible instance publishes to the consumer',
      hiddenInstances(async page => {
        await page.waitForVisible(consumerBreadcrumbs.toSelector());
        await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('page1');

        // page2 passes no breadcrumbs. page1 stays mounted but hidden, so it must stop publishing
        // rather than leaving a stale trail in the consumer.
        await page.clickHref('page2');
        await page.waitForAssertion(() => expect(page.hasConsumerBreadcrumbs()).resolves.toBe(false));

        await page.clickHref('page3');
        await page.waitForVisible(consumerBreadcrumbs.toSelector());
        await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('page3');

        await page.clickHref('page1');
        await page.waitForAssertion(() => expect(page.getConsumerBreadcrumbsText()).resolves.toContain('page1'));
      })
    );

    test(
      'App Layout draws the visible instance trail once the consumer unmounts',
      hiddenInstances(async page => {
        await page.waitForVisible(consumerBreadcrumbs.toSelector());
        await expect(page.hasMainLayoutBreadcrumbs()).resolves.toBe(false);

        await page.clickTestId('toggle-nav-header');
        await page.waitForVisible(mainLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
        await expect(page.getText(mainLayoutBreadcrumbs.toSelector())).resolves.toContain('page1');
        await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1);
      })
    );
  });
});
