// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/selectors';
import { setupTest } from './common';

describe('Popover content is announced as plain text on hover', () => {
  describe.each(['keys', 'values'])('when using links in %s', useLinks => {
    const alwaysVisibleTexts = [
      'Jun 2023',
      'Amazon Simple Storage Service $69.80',
      'Amazon Relational Database Service $35.96',
      'Group 1 $83.31',
      'Group 2 $114.17',
    ];
    const group1SubItemsTexts = ['AWS Config $40.06', 'AWS Key Management Service $43.25'];

    test(
      'without expandable sub-items',
      setupTest(`#/light/mixed-line-bar-chart/drilldown?useLinks=${useLinks}&expandableSubItems=false`, async page => {
        const wrapper = createWrapper().findMixedLineBarChart();
        const bar = wrapper.findBarGroups().get(3).toSelector();
        const getLabel = () => page.getElementAttribute(bar, 'aria-label');
        await page.hoverElement(bar);
        await page.waitForAssertion(async () => {
          const label = await getLabel();
          for (const text of alwaysVisibleTexts) {
            expect(label).toContain(text);
          }
          expect(label).toContain(group1SubItemsTexts.join(', '));
          // Make sure that the text does not contain any unexpected stringified object,
          // which could come from badly handled non-plain text content in the popover.
          expect(label).not.toContain('[object Object]');
        });
      })
    );

    test(
      'with expandable sub-items',
      setupTest(`#/light/mixed-line-bar-chart/drilldown?useLinks=${useLinks}&expandableSubItems=true`, async page => {
        const wrapper = createWrapper().findMixedLineBarChart();
        const bar = wrapper.findBarGroups().get(3).toSelector();
        const getLabel = () => page.getElementAttribute(bar, 'aria-label');
        await page.hoverElement(bar);
        await page.waitForAssertion(async () => {
          const label = await getLabel();
          expect(label).toBe(alwaysVisibleTexts.join(', '));
          // Collapsed sub-items should not be announced
          for (const text of group1SubItemsTexts) {
            expect(label).not.toContain(text);
          }
          expect(label).not.toContain('[object Object]');
        });

        // Expand sub-items
        await page.click(
          wrapper.findDetailPopover().findContent().findExpandableSection().findExpandButton().toSelector()
        );
        // Pin and dismiss the poover,
        // then hover over a different item and come back to hover the initial one.
        // We need to use `page.buttonDownOnElement` instead of `page.click` because the ancestor SVG element
        // intercepts the click and this is seen by Webdriver as an error and thrown as such, although it works for us
        // (the component manages the event accordingly as coming from the corresponding bar group).
        await page.buttonDownOnElement(bar);
        await page.click(wrapper.findDetailPopover().findDismissButton().toSelector());
        await page.hoverElement(wrapper.findBarGroups().get(4).toSelector());
        await page.hoverElement(bar);
        await page.waitForAssertion(async () => {
          const label = await getLabel();
          for (const text of alwaysVisibleTexts) {
            expect(label).toContain(text);
          }
          // Previously collapsed sub-item is now expanded
          expect(label).toContain(group1SubItemsTexts.join(', '));
          expect(label).not.toContain('[object Object]');
        });
      })
    );
  });
});
