// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

// Scope the finders to the plain auto group so the real controls are addressed through the
// component test-utils rather than raw attribute selectors (the Select trigger is labelled
// via `aria-labelledby`, not `aria-label`, so it has no direct `aria-label` to match).
const autoPlain = createWrapper('[data-testid="auto-plain"]');
const firstInput = autoPlain.findInput('[aria-label="Label name"]').findNativeInput().toSelector();
const selectTrigger = autoPlain.findSelect().findTrigger().toSelector();
const lastInput = autoPlain.findInput('[aria-label="Label value"]').findNativeInput().toSelector();

// The dev page lays out one control group per scenario, each wrapped in a `data-testid`
// container. Each group holds three controls with these aria labels; the auto groups also
// render a hidden measurement duplicate, which this test ignores by reading only the boxes
// of visible (non-zero-height) controls.
const CONTROL_LABELS = ['Label name', 'Operator', 'Label value'];

const WIDE = { width: 1200, height: 800 };
const NARROW = { width: 360, height: 800 };

// Field boxes are bottom-aligned within a row (`align-items: flex-end`), so compare `top`
// with a small tolerance rather than exact equality; it also absorbs sub-pixel rounding.
const ROW_TOP_TOLERANCE = 2;

interface Box {
  top: number;
  left: number;
}

class ControlGroupPage extends BasePageObject {
  // Returns the bounding boxes of the real (visible) controls inside the given scenario
  // wrapper, left-to-right in DOM order. The hidden measurement ghost is skipped because its
  // controls have zero height.
  getVisibleControlBoxes(testId: string): Promise<Box[]> {
    return this.browser.execute(
      (id, labels) => {
        const container = document.querySelector(`[data-testid="${id}"]`);
        if (!container) {
          return [];
        }
        const boxes: Array<{ top: number; left: number }> = [];
        for (const label of labels) {
          const elements = Array.from(container.querySelectorAll(`[aria-label="${label}"]`));
          for (const element of elements) {
            const rect = element.getBoundingClientRect();
            // Skip the hidden ghost duplicate (collapsed to zero height, out of flow).
            if (rect.height > 0) {
              boxes.push({ top: rect.top, left: rect.left });
              break;
            }
          }
        }
        return boxes;
      },
      testId,
      CONTROL_LABELS
    );
  }

  async expectRow(testId: string) {
    await this.waitForAssertion(async () => {
      const boxes = await this.getVisibleControlBoxes(testId);
      expect(boxes).toHaveLength(CONTROL_LABELS.length);
      // All controls share approximately the same top (one row)...
      for (const box of boxes) {
        expect(Math.abs(box.top - boxes[0].top)).toBeLessThanOrEqual(ROW_TOP_TOLERANCE);
      }
      // ...and are placed left-to-right.
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].left).toBeGreaterThan(boxes[i - 1].left);
      }
    });
  }

  async expectStacked(testId: string) {
    await this.waitForAssertion(async () => {
      const boxes = await this.getVisibleControlBoxes(testId);
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
    await page.waitForVisible('[data-testid="auto-plain"]');
    await testFn(page);
  });
}

describe('ControlGroup responsiveness', () => {
  test(
    'auto group is a single row when there is room',
    setupTest(async page => {
      await page.setWindowSize(WIDE);
      await page.expectRow('auto-plain');
    })
  );

  test(
    'auto group stacks all controls at once when the viewport is narrow',
    setupTest(async page => {
      await page.setWindowSize(NARROW);
      await page.expectStacked('auto-plain');
    })
  );

  test(
    'auto group re-expands to a single row when the viewport widens again',
    setupTest(async page => {
      await page.setWindowSize(NARROW);
      await page.expectStacked('auto-plain');
      await page.setWindowSize(WIDE);
      await page.expectRow('auto-plain');
    })
  );

  test(
    'auto group inside a horizontal SpaceBetween re-expands after stacking (flexbox deadlock)',
    setupTest(async page => {
      await page.setWindowSize(WIDE);
      await page.expectRow('auto-spacebetween');
      await page.setWindowSize(NARROW);
      await page.expectStacked('auto-spacebetween');
      // The critical case: widening the viewport must break the parent/child deadlock and
      // let the group re-expand, instead of staying stuck stacked.
      await page.setWindowSize(WIDE);
      await page.expectRow('auto-spacebetween');
    })
  );

  test(
    'a forced direction ignores the available width',
    setupTest(async page => {
      // Forced horizontal stays a row even when the viewport is too narrow to fit it.
      await page.setWindowSize(NARROW);
      await page.expectRow('forced-horizontal');
      // Forced vertical stays stacked even when the viewport is wide enough for a row.
      await page.setWindowSize(WIDE);
      await page.expectStacked('forced-vertical');
    })
  );

  test(
    'keyboard focus flows through only the real controls, never a hidden measurement duplicate',
    setupTest(async page => {
      // The group renders a hidden duplicate of its controls to measure the row width. Those
      // duplicates must not be keyboard-focusable, or they would add phantom tab stops. Tab
      // from the button before the group: focus must visit each real control once (the Select
      // is a single tab stop at its trigger) and then land on the button after the group — a
      // total of (controls + 1) presses. An extra, hidden tab stop would divert focus and this
      // sequence would fail.
      await page.setWindowSize(WIDE);
      await page.click('[data-testid="focus-before"]');
      await expect(page.isFocused('[data-testid="focus-before"]')).resolves.toBe(true);

      // Tab across the three real controls in order. The ghost duplicate's controls share the
      // same markup, but it is inert and `visibility: hidden`, so focus can never rest on them.
      await page.keys(['Tab']);
      await expect(page.isFocused(firstInput)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(selectTrigger)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(lastInput)).resolves.toBe(true);

      // The next Tab leaves the group entirely, reaching the sentinel after it — proving no
      // hidden duplicate sits between the last real control and the following focus target.
      await page.keys(['Tab']);
      await expect(page.isFocused('[data-testid="focus-after"]')).resolves.toBe(true);
    })
  );
});
