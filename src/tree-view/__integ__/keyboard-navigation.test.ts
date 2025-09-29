// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

test(
  'Focus moves to the next tree-item toggle when tree-item gets removed',
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

    await page.keys('Enter');

    const thirdItemToggle = wrapper.findItemById('cds3')!.findItemToggle();
    await expect(page.isFocused(thirdItemToggle.toSelector())).resolves.toBe(true);
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

    await page.keys('Enter');

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

    await page.keys('Enter');

    await expect(page.isFocused(secondItemRegularButton.toSelector())).resolves.toBe(true);
  })
);

test(
  'Re-focuses on the previously focused tree-item when focus moves outside and back inside',
  useBrowser(async browser => {
    await browser.url('#/light/tree-view/removable-elements');
    const page = new BasePageObject(browser);
    const wrapper = createWrapper();
    const treeView = wrapper.findTreeView('[data-testid="removable-items-tree"]')!;

    const secondItemToggle = treeView.findItemById('cds2')!.findItemToggle();
    await page.click(secondItemToggle.toSelector());

    await page.keys('Tab');
    await expect(page.isFocused(wrapper.findButton('[data-testid="focus-button2"]').toSelector())).resolves.toBe(true);

    await page.keys(['Shift', 'Tab']);
    await expect(page.isFocused(secondItemToggle.toSelector())).resolves.toBe(true);
  })
);

test(
  'Re-focuses on the tree-item that previously focused element belongs when focus moves outside and back inside',
  useBrowser(async browser => {
    await browser.url('#/light/tree-view/removable-elements');
    const page = new BasePageObject(browser);
    const wrapper = createWrapper();
    const treeView = wrapper.findTreeView('[data-testid="removable-items-tree"]')!;

    const secondItem = treeView.findItemById('cds2')!;
    const secondItemToggle = secondItem.findItemToggle();
    await page.click(secondItemToggle.toSelector());
    await page.keys(['ArrowRight', 'ArrowRight']);
    await expect(page.isFocused(secondItem.findActions()!.findButton().toSelector())).resolves.toBe(true);

    await page.keys('Tab');
    await expect(page.isFocused(wrapper.findButton('[data-testid="focus-button2"]').toSelector())).resolves.toBe(true);

    await page.keys(['Shift', 'Tab']);
    await expect(page.isFocused(secondItemToggle.toSelector())).resolves.toBe(true);
  })
);
