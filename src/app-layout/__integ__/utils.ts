// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../../lib/components/test-utils/selectors';
import useBrowser from '../../__integ__/use-browser-with-scrollbars';
import { viewports } from './constants';

export const testIf = (condition: boolean) => (condition ? test : test.skip);

export type Theme = 'classic' | 'refresh' | 'refresh-toolbar';

interface SetupTestOptions {
  splitPanelPosition?: string;
  size?: 'desktop' | 'mobile';
  disableContentPaddings?: string;
  theme?: 'refresh' | 'refresh-toolbar' | 'classic';
}

export function getUrlParams(theme: Theme, other?: Record<string, string>) {
  const params = new URLSearchParams({
    visualRefresh: `${theme !== 'classic'}`,
    appLayoutToolbar: `${theme === 'refresh-toolbar'}`,
    ...other,
  });
  return params.toString();
}

export class AppLayoutDrawersPage extends BasePageObject {
  async getElementCenter(selector: string) {
    const targetRect = await this.getBoundingBox(selector);
    const x = Math.round(targetRect.left + targetRect.width / 2);
    const y = Math.round(targetRect.top + targetRect.height / 2);
    return { x, y };
  }

  async pointerDown(selector: string) {
    const center = await this.getElementCenter(selector);
    await (await this.browser.$(selector)).moveTo();
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, origin: 'pointer', ...center },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
        ],
      },
    ]);
  }

  async pointerUp() {
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'event',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: 100 },
        ],
      },
    ]);
  }
}

export const setupTest = (
  { size = 'desktop', theme = 'refresh', splitPanelPosition = '' }: SetupTestOptions,
  testFn: (page: AppLayoutDrawersPage) => Promise<void>
) =>
  useBrowser(size === 'desktop' ? viewports.desktop : viewports.mobile, async browser => {
    const wrapper = createWrapper().findAppLayout();
    const page = new AppLayoutDrawersPage(browser);
    const params = new URLSearchParams({
      visualRefresh: `${theme !== 'classic'}`,
      appLayoutWidget: `${theme === 'refresh-toolbar'}`,
      ...(splitPanelPosition ? { splitPanelPosition } : {}),
    }).toString();
    await browser.url(`#/light/app-layout/with-drawers?${params}`);
    await page.waitForVisible(wrapper.findContentRegion().toSelector());
    await testFn(page);
  });

const wrapper = createWrapper().findAppLayout();
export class AppLayoutSplitViewPage extends BasePageObject {
  async openPanel() {
    await this.click(wrapper.findSplitPanel().findOpenButton().toSelector());
  }

  // the argument here is the position value
  async switchPosition(position: 'bottom' | 'side') {
    await this.click(wrapper.findSplitPanel().findPreferencesButton().toSelector());
    const tile = createWrapper().findModal().findContent().findTiles().findItemByValue(position);
    await this.click(tile.toSelector());
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

  getSplitPanelSize() {
    return this.getBoundingBox(wrapper.findSplitPanel().toSelector());
  }

  async getSplitPanelSliderValue() {
    const attrValue = await this.getElementAttribute(
      wrapper.findSplitPanel().findSlider().toSelector(),
      'aria-valuenow'
    );
    return parseFloat(attrValue);
  }

  getContentOffsetBottom(theme: string) {
    const contentSelector = wrapper.findContentRegion().toSelector();
    switch (theme) {
      case 'classic':
        return this.browser.execute(contentSelector => {
          return getComputedStyle(document.querySelector(contentSelector)!.parentElement!.parentElement!).marginBottom;
        }, contentSelector);
      case 'refresh':
        return this.browser.execute(contentSelector => {
          return getComputedStyle(document.querySelector(contentSelector)!).paddingBottom;
        }, contentSelector);
      case 'refresh-toolbar':
        return this.browser.execute(contentSelector => {
          return getComputedStyle(document.querySelector(contentSelector)!.parentElement!).paddingBottom;
        }, contentSelector);
    }
  }

  hasPageScrollbar() {
    return this.browser.execute(
      () => window.document.documentElement.scrollHeight > window.document.documentElement.clientHeight
    );
  }

  verifySplitPanelPosition(targetPosition: 'side' | 'bottom') {
    return targetPosition === 'side'
      ? this.isExisting(wrapper.findSplitPanel().findOpenPanelSide().toSelector())
      : this.isExisting(wrapper.findSplitPanel().findOpenPanelBottom().toSelector());
  }
}
