// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/selectors';
import { setupTest } from './common';

describe('Popover content is announced as plain text', () => {
  test.each(['keys', 'values'])(`when using links in %s`, (useLinks: string) =>
    setupTest(`#/light/mixed-line-bar-chart/drilldown?useLinks=${useLinks}`, async page => {
      const wrapper = createWrapper().findMixedLineBarChart();
      const bar = wrapper.findBarGroups().get(3).toSelector();
      await page.hoverElement(bar);
      const label = await page.getElementAttribute(bar, 'aria-label');
      expect(label).toContain('Amazon Simple Storage Service');
      expect(label).toContain('$78.45');
      expect(label).not.toContain('[object object]');
    })()
  );
});
