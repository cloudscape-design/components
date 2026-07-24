// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { Browser } from 'webdriverio';

import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

const scrollContainerSelector = '#auto-skeleton-scroll-container';
const innerScrollContainerSelector = '#auto-skeleton-inner-scroll-container';
const skeletonRowSelector = `${innerScrollContainerSelector} tr[aria-hidden="true"]`;
const featureScenarioSelectors = [
  '#auto-skeleton-sticky-header',
  '#auto-skeleton-footer',
  '#auto-skeleton-long-headers-nowrap',
  '#auto-skeleton-long-headers-wrap',
  '#auto-skeleton-all-features',
  '#auto-skeleton-mixed-rows',
];

async function expectNoVerticalOverflow(browser: Browser, selector: string) {
  await expect(
    browser.execute(scrollContainerSelector => {
      const scrollContainer = document.querySelector<HTMLElement>(scrollContainerSelector)!;
      return scrollContainer.scrollHeight - scrollContainer.clientHeight;
    }, selector)
  ).resolves.toBeLessThanOrEqual(0);
}

function getScenarioLayout(browser: Browser, selector: string) {
  return browser.execute(selector => {
    const scenario = document.querySelector<HTMLElement>(selector)!;
    const skeletonRows = scenario.querySelectorAll<HTMLTableRowElement>('tr[aria-hidden="true"]');
    const footer = scenario.querySelector<HTMLElement>(`[id="${scenario.id}-footer"]`);
    const lastSkeletonRow = skeletonRows[skeletonRows.length - 1];
    const scenarioRect = scenario.getBoundingClientRect();
    const footerRect = footer?.getBoundingClientRect();
    const table = scenario.querySelector<HTMLTableElement>('table');

    return {
      footerIsVisible:
        !footerRect || !lastSkeletonRow
          ? true
          : footerRect.top >= lastSkeletonRow.getBoundingClientRect().bottom &&
            footerRect.bottom <= scenarioRect.bottom,
      headerTableWidth: table?.getBoundingClientRect().width,
      headerText: Array.from(scenario.querySelectorAll('th')).map(header => header.textContent),
      horizontalOverflow: scenario.scrollWidth - scenario.clientWidth,
      skeletonRowCount: skeletonRows.length,
      stickyHeaderTableCount: scenario.querySelectorAll('table').length,
    };
  }, selector);
}

test(
  'fits automatic skeleton rows inside nested scroll viewports',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/table/auto-skeleton-rows');
    await page.waitForVisible(skeletonRowSelector);

    await expectNoVerticalOverflow(browser, scrollContainerSelector);
    await expectNoVerticalOverflow(browser, innerScrollContainerSelector);
  })
);

test(
  'fits automatic skeleton rows with table layout features',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1024, height: 800 });
    await browser.url('#/light/table/auto-skeleton-rows');

    for (const selector of featureScenarioSelectors) {
      await page.waitForVisible(`${selector} tr[aria-hidden="true"]`);
      await expectNoVerticalOverflow(browser, selector);
    }

    const stickyHeader = await getScenarioLayout(browser, '#auto-skeleton-sticky-header');
    const footer = await getScenarioLayout(browser, '#auto-skeleton-footer');
    const longHeadersWithoutWrapping = await getScenarioLayout(browser, '#auto-skeleton-long-headers-nowrap');
    const longHeadersWithWrapping = await getScenarioLayout(browser, '#auto-skeleton-long-headers-wrap');
    const combined = await getScenarioLayout(browser, '#auto-skeleton-all-features');

    expect(stickyHeader.skeletonRowCount).toBeGreaterThan(0);
    expect(stickyHeader.stickyHeaderTableCount).toBeGreaterThan(1);
    expect(footer.footerIsVisible).toBe(true);
    expect(longHeadersWithoutWrapping.headerText).toContain(
      'Resource identifier used to locate the item in the inventory'
    );
    expect(longHeadersWithWrapping.headerText).toContain(
      'Resource identifier used to locate the item in the inventory'
    );
    expect(longHeadersWithoutWrapping.headerTableWidth).toBeGreaterThan(longHeadersWithWrapping.headerTableWidth!);
    expect(combined.footerIsVisible).toBe(true);
    expect(combined.stickyHeaderTableCount).toBeGreaterThan(1);
  })
);

function getMixedRowsLayout(browser: Browser, selector: string) {
  return browser.execute(selector => {
    const scenario = document.querySelector<HTMLElement>(selector)!;
    const bodyRows = Array.from(scenario.querySelectorAll<HTMLTableRowElement>('tbody > tr'));
    const skeletonFlags = bodyRows.map(row => row.getAttribute('aria-hidden') === 'true');

    return {
      dataRowText: bodyRows
        .filter((_, index) => !skeletonFlags[index])
        .map(row => row.textContent?.trim())
        .filter(Boolean),
      firstSkeletonRowIndex: skeletonFlags.indexOf(true),
      lastDataRowIndex: skeletonFlags.lastIndexOf(false),
      skeletonRowCount: skeletonFlags.filter(Boolean).length,
    };
  }, selector);
}

test(
  'renders data rows alongside automatic skeleton rows',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1024, height: 800 });
    await browser.url('#/light/table/auto-skeleton-rows');

    await page.waitForVisible('#auto-skeleton-mixed-rows tr[aria-hidden="true"]');
    await expectNoVerticalOverflow(browser, '#auto-skeleton-mixed-rows');

    const mixed = await getMixedRowsLayout(browser, '#auto-skeleton-mixed-rows');

    // Real data rows render actual content, and automatic skeleton rows fill the rest.
    expect(mixed.dataRowText).toContain('1First resource');
    expect(mixed.skeletonRowCount).toBeGreaterThan(0);
    // Data rows always precede skeleton rows.
    expect(mixed.firstSkeletonRowIndex).toBeGreaterThan(mixed.lastDataRowIndex);
  })
);

function getAppLayoutScenarioLayout(browser: Browser, selector: string) {
  return browser.execute(selector => {
    const scenario = document.querySelector<HTMLElement>(selector)!;
    const externalHeader = document.querySelector<HTMLElement>('#h')!;
    const externalFooter = scenario.querySelector<HTMLElement>('#f')!;
    const tableFooter = scenario.querySelector<HTMLElement>(`#${scenario.id}-table-footer`)!;
    const skeletonRows = scenario.querySelectorAll<HTMLTableRowElement>('tr[aria-hidden="true"]');
    const externalHeaderRect = externalHeader.getBoundingClientRect();
    const externalFooterRect = externalFooter.getBoundingClientRect();
    const tableFooterRect = tableFooter.getBoundingClientRect();

    return {
      documentOverflow: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      externalFooterIsVisible: externalFooterRect.top >= 0 && externalFooterRect.bottom <= window.innerHeight,
      externalHeaderIsVisible: externalHeaderRect.top >= 0 && externalHeaderRect.bottom <= window.innerHeight,
      skeletonRowCount: skeletonRows.length,
      tableFooterIsVisible: tableFooterRect.top >= 0 && tableFooterRect.bottom <= window.innerHeight,
    };
  }, selector);
}

test(
  'fits automatic skeleton rows inside AppLayout with external page chrome',
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await page.setWindowSize({ width: 1024, height: 800 });
    await browser.url('#/light/app-layout/auto-skeleton-table');
    await page.waitForVisible('#auto-skeleton-app-layout tr[aria-hidden="true"]');

    const layout = await getAppLayoutScenarioLayout(browser, '#auto-skeleton-app-layout');

    expect(layout.documentOverflow).toBeLessThanOrEqual(0);
    expect(layout.externalHeaderIsVisible).toBe(true);
    expect(layout.externalFooterIsVisible).toBe(true);
    expect(layout.skeletonRowCount).toBeGreaterThan(0);
    expect(layout.tableFooterIsVisible).toBe(true);
  })
);
