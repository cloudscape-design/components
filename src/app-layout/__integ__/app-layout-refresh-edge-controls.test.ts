// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();

class AppLayoutRefreshEdgeControlsPage extends BasePageObject {
  getEvent(index: number) {
    return this.getText(`#events > li:nth-child(${index + 1})`);
  }
}

function setupTest(testFn: (page: AppLayoutRefreshEdgeControlsPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new AppLayoutRefreshEdgeControlsPage(browser);
    await page.setWindowSize(viewports.desktop);
    await browser.url(`#/light/app-layout/disable-paddings-edge-controls/?visualRefresh=true`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

describe('with disableContentPaddings=true', () => {
  test(
    'clickable elements below the navigation toggle are clickable',
    setupTest(async page => {
      await page.click(`[data-testid="one"]`);
      return expect(page.getEvent(0)).resolves.toBe(`Clicked "One"`);
    })
  );

  test(
    'clickable elements below the tools toggle are clickable',
    setupTest(async page => {
      await page.click(`[data-testid="two"]`);
      return expect(page.getEvent(0)).resolves.toBe(`Clicked "Two"`);
    })
  );

  test(
    'the navigation toggle is clickable',
    setupTest(async page => {
      await page.click(wrapper.findNavigationToggle().toSelector());
      return expect(page.isDisplayed(wrapper.findNavigationClose().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'the tools toggle is clickable',
    setupTest(async page => {
      await page.click(wrapper.findToolsToggle().toSelector());
      return expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'the side split panel toggle is clickable',
    setupTest(async page => {
      await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
      return expect(page.isDisplayed(wrapper.findSplitPanel().findOpenPanelSide().toSelector())).resolves.toBe(true);
    })
  );

  test(
    'the navigation content is clickable',
    setupTest(async page => {
      await page.click(wrapper.findNavigationToggle().toSelector());
      await page.click(`[data-testid="navigation"]`);
      return expect(page.getEvent(0)).resolves.toBe(`Clicked "Navigation"`);
    })
  );

  test(
    'the tools content is clickable',
    setupTest(async page => {
      await page.click(wrapper.findToolsToggle().toSelector());
      await page.click(`[data-testid="tools"]`);
      return expect(page.getEvent(0)).resolves.toBe(`Clicked "Tools"`);
    })
  );

  test(
    'the side split panel content is clickable',
    setupTest(async page => {
      await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());
      await page.click(`[data-testid="split-panel"]`);
      return expect(page.getEvent(0)).resolves.toBe(`Clicked "Split panel"`);
    })
  );
});
