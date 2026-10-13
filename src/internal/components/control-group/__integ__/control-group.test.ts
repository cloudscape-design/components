// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';
import ControlGroupWrapper from '../../../../../lib/components/test-utils/selectors/internal/control-group';

const wrapperSelector = '[data-testid="auto-spacebetween"]';

const controls = createWrapper(wrapperSelector)
  .findComponent(`.${ControlGroupWrapper.rootSelector}`, ControlGroupWrapper)!
  .findControls();

const expectedControlCount = 6;

const firstControl = controls.get(1).findInput().findNativeInput().toSelector();
const secondControl = controls.get(2).findSelect().findTrigger().toSelector();
const thirdControl = controls.get(3).findInput().findNativeInput().toSelector();

const wide = { width: 1200, height: 800 };
const narrow = { width: 500, height: 800 }; // Headless Chrome does not shrink narrower than 500px.

class ControlGroupPage extends BasePageObject {
  async getControlBoxes() {
    const boxes = [];
    for (let i = 1; i <= expectedControlCount; i++) {
      boxes.push(await this.getBoundingBox(controls.get(i).toSelector()));
    }
    return boxes;
  }

  async expectRow() {
    await this.waitForAssertion(async () => {
      const boxes = await this.getControlBoxes();
      expect(boxes).toHaveLength(expectedControlCount);
      for (const box of boxes) {
        expect(box.top).toEqual(boxes[0].top);
      }
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].left).toBeGreaterThan(boxes[i - 1].left);
      }
    });
  }

  async expectStacked() {
    await this.waitForAssertion(async () => {
      const boxes = await this.getControlBoxes();
      expect(boxes).toHaveLength(expectedControlCount);
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
    await browser.url('#/control-group/responsive');
    await page.waitForVisible(wrapperSelector);
    await testFn(page);
  });
}

describe('Control Group responsiveness', () => {
  test(
    'Collapses and re-expands according to available width when `direction="auto"`',
    setupTest(async page => {
      await page.setWindowSize(wide);
      await page.expectRow();
      await page.setWindowSize(narrow);
      await page.expectStacked();
      // Critical case: widening must re-expand it, not leave it stuck stacked.
      await page.setWindowSize(wide);
      await page.expectRow();
    })
  );

  test(
    'Measurement ghost does not add tab stops',
    setupTest(async page => {
      await page.setWindowSize(wide);
      await page.click('#focus-target');
      await expect(page.isFocused('#focus-target')).resolves.toBe(true);

      await page.keys(['Tab']);
      await expect(page.isFocused(firstControl)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(secondControl)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isFocused(thirdControl)).resolves.toBe(true);

      for (let i = 3; i < expectedControlCount; i++) {
        await page.keys(['Tab']);
      }
      await page.keys(['Tab']);
      // Focus exits the group, not intercepted by the measurement ghost.
      await expect(page.isFocused('[data-testid="focus-after"]')).resolves.toBe(true);
    })
  );
});
