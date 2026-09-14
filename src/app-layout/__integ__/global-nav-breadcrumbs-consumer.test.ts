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

  isConsumerBreadcrumbsDisplayed() {
    return this.isDisplayed(consumerBreadcrumbs.toSelector());
  }

  getConsumerBreadcrumbsText() {
    return this.getText(consumerBreadcrumbs.toSelector());
  }

  hasAppLayoutBreadcrumbs() {
    return this.isExisting(appLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
  }

  isAppLayoutBreadcrumbsDisplayed() {
    return this.isDisplayed(appLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
  }

  hasMainLayoutBreadcrumbs() {
    return this.isExisting(mainLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
  }

  isMainLayoutBreadcrumbsDisplayed() {
    return this.isDisplayed(mainLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
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
      // App Layout keeps an analytics copy in the DOM, but only the consumer is displayed.
      await expect(page.hasAppLayoutBreadcrumbs()).resolves.toBe(true);
      await expect(page.isAppLayoutBreadcrumbsDisplayed()).resolves.toBe(false);
      await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(2);

      await page.clickTestId('toggle-nav-header');
      await page.waitForVisible(appLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
      await expect(page.hasConsumerBreadcrumbs()).resolves.toBe(false);
      await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1);

      await page.clickTestId('toggle-nav-header');
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.isAppLayoutBreadcrumbsDisplayed()).resolves.toBe(false);
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
    'reserves external ownership before the consumer loads',
    setupTest('global-nav-breadcrumbs-reserved', {}, async page => {
      await expect(page.hasConsumerBreadcrumbs()).resolves.toBe(false);
      await expect(page.hasAppLayoutBreadcrumbs()).resolves.toBe(true);
      await expect(page.isAppLayoutBreadcrumbsDisplayed()).resolves.toBe(false);
      await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1);

      await page.clickTestId('toggle-nav-header');
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Resource');
      await expect(page.isAppLayoutBreadcrumbsDisplayed()).resolves.toBe(false);
      await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(2);

      await page.clickTestId('toggle-nav-header');
      await page.waitForAssertion(() => expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1));
      await expect(page.isAppLayoutBreadcrumbsDisplayed()).resolves.toBe(false);
    })
  );

  test(
    'coordinates breadcrumbs from multiple App Layout instances',
    setupTest('global-nav-breadcrumbs-multi-layout', {}, async page => {
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Beta service');
      await expect(page.isConsumerBreadcrumbsDisplayed()).resolves.toBe(true);

      await page.clickTestId('toggle-secondary-layout-beta');
      await page.waitForAssertion(() => expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Alpha service'));

      await page.clickTestId('toggle-nav-header');
      await page.waitForAssertion(() => expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1));
    })
  );

  test(
    'coordinates producers mounted in separate iframe roots',
    setupTest('global-nav-breadcrumbs-multi-instance', {}, async page => {
      await page.waitForVisible(consumerBreadcrumbs.toSelector());
      await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Alpha service');

      await page.clickTestId('toggle-iframe-beta');
      await expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Alpha service');

      await page.clickTestId('toggle-iframe-alpha');
      await page.waitForAssertion(() => expect(page.getConsumerBreadcrumbsText()).resolves.toContain('Beta service'));
      await expect(page.isConsumerBreadcrumbsDisplayed()).resolves.toBe(true);
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
        await expect(page.hasMainLayoutBreadcrumbs()).resolves.toBe(true);
        await expect(page.isMainLayoutBreadcrumbsDisplayed()).resolves.toBe(false);

        await page.clickTestId('toggle-nav-header');
        await page.waitForVisible(mainLayoutBreadcrumbs.findBreadcrumbGroup().toSelector());
        await expect(page.getText(mainLayoutBreadcrumbs.toSelector())).resolves.toContain('page1');
        await expect(page.getBreadcrumbGroupsCount()).resolves.toBe(1);
      })
    );
  });
});
