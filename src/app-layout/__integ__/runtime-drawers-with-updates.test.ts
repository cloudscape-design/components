// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findAppLayout();

for (const visualRefresh of [true, false]) {
  describe(`visualRefresh=${visualRefresh}`, () => {
    function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
      return useBrowser(async browser => {
        const page = new BasePageObject(browser);

        await browser.url(
          `#/light/app-layout/runtime-drawers-with-updates?${new URLSearchParams({
            hasTools: 'true',
            visualRefresh: `${visualRefresh}`,
          }).toString()}`
        );
        await page.waitForVisible(wrapper.findDrawerTriggerById('security').toSelector(), true);
        await testFn(page);
      });
    }

    test(
      'should update the drawer default size',
      setupTest(async page => {
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());
        // using `clientWidth` to neglect possible border width set on this element
        expect(await page.getElementProperty(wrapper.findActiveDrawer().toSelector(), 'clientWidth')).toEqual(320);

        await page.click(
          createWrapper().findToggle('[data-testid="increase-drawer-size-toggle"]').findNativeInput().toSelector()
        );

        expect(await page.getElementProperty(wrapper.findActiveDrawer().toSelector(), 'clientWidth')).toEqual(440);
      })
    );

    test(
      'should call update drawer to disable resize',
      setupTest(async page => {
        // close navigation panel to give drawer more room to resize
        await page.click(wrapper.findNavigationClose().toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.isExisting(wrapper.findActiveDrawerResizeHandle().toSelector())).resolves.toBe(true);

        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: false');

        await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -200);
        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: true');

        await page.click(
          createWrapper().findToggle('[data-testid="turn-off-resize-toggle"]').findNativeInput().toSelector()
        );

        await expect(page.isExisting(wrapper.findActiveDrawerResizeHandle().toSelector())).resolves.toBe(false);
      })
    );
  });
}
