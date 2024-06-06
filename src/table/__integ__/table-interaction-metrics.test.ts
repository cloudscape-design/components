// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper, { TableWrapper } from '../../../lib/components/test-utils/selectors/index.js';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import { TableInteractionProps } from '../../../lib/components/internal/analytics/interfaces.js';

const setupTest = (
  testFn: (parameters: {
    page: BasePageObject;
    wrapper: TableWrapper;
    getInteractionMetrics: () => Promise<TableInteractionProps[]>;
    waitForLoadingFinished: () => Promise<void>;
  }) => Promise<void>
) => {
  return useBrowser(async browser => {
    const wrapper = createWrapper().findTable();
    await browser.url('#/light/table/simulated-server-actions');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.toSelector());

    const getInteractionMetrics = () =>
      browser.execute(() => ((window as any).tableInteractionMetrics ?? []) as TableInteractionProps[]);

    const waitForLoadingFinished = () =>
      page.waitForAssertion(async () =>
        expect(await page.isExisting(wrapper.findLoadingText().toSelector())).toBeFalsy()
      );

    await testFn({ page, wrapper, getInteractionMetrics, waitForLoadingFinished });
  });
};
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test(
  'has no metrics when the table does not load anything',
  setupTest(async ({ getInteractionMetrics }) => {
    expect(await getInteractionMetrics()).toHaveLength(0);
  })
);

test(
  'emits a metric when the user filters',
  setupTest(async ({ page, wrapper, getInteractionMetrics, waitForLoadingFinished }) => {
    await page.click(wrapper.findFilterSlot().findTextFilter().toSelector());
    await page.keys('238-1');
    await waitForLoadingFinished();

    const metrics = await getInteractionMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toEqual(
      expect.objectContaining({
        userAction: 'filter',
        componentIdentifier: 'Instances',
        instanceIdentifier: 'the-instances-table',
        noOfResourcesInTable: 19,
      })
    );
    expect(metrics[0].interactionTime).toBeGreaterThanOrEqual(500);
    expect(metrics[0].interactionTime).toBeLessThanOrEqual(2000);
  })
);

test(
  'emits a metric when the user paginates',
  setupTest(async ({ page, wrapper, getInteractionMetrics, waitForLoadingFinished }) => {
    await page.click(wrapper.findPagination().findPageNumberByIndex(2).toSelector());
    await waitForLoadingFinished();

    const metrics = await getInteractionMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toEqual(
      expect.objectContaining({
        userAction: 'pagination',
        componentIdentifier: 'Instances',
        instanceIdentifier: 'the-instances-table',
        noOfResourcesInTable: 20,
      })
    );
    expect(metrics[0].interactionTime).toBeGreaterThanOrEqual(500);
    expect(metrics[0].interactionTime).toBeLessThanOrEqual(2000);
  })
);

test(
  'emits a metric when the user sorts',
  setupTest(async ({ page, wrapper, getInteractionMetrics, waitForLoadingFinished }) => {
    await page.click(wrapper.findColumnSortingArea(2).toSelector());
    await waitForLoadingFinished();

    const metrics = await getInteractionMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toEqual(
      expect.objectContaining({
        userAction: 'sorting',
        componentIdentifier: 'Instances',
        instanceIdentifier: 'the-instances-table',
        noOfResourcesInTable: 20,
      })
    );
    expect(metrics[0].interactionTime).toBeGreaterThanOrEqual(500);
    expect(metrics[0].interactionTime).toBeLessThanOrEqual(2000);
  })
);

test(
  'emits a metric when the user changes preferences',
  setupTest(async ({ page, wrapper, getInteractionMetrics, waitForLoadingFinished }) => {
    await page.click(wrapper.findCollectionPreferences().findTriggerButton().toSelector());
    await delay(4000);
    await page.click(wrapper.findCollectionPreferences().findModal().findConfirmButton().toSelector());
    await waitForLoadingFinished();

    const metrics = await getInteractionMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toEqual(
      expect.objectContaining({
        userAction: 'preferences',
        componentIdentifier: 'Instances',
        instanceIdentifier: 'the-instances-table',
        noOfResourcesInTable: 20,
      })
    );
    expect(metrics[0].interactionTime).toBeGreaterThanOrEqual(500);
    expect(metrics[0].interactionTime).toBeLessThanOrEqual(2000);
  })
);

test(
  'emits a metric when the table refreshes for other reasons',
  setupTest(async ({ page, getInteractionMetrics, waitForLoadingFinished }) => {
    await page.click('[data-testid=refresh-table]');
    await waitForLoadingFinished();

    const metrics = await getInteractionMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toEqual(
      expect.objectContaining({
        userAction: '',
        componentIdentifier: 'Instances',
        instanceIdentifier: 'the-instances-table',
        noOfResourcesInTable: 20,
      })
    );
    expect(metrics[0].interactionTime).toBeGreaterThanOrEqual(500);
    expect(metrics[0].interactionTime).toBeLessThanOrEqual(2000);
  })
);
