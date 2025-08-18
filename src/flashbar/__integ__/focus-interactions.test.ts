// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FOCUS_DEBOUNCE_DELAY } from '../utils';
import { setupTest } from './pages/interactive-page';

// The approximate time it takes for 3 flashes to be added in a quick sequence with a 100ms delay.
const SEQUENTIAL_FLASH_DELAY = 300;

test(
  'a flash with ariaRole="status" produces no duplicate interactive content',
  setupTest(async page => {
    await page.removeAll();
    await page.addInfoFlash();
    await page.pause(FOCUS_DEBOUNCE_DELAY);

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
    await page.pause(FOCUS_DEBOUNCE_DELAY);
    return expect(page.isFlashFocused(1)).resolves.toBe(false);
  })
);

test(
  'adding flash with ariaRole="alert" moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlash();
    await page.pause(FOCUS_DEBOUNCE_DELAY);
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);

test(
  'adding new non-alert flashes does not move focus to previous alert flashes',
  setupTest(async page => {
    await page.addErrorFlash();
    await page.pause(FOCUS_DEBOUNCE_DELAY);
    await expect(page.isFlashFocused(1)).resolves.toBe(true);
    await page.pause(FOCUS_DEBOUNCE_DELAY);
    await page.addInfoFlash();
    await expect(page.isFlashFocused(1)).resolves.toBe(false);
  })
);

test(
  'adding multiple flashes with ariaRole="alert" debounces focus moves',
  setupTest(async page => {
    await page.addSequentialErrorFlashes();
    // Wait for sequential flashes to be added
    await page.pause(SEQUENTIAL_FLASH_DELAY);
    // Flash items are added from bottom to top, so the last one added is the first one in the DOM.
    await page.pause(FOCUS_DEBOUNCE_DELAY);
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);

test(
  'adding flash with ariaRole="alert" to the top moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlash();
    await page.pause(FOCUS_DEBOUNCE_DELAY);
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);

test(
  'adding flash with ariaRole="alert" to the bottom moves focus to the new flash',
  setupTest(async page => {
    const initialCount = await page.countFlashes();
    await page.addErrorFlashToBottom();
    await page.pause(FOCUS_DEBOUNCE_DELAY);
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
  })
);

test(
  'dismissing flash item moves focus to next item',
  setupTest(async page => {
    await page.addSequentialErrorFlashes();
    await page.pause(SEQUENTIAL_FLASH_DELAY);

    await page.dismissFirstItem();
    await page.pause(FOCUS_DEBOUNCE_DELAY);

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
    await page.pause(FOCUS_DEBOUNCE_DELAY);

    return expect(await page.isFlashFocused(1)).toBe(true);
  })
);

test(
  'dismissing flash in collapsed state moves focus to notification bar',
  setupTest(async page => {
    await page.removeAll();
    await page.toggleStackingFeature();
    await page.addSequentialErrorFlashes();
    await page.pause(SEQUENTIAL_FLASH_DELAY);

    await page.dismissFirstItem();
    await page.pause(FOCUS_DEBOUNCE_DELAY);

    const isDismissButtonFocused = await page.isDismissButtonFocused();

    return expect(isDismissButtonFocused).toBe(true);
  })
);
