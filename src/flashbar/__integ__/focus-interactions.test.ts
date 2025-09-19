// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setupTest } from './pages/interactive-page';

test(
  'a flash with ariaRole="status" produces no duplicate interactive content',
  setupTest(async page => {
    await page.removeAll();
    await page.addInfoFlash();

    await page.click('#focus-before');
    await page.keys('Tab');
    await page.keys('Tab');
    await page.keys('Tab');

    expect(await page.isFocused('#focus-after')).toBe(true);
  })
);

test(
  'adding flash with ariaRole="status" does not move focus',
  setupTest(async page => {
    await page.addInfoFlash();
    return expect(page.isFlashFocused(1)).resolves.toBe(false);
  })
);

test(
  'adding flash with ariaRole="alert" moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlash();
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);

test(
  'adding new non-alert flashes does not move focus to previous alert flashes',
  setupTest(async page => {
    await page.addErrorFlash();
    await expect(page.isFlashFocused(1)).resolves.toBe(true);
    await page.addInfoFlash();
    await expect(page.isFlashFocused(1)).resolves.toBe(false);
  })
);

test(
  'adding multiple flashes with ariaRole="alert" debounces focus moves',
  setupTest(async page => {
    await page.addSequentialErrorFlashes();
    // Flash items are added from bottom to top, so the last one added is the first one in the DOM.
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);

test(
  'adding flash with ariaRole="alert" to the top moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlash();
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);

test(
  'adding flash with ariaRole="alert" to the bottom moves focus to the new flash',
  setupTest(async page => {
    const initialCount = await page.countFlashes();
    await page.addErrorFlashToBottom();
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
  })
);

test(
  'dismissing flash item moves focus to next item',
  setupTest(async page => {
    await page.addSequentialErrorFlashes();

    await page.dismissFirstItem();

    return expect(await page.isFlashFocused(1)).toBe(true);
  })
);

test(
  'dismissing flash in expanded collapsible state moves focus to next item',
  setupTest(async page => {
    await page.removeAll();
    await page.toggleStackingFeature();
    await page.addSequentialErrorFlashes();
    await page.toggleCollapsedState();

    await page.dismissFirstItem();

    return expect(await page.isFlashFocused(1)).toBe(true);
  })
);

test(
  'dismissing flash in collapsed state moves focus to notification bar',
  setupTest(async page => {
    await page.removeAll();
    await page.toggleStackingFeature();
    await page.addSequentialErrorFlashes();

    await page.dismissFirstItem();

    const isDismissButtonFocused = await page.isDismissButtonFocused();

    return expect(isDismissButtonFocused).toBe(true);
  })
);

test(
  'dismissing the last flash item moves focus to h1 element',
  setupTest(async page => {
    await page.removeAll();
    await page.addInfoFlash();

    await page.dismissFirstItem();

    const isH1Focused = await page.isFocused('h1');

    return expect(isH1Focused).toBe(true);
  })
);
