// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

class DetailPopoverPage extends BasePageObject {
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
      // We need to use `page.buttonDownOnElement` instead of `page.click` because the ancestor SVG element
      // intercepts the click and this is seen by Webdriver as an error and thrown as such, although it works for us
      // (the component manages the event accordingly as coming from the corresponding bar group).
      return this.buttonDownOnElement(barGroup);
    }
  }
}

describe('Detail popover series content keeps expanded state independently for every datum', () => {
  test.each(['hover', 'click'])('on %s', interaction =>
    useBrowser(async browser => {
      const page = new DetailPopoverPage(browser);
      await browser.url('#/light/mixed-line-bar-chart/drilldown?expandableSubItems=true');

      const textUnderFirstExpandableSection = 'AWS Config';
      const textUnderSecondExpandableSection = 'Amazon Elastic Container Service';

      await page.setWindowSize({ width: 900, height: 800 });

      // Move to first group
      await page.navigateToDatum(1, interaction);
      await expect(page.getPopoverHeaderText()).resolves.toContain('Apr 2023');
      await expect(page.getKeyValuePairsText()).resolves.not.toContain(textUnderFirstExpandableSection);
      // The text under the second expandable section should never be visible, we never expand it.
      await expect(page.getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);

      // Expand internal expandable section in first group
      await page.click(
        page.wrapper.findDetailPopover().findContent().findExpandableSection().findExpandButton().toSelector()
      );
      await expect(page.getKeyValuePairsText()).resolves.toContain(textUnderFirstExpandableSection);
      await expect(page.getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);

      // Move to fourth group and make sure its expandable section is not expanded.
      await page.navigateToDatum(4, interaction);
      await expect(page.getPopoverHeaderText()).resolves.toContain('Jul 2023');
      await expect(page.getKeyValuePairsText()).resolves.not.toContain(textUnderFirstExpandableSection);
      await expect(page.getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);

      // Move back to first group and make sure that the previously expanded item remains expanded.
      await page.navigateToDatum(1, interaction);
      await expect(page.getPopoverHeaderText()).resolves.toContain('Apr 2023');
      await expect(page.getKeyValuePairsText()).resolves.toContain(textUnderFirstExpandableSection);
      await expect(page.getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);
    })()
  );
});
