// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../../lib/components/test-utils/selectors';
import ControlGroupWrapper from '../../../../../lib/components/test-utils/selectors/internal/control-group';

// One shared anchor drives every wrap mode, so a single selector set resolves the group.
const wrapperSelector = '[data-testid="control-group-wrapper"]';
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
  async getControlBoxes(controlsCollection: typeof controls) {
    const boxes = [];
    for (let i = 1; i <= expectedControlCount; i++) {
      boxes.push(await this.getBoundingBox(controlsCollection.get(i).toSelector()));
    }
    return boxes;
  }

  async selectWidth(value: string) {
    await this.click(
      createWrapper().findRadioGroup('[data-testid="width-radio"]').findInputByValue(value).toSelector()
    );
    await this.pause(500);
  }

  async expectRow(controlsCollection: typeof controls) {
    await this.waitForAssertion(async () => {
      const boxes = await this.getControlBoxes(controlsCollection);
      expect(boxes).toHaveLength(expectedControlCount);
      for (const box of boxes) {
        expect(box.top).toEqual(boxes[0].top);
      }
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].left).toBeGreaterThan(boxes[i - 1].left);
      }
    });
  }

  async expectStacked(controlsCollection: typeof controls) {
    await this.waitForAssertion(async () => {
      const boxes = await this.getControlBoxes(controlsCollection);
      expect(boxes).toHaveLength(expectedControlCount);
      // Every control is on its own row below the previous one (all-or-nothing stacking).
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].top);
      }
    });
  }
}

// Container-constrained modes (flex / block): a large window keeps the resizable
// container the only width constraint; the width radio drives the container width.
function setup(wrapMode: 'flex' | 'block', withButton: boolean, testFn: (page: ControlGroupPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new ControlGroupPage(browser);
    await page.setWindowSize({ width: 1600, height: 800 });
    await browser.url(
      `#/control-group/responsive?wrapMode=${wrapMode}&containerWidth=1200${withButton ? '&withButton=true' : ''}`
    );
    await page.waitForVisible(wrapperSelector);
    await testFn(page);
  });
}

// Loads the flex example at an exact container width, navigating fresh each time: a
// hash-only change leaves a stale `overflows` closure, so each case must land on a blank
// page first and reload to force a clean re-measure.
function setupWidth(containerWidth: number, withButton: boolean, testFn: (page: ControlGroupPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new ControlGroupPage(browser);
    await page.setWindowSize({ width: 1600, height: 800 });
    await browser.url('about:blank');
    await browser.url(
      `#/control-group/responsive?wrapMode=flex&containerWidth=${containerWidth}${withButton ? '&withButton=true' : ''}`
    );
    await page.waitForVisible(wrapperSelector);
    await testFn(page);
  });
}

// Window-constrained mode (none): there is no width-constraining wrapper, so the
// group resolves against the viewport; the window size drives the available width.
function setupWindow(testFn: (page: ControlGroupPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new ControlGroupPage(browser);
    await browser.url('#/control-group/responsive?wrapMode=none');
    await page.waitForVisible(wrapperSelector);
    await testFn(page);
  });
}

describe('Control Group responsiveness', () => {
  (['flex', 'block'] as const).forEach(mode => {
    test(
      `Collapses and re-expands according to the ${mode} container width when \`direction="auto"\``,
      setup(mode, false, async page => {
        await page.selectWidth('1200');
        await page.expectRow(controls);
        await page.selectWidth('300');
        await page.expectStacked(controls);
        // Critical case: widening must re-expand it, not leave it stuck stacked.
        await page.selectWidth('1200');
        await page.expectRow(controls);
      })
    );
  });

  test(
    'Collapses and re-expands according to the window width when constrained only by the window',
    setupWindow(async page => {
      await page.setWindowSize({ width: 1600, height: 800 });
      await page.expectRow(controls);
      // Headless Chrome will not shrink below ~500px wide; the 6-control single-row
      // width exceeds this, so a narrow window forces stacking.
      await page.setWindowSize({ width: 500, height: 800 });
      await page.expectStacked(controls);
      // Critical case: widening must re-expand it, not leave it stuck stacked.
      await page.setWindowSize({ width: 1600, height: 800 });
      await page.expectRow(controls);
    })
  );

  test(
    'Measurement ghost does not add tab stops',
    setup('flex', false, async page => {
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
    setup('flex', true, async page => {
      await page.selectWidth('300');
      // The group fits its clipping container: the action button stays within it.
      await page.waitForAssertion(async () => {
        const container = await page.getBoundingBox(resizableContainerSelector);
        const actionButton = await page.getBoundingBox(group.findActionButton()!.toSelector());
        expect(actionButton.right).toBeLessThanOrEqual(container.right);
      });
    })
  );

  // The action button must be counted on the row: at a width where the controls' own
  // single row still fits but the controls + button do not, the group must STACK rather
  // than keep the row and force-compress the controls by ~1 button-width.
  //
  // `thresholdWidth` sits between the two stack points: the no-button group stacks only
  // below ~818px, while the with-button group stacks below ~851px once the ~34px button
  // (minus its 1px overlap seam) no longer fits beside the controls.
  const thresholdWidth = 840;

  test(
    `A control group without an action button still rows at ${thresholdWidth}px`,
    setupWidth(thresholdWidth, false, async page => {
      await page.expectRow(controls);
    })
  );

  test(
    `A control group with an action button stacks at ${thresholdWidth}px because the button is accounted for`,
    setupWidth(thresholdWidth, true, async page => {
      await page.expectStacked(controls);
    })
  );
});
