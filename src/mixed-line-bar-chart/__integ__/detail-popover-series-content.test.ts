// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { MixedChartPage } from './common';

describe('Detail popover series content keeps expanded state independently for every datum', () => {
  test.each(['hover', 'click'])('on %s', interaction =>
    useBrowser(async browser => {
      const page = new MixedChartPage(browser);
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
