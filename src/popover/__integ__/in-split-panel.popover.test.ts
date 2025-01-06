// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';

import styles from '../../../lib/components/popover/styles.selectors.js';

const wrapper = createWrapper();
const splitPanel = wrapper.findSplitPanel();
const splitPanelSelector = splitPanel.toSelector();
const popoverContainerSelector = wrapper.findPopover().findByClassName(styles.container).toSelector();

const setupTest = (testFn: (page: BasePageObject) => Promise<void>) =>
  useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('#/light/app-layout/with-popover-in-split-panel');
    await testFn(page);
  });

describe('Popover does not overflow split panel', () => {
  describe('Regular popovers', () => {
    describe.each(['top', 'right', 'bottom', 'left'])('popover position: %s', popoverPosition => {
      test.each([
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
        { row: 2, column: 3 },
        { row: 3, column: 1 },
        { row: 3, column: 2 },
        { row: 3, column: 3 },
      ])('trigger position: %s', ({ row, column }) =>
        setupTest(async page => {
          await page.click(
            wrapper
              .findSegmentedControl('[data-testid="position-control"]')
              .findSegmentById(popoverPosition)
              .toSelector()
          );
          await page.click(`[data-testid="popover-${row}-${column}"]`);
          await expectPopoverWithinSplitPanelBoundaries(page);
        })()
      );
    });
  });
  test(
    'Chart popover',
    setupTest(async page => {
      await page.click(
        wrapper.findSegmentedControl('[data-testid="content-control"]').findSegmentById('chart').toSelector()
      );
      await page.hoverElement(wrapper.findBarChart().findBarGroups().get(1).toSelector());
      await expectPopoverWithinSplitPanelBoundaries(page);
    })
  );
});

async function expectPopoverWithinSplitPanelBoundaries(page: BasePageObject) {
  const splitPanelPosition = await page.getBoundingBox(splitPanelSelector);
  const popoverContainerPosition = await page.getBoundingBox(popoverContainerSelector);
  expect(popoverContainerPosition.left).toBeGreaterThanOrEqual(splitPanelPosition.left);
  expect(popoverContainerPosition.top).toBeGreaterThanOrEqual(splitPanelPosition.top);
  expect(popoverContainerPosition.right).toBeLessThanOrEqual(splitPanelPosition.right);
  expect(popoverContainerPosition.bottom).toBeLessThanOrEqual(splitPanelPosition.bottom);
}
