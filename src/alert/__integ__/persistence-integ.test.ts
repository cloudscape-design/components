// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();

class AlertPersistencePage extends BasePageObject {
  countAlerts() {
    return this.getElementsCount(wrapper.findAlert().toSelector());
  }

  async dismissAlert(index: number) {
    await this.click(wrapper.findAlert(`[data-testid="alert-${index}"]`).findDismissButton().toSelector());
  }
}

const setupTest = (
  params: { mockRetrieveDelay?: number; dismissedKeys?: string } = {},
  testFn: (page: AlertPersistencePage) => Promise<void>
) => {
  return useBrowser(async browser => {
    const page = new AlertPersistencePage(browser);
    const urlParams = new URLSearchParams();
    if (params.mockRetrieveDelay !== undefined) {
      urlParams.set('mockRetrieveDelay', params.mockRetrieveDelay.toString());
    }
    if (params.dismissedKeys !== undefined) {
      urlParams.set('dismissedKeys', params.dismissedKeys);
    }
    const url = `#/light/alert/persistence${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    await browser.url(url);
    await page.waitForVisible(wrapper.findAlert().toSelector());
    await testFn(page);
  });
};

describe('Alert Persistence Integration', () => {
  test(
    'showing 2 non-persisted items initially, then all 4 items after persistence delay',
    setupTest({ mockRetrieveDelay: 150 }, async page => {
      await expect(page.countAlerts()).resolves.toBeGreaterThanOrEqual(2);
      await new Promise(resolve => setTimeout(resolve, 150));
      await expect(page.countAlerts()).resolves.toBe(4);
    })
  );

  test(
    'adding new persistent item and showing 5 total items',
    setupTest({ mockRetrieveDelay: 150 }, async page => {
      await expect(page.countAlerts()).resolves.toBeGreaterThanOrEqual(2);
      await page.click('[data-id="add-persistence-item"]');
      await new Promise(resolve => setTimeout(resolve, 150));
      await expect(page.countAlerts()).resolves.toBe(5);
    })
  );

  test(
    'dismissing persistent alert and reducing count from 4 to 3',
    setupTest({ mockRetrieveDelay: 150 }, async page => {
      await new Promise(resolve => setTimeout(resolve, 150));
      await expect(page.countAlerts()).resolves.toBe(4);
      await page.dismissAlert(3);
      await expect(page.countAlerts()).resolves.toBe(3);
    })
  );

  describe('dismissed items', () => {
    test(
      'showing 3 items when persistence_1 is dismissed',
      setupTest({ mockRetrieveDelay: 150, dismissedKeys: 'persistence_1' }, async page => {
        await expect(page.countAlerts()).resolves.toBeGreaterThanOrEqual(2);
        await new Promise(resolve => setTimeout(resolve, 150));
        await expect(page.countAlerts()).resolves.toBe(3);
      })
    );
  });
});
