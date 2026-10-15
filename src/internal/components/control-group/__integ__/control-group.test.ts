// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';
import ControlGroupWrapper from '../../../../../lib/components/test-utils/selectors/internal/control-group';

const wrapperSelector = '[data-testid="auto-spacebetween"]';
const resizableContainerSelector = '[data-testid="resizable-container"]';

const group = createWrapper(wrapperSelector).findComponent(
  `.${ControlGroupWrapper.rootSelector}`,
  ControlGroupWrapper
)!;
const controls = group.findControls();

const expectedControlCount = 6;

const firstControl = controls.get(1).findInput().findNativeInput().toSelector();
const secondControl = controls.get(2).findSelect().findTrigger().toSelector();
const thirdControl = controls.get(3).findInput().findNativeInput().toSelector();

class ControlGroupPage extends BasePageObject {
  async getControlBoxes() {
    const boxes = [];
    for (let i = 1; i <= expectedControlCount; i++) {
      boxes.push(await this.getBoundingBox(controls.get(i).toSelector()));
    }
    return boxes;
  }

  async selectWidth(value: string) {
    await this.click(
      createWrapper().findRadioGroup('[data-testid="width-radio"]').findInputByValue(value).toSelector()
    );
    await this.pause(500);
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

function setup(withButton: boolean, testFn: (page: ControlGroupPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new ControlGroupPage(browser);
    // Keep the viewport large so only the container width constrains the control group.
    await page.setWindowSize({ width: 1600, height: 800 });
    await browser.url(`#/control-group/responsive?containerWidth=1200${withButton ? '&withButton=true' : ''}`);
    await page.waitForVisible(wrapperSelector);
    await testFn(page);
  });
}

describe('Control Group responsiveness', () => {
  [false, true].forEach(withButton => {
    test(
      `Collapses and re-expands according to available width when \`direction="auto"\` ${withButton ? 'with' : 'without'} action button`,
      setup(withButton, async page => {
        await page.selectWidth('1200');
        await page.expectRow();
        await page.selectWidth('300');
        await page.expectStacked();
        // Critical case: widening must re-expand it, not leave it stuck stacked.
        await page.selectWidth('1200');
        await page.expectRow();
      })
    );
  });

  test(
    'Measurement ghost does not add tab stops',
    setup(false, async page => {
      await page.selectWidth('1200');
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

  test(
    'Controls compress rather than overflow when an action button is present',
    setup(true, async page => {
      await page.selectWidth('300');
      // The group fits its clipping container: the action button stays within it.
      await page.waitForAssertion(async () => {
        const container = await page.getBoundingBox(resizableContainerSelector);
        const actionButton = await page.getBoundingBox(group.findActionButton()!.toSelector());
        expect(actionButton.right).toBeLessThanOrEqual(container.right);
      });
    })
  );
});
