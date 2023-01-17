// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setupTest } from './pages/interactive-page';
import { testFocusInteractions } from './common';

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

        await page.keys('Space');
        await expect(page.findFlashes()).resolves.toBe(1);
      })
    );
  });

  describe('Focus interactions', () => {
    describe('in collapsed state', () =>
      testFocusInteractions({
        prepareInitialState: async page => {
          await page.toggleCollapsibleFeature();
        },
        initialCount: 0,
      }));

    describe('in expanded state', () =>
      testFocusInteractions({
        prepareInitialState: async page => {
          await page.toggleCollapsibleFeature();
          await page.toggleCollapsedState();
        },
        initialCount: 0,
      }));
  });
});
