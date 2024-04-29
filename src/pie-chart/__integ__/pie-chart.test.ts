// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper, { PieChartWrapper } from '../../../lib/components/test-utils/selectors';
import chartPlotStyles from '../../../lib/components/internal/components/chart-plot/styles.selectors.js';

class PieChartPageObject extends BasePageObject {
  constructor(
    browser: ConstructorParameters<typeof BasePageObject>[0],
    protected wrapper: PieChartWrapper
  ) {
    super(browser);
  }

  async openFilter() {
    await this.click(this.wrapper.findDefaultFilter().findTrigger().toSelector());
    await this.waitForVisible(this.wrapper.findDefaultFilter().findDropdown().findOpenDropdown().toSelector());
  }
}

const createSetupTest = (wrapper: PieChartWrapper) => (testFn: (page: PieChartPageObject) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new PieChartPageObject(browser, wrapper);
    await browser.url('#/light/pie-chart/test');
    await testFn(page);
  });
};

const pieWrapper = createWrapper().findPieChart('#pie-chart');
const highlightedSegmentSelector = pieWrapper.findHighlightedSegment().toSelector();
const detailsPopoverSelector = pieWrapper.findDetailPopover().toSelector();
const detailsDismissSelector = pieWrapper.findDetailPopover().findDismissButton().toSelector();
const filterWrapper = pieWrapper.findDefaultFilter();
const legendWrapper = pieWrapper.findLegend();

const setupTest = createSetupTest(pieWrapper);

describe('Segments', () => {
  test(
    'can be highlighted with mouse hover',
    setupTest(async page => {
      await page.hoverElement(pieWrapper.findSegments().get(1).toSelector());
      await expect(page.getText(pieWrapper.findHighlightedSegmentLabel().toSelector())).resolves.toContain('Potatoes');
    })
  );

  test(
    'can be highlighted with keyboard',
    setupTest(async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);
      await expect(page.getText(pieWrapper.findHighlightedSegmentLabel().toSelector())).resolves.toContain('Potatoes');
    })
  );

  test(
    'segments can be navigated with arrow keys',
    setupTest(async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);
      // Now focused on the first segment
      await page.waitForVisible(highlightedSegmentSelector);
      await page.keys(['ArrowRight']);

      // Should now be on the second segment
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Chocolate');

      // Can go backwards
      await page.keys(['ArrowLeft']);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Potatoes');

      // Wraps back to the first segment
      // The keystrokes need to be separate or the component doesn't catch up
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Potatoes');

      // Goes backwards to the last segment
      await page.keys(['ArrowLeft']);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Oranges');
    })
  );

  test(
    'tabbing out of the chart removes all highlights',
    setupTest(async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);
      // Now focused on the first segment
      await page.waitForVisible(highlightedSegmentSelector);

      // Tab out of the chart (including the action in the popover) and out of the legend
      await page.keys(['Tab', 'Tab', 'Tab']);
      await expect(page.isDisplayed(highlightedSegmentSelector)).resolves.toBe(false);
    })
  );

  test(
    'tabbing from the popover back to the chart keeps the highlights',
    setupTest(async page => {
      const buttonSelector = pieWrapper.findDetailPopover().findContent().findButton().toSelector();
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);

      // First segment is highlighted
      await page.waitForVisible(highlightedSegmentSelector);
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.isFocused(buttonSelector)).resolves.toBe(false);

      // Tab into the popover
      await page.keys(['Tab']);
      await expect(page.isFocused(buttonSelector)).resolves.toBe(true);

      // Tab back into the chart
      await page.keys(['Shift', 'Tab', 'Shift']);
      await expect(page.isFocused(buttonSelector)).resolves.toBe(false);

      // First group is still highlighted
      await page.waitForVisible(detailsPopoverSelector);
    })
  );

  test(
    'clicking outside of the chart removes all highlights for pinned element',
    setupTest(async page => {
      await page.click(pieWrapper.findSegments().get(2).toSelector());
      await expect(page.getText(pieWrapper.findHighlightedSegmentLabel().toSelector())).resolves.toContain('Chocolate');
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.isDisplayed(detailsDismissSelector)).resolves.toBe(true);

      await page.click('#focus-target');
      await expect(page.isDisplayed(highlightedSegmentSelector)).resolves.toBe(false);
    })
  );
});

describe('Filter', () => {
  test(
    'can filter out segments',
    setupTest(async page => {
      await expect(page.getElementsCount(pieWrapper.findSegments().toSelector())).resolves.toBe(4);
      await expect(page.getElementsCount(legendWrapper.findItems().toSelector())).resolves.toBe(4);

      // Deselect the first and third segments
      await page.openFilter();
      await page.click(filterWrapper.findDropdown().findOption(3).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(1).toSelector());
      await page.keys(['Escape']);

      await expect(page.getElementsCount(pieWrapper.findSegments().toSelector())).resolves.toBe(2);
      await expect(page.getElementsCount(legendWrapper.findItems().toSelector())).resolves.toBe(2);
      await expect(page.getText(pieWrapper.findSegmentLabels().get(1).toSelector())).resolves.toBe('Chocolate');
      await expect(page.getText(pieWrapper.findSegmentLabels().get(2).toSelector())).resolves.toBe('Oranges');
    })
  );

  test(
    'maintains series order',
    setupTest(async page => {
      // Filter out two segments and then re-enable them in reverse order
      await page.openFilter();
      await page.click(filterWrapper.findDropdown().findOption(3).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(1).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(1).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(3).toSelector());
      await page.keys(['Escape']);

      await expect(page.getElementsCount(pieWrapper.findSegments().toSelector())).resolves.toBe(4);
      await expect(page.getElementsCount(legendWrapper.findItems().toSelector())).resolves.toBe(4);
      await expect(page.getText(pieWrapper.findSegmentLabels().get(1).toSelector())).resolves.toContain('Potatoes');
      await expect(page.getText(pieWrapper.findSegmentLabels().get(2).toSelector())).resolves.toBe('Chocolate');
      await expect(page.getText(pieWrapper.findSegmentLabels().get(3).toSelector())).resolves.toBe('Apples');
      await expect(page.getText(pieWrapper.findSegmentLabels().get(4).toSelector())).resolves.toBe('Oranges');
    })
  );
});

describe('Legend', () => {
  test(
    'can be controlled with mouse',
    setupTest(async page => {
      // Hover over second segment in the legend
      await page.elementScrollTo(legendWrapper.findItems().get(2).toSelector(), { top: 0, left: 0 });
      await page.hoverElement(legendWrapper.findItems().get(2).toSelector());

      await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).resolves.toBe('Chocolate');
      await expect(page.getText(pieWrapper.findHighlightedSegmentLabel().toSelector())).resolves.toBe('Chocolate');
    })
  );

  test(
    'can be controlled with keyboard',
    setupTest(async page => {
      await page.click('#focus-target');

      // Tab to first legend item
      await page.keys(['Tab', 'Tab', 'Tab']);
      await expect(page.getText(pieWrapper.findHighlightedSegmentLabel().toSelector())).resolves.toContain('Potatoes');
      await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).resolves.toBe('Potatoes');

      // Move to third item
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await expect(page.getText(pieWrapper.findHighlightedSegmentLabel().toSelector())).resolves.toBe('Apples');
      await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).resolves.toBe('Apples');
    })
  );

  test(
    'highlighted legend elements should be not be highlighted when user hovers away',
    setupTest(async page => {
      // Hover over second segment in the legend
      await page.elementScrollTo(legendWrapper.findItems().get(2).toSelector(), { top: 0, left: 0 });
      await page.hoverElement(legendWrapper.findItems().get(2).toSelector());

      // Verify that no legend is highlighted
      await page.hoverElement(pieWrapper.findFilterContainer().toSelector());
      expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).rejects.toThrow();
    })
  );
});

describe('Detail popover', () => {
  test(
    'shown when focusing a segment with mouse',
    setupTest(async page => {
      await page.hoverElement(pieWrapper.findSegments().get(1).toSelector());
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Potatoes');
    })
  );

  test(
    'shown when focusing a segment with keyboard',
    setupTest(async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Potatoes');
    })
  );

  test(
    'not shown when using the legend',
    setupTest(async page => {
      await page.hoverElement(legendWrapper.findItems().get(1).toSelector());
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'not shown when setting highlighted segment via API',
    setupTest(async page => {
      const secondPieWrapper = createWrapper().findPieChart('#pie-chart-2');

      // Hovering over a segment in the first chart causes the same segment to be highlighted in the second chart
      await page.hoverElement(pieWrapper.findSegments().get(1).toSelector());
      await page.waitForVisible(detailsPopoverSelector);

      // For the second chart, the highlight is set programmatically and should therefore not show any popover
      await page.waitForVisible(secondPieWrapper.findHighlightedSegment().toSelector());
      await expect(page.isDisplayed(secondPieWrapper.findDetailPopover().toSelector())).resolves.toBe(false);
    })
  );

  test(
    'can be pinned and unpinned with mouse',
    setupTest(async page => {
      // Show and pin the popover by clicking
      await page.click(pieWrapper.findSegments().get(2).toSelector());
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Chocolate');
      await expect(page.isDisplayed(detailsDismissSelector)).resolves.toBe(true);
      await page.waitForAssertion(() => expect(page.isFocused(detailsDismissSelector)).resolves.toBe(true));

      // Unpin by clicking the dismiss button
      await page.click(detailsDismissSelector);
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'can be pinned and unpinned with mouse by clicking on the segment again',
    setupTest(async page => {
      // Show and pin the popover by clicking
      await page.click(pieWrapper.findSegments().get(2).toSelector());
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Chocolate');

      // Unpin by clicking the segment again
      await page.click(pieWrapper.findSegments().get(2).toSelector());
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'can be pinned and unpinned with keyboard',
    setupTest(async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);
      await page.keys(['ArrowRight']);

      // Show and pin the popover by pressing enter
      await page.keys(['Enter']);
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Chocolate');

      // Unpin by pressing the dismiss button
      await page.keys(['Enter']);
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'can be dismissed by clicking somewhere else on the chart',
    setupTest(async page => {
      // Show and pin the popover by clicking
      await page.click(pieWrapper.findSegments().get(2).toSelector());
      await page.waitForVisible(detailsPopoverSelector);

      // Unpin by clicking somewhere else in the chart component
      await page.click(pieWrapper.findLegend().toSelector());
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'can be dismissed by clicking somewhere else on the page',
    setupTest(async page => {
      // Show and pin the popover by clicking
      await page.click(pieWrapper.findSegments().get(2).toSelector());
      await page.waitForVisible(detailsPopoverSelector);

      // Unpin by clicking outside the chart component
      await page.click('#focus-target');
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'can be dismissed after hovering on the segment by pressing Escape',
    setupTest(async page => {
      await page.hoverElement(pieWrapper.findSegments().get(1).toSelector());
      await page.waitForVisible(detailsPopoverSelector);
      await page.keys(['Escape']);
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'can be dismissed after navigating to the segment with keyboard by pressing Escape',
    setupTest(async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);
      await page.waitForVisible(detailsPopoverSelector);
      await page.keys(['Escape']);
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'can be dismissed by moving focus away',
    setupTest(async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'Enter']);
      await page.waitForVisible(detailsPopoverSelector);
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Potatoes');
      await page.keys(['Tab']);
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(true);
      await page.keys(['Tab']);
      await expect(page.isDisplayed(detailsPopoverSelector)).resolves.toBe(false);
    })
  );

  test(
    'allow mouse to enter popover on hover',
    setupTest(async page => {
      await page.hoverElement(pieWrapper.findSegments().get(3).toSelector());
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Apples');

      await page.hoverElement(pieWrapper.findDetailPopover().findHeader().toSelector());
      await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Apples');
    })
  );
});

test(
  'highlights the clicked segment when there is a pinned segment',
  setupTest(async page => {
    // Show and pin the popover by clicking
    await page.click(pieWrapper.findSegments().get(2).toSelector());
    await page.waitForVisible(detailsPopoverSelector);
    await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Chocolate');

    await page.click(pieWrapper.findSegments().get(3).toSelector());
    await expect(page.getText(detailsPopoverSelector)).resolves.toContain('Apples');
    await expect(page.getText(pieWrapper.findHighlightedSegmentLabel().toSelector())).resolves.toBe('Apples');
  })
);
describe('Focus outline', () => {
  const focusOutlineSelector = `.${chartPlotStyles['focus-outline']}`;

  test(
    'is only visible when using keyboard navigation',
    setupTest(async page => {
      // Not visible by default
      await expect(page.isDisplayed(focusOutlineSelector)).resolves.toBe(false);

      // Not visible when using the mouse
      await page.hoverElement(pieWrapper.findSegments().get(1).toSelector());
      await expect(page.isDisplayed(focusOutlineSelector)).resolves.toBe(false);

      // Visible when using the keyboard
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab']);
      await expect(page.isDisplayed(focusOutlineSelector)).resolves.toBe(true);
    })
  );
});

test(
  'Legend selection corresponds clicked segment',
  setupTest(async page => {
    // Show and pin the popover by clicking
    await page.click(pieWrapper.findSegments().get(2).toSelector());
    await page.waitForVisible(detailsPopoverSelector);

    await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).resolves.toBe('Chocolate');
  })
);
