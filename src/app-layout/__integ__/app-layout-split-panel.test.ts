// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import mobileStyles from '../../../lib/components/app-layout/mobile-toolbar/styles.selectors.js';
import { viewports } from './constants';

const wrapper = createWrapper().findAppLayout();
class AppLayoutSplitViewPage extends BasePageObject {
  async openPanel() {
    await this.click(wrapper.findSplitPanel().findOpenButton().toSelector());
  }

  // the argument here is the visible label text
  async switchPosition(position: 'Bottom' | 'Side') {
    await this.click(wrapper.findSplitPanel().findPreferencesButton().toSelector());
    await this.click(`label=${position}`);
    await this.click('button=Confirm');
  }

  async dragResizerTo({ x: targetX, y: targetY }: { x: number; y: number }) {
    const resizerSelector = wrapper.findSplitPanel().findSlider().toSelector();
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

  async getPanelPosition() {
    if (await this.isExisting(wrapper.findSplitPanel().findSlider().toSelector())) {
      if (await this.isExisting(wrapper.findSplitPanel().findOpenPanelBottom().toSelector())) {
        return 'bottom';
      }
      return 'side';
    }
    // can't detect position when the panel is closed
    return undefined;
  }

  getWindowSize() {
    return this.browser.getWindowSize();
  }

  getSplitPanelSize() {
    return this.getBoundingBox(wrapper.findSplitPanel().toSelector());
  }
}

function setupTest(
  testFn: (page: AppLayoutSplitViewPage) => Promise<void>,
  url = '#/light/app-layout/with-split-panel'
) {
  return useBrowser(async browser => {
    const page = new AppLayoutSplitViewPage(browser);
    await page.setWindowSize(viewports.desktop);
    await browser.url(`${url}?visualRefresh=false`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });
}

test(
  'renders with initial side position',
  useBrowser(async browser => {
    const page = new AppLayoutSplitViewPage(browser);
    await page.setWindowSize(viewports.desktop);
    await browser.url(`#/light/app-layout/with-split-panel?visualRefresh=false&splitPanelPosition=side`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await page.openPanel();
    await expect(page.getPanelPosition()).resolves.toEqual('side');
  })
);

test(
  'switches to bottom position when screen is too narrow and restores back on resize',
  setupTest(async page => {
    await page.openPanel();
    await page.switchPosition('Side');
    await expect(page.getPanelPosition()).resolves.toEqual('side');

    // narrow enough to force bottom position, but still not mobile
    await page.setWindowSize({ ...viewports.desktop, width: 820 });
    await expect(page.isExisting(`.${mobileStyles['mobile-bar']}`)).resolves.toBe(false);
    await expect(page.getPanelPosition()).resolves.toEqual('bottom');

    await page.setWindowSize(viewports.desktop);
    await expect(page.getPanelPosition()).resolves.toEqual('side');
  })
);

test(
  'switches to bottom position when when tools panel opens and available space is too small',
  setupTest(async page => {
    await page.openPanel();
    await page.switchPosition('Side');
    await page.click(wrapper.findToolsToggle().toSelector());
    await expect(page.getPanelPosition()).resolves.toEqual('bottom');

    await page.click(wrapper.findToolsClose().toSelector());
    await expect(page.getPanelPosition()).resolves.toEqual('side');
  })
);

test(
  `should have extended max height for constrained heights`,
  setupTest(async page => {
    // Simulating 200% zoom on medium screens (1366x768 / 2 ~= 680x360 ).
    await page.setWindowSize({ width: 680, height: 360 });
    await page.openPanel();
    const { height } = await page.getWindowSize();
    await page.dragResizerTo({ x: 0, y: height });
    expect((await page.getSplitPanelSize()).height).toEqual(160);
    await page.dragResizerTo({ x: 0, y: 0 });
    expect(Math.round((await page.getSplitPanelSize()).height)).toEqual(277);
  })
);

[
  { url: '#/light/app-layout/disable-paddings-with-split-panel', name: 'paddings disabled' },
  { url: '#/light/app-layout/with-split-panel', name: 'paddings enabled' },
].forEach(({ url, name }) => {
  test(
    `should not allow resize split panel beyond min and max limits (side position) (${name})}`,
    setupTest(async page => {
      await page.openPanel();
      await page.switchPosition('Side');
      const { width } = await page.getWindowSize();
      await page.dragResizerTo({ x: width, y: 0 });
      expect((await page.getSplitPanelSize()).width).toEqual(280);

      await page.dragResizerTo({ x: 0, y: 0 });
      expect((await page.getSplitPanelSize()).width).toEqual(520);
    }, url)
  );
});

test(
  'should not allow resize split panel beyond min and max limits (bottom position)',
  setupTest(async page => {
    await page.openPanel();
    const { height } = await page.getWindowSize();
    const { height: headerHeight } = await page.getBoundingBox('#h');
    await page.dragResizerTo({ x: 0, y: height });
    expect((await page.getSplitPanelSize()).height).toEqual(160);

    await page.dragResizerTo({ x: 0, y: 0 });
    expect((await page.getSplitPanelSize()).height).toEqual(height - headerHeight - 250);
  })
);

test(
  'automatically shrinks split panel when screen resizes (bottom position)',
  setupTest(async page => {
    await page.openPanel();
    const windowHeight = 400;
    const { height: originalHeight } = await page.getSplitPanelSize();
    await page.setWindowSize({ ...viewports.desktop, height: windowHeight });
    const { height: newHeight } = await page.getSplitPanelSize();
    expect(newHeight).toBeLessThan(originalHeight);
    expect(newHeight).toBeLessThan(windowHeight);
  })
);

test(
  'should keep split panel position during drag',
  setupTest(async page => {
    await page.openPanel();
    await page.switchPosition('Side');
    await page.dragResizerTo({ x: 0, y: 0 });
    await page.setWindowSize({ ...viewports.desktop, width: 820 });
    const { height } = await page.getWindowSize();
    await page.dragResizerTo({ x: 0, y: height });
    await expect(page.getPanelPosition()).resolves.toEqual('bottom');
  })
);
