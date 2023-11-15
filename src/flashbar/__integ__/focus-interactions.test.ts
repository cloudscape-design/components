// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setupTest } from './pages/interactive-page';
import { FOCUS_THROTTLE_DELAY } from '../utils';

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
    await page.pause(FOCUS_THROTTLE_DELAY);
    await expect(page.isFlashFocused(1)).resolves.toBe(false);
  })
);

test(
  'adding multiple flashes with ariaRole="alert" throttles focus moves',
  setupTest(async page => {
    const initialCount = await page.countFlashes();
    await page.addSequentialErrorFlashes();
    await page.pause(300);
    const currentCount = await page.countFlashes();
    const firstAddedItemIndex = currentCount - initialCount;
    return expect(page.isFlashFocused(firstAddedItemIndex)).resolves.toBe(true);
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
