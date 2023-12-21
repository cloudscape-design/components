// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BoundingBox } from '../../popover/interfaces';

function getElementCenter(rect: BoundingBox): { x: number; y: number } {
  return {
    x: Math.floor(rect.left + rect.width / 2),
    y: Math.floor(rect.top + rect.height / 2),
  };
}
export class MixedChartPage extends BasePageObject {
  currentIndex: number | undefined;
  wrapper = createWrapper().findMixedLineBarChart();

  constructor(browser: ConstructorParameters<typeof BasePageObject>[0]) {
    super(browser);
  }

  getPopoverHeaderText() {
    return this.getText(this.wrapper.findDetailPopover().findHeader().toSelector());
  }

  async getKeyValuePairsText() {
    return (await this.getElementsText(this.wrapper.findDetailPopover().findSeries().toSelector())).join('\n');
  }

  async navigateToDatum(index: number, interaction: string) {
    const barGroup = this.wrapper.findBarGroups().get(index).toSelector();
    if (interaction === 'hover') {
      return this.hoverElement(barGroup);
    } else {
      // If a popover was pinned, we need to unpin it before pinning another one.
      if (this.currentIndex) {
        await this.click(this.wrapper.findDetailPopover().findDismissButton().toSelector());
      }
      this.currentIndex = index;
      await this.clickBarGroup(barGroup);
    }
  }

  async clickBarGroup(selector: string) {
    // We need to use `page.buttonDownOnElement` and `page.buttonUp` instead of `page.click` because the ancestor SVG element
    // intercepts the click and this is seen by Webdriver as an error and thrown as such, although it works for us
    // (the component manages the event accordingly as coming from the corresponding bar group).
    await this.buttonDownOnElement(selector);
    await this.buttonUp();
  }

  async tapBarGroup(selector: string) {
    await this.touchDownOnelement(selector);
    await this.touchEnd();
    // On a browser, tapping triggers touch and then click events.
    await this.clickBarGroup(selector);
  }

  // Based on buttonDownOneElement, but with touch events instead of click events.
  async touchDownOnelement(selector: string) {
    // Clean up all previous actions before stating a new batch. Without this line Safari emits extra "mouseup" events
    await this.browser.releaseActions();
    const box = await this.getBoundingBox(selector);
    const center = getElementCenter(box);
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'touch',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: center.x, y: center.y },
          { type: 'pointerDown', button: 0 },
          // extra delay to let event listeners to be fired
          { type: 'pause', duration: 10 },
        ],
      },
    ]);
  }

  async touchEnd() {
    await this.browser.performActions([
      {
        type: 'pointer',
        id: 'touch',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerUp', button: 0 },

          // extra delay for Safari to process the event before moving the cursor away
          { type: 'pause', duration: 10 },
          // return cursor back to the corner to avoid hover effects on screenshots
          { type: 'pointerMove', duration: 0, x: 0, y: 0 },
        ],
      },
    ]);
    // make sure all controls are properly released to avoid conflicts with further actions
    await this.browser.releaseActions();
  }
}

export function setupTest(url: string, testFn: (page: MixedChartPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new MixedChartPage(browser);
    await browser.url(url);
    await testFn(page);
  });
}
