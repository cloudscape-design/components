// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { setupTest } from './common';
import createWrapper from '../../../lib/components/test-utils/selectors';

describe('Detail popover series content', () => {
  test(
    'closes all expandable sub-items every time a different bar is hovered',
    setupTest('#/light/mixed-line-bar-chart/drilldown?expandableSubItems=true', async page => {
      const collapsedItemText = 'AWS Key Management Service';
      const wrapper = createWrapper().findMixedLineBarChart();

      const getHeaderText = () => page.getText(wrapper.findDetailPopover().findHeader().toSelector());
      const getKeyValuePairsText = async () =>
        (await page.getElementsText(wrapper.findDetailPopover().findSeries().toSelector())).join('\n');

      page.setWindowSize({ width: 1000, height: 800 });

      // Hover over second group
      await page.hoverElement(wrapper.findBarGroups().get(2).toSelector());
      await expect(getHeaderText()).resolves.toContain('May 2023');
      await expect(getKeyValuePairsText()).resolves.not.toContain(collapsedItemText);

      // Expand internal expandable section
      await page.click(
        wrapper.findDetailPopover().findContent().findExpandableSection().findExpandButton().toSelector()
      );
      await expect(getKeyValuePairsText()).resolves.toContain(collapsedItemText);

      // Move mouse over fifth group.
      // Since this group is partially covered by the previous popover, a popover is shown at all times.
      // This assertion makes sure that the popover state is not preserved unintentionally because of this.
      await page.hoverElement(wrapper.findBarGroups().get(5).toSelector());
      await expect(getHeaderText()).resolves.toContain('Aug 2023');
      await expect(getKeyValuePairsText()).resolves.not.toContain(collapsedItemText);
    })
  );
});
