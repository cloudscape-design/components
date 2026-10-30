// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import ControlGroupWrapper from '../../../lib/components/test-utils/selectors/control-group';

const wrapperSelector = '[data-testid="control-group-wrapper"]';

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
    await this.waitForJsTimers(50);
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
      // Each control sits below the previous one.
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].top);
      }
    });
  }
}

interface SetupSettings {
  wrapMode?: 'flex' | 'block' | 'none';
  containerWidth?: number;
  withButton?: boolean;
}

function setupTest(settings: SetupSettings, testFn: (page: ControlGroupPage) => Promise<void>) {
  const { wrapMode = 'flex', containerWidth = 1000, withButton = false } = settings;
  return useBrowser(async browser => {
    const page = new ControlGroupPage(browser);
    await page.setWindowSize({ width: 1600, height: 800 });
    const query = new URLSearchParams({
      wrapMode,
      containerWidth: String(containerWidth),
      withButton: String(withButton),
    });
    await browser.url(`#/control-group/responsive?${query.toString()}`);
    await page.waitForVisible(wrapperSelector);
    await testFn(page);
  });
}

describe('Control Group responsiveness', () => {
  (['flex', 'block'] as const).forEach(mode => {
    test(
      `Collapses and re-expands according to the ${mode} container width when \`direction="auto"\``,
      setupTest({ wrapMode: mode }, async page => {
        await page.selectWidth('1000');
        await page.expectRow(controls);
        await page.selectWidth('500');
        await page.expectStacked(controls);
        // Widening must re-expand it, not leave it stuck stacked.
        await page.selectWidth('1000');
        await page.expectRow(controls);
      })
    );
  });

  test(
    'Collapses and re-expands according to the window width when constrained only by the window',
    setupTest({ wrapMode: 'none' }, async page => {
      await page.setWindowSize({ width: 1600, height: 800 });
      await page.expectRow(controls);
      // Headless Chrome will not shrink below ~500px wide.
      await page.setWindowSize({ width: 500, height: 800 });
      await page.expectStacked(controls);
      // Widening must re-expand it, not leave it stuck stacked.
      await page.setWindowSize({ width: 1600, height: 800 });
      await page.expectRow(controls);
    })
  );

  test(
    'Measurement ghost does not add tab stops',
    setupTest({ wrapMode: 'flex' }, async page => {
      await page.selectWidth('1000');
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
      // Focus exits the group rather than entering the measurement ghost.
      await expect(page.isFocused('[data-testid="focus-after"]')).resolves.toBe(true);
    })
  );
});
