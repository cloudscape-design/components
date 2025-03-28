// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { AppLayoutWrapper } from '../../../lib/components/test-utils/selectors';
import { Theme } from '../../__integ__/utils.js';
import { viewports } from './constants';
import { getUrlParams } from './utils';

import vrDrawerStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';
import vrToolbarDrawerStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/drawer/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();
const findDrawerById = (wrapper: AppLayoutWrapper, id: string) => {
  return wrapper.find(`[data-testid="awsui-app-layout-drawer-${id}"]`);
};
const findDrawerContentById = (wrapper: AppLayoutWrapper, id: string) => {
  return wrapper.find(`[data-testid="awsui-app-layout-drawer-content-${id}"]`);
};

describe.each(['classic', 'refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest(
    { hasDrawers = 'false', url = 'runtime-drawers', size = viewports.desktop },
    testFn: (page: BasePageObject) => Promise<void>
  ) {
    return useBrowser({ width: size.width, height: size.height }, async browser => {
      const page = new BasePageObject(browser);

      await browser.url(
        `#/light/app-layout/${url}?${getUrlParams(theme, {
          hasDrawers: hasDrawers,
          hasTools: 'true',
          splitPanelPosition: 'side',
        })}`
      );
      await page.waitForVisible(wrapper.findContentRegion().toSelector());
      await testFn(page);
    });
  }

  //drawer width assertions not necessary for mobile
  describe('desktop', () => {
    test(
      'should resize equally with tools or drawers',
      setupTest({ size: { ...viewports.desktop, width: 1800 } }, async page => {
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
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());
        // using `clientWidth` to neglect possible border width set on this element
        const width = await page.getElementProperty(wrapper.findActiveDrawer().toSelector(), 'clientWidth');
        expect(width).toEqual(320);
      })
    );

    test(
      'should call resize handler',
      setupTest({}, async page => {
        // close navigation panel to give drawer more room to resize
        await page.click(wrapper.findNavigationClose().toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: false');

        await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -200);
        await expect(page.getText('[data-testid="current-size"]')).resolves.toEqual('resized: true');
      })
    );

    test(
      'should persist runtime drawer preferences when switching between multiple app layouts',
      setupTest(
        {
          url: 'multi-layout-with-hidden-instances-iframe',
        },
        async page => {
          await page.runInsideIframe('#page1', theme !== 'refresh-toolbar', async () => {
            await page.click(wrapper.findDrawerTriggerById('security').toSelector());
          });
          let newWidth: number;
          await page.runInsideIframe('#page1', true, async () => {
            await expect(page.getText(wrapper.findActiveDrawer().toSelector())).resolves.toContain('Security');
            const { width: originalWidth } = await page.getBoundingBox(wrapper.findActiveDrawer().toSelector());
            await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -200);
            ({ width: newWidth } = await page.getBoundingBox(wrapper.findActiveDrawer().toSelector()));
            expect(newWidth).toBeGreaterThan(originalWidth);
          });

          await page.click(wrapper.findNavigation().findSideNavigation().findLinkByHref('page2').toSelector());
          await page.runInsideIframe('#page2', true, async () => {
            await page.waitForVisible(wrapper.findActiveDrawer().toSelector());
            expect((await page.getBoundingBox(wrapper.findActiveDrawer().toSelector())).width).toEqual(newWidth!);
            await expect(page.getText(wrapper.findActiveDrawer().toSelector())).resolves.toContain('Security');
          });
        }
      )
    );

    test(
      'should show sticky elements on scroll in drawer',
      setupTest({ hasDrawers: 'true' }, async page => {
        await page.waitForVisible(wrapper.findDrawerTriggerById('pro-help').toSelector(), true);

        await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(false);
        await page.click(wrapper.findDrawerTriggerById('pro-help').toSelector());
        await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(true);

        const getScrollPosition = () => page.getBoundingBox('[data-testid="drawer-sticky-header"]');
        const scrollBefore = await getScrollPosition();

        const scrollableContainer =
          theme === 'classic'
            ? wrapper.findActiveDrawer().toSelector()
            : theme === 'refresh'
              ? `.${vrDrawerStyles['drawer-content-container']}`
              : `.${vrToolbarDrawerStyles['drawer-content-container']}`;

        await page.elementScrollTo(scrollableContainer, { top: 100 });
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
      await page.click(wrapper.findDrawerTriggerById('global-with-stored-state').toSelector());

      await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'global-with-stored-state')!.toSelector())).resolves.toBe(
        true
      );
    })
  );

  describe('active drawers take up all available space on the page and a third drawer is opened', () => {
    test(
      'active drawers can be shrunk to accommodate a third drawer',
      setupTest(async page => {
        await page.setWindowSize({ ...viewports.desktop, width: 1600 });
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('global-with-stored-state').toSelector());

        // resize an active drawer to take up all available space
        await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -600);

        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'global-with-stored-state')!.toSelector())).resolves.toBe(
          true
        );
      })
    );

    test(
      'first opened drawer should be closed when active drawers can not be shrunk to accommodate it (1400px)',
      setupTest(async page => {
        await page.setWindowSize({ ...viewports.desktop, width: 1400 });
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('global-with-stored-state').toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());

        await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(false);
        await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'global-with-stored-state')!.toSelector())).resolves.toBe(
          true
        );
      })
    );

    test(
      'first opened drawer should be closed when active drawers can not be shrunk to accommodate it (1345px)',
      setupTest(async page => {
        // Give the toolbar enough horizontal space to make sure the triggers are not collapsed into a dropdown
        await page.setWindowSize({ ...viewports.desktop, width: 1345 });
        await page.click(wrapper.findDrawerTriggerById('circle').toSelector());
        await page.click(wrapper.findDrawerTriggerById('security').toSelector());
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        await page.click(wrapper.findDrawerTriggerById('global-with-stored-state').toSelector());

        await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(false);
        await expect(page.isClickable(findDrawerById(wrapper, 'security')!.toSelector())).resolves.toBe(false);
        await expect(page.isClickable(findDrawerById(wrapper, 'circle-global')!.toSelector())).resolves.toBe(true);
        await expect(page.isClickable(findDrawerById(wrapper, 'global-with-stored-state')!.toSelector())).resolves.toBe(
          true
        );
      })
    );
  });

  test(
    'should prevent the horizontal page scroll from appearing during resize',
    setupTest(async page => {
      await page.setWindowSize({ ...viewports.desktop, width: 1600 });
      await page.click(wrapper.findDrawerTriggerById('circle').toSelector());
      await page.click(wrapper.findDrawerTriggerById('global-with-stored-state').toSelector());
      await page.click(wrapper.findDrawerTriggerById('circle3-global').toSelector());

      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'global-with-stored-state')!.toSelector())).resolves.toBe(
        true
      );
      await expect(page.isClickable(findDrawerById(wrapper, 'circle3-global')!.toSelector())).resolves.toBe(true);
      await expect(page.hasHorizontalScroll()).resolves.toBe(false);

      await page.setWindowSize({ ...viewports.desktop, width: 1185 });
      // navigation panel closes first
      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toBe(false);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(true);
      await expect(page.isClickable(findDrawerById(wrapper, 'global-with-stored-state')!.toSelector())).resolves.toBe(
        true
      );
      await expect(page.isClickable(findDrawerById(wrapper, 'circle3-global')!.toSelector())).resolves.toBe(true);
      await expect(page.hasHorizontalScroll()).resolves.toBe(false);

      await page.setWindowSize({ ...viewports.desktop, width: 900 });
      // then the first opened drawer closes
      await expect(page.isClickable(wrapper.findNavigation().toSelector())).resolves.toBe(false);
      await expect(page.isClickable(findDrawerById(wrapper, 'circle')!.toSelector())).resolves.toBe(false);
      await expect(page.isClickable(findDrawerById(wrapper, 'global-with-stored-state')!.toSelector())).resolves.toBe(
        true
      );
      await expect(page.isClickable(findDrawerById(wrapper, 'circle3-global')!.toSelector())).resolves.toBe(true);
      await expect(page.hasHorizontalScroll()).resolves.toBe(false);
    })
  );

  for (const viewport of ['mobile', 'desktop']) {
    test(
      `the content inside drawers should be scrollable on ${viewport} view`,
      setupTest(async page => {
        await page.click(wrapper.findDrawerTriggerById('circle-global').toSelector());
        if (viewport === 'mobile') {
          await page.setWindowSize(viewports.mobile);
        }
        await expect(
          page.isDisplayedInViewport(wrapper.find('[data-testid="circle-global-bottom-content"]')!.toSelector())
        ).resolves.toBe(false);
        await page.elementScrollTo(findDrawerContentById(wrapper, 'circle-global').toSelector(), { top: 2000 });
        await expect(
          page.isDisplayedInViewport(wrapper.find('[data-testid="circle-global-bottom-content"]')!.toSelector())
        ).resolves.toBe(true);
      })
    );
  }

  test(
    'should show sticky elements on scroll in custom global drawer',
    setupTest(async page => {
      await page.setWindowSize(viewports.desktop);
      await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(false);

      await page.click(createWrapper().findButton('[data-testid="open-drawer-button"]').toSelector());
      await page.waitForVisible(findDrawerById(wrapper, 'circle4-global')!.toSelector(), true);
      await expect(page.isDisplayed('[data-testid="drawer-sticky-footer"]')).resolves.toBe(true);

      const getScrollPosition = () => page.getBoundingBox('[data-testid="drawer-sticky-header"]');
      const scrollBefore = await getScrollPosition();

      const scrollableContainer = `.${vrToolbarDrawerStyles['drawer-content-container']}`;
      await page.elementScrollTo(scrollableContainer, { top: 100 });
      await expect(getScrollPosition()).resolves.toEqual(scrollBefore);
      await expect(page.isDisplayed('[data-testid="drawer-sticky-header"]')).resolves.toBe(true);
    })
  );
});
