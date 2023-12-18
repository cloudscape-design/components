// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();
class AppLayoutDrawersPage extends BasePageObject {
  async openFirstDrawer() {
    await this.click(wrapper.findDrawersTriggers().get(1).toSelector());
  }

  async openThirdDrawer() {
    await this.click(wrapper.findDrawerTriggerById('links').toSelector());
  }

  async openSplitPanel() {
    await this.click(wrapper.findSplitPanel().findOpenButton().toSelector());
  }

  async dragResizerTo({ x: targetX, y: targetY }: { x: number; y: number }) {
    const resizerSelector = wrapper.findActiveDrawerResizeHandle().toSelector();
    const resizerBox = await this.getBoundingBox(resizerSelector);
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, x: Math.ceil(resizerBox.left), y: Math.ceil(resizerBox.top) }, // hover on the resizer
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 30 }, // extra delay to allow event listeners to update
          { type: 'pointerMove', duration: 0, x: targetX, y: targetY },
          { type: 'pause', duration: 30 }, // extra delay to allow event listeners to update
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
  }

  getWindowSize() {
    return this.browser.getWindowSize();
  }

  async getActiveDrawerWidth() {
    const { width } = await this.getBoundingBox(wrapper.findActiveDrawer().toSelector());
    return width;
  }

  async getSplitPanelWidth() {
    const { width } = await this.getBoundingBox(wrapper.findSplitPanel().toSelector());
    return width;
  }

  async getMainContentWidth() {
    const { width } = await this.getBoundingBox(wrapper.find('[data-test-id="content"]').toSelector());
    return width;
  }

  async getResizeHandlePosition() {
    const position = await this.getBoundingBox(wrapper.findActiveDrawerResizeHandle().toSelector());
    return position;
  }
}

interface SetupTestOptions {
  splitPanelPosition?: string;
  screenSize?: typeof viewports['desktop' | 'mobile'];
  disableContentPaddings?: string;
  visualRefresh?: string;
}

const setupTest = (
  {
    splitPanelPosition = 'bottom',
    screenSize = viewports.desktop,
    disableContentPaddings = 'false',
    visualRefresh = 'false',
  }: SetupTestOptions,
  testFn: (page: AppLayoutDrawersPage) => Promise<void>
) =>
  useBrowser(screenSize, async browser => {
    const page = new AppLayoutDrawersPage(browser);
    const params = new URLSearchParams({
      visualRefresh,
      splitPanelPosition,
      disableContentPaddings,
    }).toString();
    await browser.url(`#/light/app-layout/with-drawers?${params}`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });

for (const visualRefresh of ['true', 'false']) {
  describe(`visualRefresh=${visualRefresh}`, () => {
    // there is an extra 2 borders inside drawer box in visual refresh
    const vrBorderOffset = visualRefresh === 'true' ? 2 : 0;

    test(
      'slider is accessible by keyboard in side position',
      setupTest({ visualRefresh }, async page => {
        await page.openFirstDrawer();
        await page.keys(['Enter']);
        await expect(page.isFocused(wrapper.findActiveDrawerResizeHandle().toSelector())).resolves.toBe(true);

        const width = await page.getActiveDrawerWidth();
        await page.keys(['ArrowLeft']);
        const expectedWidth = width + 10;
        await expect(page.getActiveDrawerWidth()).resolves.toEqual(expectedWidth);
      })
    );

    test(
      'hides the resize handle on mobile',
      setupTest({ visualRefresh }, async page => {
        await page.openFirstDrawer();
        await expect(page.isExisting(wrapper.findActiveDrawerResizeHandle().toSelector())).resolves.toBe(true);

        await page.setWindowSize(viewports.mobile);
        await expect(page.isExisting(wrapper.findActiveDrawerResizeHandle().toSelector())).resolves.toBe(false);
      })
    );

    test(
      `should not allow resize drawer beyond min and max limits`,
      setupTest({ visualRefresh }, async page => {
        await page.openFirstDrawer();
        const { width } = await page.getWindowSize();
        await page.dragResizerTo({ x: width, y: 0 });
        // there are different layouts between these two designs
        await expect(page.getActiveDrawerWidth()).resolves.toEqual(290 + vrBorderOffset);
        await page.dragResizerTo({ x: 0, y: 0 });
        await expect(page.getActiveDrawerWidth()).resolves.toEqual(visualRefresh === 'true' ? 447 : 520);
      })
    );

    test(
      'automatically shrinks drawer when screen resizes',
      setupTest({ visualRefresh }, async page => {
        const largeWindowWidth = 1400;
        const smallWindowWidth = 900;
        await page.setWindowSize({ ...viewports.desktop, width: largeWindowWidth });
        await page.openThirdDrawer();
        const originalWidth = await page.getActiveDrawerWidth();
        await page.setWindowSize({ ...viewports.desktop, width: smallWindowWidth });
        const newWidth = await page.getActiveDrawerWidth();
        expect(newWidth).toBeLessThan(originalWidth);
        expect(newWidth).toBeLessThan(smallWindowWidth);
      })
    );

    test(
      `should not shrink drawer beyond min width`,
      setupTest({ visualRefresh, screenSize: { ...viewports.desktop, width: 700 } }, async page => {
        await page.openThirdDrawer();
        await expect(page.getActiveDrawerWidth()).resolves.toEqual(290 + vrBorderOffset);
      })
    );

    test(
      'split panel and drawer can resize independently',
      setupTest(
        { visualRefresh, splitPanelPosition: 'side', screenSize: { ...viewports.desktop, width: 1800 } },
        async page => {
          await page.openFirstDrawer();
          await page.openSplitPanel();

          const originalSplitPanelWidth = await page.getSplitPanelWidth();
          const originalDrawerWidth = await page.getActiveDrawerWidth();
          await page.dragAndDrop(wrapper.findSplitPanel().findSlider().toSelector(), 100);

          const newSplitPanelWidth = await page.getSplitPanelWidth();
          expect(newSplitPanelWidth).toBeLessThan(originalSplitPanelWidth);
          await expect(page.getActiveDrawerWidth()).resolves.toEqual(originalDrawerWidth);

          await page.dragAndDrop(wrapper.findActiveDrawerResizeHandle().toSelector(), -100);
          await expect(page.getSplitPanelWidth()).resolves.toEqual(newSplitPanelWidth);
          await expect(page.getActiveDrawerWidth()).resolves.toBeGreaterThan(originalDrawerWidth);
        }
      )
    );

    test(
      'updates side split panel position when using different width drawers',
      setupTest(
        { visualRefresh, splitPanelPosition: 'side', screenSize: { ...viewports.desktop, width: 1500 } },
        async page => {
          await page.openFirstDrawer();
          await page.openSplitPanel();
          await expect(page.isExisting(wrapper.findSplitPanel().findOpenPanelSide().toSelector())).resolves.toEqual(
            true
          );

          await page.openThirdDrawer();
          await expect(page.isExisting(wrapper.findSplitPanel().findOpenPanelBottom().toSelector())).resolves.toEqual(
            true
          );

          await page.openFirstDrawer();
          await expect(page.isExisting(wrapper.findSplitPanel().findOpenPanelSide().toSelector())).resolves.toEqual(
            true
          );
        }
      )
    );

    test(
      'scrolling drawer does not affect resize handle position',
      setupTest({}, async page => {
        await page.openFirstDrawer();
        const resizeHandleBefore = await page.getResizeHandlePosition();
        await page.elementScrollTo(wrapper.findActiveDrawer().toSelector(), { top: 100 });
        const resizeHandleAfter = await page.getResizeHandlePosition();
        await expect(resizeHandleAfter).toEqual(resizeHandleBefore);
      })
    );
  });
}

describe('Visual refresh only', () => {
  test(
    'pushes content over with disableContentPaddings',
    setupTest({ disableContentPaddings: 'true', visualRefresh: 'true' }, async page => {
      const width = await page.getMainContentWidth();
      await page.openFirstDrawer();
      const newWidth = await page.getMainContentWidth();
      await expect(width).toBeGreaterThan(newWidth);
    })
  );
});
