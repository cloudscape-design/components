// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { createWrapper } from '@cloudscape-design/test-utils-core/selectors';

import '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findTreeView();

test(
  'Expands and collapses item',
  useBrowser(async browser => {
    await browser.url('#/light/tree-view/basic');
    const page = new BasePageObject(browser);

    const itemsSelector = wrapper.findItems().toSelector();
    await expect(await browser.$$(itemsSelector)).toHaveLength(10);

    const expandedItemsSelector = wrapper.findItems({ expanded: true }).toSelector();
    await expect(await browser.$$(expandedItemsSelector)).toHaveLength(1); // The test page expands "Item 1" by default

    const collapsedItemsSelector = wrapper.findItems({ expanded: false }).toSelector();
    await expect(await browser.$$(collapsedItemsSelector)).toHaveLength(5); // non-expandable items are not included

    // expand
    const expandableItem = wrapper.findItemById('4')!;

    await page.click(expandableItem.findItemToggle().toSelector());

    await expect(await browser.$$(expandableItem.findChildItems().toSelector())).toHaveLength(3);
    await expect(await browser.$$(expandableItem.findChildItems({ expanded: false }).toSelector())).toHaveLength(1);
    await expect(await browser.$$(itemsSelector)).toHaveLength(13);
    await expect(await browser.$$(expandedItemsSelector)).toHaveLength(2);
    await expect(await browser.$$(collapsedItemsSelector)).toHaveLength(5); // one item expanded, it has one collapsed child item so the number doesn't change

    // collapse
    const collapsibleItem = wrapper.findItemById('4', { expanded: true })!;

    await page.click(collapsibleItem.findItemToggle().toSelector());

    await expect(await browser.$$(expandableItem.findChildItems().toSelector())).toHaveLength(0);
    await expect(await browser.$$(itemsSelector)).toHaveLength(10); // 1 expanded, 5 collapsed, rest are not expandable
    await expect(await browser.$$(expandedItemsSelector)).toHaveLength(1);
    await expect(await browser.$$(collapsedItemsSelector)).toHaveLength(5);
  })
);
