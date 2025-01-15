// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { scrollbarThickness } from '../../__integ__/scrollbars';
import { viewports } from './constants';
import { AppLayoutSplitViewPage } from './utils';

import mobileStyles from '../../../lib/components/app-layout/mobile-toolbar/styles.selectors.js';

const wrapper = createWrapper().findAppLayout();

describe.each(['classic', 'refresh', 'refresh-toolbar'] as const)('%s', theme => {
  function setupTest(
    testFn: (page: AppLayoutSplitViewPage) => Promise<void>,
    url = '#/light/app-layout/with-split-panel'
  ) {
    return useBrowser(async browser => {
      const page = new AppLayoutSplitViewPage(browser);
      await page.setWindowSize(viewports.desktop);
      const params = new URLSearchParams({
        visualRefresh: `${theme.startsWith('refresh')}`,
        appLayoutToolbar: `${theme === 'refresh-toolbar'}`,
      });
      await browser.url(`${url}?${params.toString()}`);
      await page.waitForVisible(wrapper.findContentRegion().toSelector());
      await testFn(page);
    });
  }

  test(
    'slider is accessible by keyboard in side position',
    setupTest(async page => {
      await page.click(wrapper.findNavigationClose().toSelector());
      await page.openPanel();
      await page.switchPosition('side');
      await page.keys(['Shift', 'Tab', 'Shift']);
      await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBe(true);

      const { width: initialWidth } = await page.getSplitPanelSize();
      const initialSliderValue = await page.getSplitPanelSliderValue();

      await page.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

      const expectedWidth = initialWidth + 30;
      expect((await page.getSplitPanelSize()).width).toEqual(expectedWidth);
      expect(await page.getSplitPanelSliderValue()).toBeLessThan(initialSliderValue);
    })
  );

  (theme === 'classic' ? test : test.skip)(
    'slider is accessible by keyboard in bottom position',
    setupTest(async page => {
      await page.openPanel();
      await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBe(true);

      const { height } = await page.getSplitPanelSize();
      const initialSliderValue = await page.getSplitPanelSliderValue();

      await page.keys(['ArrowUp', 'ArrowUp', 'ArrowUp']);

      const expectedHeight = Math.round(height + 30);
      expect((await page.getSplitPanelSize()).height).toEqual(expectedHeight);
      expect(await page.getSplitPanelSliderValue()).toBeGreaterThan(initialSliderValue);
    })
  );

  (theme === 'classic' ? test : test.skip).each([
    { position: 'side', repeatKey: 'ArrowLeft', expectedValue: 0 },
    { position: 'side', repeatKey: 'ArrowRight', expectedValue: 100 },
    { position: 'bottom', repeatKey: 'ArrowLeft', expectedValue: 0 },
    { position: 'bottom', repeatKey: 'ArrowRight', expectedValue: 100 },
  ])(
    'allows split panel slider in $position position to be adjusted to $expectedValue',
    ({ position, repeatKey, expectedValue }) =>
      setupTest(async page => {
        await page.openPanel();
        if (position === 'side') {
          await page.switchPosition('side');
          await page.keys(['Shift', 'Tab', 'Shift']);
        }
        await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBe(true);
        // send each keystroke as individual command to allow UI re-rendering between keys
        for (const key of Array(30).fill(repeatKey)) {
          await page.keys(key);
        }
        await expect(page.getSplitPanelSliderValue()).resolves.toBe(expectedValue);
      })()
  );

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
    'switches to bottom position when screen resizes to mobile',
    setupTest(async page => {
      await page.openPanel();
      await page.switchPosition('side');
      await expect(page.getPanelPosition()).resolves.toEqual('side');

      await page.setWindowSize(viewports.mobile);
      await expect(page.getPanelPosition()).resolves.toEqual('bottom');
      // in VR design, split panel keeps same size as it was open on the side
      const { height: windowHeight } = await page.getViewportSize();
      const expectedBottomOffset = theme === 'refresh' ? windowHeight / 2 + 40 + 'px' : '160px';
      await expect(page.getContentOffsetBottom(theme)).resolves.toEqual(expectedBottomOffset);
    })
  );
  test(
    'switches to bottom position when screen is too narrow and restores back on resize',
    setupTest(async page => {
      await page.openPanel();
      await page.switchPosition('side');
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
      await page.setWindowSize({ ...viewports.desktop, width: 1100 });
      await page.openPanel();
      await page.switchPosition('side');
      await page.click(wrapper.findToolsToggle().toSelector());
      await expect(page.getPanelPosition()).resolves.toEqual('bottom');

      await page.click(wrapper.findToolsClose().toSelector());
      await expect(page.getPanelPosition()).resolves.toEqual('side');
    })
  );

  test(
    'should have extended max height for constrained heights',
    setupTest(async page => {
      // Simulating 200% zoom on medium screens (1366x768 / 2 ~= 680x360 ).
      await page.setWindowSize({ width: 680, height: 360 });
      await page.openPanel();
      const { height: screenHeight } = await page.getViewportSize();
      const headerRect = await page.getBoundingBox('#h');
      await page.dragResizerTo({ x: 0, y: screenHeight });
      expect((await page.getSplitPanelSize()).height).toEqual(160);
      await page.dragResizerTo({ x: 0, y: 0 });
      const splitPanelMaxSize = screenHeight - 40 - headerRect.height;
      expect(Math.round((await page.getSplitPanelSize()).height)).toEqual(splitPanelMaxSize);
    })
  );

  [
    { url: '#/light/app-layout/disable-paddings-with-split-panel', name: 'paddings disabled' },
    { url: '#/light/app-layout/with-split-panel', name: 'paddings enabled' },
  ].forEach(({ url, name }) => {
    test(
      `should not allow resize split panel beyond min and max limits (side position) (${name})`,
      setupTest(async page => {
        await page.openPanel();
        await page.switchPosition('side');
        const { width } = await page.getViewportSize();

        // Drag the resizer to the right (i.e, make the split panel narrower) as much as possible
        await page.dragResizerTo({ x: width, y: 0 });
        expect((await page.getSplitPanelSize()).width).toEqual(280);

        // Drag the resizer to the left (i.e, make the split panel wider) as much as possible
        await page.dragResizerTo({ x: 0, y: 0 });

        const arePaddingsEnabled = name === 'paddings enabled';

        // different design allows for different split panel max width
        const expectedWidth = {
          classic: arePaddingsEnabled ? 520 - scrollbarThickness : 520,
          refresh: arePaddingsEnabled ? 445 - 2 * scrollbarThickness : 469 - scrollbarThickness,
          'refresh-toolbar': arePaddingsEnabled ? 592 - scrollbarThickness : 592,
        };
        expect((await page.getSplitPanelSize()).width).toEqual(expectedWidth[theme]);
      }, url)
    );
  });

  test(
    'should not allow resize split panel beyond min and max limits (bottom position)',
    setupTest(async page => {
      await page.openPanel();
      const { height } = await page.getViewportSize();
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
    'respects min width when switching panel from bottom to side',
    setupTest(async page => {
      await page.openPanel();
      const { height: viewportHeight } = await page.getViewportSize();
      await page.dragResizerTo({ x: 0, y: viewportHeight });
      const { height } = await page.getSplitPanelSize();
      expect(height).toEqual(160);
      await page.switchPosition('side');
      const { width } = await page.getSplitPanelSize();
      expect(width).toEqual(280);
    })
  );

  test(
    'should keep split panel position during drag',
    setupTest(async page => {
      await page.openPanel();
      await page.switchPosition('side');
      await page.dragResizerTo({ x: 0, y: 0 });
      await page.setWindowSize({ ...viewports.desktop, width: 820 });
      const { height } = await page.getViewportSize();
      await page.dragResizerTo({ x: 0, y: height });
      await expect(page.getPanelPosition()).resolves.toEqual('bottom');
    })
  );

  test(
    'side panel stays in the viewport when scrolling down',
    setupTest(async page => {
      const splitPanelSelector = wrapper.findSplitPanel().findOpenPanelSide().toSelector();
      await page.openPanel();
      await page.switchPosition('side');
      const { top: offsetBefore } = await page.getBoundingBox(splitPanelSelector);
      await page.windowScrollTo({ top: 500 });
      const { top: offsetAfter } = await page.getBoundingBox(splitPanelSelector);
      expect(offsetAfter).toEqual(offsetBefore);
    })
  );

  test(
    'avoids covering the page content when collapsed at the bottom',
    setupTest(async page => {
      const splitPanel = wrapper.findSplitPanel();
      const splitPanelSelector = wrapper.findSplitPanel().toSelector();
      const contentSelector = wrapper.findContentRegion().findSpaceBetween().toSelector();
      await expect(page.isExisting(splitPanel.findOpenButton().toSelector())).resolves.toBe(true);
      await page.windowScrollTo({ top: 1000 });
      const { top: splitPAnelTop } = await page.getBoundingBox(splitPanelSelector);
      const { bottom: contentBottom } = await page.getBoundingBox(contentSelector);
      expect(splitPAnelTop).toBeGreaterThanOrEqual(contentBottom);
    })
  );

  describe('interaction with table sticky header', () => {
    // bottom padding is included into the offset in VR but not in classic
    const splitPanelPadding = theme === 'refresh' ? 40 : 0;

    test(
      'should resize main content area when switching to side',
      setupTest(async page => {
        const { height: windowHeight } = await page.getViewportSize();
        await expect(page.getContentOffsetBottom(theme)).resolves.toEqual(windowHeight / 2 + splitPanelPadding + 'px');
        await page.switchPosition('side');
        await expect(page.getContentOffsetBottom(theme)).resolves.toEqual(splitPanelPadding + 'px');
      }, '#/light/app-layout/with-full-page-table-and-split-panel')
    );

    test(
      'should resize main content area when switching to side then back to bottom',
      setupTest(async page => {
        const { height: windowHeight } = await page.getViewportSize();
        await expect(page.getContentOffsetBottom(theme)).resolves.toEqual(windowHeight / 2 + splitPanelPadding + 'px');
        await page.switchPosition('side');
        await page.switchPosition('bottom');
        await expect(page.getContentOffsetBottom(theme)).resolves.toEqual(windowHeight / 2 + splitPanelPadding + 'px');
      }, '#/light/app-layout/with-full-page-table-and-split-panel')
    );
  });
});
