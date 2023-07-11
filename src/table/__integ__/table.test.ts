// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import styles from '../../../lib/components/table/styles.selectors.js';

test(
  'displays no match state when filter is applied and allows to reset the filter',
  useBrowser(async browser => {
    const wrapper = createWrapper().findTable();
    const inputSelector = wrapper.findTextFilter().findInput().toSelector();
    await browser.url('#/light/table/hooks');
    const page = new BasePageObject(browser);
    await page.waitForVisible(wrapper.findRows().toSelector());
    await expect(page.getElementsCount(wrapper.findRows().toSelector())).resolves.toEqual(20);
    await expect(page.isExisting(wrapper.findEmptySlot().toSelector())).resolves.toEqual(false);

    await page.click(inputSelector);
    await page.keys('no match');
    await expect(page.getElementsCount(wrapper.findRows().toSelector())).resolves.toEqual(0);
    await expect(page.isExisting(wrapper.findEmptySlot().toSelector())).resolves.toEqual(true);

    await page.click('button=Clear filter');
    await expect(page.getElementsCount(wrapper.findRows().toSelector())).resolves.toEqual(20);
    await expect(page.isExisting(wrapper.findEmptySlot().toSelector())).resolves.toEqual(false);
  })
);

test(
  'sticky header does not change height when scrolling in full-page variant',
  useBrowser(async browser => {
    const extractHeight = (selector: string) => {
      const el = document.querySelector<HTMLElement>(selector)!;
      const { marginBottom, height } = getComputedStyle(el);
      return { height, marginBottom };
    };
    const header = createWrapper().findContainer().findHeader().toSelector();
    await browser.url('#/light/table/full-page-variant?visualRefresh=true');
    const page = new BasePageObject(browser);
    await expect(browser.execute(extractHeight, header)).resolves.toEqual({ height: '91px', marginBottom: '0px' });
    await page.windowScrollTo({ top: 100 });
    await page.waitForJsTimers();
    await expect(browser.execute(extractHeight, header)).resolves.toEqual({ height: '82px', marginBottom: '10px' });
  })
);

test(
  'body scrolls synchronously with header in visual refresh',
  useBrowser({ width: 400, height: 800 }, async browser => {
    const tableWrapper = createWrapper().findTable();
    await browser.url('#/light/table/full-page-variant?visualRefresh=true');
    const page = new BasePageObject(browser);
    await page.elementScrollTo(tableWrapper.findByClassName(styles['header-secondary']).toSelector(), { left: 50 });
    await page.waitForJsTimers();
    const { left: scrollLeft } = await page.getElementScroll(tableWrapper.findByClassName(styles.wrapper).toSelector());
    expect(scrollLeft).toEqual(50);
  })
);

test(
  'sets role=region and aria-label on scrollable wrapper when overflowing',
  useBrowser(async browser => {
    const tableWrapper = createWrapper().findTable();
    const tableLabel = 'Full-page table';
    await browser.url('#/light/table/full-page-variant?visualRefresh=true');
    const page = new BasePageObject(browser);

    // Find the scrollable wrapper element
    const scrollableWrapperSelector = tableWrapper.findByClassName(styles.wrapper).toSelector();

    let role, ariaLabel;
    // Get the 'role' and 'aria-label' attributes of the scrollable wrapper
    role = await page.getElementAttribute(scrollableWrapperSelector, 'role');
    ariaLabel = await page.getElementAttribute(scrollableWrapperSelector, 'aria-label');

    // Verify that the 'role' and 'aria-label' attributes are set correctly
    await expect(role).toBeNull();
    await expect(ariaLabel).toBeNull();
    await page.setWindowSize({ width: 400, height: 800 });
    role = await page.getElementAttribute(scrollableWrapperSelector, 'role');
    ariaLabel = await page.getElementAttribute(scrollableWrapperSelector, 'aria-label');
    await expect(role).toEqual('region');
    await expect(ariaLabel).toEqual(tableLabel);
  })
);
