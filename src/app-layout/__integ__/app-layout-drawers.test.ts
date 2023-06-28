// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();
class AppLayoutDrawersPage extends BasePageObject {
  async openPanel() {
    await this.click(wrapper.findDrawersTriggers().get(1).toSelector());
  }

  async openThirdPanel() {
    await this.click(wrapper.findDrawersTriggers().get(3).toSelector());
  }

  async dragResizerTo({ x: targetX, y: targetY }: { x: number; y: number }) {
    const resizerSelector = wrapper.findDrawersSlider().toSelector();
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

  getDrawerSize() {
    return this.getBoundingBox(wrapper.findActiveDrawer().toSelector());
  }
}

function setupTest({ visualRefresh = false }, testFn: (page: AppLayoutDrawersPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new AppLayoutDrawersPage(browser);
    await page.setWindowSize(viewports.desktop);
    await browser.url(`#/light/app-layout/with-drawers?visualRefresh=${visualRefresh}`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

for (const visualRefresh of [true, false]) {
  describe(`visualRefresh=${visualRefresh}`, () => {
    test(
      'slider is accessible by keyboard in side position',
      setupTest({ visualRefresh }, async page => {
        await page.openPanel();
        await page.keys(['Enter']);
        await expect(page.isFocused(wrapper.findDrawersSlider().toSelector())).resolves.toBe(true);

        const { width } = await page.getDrawerSize();
        await page.keys(['ArrowLeft']);
        const expectedWidth = width + 10;
        await expect((await page.getDrawerSize()).width).toEqual(expectedWidth);
      })
    );

    test(
      'hides the resize handle on mobile',
      setupTest({ visualRefresh }, async page => {
        await page.openPanel();
        await expect(page.isExisting(wrapper.findDrawersSlider().toSelector())).resolves.toBe(true);

        await page.setWindowSize(viewports.mobile);
        await expect(page.isExisting(wrapper.findDrawersSlider().toSelector())).resolves.toBe(false);
      })
    );

    test(
      `should not allow resize drawer beyond min and max limits`,
      setupTest({ visualRefresh: false }, async page => {
        await page.openPanel();
        const { width } = await page.getWindowSize();
        await page.dragResizerTo({ x: width, y: 0 });
        expect((await page.getDrawerSize()).width).toEqual(280);

        await page.dragResizerTo({ x: 0, y: 0 });
        expect((await page.getDrawerSize()).width).toEqual(520);
      })
    );

    // in VR, there is a border that adds 2px to the width.
    test(
      `should not allow resize drawer beyond min and max limits`,
      setupTest({ visualRefresh: true }, async page => {
        await page.openPanel();
        const { width } = await page.getWindowSize();
        await page.dragResizerTo({ x: width, y: 0 });
        expect((await page.getDrawerSize()).width).toEqual(292);
        await page.dragResizerTo({ x: 0, y: 0 });
        expect((await page.getDrawerSize()).width).toEqual(362);
      })
    );

    test(
      'automatically shrinks drawer when screen resizes',
      setupTest({ visualRefresh: true }, async page => {
        const largeWindowWidth = 1400;
        const smallWindowWidth = 900;
        await page.setWindowSize({ ...viewports.desktop, width: largeWindowWidth });
        await page.openThirdPanel();
        const { width: originalWidth } = await page.getDrawerSize();
        await page.setWindowSize({ ...viewports.desktop, width: smallWindowWidth });
        const { width: newWidth } = await page.getDrawerSize();
        expect(newWidth).toBeLessThan(originalWidth);
        expect(newWidth).toBeLessThan(smallWindowWidth);
      })
    );
  });
}
