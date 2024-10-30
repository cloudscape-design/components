// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { AppLayoutWrapper } from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';
import { getUrlParams, Theme } from './utils';

const wrapper = createWrapper().findAppLayout();
const findDrawerById = (wrapper: AppLayoutWrapper, id: string) => {
  return wrapper.find(`[data-testid="awsui-app-layout-drawer-${id}"]`);
};

describe.each(['classic', 'refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest({ hasDrawers = 'false' }, testFn: (page: BasePageObject) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new BasePageObject(browser);

      await browser.url(
        `#/light/app-layout/runtime-drawers?${getUrlParams(theme, {
          hasDrawers: hasDrawers,
          hasTools: 'true',
          splitPanelPosition: 'side',
        })}`
      );
      await page.waitForVisible(wrapper.findDrawerTriggerById('security').toSelector(), true);
      await testFn(page);
    });
  }

  //drawer width assertions not neccessary for mobile
  describe('desktop', () => {
    test(
      'should resize equally with tools or drawers',
      setupTest({}, async page => {
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
      setupTest({}, async page => {
        await page.setWindowSize(viewports.desktop);
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());
        // using `clientWidth` to neglect possible border width set on this element
        const width = await page.getElementProperty(wrapper.findActiveDrawer().toSelector(), 'clientWidth');
        expect(width).toEqual(320);
      })
    );

    test(
      'should call resize handler',
      setupTest({}, async page => {
        await page.setWindowSize(viewports.desktop);
        // close navigation panel to give drawer more room to resize
        await page.click(wrapper.findNavigationClose().toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: false');

        await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -200);
        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: true');
      })
    );

    test(
      'should show sticky elements on scroll in drawer',
      setupTest({ hasDrawers: 'true' }, async page => {
        await page.setWindowSize(viewports.desktop);
        await page.waitForVisible(wrapper.findDrawerTriggerById('pro-help').toSelector(), true);

        await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(false);
        await page.click(wrapper.findDrawerTriggerById('pro-help').toSelector());
        await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(true);

        const getScrollPosition = () => page.getBoundingBox('[data-testid="drawer-sticky-header"]');
        const scrollBefore = await getScrollPosition();

        await page.elementScrollTo(wrapper.findActiveDrawer().toSelector(), { top: 100 });
        await expect(getScrollPosition()).resolves.toEqual(scrollBefore);
        await expect(page.isDisplayed('[data-testid="drawer-sticky-header"]')).resolves.toBe(true);
      })
    );
  });
});

describe('Visual refresh toolbar only', () => {
  class PageObject extends BasePageObject {
    hasHorizontalScroll() {
      return this.browser.execute(() => document.body.scrollWidth - document.body.clientWidth > 0);
    }
  }
  function setupTest(testFn: (page: PageObject) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new PageObject(browser);

      await browser.url(
        `#/light/app-layout/runtime-drawers?${getUrlParams('refresh-toolbar', {
          hasDrawers: 'false',
          hasTools: 'true',
          splitPanelPosition: 'side',
        })}`
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

    test(
      'first opened drawer should be closed when active drawers can not be shrunk to accommodate it (1400px)',
      setupTest(async page => {
        await page.setWindowSize({ ...viewports.desktop, width: 1400 });
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('circle2-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(false);
        await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
      })
    );

    test(
      'first opened drawer should be closed when active drawers can not be shrunk to accommodate it (1330px)',
      setupTest(async page => {
        await page.setWindowSize({ ...viewports.desktop, width: 1330 });
        await page.click(wrapper.findDrawerTriggerById('circle').toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('circle2-global').toSelector());

        await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(false);
        await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(false);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
      })
    );
  });

  test(
    'should prevent the horizontal page scroll from appearing during resize',
    setupTest(async page => {
      await page.setWindowSize({ ...viewports.desktop, width: 1600 });
      await page.click(wrapper.findDrawerTriggerById('circle').toSelector());
      await page.click(wrapper.findDrawerTriggerById('circle2-global').toSelector());
      await page.click(wrapper.findDrawerTriggerById('circle3-global').toSelector());

      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle3-global')!.toSelector())).resolves.toBe(true);
      await expect(page.hasHorizontalScroll()).resolves.toBe(false);

      await page.setWindowSize({ ...viewports.desktop, width: 1185 });
      // navigation panel closes first
      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toBe(false);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle3-global')!.toSelector())).resolves.toBe(true);
      await expect(page.hasHorizontalScroll()).resolves.toBe(false);

      await page.setWindowSize({ ...viewports.desktop, width: 900 });
      // then the first opened drawer closes
      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toBe(false);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(false);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle2-global')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle3-global')!.toSelector())).resolves.toBe(true);
      await expect(page.hasHorizontalScroll()).resolves.toBe(false);
    })
  );

  test(
    'should show sticky elements on scroll in global drawer',
    setupTest(async page => {
      await page.setWindowSize(viewports.desktop);
      await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(false);

      await page.click(createWrapper().findButton('[data-testid="open-drawer-button"]').toSelector());
      await page.waitForVisible(findDrawerById(wrapper, 'circle4-global')!.toSelector(), true);
      await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(true);

      const getScrollPosition = () => page.getBoundingBox('[data-testid="drawer-sticky-header"]');
      const scrollBefore = await getScrollPosition();

      await page.elementScrollTo(wrapper.findActiveDrawer().toSelector(), { top: 100 });
      await expect(getScrollPosition()).resolves.toEqual(scrollBefore);
      await expect(page.isDisplayed('[data-testid="drawer-sticky-header"]')).resolves.toBe(true);
    })
  );
});
