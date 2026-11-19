// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/expandable-section/styles.selectors.js';

const focusTargetSelector = '#focus-target';

const expandableSectionWrapper = createWrapper().findExpandableSection();
const headerButtonSelector = expandableSectionWrapper.findHeader().find('[role="button"]').toSelector();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/expandable-section/test');
    await page.waitForVisible(expandableSectionWrapper.toSelector());
    await testFn(page);
  });
};

describe('Expandable Section', () => {
  test(
    'keeps focus on header button after expanding/collapsing',
    setupTest(async page => {
      await page.click(focusTargetSelector);

      // Open expandable section
      await page.keys(['Tab', 'Space']);
      await expect(page.isExisting(expandableSectionWrapper.findExpandedContent().toSelector())).resolves.toBe(true);
      await expect(page.isFocused(headerButtonSelector)).resolves.toBe(true);

      // Close expandable section
      await page.keys(['Space']);
      await expect(page.isExisting(expandableSectionWrapper.findExpandedContent().toSelector())).resolves.toBe(false);
      await expect(page.isFocused(headerButtonSelector)).resolves.toBe(true);
    })
  );
});

// --- End-position integration tests ---
// These sections use headerActions to trigger the OUTSIDE caret button path
// (renderIconOutsideHeader = iconAtEnd && (isContainer || !!actions)).
// The outside <button> with .icon-container-end is the element exercised by the #9 fixes:
// stopPropagation on keydown/keyup, focus ring, and align-self:stretch clickable area.

const endSingleRowWrapper = createWrapper().find('[data-testid="end-position-single-row"]').findExpandableSection();
const endWrappingWrapper = createWrapper().find('[data-testid="end-position-wrapping-header"]').findExpandableSection();

// The outside caret button: a native <button> with class .icon-container-end, rendered separately
// from the headerButton when actions are present. This is the element that receives the #9 fixes.
const endCaretButtonSelector = endSingleRowWrapper
  .findHeader()
  .find(`button.${styles['icon-container-end']}`)
  .toSelector();
const wrappingCaretButtonSelector = endWrappingWrapper
  .findHeader()
  .find(`button.${styles['icon-container-end']}`)
  .toSelector();

class EndPositionPage extends BasePageObject {
  hasOutline(selector: string) {
    return this.browser.execute(selector => {
      const element = document.querySelector(selector);
      return !!element && getComputedStyle(element).outline.includes('2px');
    }, selector);
  }

  async clickAtPosition(x: number, y: number) {
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
  }
}

const setupEndPositionTest = (testFn: (page: EndPositionPage) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new EndPositionPage(browser);
    await browser.url('#/light/expandable-section/test');
    await page.waitForVisible(endSingleRowWrapper.toSelector());
    await testFn(page);
  });
};

describe('Expandable Section - end icon position', () => {
  test(
    'Enter toggles an end-position section exactly once',
    setupEndPositionTest(async page => {
      await page.click(focusTargetSelector);

      // Tab order from #focus-target:
      // 1. First section headerButton ("Static website hosting")
      // 2. End-position section headerButton (text-only, since caret is outside)
      // 3. Action <Button> inside headerActions
      // 4. Outside caret <button> (ExpandIconButton)
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isFocused(endCaretButtonSelector)).resolves.toBe(true);

      // Press Enter — should expand (single toggle, not open+close due to stopPropagation fix)
      await page.keys(['Enter']);
      await expect(page.isExisting(endSingleRowWrapper.findExpandedContent().toSelector())).resolves.toBe(true);

      // Press Enter again — should collapse
      await page.keys(['Enter']);
      await expect(page.isExisting(endSingleRowWrapper.findExpandedContent().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'Space toggles an end-position section exactly once',
    setupEndPositionTest(async page => {
      await page.click(focusTargetSelector);

      // Tab to the outside caret button (4 stops from #focus-target)
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isFocused(endCaretButtonSelector)).resolves.toBe(true);

      // Press Space — should expand (single toggle, not open+close due to stopPropagation fix)
      await page.keys(['Space']);
      await expect(page.isExisting(endSingleRowWrapper.findExpandedContent().toSelector())).resolves.toBe(true);

      // Press Space again — should collapse
      await page.keys(['Space']);
      await expect(page.isExisting(endSingleRowWrapper.findExpandedContent().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'end-position caret button shows a focus ring when focused',
    setupEndPositionTest(async page => {
      await page.click(focusTargetSelector);

      // Tab to the outside caret button
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab']);
      await expect(page.isFocused(endCaretButtonSelector)).resolves.toBe(true);

      // Verify focus ring (2px outline) is visible on the caret button
      // This exercises the @include focus-highlight(2px) rule on .icon-container-end
      await expect(page.hasOutline(endCaretButtonSelector)).resolves.toBe(true);
    })
  );

  test(
    'clicking below the caret on a wrapped end-position header toggles the section',
    setupEndPositionTest(async page => {
      // WHY HEADER-RELATIVE: Computing the click from the caret button's own bbox is vacuous —
      // the point always lands inside the button regardless of align-self:stretch. Instead we
      // derive y from the HEADER's full height (the tall wrapped row) and x from the caret's
      // horizontal center. With align-self:stretch the caret button fills the header height,
      // so (caret-x, header-bottom) is INSIDE the button → toggles. Without stretch, the
      // caret button is only glyph-tall at the top and restrictClickableArea (actions present)
      // makes the header wrapper dead space → no toggle. This genuinely exercises the fix.
      const headerSelector = endWrappingWrapper.findHeader().toSelector();
      const caretBox = await page.getBoundingBox(wrappingCaretButtonSelector);
      const headerBox = await page.getBoundingBox(headerSelector);

      // x = horizontal center of the caret button (at the header's inline-end)
      const x = Math.round(caretBox.left + caretBox.width / 2);
      // y = near the bottom of the tall wrapped header, well below the small caret glyph
      const y = Math.round(headerBox.top + headerBox.height - 5);

      await page.clickAtPosition(x, y);

      // Should expand — the stretched caret button covers this point
      await expect(page.isExisting(endWrappingWrapper.findExpandedContent().toSelector())).resolves.toBe(true);
    })
  );
});
