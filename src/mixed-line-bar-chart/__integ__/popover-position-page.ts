// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findMixedLineBarChart();

class PopoverPositionPage extends BasePageObject {
  findDetailPopover() {
    return wrapper.findDetailPopover();
  }
  async focusCoordinate(index: number, interactionType: string) {
    const selector = wrapper
      .findBarGroups()
      .get(index + 1)
      .toSelector();
    switch (interactionType) {
      case 'hover':
        await this.hoverElement(selector);
        break;
      case 'click':
        await this.buttonDownOnElement(selector);
        break;
      case 'keyboard':
        await this.click('#focus-target');
        await this.keys(['Tab', 'ArrowRight']);
    }
  }
  getPopoverRect() {
    const selector = wrapper.findDetailPopover().findContent().toSelector();
    return this.browser.execute(s => document.querySelector(s)!.getBoundingClientRect(), selector);
  }
}

export function setupPopoverPositionTest(testFn: (page: PopoverPositionPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new PopoverPositionPage(browser);
    await browser.url('#/light/mixed-line-bar-chart/popover-position');
    await testFn(page);
  });
}
