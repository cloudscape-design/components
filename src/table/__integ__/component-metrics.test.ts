// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { TestAPI } from '../../../lib/components/internal/analytics/helpers/test-api';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/selectors/index.js';

interface ExtendedWindow extends Window {
  __analytics?: {
    __tableInteractionAPI?: TestAPI;
  };
}

declare const window: ExtendedWindow;

const baseComponentConfiguration = {
  filtered: false,
  filteredBy: [],
  flowType: null,
  instanceIdentifier: null,
  pagination: {
    currentPageIndex: 1,
    totalNumberOfPages: 200,
    openEnd: false,
  },
  patternIdentifier: '',
  resourcesSelected: false,
  sortedBy: { columnId: null, sortingOrder: null },
  tablePreferences: {
    visibleColumns: ['id', 'type', 'dnsName', 'state'],
    resourcesPerPage: 20,
  },
  taskName: 'Instances',
  taskNameUx: 'Instances',
  totalNumberOfResources: 4000,
  totalNumberOfResourcesText: '4000 matches',
  variant: 'container',
};

class TableWithAnalyticsPageObject extends BasePageObject {
  async clearEvents() {
    await this.browser.execute(() => {
      window.__analytics?.__tableInteractionAPI?.clear();
    });
  }

  async getEvents() {
    const interactionEvents = await this.browser.execute(
      () => window.__analytics?.__tableInteractionAPI?.getEvents() || []
    );
    return interactionEvents;
  }

  async getLastInteractionEvent() {
    const lastinteractionEvent = await this.browser.execute(() =>
      window.__analytics?.__tableInteractionAPI?.getLastEvent()
    );
    return lastinteractionEvent;
  }

  async getEventsByName(name: string) {
    const interactionEventsByName = await this.browser.execute(
      nameArg => window.__analytics?.__tableInteractionAPI?.getEventsByName(nameArg),
      name
    );
    return interactionEventsByName || [];
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

const setupTest = (
  testFn: (testFnProps: { page: TableWithAnalyticsPageObject; wrapper: TableWrapper }) => Promise<void>,
  url?: string
) => {
  return useBrowser(async browser => {
    await browser.url(url || '#/light/analytics/with-table');
    const page = new TableWithAnalyticsPageObject(browser);
    const wrapper = createWrapper().findTable();
    await page.waitForVisible(wrapper.toSelector());

    await testFn({ page, wrapper });
  });
};

test(
  'emits componentMounted and extracts taskName from header component',
  setupTest(async ({ page }) => {
    const componentsLog = await page.getEvents();
    expect(componentsLog.length).toBe(1);
    expect(componentsLog[0].name).toBe('componentMounted');
    expect(componentsLog[0].detail).toMatchObject({
      componentConfiguration: {
        ...baseComponentConfiguration,
      },
      componentName: 'table',
      taskInteractionId: expect.any(String),
    });
  })
);

test(
  'debounces componentUpdated events',
  setupTest(async ({ wrapper, page }) => {
    const columnSortSelector = wrapper.findColumnSortingArea(2).toSelector();
    await page.click(columnSortSelector);
    await page.click(columnSortSelector);
    await page.click(columnSortSelector);
    await page.click(columnSortSelector);

    await page.waitForInteractionEvent('componentUpdated');
    const componentsLog = await page.getEvents();
    expect(componentsLog.length).toBe(2);
    expect(componentsLog[1].name).toBe('componentUpdated');
  })
);

test(
  'sequential events are not debounced when separated by debounce timeout',
  setupTest(async ({ wrapper, page }) => {
    const debounceTimeoutInMs = 300;
    const columnSortSelector = wrapper.findColumnSortingArea(2).toSelector();
    await page.click(columnSortSelector);
    await page.pause(debounceTimeoutInMs);
    await page.click(columnSortSelector);
    await page.pause(debounceTimeoutInMs);

    const componentsLog = await page.getEvents();
    expect(componentsLog.length).toBe(3);
  })
);

describe('filtering', () => {
  test(
    'tracks component updates caused by text filtering',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findTextFilter().toSelector());
      await page.keys('m3.2xlarge');
      await page.waitForInteractionEvent('componentUpdated');

      const componentsLog = await page.getEvents();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'filter',
        componentConfiguration: {
          ...baseComponentConfiguration,
          filtered: true,
          totalNumberOfResourcesText: '92 matches',
          totalNumberOfResources: 100,
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
      const componentsLog = await page.getEvents();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'filter',
        componentConfiguration: {
          ...baseComponentConfiguration,
          pagination: {
            currentPageIndex: 1,
            totalNumberOfPages: 43,
            openEnd: false,
          },
          filtered: true,
          filteredBy: ['state'],
          totalNumberOfResourcesText: '852 matches',
          totalNumberOfResources: 860,
        },
      });
    }, '#/light/analytics/with-property-filter-table')
  );
});

describe('sorting', () => {
  test(
    'tracks component updates caused by sorting',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findColumnSortingArea(2).toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getEvents();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
      expect(componentsLog[1].detail).toEqual({
        taskInteractionId: expect.any(String),
        componentName: 'table',
        actionType: 'sorting',
        componentConfiguration: {
          ...baseComponentConfiguration,
          sortedBy: { columnId: 'id', sortingOrder: 'asc' },
        },
      });
    })
  );
});

describe('pagination', () => {
  test(
    'tracks component updates caused by pagination',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findPagination().findPageNumberByIndex(3).toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getEvents();
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
    'track components updates caued by single selection',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findRowSelectionArea(1).toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getEvents();
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
    }, '#/light/analytics/with-property-filter-table')
  );

  test(
    'tracks component updates caused by multi selection',
    setupTest(async ({ page, wrapper }) => {
      await page.click(wrapper.findRowSelectionArea(1).toSelector());
      await page.click(wrapper.findRowSelectionArea(2).toSelector());
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getEvents();
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
      const componentsLog = await page.getEvents();
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
      const componentsLog = await page.getEvents();
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
      const componentsLog = await page.getEvents();
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
          variant: 'full-page',
          pagination: {
            currentPageIndex: 3,
            totalNumberOfPages: 200,
            openEnd: false,
          },
        },
      });
    }, '#/light/analytics/with-async-table')
  );

  test(
    'tracks component updates when the table refreshes for other reasons',
    setupTest(async ({ page }) => {
      await page.click('[data-testid=refresh-table]');
      await page.waitForInteractionEvent('componentUpdated');
      const componentsLog = await page.getEvents();
      expect(componentsLog.length).toBe(2);
      expect(componentsLog[1].name).toBe('componentUpdated');
    }, '#/light/analytics/with-async-table')
  );
});
