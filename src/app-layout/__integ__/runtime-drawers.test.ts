// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { AppLayoutWrapper } from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();
const findDrawerById = (wrapper: AppLayoutWrapper, id: string) => {
  return wrapper.find(`[data-testid="awsui-app-layout-drawer-${id}"]`);
};

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

describe('Visual refresh toolbar only', () => {
  function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);

      await browser.url(
        `#/light/app-layout/runtime-drawers?${new URLSearchParams({
          hasDrawers: 'false',
          hasTools: 'true',
          splitPanelPosition: 'side',
          visualRefresh: 'true',
          appLayoutToolbar: 'true',
        }).toString()}`
      );
      await page.waitForVisible(wrapper.findDrawerTriggerById('security').toSelector(), true);
      await testFn(page);
    });
  }

  test(
    'displays only the most recently opened drawer in a full-width popup on mobile view (global drawer on top of the local one)',
    setupTest(async page => {
      await page.click(wrapper.findDrawerTriggerById('security').toSelector());
      await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());

      await page.setWindowSize(viewports.mobile);
      // technically, both drawers are present in the DOM tree, but only one is visible.
      // the isClickable check ensures that the drawer is actually visible
      await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(true);
    })
  );

  test(
    'displays only the most recently opened drawer in a full-width popup on mobile view (local drawer on top of the global one)',
    setupTest(async page => {
      await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
      await page.click(wrapper.findDrawerTriggerById('security').toSelector());

      await page.setWindowSize(viewports.mobile);
      // technically, both drawers are present in the DOM tree, but only one is visible.
      // the isClickable check ensures that the drawer is actually visible
      await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
    })
  );

  test(
    'should open 3 drawers (1 local and 2 global) if the screen size permits',
    setupTest(async page => {
      await page.setWindowSize({ ...viewports.desktop, width: 1700 });
      await page.click(wrapper.findDrawerTriggerById('security').toSelector());
      await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
      await page.click(wrapper.findDrawerTriggerById('circle2-global').toSelector());

      await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
    })
  );

  describe('active drawers take up all available space on the page and a third drawer is opened', () => {
    test(
      'active drawers can be shrunk to accommodate a third drawer',
      setupTest(async page => {
        await page.setWindowSize({ ...viewports.desktop, width: 1600 });
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('circle2-global').toSelector());

        // resize an active drawer to take up all available space
        await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -600);

        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
      })
    );

    test('first opened drawer should be closed when active drawers can not be shrunk to accommodate it', () => {
      setupTest(async page => {
        await page.setWindowSize({ ...viewports.desktop, width: 1400 });
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('circle2-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(false);
        await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
      });
    });
  });
});
