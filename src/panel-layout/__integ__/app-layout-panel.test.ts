// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const appLayoutWrapper = wrapper.findAppLayout();

class PanelLayoutAppLayoutPage extends BasePageObject {
  async visit(params: Record<string, string | boolean | number> = {}) {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      urlParams.set(key, value.toString());
    });

    const url = `#/light/panel-layout/app-layout-panel?${urlParams.toString()}`;
    await this.browser.url(url);
    await this.waitForVisible(appLayoutWrapper.toSelector());
  }

  async openDrawer() {
    if (!(await this.isDisplayed(appLayoutWrapper.findActiveDrawer()!.toSelector()))) {
      await this.click(appLayoutWrapper.findDrawerTriggerById('panel').toSelector());
      await this.waitForVisible(appLayoutWrapper.findActiveDrawer()!.toSelector());
    }
  }

  getPanelLayoutWrapper() {
    return appLayoutWrapper.findActiveDrawer()!.findPanelLayout();
  }

  async getPanelLayoutPanelSize() {
    const panelLayout = this.getPanelLayoutWrapper();
    const panel = panelLayout.findPanelContent();
    if (!panel) {
      return null;
    }

    const element = await this.browser.$(panel.toSelector());
    const size = await element.getCSSProperty('inline-size');
    return size.value;
  }

  async resizePanelLayout(deltaX: number) {
    const panelLayout = this.getPanelLayoutWrapper();
    const handle = panelLayout.findResizeHandle();
    if (!handle) {
      throw new Error('Resize handle not found');
    }

    const handleElement = await this.browser.$(handle.toSelector());
    await handleElement.dragAndDrop({ x: deltaX, y: 0 });
  }

  async focusPanelButton() {
    const panelLayout = this.getPanelLayoutWrapper();
    const panelButton = panelLayout.findPanelContent().findButton();
    await this.click(panelButton.toSelector());
  }

  async focusMainContentButton() {
    const panelLayout = this.getPanelLayoutWrapper();
    const contentButton = panelLayout.findMainContent().findButton();
    await this.click(contentButton.toSelector());
  }

  isPanelButtonFocused() {
    const panelLayout = this.getPanelLayoutWrapper();
    const panelButton = panelLayout.findPanelContent().findButton();
    return this.isFocused(panelButton.toSelector());
  }

  isMainContentButtonFocused() {
    const panelLayout = this.getPanelLayoutWrapper();
    const contentButton = panelLayout.findMainContent().findButton();
    return this.isFocused(contentButton.toSelector());
  }

  isResizeHandleFocused() {
    const panelLayout = this.getPanelLayoutWrapper();
    const handle = panelLayout.findResizeHandle();
    if (!handle) {
      return false;
    }
    return this.isFocused(handle.toSelector());
  }
}

describe('PanelLayout in App Layout Panel', () => {
  const setupTest = (
    params: Record<string, string | boolean | number> = {},
    testFn: (page: PanelLayoutAppLayoutPage) => Promise<void>
  ) => {
    return useBrowser(async browser => {
      const page = new PanelLayoutAppLayoutPage(browser);
      await page.setWindowSize({ width: 1800, height: 800 });
      await page.visit(params);
      await page.openDrawer();
      await testFn(page);
    });
  };

  test(
    'displays panel and main content with proper headers',
    setupTest({}, async page => {
      const panelLayout = page.getPanelLayoutWrapper();
      const panel = panelLayout.findPanelContent();
      const content = panelLayout.findMainContent();

      await expect(page.getText(panel.findHeader().toSelector())).resolves.toContain('Panel content');
      await expect(page.getText(content.findHeader().toSelector())).resolves.toContain('Main content');
    })
  );

  test(
    'applies default panel size correctly',
    setupTest({ minPanelSize: 250 }, async page => {
      const panelSize = await page.getPanelLayoutPanelSize();
      expect(panelSize).toBe('250px');
    })
  );

  test(
    'respects maximum panel size constraint',
    setupTest({ minPanelSize: 200, maxPanelSize: 300 }, async page => {
      await page.resizePanelLayout(200);
      const panelSize = await page.getPanelLayoutPanelSize();
      expect(parseInt(panelSize!)).toBe(300);
    })
  );

  test(
    'respects minimum panel size constraint',
    setupTest({ minPanelSize: 100 }, async page => {
      await page.resizePanelLayout(-100);
      const panelSize = await page.getPanelLayoutPanelSize();
      expect(parseInt(panelSize!)).toBe(100);
    })
  );

  describe('panelPosition: side-start (default)', () => {
    test(
      'focuses elements in order: panel content -> resize handle -> main content when tabbing forward',
      setupTest({ panelPosition: 'side-start' }, async page => {
        await page.focusPanelButton();

        await page.keys(['Tab']);
        await expect(page.isResizeHandleFocused()).resolves.toBe(true);

        await page.keys(['Tab']);
        await expect(page.isMainContentButtonFocused()).resolves.toBe(true);
      })
    );
  });

  describe('panelPosition: side-end', () => {
    test(
      'focuses elements in order: main content -> resize handle -> panel content when tabbing forward',
      setupTest({ panelPosition: 'side-end' }, async page => {
        await page.focusMainContentButton();

        await page.keys(['Tab']);
        await expect(page.isResizeHandleFocused()).resolves.toBe(true);

        await page.keys(['Tab']);
        await expect(page.isPanelButtonFocused()).resolves.toBe(true);
      })
    );
  });
});
