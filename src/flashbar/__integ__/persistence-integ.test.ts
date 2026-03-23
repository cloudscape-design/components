// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { flashbar, FlashbarBasePage } from './pages/base';

const wrapper = createWrapper();

class FlashbarPersistencePage extends FlashbarBasePage {
  async dismissFlash(index: number) {
    await this.click(wrapper.findFlashbar().findItems().get(index).findDismissButton().toSelector());
  }
}

const setupTest = (
  params: { mockRetrieveDelay?: number; stackItems?: boolean; dismissedKeys?: string } = {},
  testFn: (page: FlashbarPersistencePage) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new FlashbarPersistencePage(browser);
    const urlParams = new URLSearchParams();
    if (params.mockRetrieveDelay !== undefined) {
      urlParams.set('mockRetrieveDelay', params.mockRetrieveDelay.toString());
    }
    if (params.stackItems !== undefined) {
      urlParams.set('stackItems', params.stackItems.toString());
    }
    if (params.dismissedKeys !== undefined) {
      urlParams.set('dismissedKeys', params.dismissedKeys);
    }
    const url = `#/light/flashbar/persistence${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    await browser.url(url);
    await page.waitForVisible(flashbar.toSelector());
    await testFn(page);
  });
};

describe('Flashbar Persistence Integration', () => {
  describe('non-stacked flashbar', () => {
    test(
      'showing 2 non-persisted items initially, then all 4 items after persistence delay',
      setupTest({ mockRetrieveDelay: 150 }, async page => {
        await expect(page.countFlashes()).resolves.toBeGreaterThanOrEqual(2);
        await new Promise(resolve => setTimeout(resolve, 150));
        await expect(page.countFlashes()).resolves.toBe(4);
      })
    );

    test(
      'adding new persistent item and showing 5 total items',
      setupTest({ mockRetrieveDelay: 150, stackItems: false }, async page => {
        await expect(page.countFlashes()).resolves.toBeGreaterThanOrEqual(2);
        await page.click('[data-id="add-persistence-item"]');
        await new Promise(resolve => setTimeout(resolve, 150));
        await expect(page.countFlashes()).resolves.toBe(5);
      })
    );

    test(
      'dismissing non-persistent item and reducing count from 4 to 3',
      setupTest({ mockRetrieveDelay: 150 }, async page => {
        await new Promise(resolve => setTimeout(resolve, 150));
        await expect(page.countFlashes()).resolves.toBe(4);
        await page.dismissFlash(1);
        await expect(page.countFlashes()).resolves.toBe(3);
      })
    );

    test(
      'dismissing persistent item and reducing count from 4 to 3',
      setupTest({ mockRetrieveDelay: 150 }, async page => {
        await new Promise(resolve => setTimeout(resolve, 150));
        await expect(page.countFlashes()).resolves.toBe(4);
        await page.dismissFlash(3);
        await expect(page.countFlashes()).resolves.toBe(3);
      })
    );
  });

  describe('stacked flashbar', () => {
    test(
      'showing collapsed flashbar initially, then expands to show all 4 items',
      setupTest({ mockRetrieveDelay: 150, stackItems: true }, async page => {
        await expect(page.countFlashes()).resolves.toBe(1);
        await new Promise(resolve => setTimeout(resolve, 150));
        await page.toggleCollapsedState();
        await expect(page.countFlashes()).resolves.toBe(4);
      })
    );

    test(
      'adding new persistent item and showing 5 total items when expanded',
      setupTest({ mockRetrieveDelay: 150, stackItems: true }, async page => {
        await expect(page.countFlashes()).resolves.toBe(1);
        await page.click('[data-id="add-persistence-item"]');
        await expect(page.countFlashes()).resolves.toBe(1);
        await new Promise(resolve => setTimeout(resolve, 150));
        await page.toggleCollapsedState();
        await expect(page.countFlashes()).resolves.toBe(5);
      })
    );
  });

  describe('Persisted dismissed items', () => {
    test(
      'showing 3 items when persistence_2 is dismissed',
      setupTest({ mockRetrieveDelay: 150, dismissedKeys: 'persistence_2' }, async page => {
        await expect(page.countFlashes()).resolves.toBeGreaterThanOrEqual(2);
        await new Promise(resolve => setTimeout(resolve, 150));
        await expect(page.countFlashes()).resolves.toBe(3);
      })
    );

    test(
      'showing 3 items when persistence_2 is dismissed in stacked flashbar',
      setupTest({ mockRetrieveDelay: 150, stackItems: true, dismissedKeys: 'persistence_2' }, async page => {
        await expect(page.countFlashes()).resolves.toBe(1);
        await new Promise(resolve => setTimeout(resolve, 150));
        await page.toggleCollapsedState();
        await expect(page.countFlashes()).resolves.toBe(3);
      })
    );
  });
});
