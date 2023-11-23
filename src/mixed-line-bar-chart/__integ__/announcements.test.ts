// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/selectors';
import { setupTest } from './common';

describe('Popover content is announced as plain text on hover', () => {
  describe.each(['keys', 'values'])('when using links in %s', useLinks =>
    test.each([false, true])('with expandable sub-items: %s', expandable =>
      setupTest(
        `#/light/mixed-line-bar-chart/drilldown?useLinks=${useLinks}&expandableSubItems=${expandable}`,
        async page => {
          const wrapper = createWrapper().findMixedLineBarChart();
          const bar = wrapper.findBarGroups().get(3).toSelector();
          await page.hoverElement(bar);
          await page.waitForAssertion(async () => {
            const label = await page.getElementAttribute(bar, 'aria-label');
            expect(label).toContain('Jun 2023,');
            expect(label).toContain('Amazon Simple Storage Service $69.80,');
            expect(label).toContain('Group 1 $83.31');
            // Collapsed sub-items should not be announced
            expect(label.includes('AWS Config $40.06,')).toEqual(!expandable);
            expect(label).not.toContain('[object object]');
          });
        }
      )()
    )
  );
});
