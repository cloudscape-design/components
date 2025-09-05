// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isEqual } from 'lodash';

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/selectors/index.js';

interface ExtendedWindow extends Window {
  __awsuiComponentlMetrics__: Array<any>;
}
declare const window: ExtendedWindow;

// Duplicate mount entries are added when testing with React 18 (in strict-mode).
function removeDuplicateMountEntries<M = any>(metrics: M[]): M[] {
  const prev: M[] = [];
  return metrics.filter((m: any) => {
    const isDuplicate = m.name === 'componentMounted' && prev.some(p => isEqual(m, p));
    if (isDuplicate) {
      return false;
    }
    prev.push(m);
    return true;
  });
}

class TableWithAnalyticsPageObject extends BasePageObject {
  async getComponentMetricsLog() {
    const componentsLog: ExtendedWindow['__awsuiComponentlMetrics__'] = await this.browser.execute(
      () => window.__awsuiComponentlMetrics__
    );
    return removeDuplicateMountEntries(componentsLog);
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
  uxTaskName: 'Table title',
  patternIdentifier: '',
  sortedBy: {
    columnId: null,
    sortingOrder: null,
  },
  tablePreferences: {
    visibleColumns: ['id', 'type', 'dnsName', 'state'],
    resourcesPerPage: 20,
  },
  filtered: false,
  filteredBy: [],
  filteredCount: 4000,
  totalNumberOfResources: 4000,
  pagination: {
    currentPageIndex: 1,
    totalNumberOfPages: 200,
    openEnd: false,
  },
  resourcesSelected: false,
};

const basePropertyFilterConfiguration = {
  variant: 'container',
  taskName: 'Table title',
  uxTaskName: 'Table title',
  resourceType: null,
  instanceIdentifier: null,
  flowType: null,
  patternIdentifier: '',
  sortedBy: {
    columnId: null,
    sortingOrder: null,
  },
  tablePreferences: {
    visibleColumns: ['id', 'type', 'dnsName', 'state'],
    resourcesPerPage: 20,
  },
  filtered: false,
  filteredBy: [],
  filteredCount: 4000,
  totalNumberOfResources: 4000,
  pagination: {
    currentPageIndex: 1,
    totalNumberOfPages: 200,
    openEnd: false,
  },
  resourcesSelected: false,
};

const setupTest = (
  testFn: (testFnProps: { page: TableWithAnalyticsPageObject; wrapper: TableWrapper }) => Promise<void>,
  url = '#/light/funnel-analytics/with-table'
) => {
  return useBrowser(async browser => {
    await browser.url(url);
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

describe('selection', () => {
  test(
    'tracks component updates caused by multi selection',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findRowSelectionArea(1).toSelector());
      await page.click(wrapper.findRowSelectionArea(2).toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'selection',
        componentConfiguration: {
          ...baseComponentConfiguration,
          resourcesSelected: true,
        },
      });
    })
  );
});

describe('preferences', () => {
  test(
    'tracks component changes when visible content preference is changed',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findCollectionPreferences().findTriggerButton().toSelector());
      await page.waitForVisible(wrapper.findCollectionPreferences().findModal().toSelector());
      await page.click(
        wrapper.findCollectionPreferences().findModal().findContentDisplayPreference().findOptionByIndex(2).toSelector()
      );
      await page.click(wrapper.findCollectionPreferences().findModal().findConfirmButton().toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'preferences',
        componentConfiguration: {
          ...baseComponentConfiguration,
          tablePreferences: {
            visibleColumns: ['id', 'dnsName', 'state'],
            resourcesPerPage: 20,
          },
        },
      });
    })
  );

  test(
    'tracks component changes when page size is changed',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findCollectionPreferences().findTriggerButton().toSelector());
      await page.waitForVisible(wrapper.findCollectionPreferences().findModal().toSelector());
      await page.click(
        wrapper
          .findCollectionPreferences()
          .findModal()
          .findPageSizePreference()
          .findOptions()
          .get(2)
          .findNativeInput()
          .toSelector()
      );

      await page.click(wrapper.findCollectionPreferences().findModal().findConfirmButton().toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'preferences',
        componentConfiguration: {
          ...baseComponentConfiguration,
          pagination: {
            currentPageIndex: 1,
            totalNumberOfPages: 80,
            openEnd: false,
          },
          tablePreferences: {
            visibleColumns: ['id', 'type', 'dnsName', 'state'],
            resourcesPerPage: 50,
          },
        },
      });
    })
  );
});

describe('async loading', () => {
  test(
    'tracks component updates once table completes loading',
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
          instanceIdentifier: 'the-instances-table',
          taskName: 'the-instances-table',
          uxTaskName: 'Instances',
          variant: 'full-page',
          pagination: {
            currentPageIndex: 3,
            totalNumberOfPages: 200,
            openEnd: false,
          },
        },
      });
    }, '#/light/funnel-analytics/with-async-table')
  );

  test(
    'tracks component updates when the table refreshes for other reasons',
    setupTest(async ({ page }) => {
      await page.click('[data-testid=refresh-table]');
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
    }, '#/light/funnel-analytics/with-async-table')
  );
});

describe('filtering', () => {
  test(
    'tracks component updates caused by text filtering',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findTextFilter().toSelector());
      await page.keys('m3.2xlarge');
      await page.waitForInteractionEvent('componentUpdated');

      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'filter',
        componentConfiguration: {
          ...baseComponentConfiguration,
          filtered: true,
          filteredCount: 92,
          pagination: {
            currentPageIndex: 1,
            openEnd: false,
            totalNumberOfPages: 5,
          },
        },
      });
    })
  );

  test(
    'tracks component updates caused by property filtering',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findPropertyFilter().findNativeInput().toSelector());
      await page.keys('State=Stopped');
      await page.keys(['Enter']);
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'filter',
        componentConfiguration: {
          ...basePropertyFilterConfiguration,
          filtered: true,
          filteredBy: ['state'],
          filteredCount: 852,
          pagination: {
            currentPageIndex: 1,
            openEnd: false,
            totalNumberOfPages: 43,
          },
        },
      });
    }, '#/light/funnel-analytics/with-table-property-filter')
  );

  test(
    'tracks component updates caused by property filtering with free text',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findPropertyFilter().findNativeInput().toSelector());
      await page.keys('Stopped');
      await page.keys(['Enter']);
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getComponentMetricsLog();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'filter',
        componentConfiguration: {
          ...basePropertyFilterConfiguration,
          filtered: true,
          filteredBy: [],
          filteredCount: 852,
          pagination: {
            currentPageIndex: 1,
            openEnd: false,
            totalNumberOfPages: 43,
          },
        },
      });
    }, '#/light/funnel-analytics/with-table-property-filter')
  );
});
