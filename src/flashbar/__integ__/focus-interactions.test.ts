// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setupTest } from './pages/interactive-page';

const initialCount = 5;
test(
  'adding flash with ariaRole="status" does not move focus',
  setupTest(async page => {
    await page.addInfoFlash();
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(false);
  })
);

test(
  'adding flash with ariaRole="alert" moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlash();
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
  })
);

test(
  'adding new non-alert flashes does not move focus to previous alert flashes',
  setupTest(async page => {
    await page.addErrorFlash();
    await expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
    await page.addInfoFlash();
    await expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(false);
  })
);

test(
  'adding multiple flashes with ariaRole="alert" throttles focus moves',
  setupTest(async page => {
    await page.addSequentialErrorFlashes();
    return expect(page.isFlashFocused(initialCount + 1)).resolves.toBe(true);
  })
);

test(
  'adding flash with ariaRole="alert" to the top moves focus to the new flash',
  setupTest(async page => {
    await page.addErrorFlashToTop();
    return expect(page.isFlashFocused(1)).resolves.toBe(true);
  })
);
