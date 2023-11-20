// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FOCUS_THROTTLE_DELAY } from '../utils';
import { setupTest } from './pages/interactive-page';
import { setupTest as setupStickyFlashbarTest } from './pages/sticky-page';

describe('Collapsible Flashbar', () => {
  describe('Keyboard navigation', () => {
    it(
      'can expand and collapse stacked notifications with the keyboard',
      setupTest(async page => {
        await page.toggleStackingFeature();

        // Navigate past all buttons to add and remove flashes
        await page.click('#focus-before');
        await page.keys('Tab');

        await expect(page.countFlashes()).resolves.toBe(1);
        await page.keys('Space');

        await expect(page.countFlashes()).resolves.toBe(5);
        await expect(page.isFlashFocused(1)).resolves.toBe(true);

        // Navigate past all flash buttons
        await page.keys(new Array(11).fill('Tab'));

        await page.keys('Space');
        await expect(page.countFlashes()).resolves.toBe(1);
      })
    );
  });

  describe('Focus interactions', () => {
    describe('in collapsed state', () => {
      test(
        'adding flash with ariaRole="status" does not move focus',
        setupTest(async page => {
          await page.toggleStackingFeature();
          await page.addInfoFlash();
          await page.pause(FOCUS_THROTTLE_DELAY);
          return expect(page.isFlashFocused(1)).resolves.toBe(false);
        })
      );

      test(
        'adding flash with ariaRole="alert" moves focus to the new flash',
        setupTest(async page => {
          await page.toggleStackingFeature();
          await page.addErrorFlash();
          await page.pause(FOCUS_THROTTLE_DELAY);
          return expect(page.isFlashFocused(1)).resolves.toBe(true);
        })
      );

      test(
        'adding new non-alert flashes does not move focus to the new flash',
        setupTest(async page => {
          await page.toggleStackingFeature();
          await page.addErrorFlash();
          await page.pause(FOCUS_THROTTLE_DELAY);
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
          await page.toggleStackingFeature();
          await page.toggleCollapsedState();
          await page.pause(FOCUS_THROTTLE_DELAY);
          await page.addInfoFlash();
          return expect(page.isFlashFocused(1)).resolves.toBe(false);
        })
      );

      test(
        'adding flash with ariaRole="alert" moves focus to the new flash',
        setupTest(async page => {
          await page.toggleStackingFeature();
          await page.toggleCollapsedState();
          await page.pause(FOCUS_THROTTLE_DELAY);
          await page.addErrorFlash();
          return expect(page.isFlashFocused(1)).resolves.toBe(true);
        })
      );

      test(
        'adding new non-alert flashes does not move focus to the new flash',
        setupTest(async page => {
          await page.toggleStackingFeature();
          await page.toggleCollapsedState();
          await page.pause(FOCUS_THROTTLE_DELAY);
          await page.addErrorFlash();
          await expect(page.isFlashFocused(1)).resolves.toBe(true);
          await page.addInfoFlash();
          await page.pause(FOCUS_THROTTLE_DELAY);
          await expect(page.isFlashFocused(1)).resolves.toBe(false);
        })
      );

      test(
        'adding new non-alert flashes does not move focus to previous alert flashes',
        setupTest(async page => {
          await page.toggleStackingFeature();
          await page.toggleCollapsedState();
          await page.pause(FOCUS_THROTTLE_DELAY);
          await page.addErrorFlash();
          await expect(page.isFlashFocused(1)).resolves.toBe(true);
          await page.pause(FOCUS_THROTTLE_DELAY);
          await page.addInfoFlash();
          await expect(page.isFlashFocused(2)).resolves.toBe(false);
        })
      );
    });

    describe('on expand', () => {
      test(
        'focuses on the first flash',
        setupTest(async page => {
          await page.toggleStackingFeature();
          await page.addErrorFlash();
          await page.pause(FOCUS_THROTTLE_DELAY);
          await page.toggleCollapsedState();
          await page.pause(FOCUS_THROTTLE_DELAY);
          await expect(page.isFlashFocused(1)).resolves.toBe(true);
        })
      );
    });
  });

  describe('Sticky Flashbar', () => {
    test(
      'keeps a space to the screen bottom to prevent the notification bar from getting cropped',
      setupStickyFlashbarTest(async page => {
        const windowDimensions = { width: 1000, height: 500 };
        await page.setWindowSize(windowDimensions);
        await page.toggleCollapsedState();
        expect(await page.getNotificationBarBottom()).toBeGreaterThan(windowDimensions.height);
        await page.windowScrollTo({ top: 1200 });
        expect(await page.getNotificationBarBottom()).toBeLessThan(windowDimensions.height);
        await page.setWindowSize({ width: windowDimensions.width, height: windowDimensions.height + 5 });
        expect(await page.getNotificationBarBottom()).toBeLessThan(windowDimensions.height + 5);
        await page.setWindowSize({ width: windowDimensions.width, height: windowDimensions.height });
        expect(await page.getNotificationBarBottom()).toBeLessThan(windowDimensions.height);
      })
    );
  });
});
