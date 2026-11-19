// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import AutosuggestTokenModePage from './page-objects/autosuggest-token-mode-page';

const URL = '/#/light/autosuggest/token-mode';
const tokenLabels = ['us-east-1', 'eu-west-1', 'ap-southeast-1', 'ca-central-1', 'sa-east-1', 'eu-central-1'];

function setupTest(windowWidth: number, testFn: (page: AutosuggestTokenModePage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new AutosuggestTokenModePage(browser);
    await page.setWindowSize({ width: windowWidth, height: 800 });
    await browser.url(URL);
    await page.waitForPageReady();
    for (const label of tokenLabels) {
      await page.typeAndAddToken(label);
    }
    await testFn(page);
  });
}

describe('Autosuggest token mode overflow', () => {
  test(
    'collapses tokens that do not fit into the overflow trigger',
    setupTest(600, async page => {
      const visibleCount = await page.getTokenCount();
      expect(visibleCount).toBeGreaterThan(0);
      expect(visibleCount).toBeLessThan(tokenLabels.length);
      await expect(page.getHiddenCount()).resolves.toBe(tokenLabels.length - visibleCount);
    })
  );

  test(
    'keeps every visible token fully between the overflow trigger and the input',
    setupTest(600, async page => {
      const visibleCount = await page.getTokenCount();
      const field = await page.getFieldBox();
      const trigger = await page.getOverflowTriggerBox();
      const input = await page.getInputBox();
      expect(trigger.left).toBeGreaterThanOrEqual(field.left);
      for (let index = 1; index <= visibleCount; index++) {
        const token = await page.getVisibleTokenBox(index);
        expect(token.left).toBeGreaterThanOrEqual(trigger.right);
        expect(token.right).toBeLessThanOrEqual(input.left + 1);
      }
      expect(input.right).toBeLessThanOrEqual(field.right);
    })
  );

  test(
    'shows all tokens without a trigger when they fit',
    setupTest(1600, async page => {
      await expect(page.getTokenCount()).resolves.toBe(tokenLabels.length);
      await expect(page.getHiddenCount()).resolves.toBe(0);
    })
  );

  test(
    'recalculates the visible tokens when the field is resized',
    setupTest(1600, async page => {
      await page.setWindowSize({ width: 600, height: 800 });
      await page.waitForOverflowTrigger();
      await expect(page.getTokenCount()).resolves.toBeLessThan(tokenLabels.length);

      await page.setWindowSize({ width: 1600, height: 800 });
      await page.waitForOverflowTrigger(false);
      await expect(page.getTokenCount()).resolves.toBe(tokenLabels.length);
    })
  );

  test(
    'reveals a hidden token when a visible one is removed',
    setupTest(600, async page => {
      const hiddenBefore = await page.getHiddenCount();
      await page.clickTokenDismiss(1);
      await page.waitForTotalTokenCount(tokenLabels.length - 1);
      await expect(page.getHiddenCount()).resolves.toBeLessThan(hiddenBefore);
    })
  );
});
