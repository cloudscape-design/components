// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setupTest } from './pages/interactive-page';
import { FOCUS_THROTTLE_DELAY } from '../utils';

describe('Collapsible Flashbar', () => {
  describe('Keyboard navigation', () => {
    it(
      'can expand and collapse stacked notifications with the keyboard',
      setupTest(async page => {
        await page.toggleCollapsibleFeature();

        // Navigate past all buttons to add and remove flashes
        await page.keys(new Array(8).fill('Tab'));

        await expect(page.findFlashes()).resolves.toBe(1);
        await page.keys('Space');

        await expect(page.findFlashes()).resolves.toBe(5);
        await expect(page.isFlashFocused(1)).resolves.toBe(true);

        // Navigate past all flash buttons
        await page.keys(new Array(11).fill('Tab'));

        await page.keys('Space');
        await expect(page.findFlashes()).resolves.toBe(1);
      })
    );
  });

  describe('Focus interactions', () => {
    describe('in collapsed state', () => {
      test(
        'adding flash with ariaRole="status" does not move focus',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.addInfoFlash();
          await wait(FOCUS_THROTTLE_DELAY);
          return expect(page.isFlashFocused(1)).resolves.toBe(false);
        })
      );

      test(
        'adding flash with ariaRole="alert" moves focus to the new flash',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.addErrorFlash();
          await wait(FOCUS_THROTTLE_DELAY);
          return expect(page.isFlashFocused(1)).resolves.toBe(true);
        })
      );

      test(
        'adding new non-alert flashes does not move focus to the new flash',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.addErrorFlash();
          await wait(FOCUS_THROTTLE_DELAY);
          await expect(page.isFlashFocused(1)).resolves.toBe(true);
          await page.addInfoFlash();
          await expect(page.isFlashFocused(1)).resolves.toBe(false);
        })
      );
    });

    describe('in expanded state', () => {
      test(
        'adding flash with ariaRole="status" does not move focus',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.toggleCollapsedState();
          await wait(FOCUS_THROTTLE_DELAY);
          await page.addInfoFlash();
          return expect(page.isFlashFocused(1)).resolves.toBe(false);
        })
      );

      test(
        'adding flash with ariaRole="alert" moves focus to the new flash',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.toggleCollapsedState();
          await wait(FOCUS_THROTTLE_DELAY);
          await page.addErrorFlash();
          return expect(page.isFlashFocused(1)).resolves.toBe(true);
        })
      );

      test(
        'adding new non-alert flashes does not move focus to the new flash',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.toggleCollapsedState();
          await wait(FOCUS_THROTTLE_DELAY);
          await page.addErrorFlash();
          await expect(page.isFlashFocused(1)).resolves.toBe(true);
          await page.addInfoFlash();
          await wait(FOCUS_THROTTLE_DELAY);
          await expect(page.isFlashFocused(1)).resolves.toBe(false);
        })
      );

      test(
        'adding new non-alert flashes does not move focus to previous alert flashes',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.toggleCollapsedState();
          await wait(FOCUS_THROTTLE_DELAY);
          await page.addErrorFlash();
          await expect(page.isFlashFocused(1)).resolves.toBe(true);
          await wait(FOCUS_THROTTLE_DELAY);
          await page.addInfoFlash();
          await expect(page.isFlashFocused(2)).resolves.toBe(false);
        })
      );
    });

    describe('on expand', () => {
      test(
        'focuses on the first flash',
        setupTest(async page => {
          await page.toggleCollapsibleFeature();
          await page.addErrorFlash();
          await wait(FOCUS_THROTTLE_DELAY);
          await page.toggleCollapsedState();
          await wait(FOCUS_THROTTLE_DELAY);
          await expect(page.isFlashFocused(1)).resolves.toBe(true);
        })
      );
    });
  });
});

function wait(amount: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, amount);
  });
}
