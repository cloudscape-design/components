// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from '../../app-layout/__integ__/constants';

const appLayoutWrapper = createWrapper().findAppLayout();
const containerWrapper = appLayoutWrapper.findContentRegion().findContainer('#inside-body');
const containerHeaderSelector = containerWrapper.findHeader().toSelector();
const containerInsideDivWrapper = appLayoutWrapper.findContentRegion().findContainer('#inside-div');
const containerInsideDivHeaderSelector = containerInsideDivWrapper.findHeader().toSelector();

const flashBarSelector = createWrapper().findFlashbar().toSelector();
const stickyToggleSelector = createWrapper().findFlashbar().findItems().get(1).findActionButton().toSelector();
const headerSelector = '#b #h';
const scrollableDivSelector = '#scrollable-div';

const CONTAINER_ROOT_BORDER = 1;

class AppLayoutStickyPage extends BasePageObject {
  async isNotificationVisible() {
    const elements = await this.browser.$$(appLayoutWrapper.findNotifications().toSelector());
    if (elements.length === 0) {
      return false;
    }
    return elements[0].isDisplayedInViewport();
  }

  async toggleStickiness() {
    await this.click(stickyToggleSelector);
  }
}

function setupTest({ viewport = viewports.desktop }, testFn: (page: AppLayoutStickyPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new AppLayoutStickyPage(browser);
    await page.setWindowSize(viewport);
    await browser.url('#/light/container/sticky-with-app-layout');
    await page.waitForVisible(appLayoutWrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

test(
  'Sticky header is offset by the height of the sticky notifications',
  setupTest({}, async page => {
    const { top: containerTopBefore } = await page.getBoundingBox(containerHeaderSelector);
    const { bottom: flashBarBottomBefore } = await page.getBoundingBox(flashBarSelector);
    expect(containerTopBefore).toBeGreaterThan(flashBarBottomBefore - CONTAINER_ROOT_BORDER);
    await page.windowScrollTo({ top: 200 });
    const { top: containerTopAfter } = await page.getBoundingBox(containerHeaderSelector);
    const { bottom: flashBarBottomAfter } = await page.getBoundingBox(flashBarSelector);
    expect(containerTopAfter).toEqual(flashBarBottomAfter - CONTAINER_ROOT_BORDER);
  })
);

test(
  'Sticky header is offset by the height of the header, if scroll parent is body',
  setupTest({}, async page => {
    await page.toggleStickiness();
    const { top: containerTopBefore } = await page.getBoundingBox(containerHeaderSelector);
    const { bottom: headerBottomBefore } = await page.getBoundingBox(headerSelector);
    expect(containerTopBefore).toBeGreaterThan(headerBottomBefore - CONTAINER_ROOT_BORDER);
    await page.windowScrollTo({ top: 200 });
    const { top: containerTopAfter } = await page.getBoundingBox(containerHeaderSelector);
    const { bottom: headerBottomAfter } = await page.getBoundingBox(headerSelector);
    expect(containerTopAfter).toEqual(headerBottomAfter - CONTAINER_ROOT_BORDER);
  })
);

test(
  'Sticky header is not offset by the height of the header, if scroll parent is not body',
  setupTest({}, async page => {
    const { top: containerHeaderTopBefore } = await page.getBoundingBox(containerInsideDivHeaderSelector);
    const { top: scrollableDivTopBefore } = await page.getBoundingBox(scrollableDivSelector);
    expect(containerHeaderTopBefore - CONTAINER_ROOT_BORDER).toEqual(scrollableDivTopBefore);

    await page.elementScrollTo(scrollableDivSelector, { top: 50 });

    const { top: containerHeaderTopAfter } = await page.getBoundingBox(containerInsideDivHeaderSelector);
    const { top: scrollableDivTopAfter } = await page.getBoundingBox(scrollableDivSelector);
    expect(containerHeaderTopAfter).toEqual(scrollableDivTopAfter - CONTAINER_ROOT_BORDER);
  })
);

test(
  'Does not stick in narrow viewports',
  setupTest({ viewport: viewports.mobile }, async page => {
    const { top: topBefore } = await page.getBoundingBox(containerHeaderSelector);
    expect(topBefore).toBeGreaterThan(0);
    await page.windowScrollTo({ top: 300 });
    const { top: topAfter } = await page.getBoundingBox(containerHeaderSelector);
    expect(topAfter).toBeLessThan(0);
  })
);
