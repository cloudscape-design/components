// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { createWrapper } from '@cloudscape-design/test-utils-core/selectors';

import '../../../lib/components/test-utils/selectors';

test(
  'Focus moves to the next tree-item action button when tree-item gets removed',
  useBrowser(async browser => {
    await browser.url('#/light/tree-view/removable-elements');
    const page = new BasePageObject(browser);

    const wrapper = createWrapper().findTreeView('[data-testid="removable-items-tree"]')!;
    const secondItem = wrapper.findItemById('cds2')!;
    const secondItemToggle = secondItem.findItemToggle();
    const secondItemRemoveButton = secondItem.findActions()!.findButton();

    await page.click(secondItemToggle.toSelector());
    await page.keys(['ArrowRight', 'ArrowRight']);
    await expect(page.isFocused(secondItemRemoveButton.toSelector())).resolves.toBe(true);

    await page.keys(['Enter']);

    const thirdItem = wrapper.findItemById('cds3')!;
    const thirdItemRemoveButton = thirdItem.findActions()!.findButton();
    await expect(page.isFocused(thirdItemRemoveButton.toSelector())).resolves.toBe(true);
  })
);

test(
  'Focus moves to the tree-item toggle when action button gets removed',
  useBrowser(async browser => {
    await browser.url('#/light/tree-view/removable-elements');
    const page = new BasePageObject(browser);

    const wrapper = createWrapper().findTreeView('[data-testid="removable-action-buttons-tree"]')!;

    const secondItem = wrapper.findItemById('removable-actions-cds2')!;
    const secondItemToggle = secondItem.findItemToggle();
    const secondItemRemoveButton = secondItem.findActions()!.findButton();

    await page.click(secondItemToggle.toSelector());
    await page.keys(['ArrowRight', 'ArrowRight']);
    await expect(page.isFocused(secondItemRemoveButton.toSelector())).resolves.toBe(true);

    await page.keys(['Enter']);

    await expect(page.isFocused(secondItemToggle.toSelector())).resolves.toBe(true);
  })
);

test(
  'Focus moves to the tree-item same position action button when action button gets removed',
  useBrowser(async browser => {
    await browser.url('#/light/tree-view/removable-elements');
    const page = new BasePageObject(browser);

    const wrapper = createWrapper().findTreeView('[data-testid="regular-removable-action-buttons-tree"]')!;

    const secondItem = wrapper.findItemById('regular-removable-actions-cds2')!;
    const secondItemToggle = secondItem.findItemToggle();
    const secondItemRemoveButton = secondItem.findActions()!.findButton('[data-testid="remove-button"]');
    const secondItemRegularButton = secondItem.findActions()!.findButton('[data-testid="regular-button"]');

    await page.click(secondItemToggle.toSelector());
    await page.keys(['ArrowRight', 'ArrowRight']);
    await expect(page.isFocused(secondItemRemoveButton.toSelector())).resolves.toBe(true);

    await page.keys(['Enter']);

    await expect(page.isFocused(secondItemRegularButton.toSelector())).resolves.toBe(true);
  })
);
