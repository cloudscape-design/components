// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { viewports } from './constants';

export const testIf = (condition: boolean) => (condition ? test : test.skip);

export type Theme = 'classic' | 'refresh' | 'refresh-toolbar';

export interface SetupTestOptions {
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
