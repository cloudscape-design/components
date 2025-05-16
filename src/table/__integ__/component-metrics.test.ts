// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/selectors/index.js';

interface ExtendedWindow extends Window {
  __awsuiComponentlMetrics__: Array<any>;
}
declare const window: ExtendedWindow;

class TableWithAnalyticsPageObject extends BasePageObject {
  async getComponentMetricsLog() {
    const componentsLog = await this.browser.execute(() => window.__awsuiComponentlMetrics__);
    return componentsLog;
  }

  async getEventsByName(name: string) {
    const events = await this.getComponentMetricsLog();
    return events.filter(event => event.name === name).map(({ detail }) => detail);
  }

  async waitForInteractionEvent(name: string, timeout = 5000) {
    await this.browser.waitUntil(
      async () => {
        const events = await this.getEventsByName(name);
        return events.length > 0;
      },
      {
        timeout,
        timeoutMsg: `Expected interaction event ${name} was not emitted within ${timeout}ms`,
      }
    );
  }
}

const baseComponentConfiguration = {
  instanceIdentifier: null,
  variant: 'container',
  flowType: 'view-resource',
  resourceType: 'table-resource-type',
  taskName: 'Table title',
  patternIdentifier: '',
  sortedBy: {
    columnId: null,
    sortingOrder: null,
  },
  filtered: false,
  totalNumberOfResources: 200,
  resourcesPerPage: 20,
  pagination: {
    currentPageIndex: 1,
    totalNumberOfPages: 200,
    openEnd: false,
  },
  resourcesSelected: false,
};

const setupTest = (
  testFn: (testFnProps: { page: TableWithAnalyticsPageObject; wrapper: TableWrapper }) => Promise<void>,
  url?: string
) => {
  return useBrowser(async browser => {
    await browser.url(url || '#/light/funnel-analytics/with-table');
    const page = new TableWithAnalyticsPageObject(browser);
    const wrapper = createWrapper().findTable();
    await page.waitForVisible(wrapper.toSelector());

    await testFn({ page, wrapper });
  });
};
test(
  'component mount event includes table title without additional header slot information',
  setupTest(async ({ page }) => {
    const componentsLog = await page.getComponentMetricsLog();
    expect(componentsLog.length).toBe(1);
    expect(componentsLog[0].detail).toMatchObject({
      componentConfiguration: {
        ...baseComponentConfiguration,
        taskName: 'Table title',
        resourceType: 'table-resource-type',
      },
      componentName: 'table',
      taskInteractionId: expect.any(String),
    });
  })
);

describe('pagination', () => {
  test(
    'tracks component updates caused by pagination',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findPagination().findPageNumberByIndex(3).toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'pagination',
        componentConfiguration: {
          ...baseComponentConfiguration,
          pagination: {
            currentPageIndex: 3,
            totalNumberOfPages: 200,
            openEnd: false,
          },
        },
      });
    })
  );
});
