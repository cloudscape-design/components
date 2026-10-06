// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

const SCENARIO = '[data-testid="auto-spacebetween"]';

// Address the controls via test-utils rather than raw selectors (the Select trigger has no
// `aria-label` — it's labelled via `aria-labelledby`).
const group = createWrapper(SCENARIO);
const firstInput = group.findInput('[aria-label="Label name"]').findNativeInput().toSelector();
const selectTrigger = group.findSelect().findTrigger().toSelector();
const lastInput = group.findInput('[aria-label="Label value"]').findNativeInput().toSelector();

// The three controls in the group.
const CONTROL_LABELS = ['Label name', 'Operator', 'Label value'];

const WIDE = { width: 1200, height: 800 };
const NARROW = { width: 360, height: 800 };

// Tolerance for comparing control tops in a row (bottom-aligned fields, sub-pixel rounding).
const ROW_TOP_TOLERANCE = 2;

interface Box {
  top: number;
  left: number;
}

class ControlGroupPage extends BasePageObject {
  // Boxes of the visible controls in the group, in DOM order. Skips the ghost duplicate.
  getVisibleControlBoxes(): Promise<Box[]> {
    return this.browser.execute(
      (selector, labels) => {
        const container = document.querySelector(selector);
        if (!container) {
          return [];
        }
        const boxes: Array<{ top: number; left: number }> = [];
        for (const label of labels) {
          const elements = Array.from(container.querySelectorAll(`[aria-label="${label}"]`));
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            // The ghost duplicate has zero height; skip it.
            if (rect.height > 0) {
              boxes.push({ top: rect.top, left: rect.left });
              break;
            }
          }
        }
        return boxes;
      },
      SCENARIO,
      CONTROL_LABELS
    );
  }

  async expectRow() {
    await this.waitForAssertion(async () => {
      const boxes = await this.getVisibleControlBoxes();
      expect(boxes).toHaveLength(CONTROL_LABELS.length);
      // Same top, increasing left: one row, left-to-right.
      for (const box of boxes) {
        expect(Math.abs(box.top - boxes[0].top)).toBeLessThanOrEqual(ROW_TOP_TOLERANCE);
      }
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].left).toBeGreaterThan(boxes[i - 1].left);
      }
    });
  }

  async expectStacked() {
    await this.waitForAssertion(async () => {
      const boxes = await this.getVisibleControlBoxes();
      expect(boxes).toHaveLength(CONTROL_LABELS.length);
      // Every control is on its own row below the previous one (all-or-nothing stacking).
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].top);
      }
    });
  }
}

function setupTest(testFn: (page: ControlGroupPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new ControlGroupPage(browser);
    await browser.url('#/control-group/responsiveness');
    await page.waitForVisible(SCENARIO);
    await testFn(page);
  });
}

describe('ControlGroup responsiveness', () => {
  test(
    'auto group inside a horizontal SpaceBetween re-expands after stacking (flexbox deadlock)',
    setupTest(async page => {
      await page.setWindowSize(WIDE);
      await page.expectRow();
      await page.setWindowSize(NARROW);
      await page.expectStacked();
      // The critical case: widening must re-expand it, not leave it stuck stacked.
      await page.setWindowSize(WIDE);
      await page.expectRow();
    })
  );

  test(
    'keyboard focus flows through only the real controls, never a hidden measurement duplicate',
    setupTest(async page => {
      // Tabbing from the focus target before the group must reach each real control then the
      // button after it. A focusable ghost duplicate would add a tab stop and break this.
      await page.setWindowSize(WIDE);
      await page.click('#focus-target');
      await expect(page.isFocused('#focus-target')).resolves.toBe(true);

      // Tab across the three real controls in order.
      await page.keys(['Tab']);
      await expect(page.isFocused(firstInput)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(selectTrigger)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(lastInput)).resolves.toBe(true);

      // The next Tab leaves the group for the button after it.
      await page.keys(['Tab']);
      await expect(page.isFocused('[data-testid="focus-after"]')).resolves.toBe(true);
    })
  );
});
