// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setupTest } from './common';
import createWrapper from '../../../lib/components/test-utils/selectors';

describe('Detail popover series content', () => {
  describe('keeps expanded state independently for every datum', () => {
    test.each(['hover', 'click'])('on %s', interaction =>
      setupTest('#/light/mixed-line-bar-chart/drilldown?expandableSubItems=true', async page => {
        const textUnderFirstExpandableSection = 'AWS Config';
        const textUnderSecondExpandableSection = 'Amazon Elastic Container Service';
        const wrapper = createWrapper().findMixedLineBarChart();
        let currentIndex: number | undefined;

        const goToDatum = (index: number, interaction: string) => {
          const barGroup = wrapper.findBarGroups().get(index).toSelector();
          if (interaction === 'hover') {
            return page.hoverElement(barGroup);
          } else {
            // If a popover was pinned, we need to unpin it before pinning another one.
            if (currentIndex) {
              page.click(wrapper.findDetailPopover().findDismissButton().toSelector());
            }
            currentIndex = index;
            // Need to use `page.buttonDownOnElement` instead of `page.click` because the ancestor SVG element
            // intercepts the click and this is seen by Webdriver as an error and thrown as such, although it works for us
            // (the component manages the event accordingly as coming from the corresponding bar group).
            return page.buttonDownOnElement(barGroup);
          }
        };
        const getPopoverHeaderText = () => page.getText(wrapper.findDetailPopover().findHeader().toSelector());
        const getKeyValuePairsText = async () =>
          (await page.getElementsText(wrapper.findDetailPopover().findSeries().toSelector())).join('\n');

        page.setWindowSize({ width: 900, height: 800 });

        // Move to first group
        await goToDatum(1, interaction);
        await expect(getPopoverHeaderText()).resolves.toContain('Apr 2023');
        await expect(getKeyValuePairsText()).resolves.not.toContain(textUnderFirstExpandableSection);
        // The text under the second expandable section should never be visible, we never expand it.
        await expect(getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);

        // Expand internal expandable section in first group
        await page.click(
          wrapper.findDetailPopover().findContent().findExpandableSection().findExpandButton().toSelector()
        );
        await expect(getKeyValuePairsText()).resolves.toContain(textUnderFirstExpandableSection);
        await expect(getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);

        // Move to fourth group and make sure its expandable section is not expanded.
        await goToDatum(4, interaction);
        await expect(getPopoverHeaderText()).resolves.toContain('Jul 2023');
        await expect(getKeyValuePairsText()).resolves.not.toContain(textUnderFirstExpandableSection);
        await expect(getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);

        // Move back to first group and make sure that the previously expanded item remains expanded.
        await goToDatum(1, interaction);
        await expect(getPopoverHeaderText()).resolves.toContain('Apr 2023');
        await expect(getKeyValuePairsText()).resolves.toContain(textUnderFirstExpandableSection);
        await expect(getKeyValuePairsText()).resolves.not.toContain(textUnderSecondExpandableSection);
      })()
    );
  });
});
