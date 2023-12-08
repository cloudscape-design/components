// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../lib/components/test-utils/selectors';

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
        console.log(this.currentIndex, index);
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
}

export function setupTest(url: string, testFn: (page: MixedChartPage) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new MixedChartPage(browser);
    await browser.url(url);
    await testFn(page);
  });
}
