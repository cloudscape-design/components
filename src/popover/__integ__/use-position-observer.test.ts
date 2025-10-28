// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import tooltipStyles from '../../../lib/components/internal/components/tooltip/styles.selectors.js';

const wrapper = createWrapper();
const expandableSectionWrapper = wrapper.findExpandableSection();
const updatePositionPopoverWrapper = wrapper.findByClassName('updatePositionPopover');

const sliderWrapper = wrapper.findSlider();
const sliderTooltipWrapper = wrapper.find(`.${tooltipStyles.root} > *`);

class UsePositionObserverPageObject extends BasePageObject {
  async dragSlider({ x: deltaX, y: deltaY }: { x: number; y: number }) {
    const slider = await this.getBoundingBox(sliderWrapper.findNativeInput().toSelector());
    const currentX = Math.ceil(slider.left);
    const currentY = Math.ceil(slider.top);
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'mouse',
        parameters: { pointerType: 'mouse' },
        actions: [
          { type: 'pointerMove', duration: 0, x: currentX, y: currentY }, // hover on the resizer
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 30 }, // extra delay to allow event listeners to update
          { type: 'pointerMove', duration: 0, x: currentX + deltaX, y: currentY + deltaY },
          { type: 'pause', duration: 30 }, // extra delay to allow event listeners to update
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
  }
}

const setupTest = (testFn: (page: UsePositionObserverPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new UsePositionObserverPageObject(browser);
    await browser.url('#/light/popover/use-position-observer');
    await testFn(page);
  });
};

describe('Use position observer', () => {
  test(
    'Update position popover moves when expandable section is expanded',
    setupTest(async page => {
      await page.waitForVisible(expandableSectionWrapper.toSelector());

      const initialUpdatePopoverPosition = await page.getBoundingBox(updatePositionPopoverWrapper.toSelector());

      // Expand the expandable section
      await page.click(expandableSectionWrapper.toSelector());

      const newUpdatePopoverPosition = await page.getBoundingBox(updatePositionPopoverWrapper.toSelector());

      expect(newUpdatePopoverPosition.top !== initialUpdatePopoverPosition.top).toBe(true);
    })
  );

  test(
    'Tooltip moves when slider is moved',
    setupTest(async page => {
      await page.waitForVisible(sliderWrapper.toSelector());

      await page.hoverElement(sliderWrapper.findNativeInput().toSelector());

      const initialTooltipPosition = await page.getBoundingBox(sliderTooltipWrapper.toSelector());

      // Move the slider
      await page.dragSlider({ x: 50, y: 0 });

      await page.hoverElement(sliderWrapper.findNativeInput().toSelector());

      const updatedTooltipPosition = await page.getBoundingBox(sliderTooltipWrapper.toSelector());

      // Confirm that the tooltip followed the slider thumb
      expect(updatedTooltipPosition.left).not.toEqual(initialTooltipPosition.left);
      expect(updatedTooltipPosition.left).toBeGreaterThan(initialTooltipPosition.left);
    })
  );
});
