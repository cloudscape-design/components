// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();

for (const visualRefresh of [true, false]) {
  describe(`visualRefresh=${visualRefresh}`, () => {
    function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
      return useBrowser(async browser => {
        const page = new BasePageObject(browser);

        await browser.url(
          `#/light/app-layout/runtime-drawers?${new URLSearchParams({
            hasDrawers: 'false',
            hasTools: 'true',
            splitPanelPosition: 'side',
            visualRefresh: `${visualRefresh}`,
          }).toString()}`
        );
        await page.waitForVisible(wrapper.findDrawerTriggerById('security').toSelector(), true);
        await testFn(page);
      });
    }

    test(
      'should resize equally with tools or drawers',
      setupTest(async page => {
        await page.setWindowSize({ ...viewports.desktop, width: 1800 });
        await page.click(wrapper.findToolsToggle().toSelector());
        await page.click(wrapper.findSplitPanel().findOpenButton().toSelector());

        const { width: splitPanelWidthWithTools } = await page.getBoundingBox(wrapper.findSplitPanel().toSelector());

        await page.click(wrapper.findDrawerTriggerById('circle').toSelector());
        const { width: splitPanelWidthWithDrawer } = await page.getBoundingBox(wrapper.findSplitPanel().toSelector());

        expect(splitPanelWidthWithTools).toEqual(splitPanelWidthWithDrawer);
      })
    );

    test(
      'renders according to defaultSize property',
      setupTest(async page => {
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());
        // using `clientWidth` to neglect possible border width set on this element
        const width = await page.getElementProperty(wrapper.findActiveDrawer().toSelector(), 'clientWidth');
        expect(width).toEqual(320);
      })
    );

    test(
      'should call resize handler',
      setupTest(async page => {
        // close navigation panel to give drawer more room to resize
        await page.click(wrapper.findNavigationClose().toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: false');

        await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -200);
        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: true');
      })
    );
  });
}
