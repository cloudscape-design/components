// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper, { BarChartWrapper, MixedLineBarChartWrapper } from '../../../lib/components/test-utils/selectors';
import chartPlotStyles from '../../../lib/components/internal/components/chart-plot/styles.selectors.js';
import mixedChartStyles from '../../../lib/components/mixed-line-bar-chart/styles.selectors.js';
import { setupTest } from './common';
import { setupPopoverPositionTest } from './popover-position-page';

const chartWrapper = createWrapper().findMixedLineBarChart('#chart');
const groupedBarWrapper = new BarChartWrapper('#chart-grouped');
const stackedBarWrapper = new BarChartWrapper('#chart-stacked');
const horizontalBarWrapper = new BarChartWrapper('#chart-horizontal');
const computedDomainChartWrapper = new BarChartWrapper('#chart-no-domain');

const popoverHeaderSelector = (wrapper: MixedLineBarChartWrapper = chartWrapper) =>
  wrapper.findDetailPopover().findHeader().toSelector();
const popoverContentSelector = (wrapper: MixedLineBarChartWrapper = chartWrapper) =>
  wrapper.findDetailPopover().findContent().toSelector();
const popoverDismissSelector = (wrapper: MixedLineBarChartWrapper = chartWrapper) =>
  wrapper.findDetailPopover().findDismissButton().toSelector();
const highlightedSeriesSelector = (wrapper: MixedLineBarChartWrapper = chartWrapper) =>
  wrapper.findHighlightedSeries().toSelector();
const seriesSVGSelector = (wrapper: MixedLineBarChartWrapper = chartWrapper) =>
  wrapper.find(`.${chartPlotStyles.root}`).toSelector();
const dimmedElementsSelector = (wrapper: MixedLineBarChartWrapper = chartWrapper) =>
  wrapper.findAll(`.${mixedChartStyles['series--dimmed']}`).toSelector();
const filterWrapper = chartWrapper.findDefaultFilter();
const legendWrapper = chartWrapper.findLegend();

describe('Legend', () => {
  test(
    'can be controlled with mouse',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      // Scroll down to get access to the legend
      await page.windowScrollTo({ top: 200 });

      // Hover over first segment in the legend
      await page.hoverElement(legendWrapper.findItems().get(1).toSelector());

      await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).resolves.toBe('Happiness');
      await expect(page.getElementAttribute(highlightedSeriesSelector(), 'aria-label')).resolves.toEqual('Happiness');
    })
  );

  test(
    'can be controlled with keyboard',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      await page.click('#focus-target');

      // Tab to first legend item
      await page.keys(['Tab', 'Tab', 'Tab']);
      await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).resolves.toBe('Happiness');
      await expect(page.getElementAttribute(highlightedSeriesSelector(), 'aria-label')).resolves.toEqual('Happiness');

      // Move to third item
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).resolves.toBe('Threshold');
      await expect(page.getElementAttribute(highlightedSeriesSelector(), 'aria-label')).resolves.toEqual('Threshold');
    })
  );

  test(
    'highlighted legend elements should be not be highlighted when user hovers away',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      // Scroll down to get access to the legend
      await page.windowScrollTo({ top: 200 });

      // Hover over first segment in the legend
      await page.hoverElement(legendWrapper.findItems().get(1).toSelector());

      // Verify that no legend is highlighted
      await page.hoverElement(chartWrapper.findFilterContainer().toSelector());
      await expect(page.getText(legendWrapper.findHighlightedItem().toSelector())).rejects.toThrowError();
    })
  );
});

describe('Filter', () => {
  test(
    'can filter out segments',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      await expect(page.getElementsCount(chartWrapper.findSeries().toSelector())).resolves.toBe(3);
      await expect(page.getElementsCount(legendWrapper.findItems().toSelector())).resolves.toBe(3);

      // Open filter
      await page.click(chartWrapper.findDefaultFilter().findTrigger().toSelector());
      await page.waitForVisible(chartWrapper.findDefaultFilter().findDropdown().findOpenDropdown().toSelector());

      // Deselect the first and third segments
      await page.click(filterWrapper.findDropdown().findOption(3).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(1).toSelector());
      await page.keys(['Escape']);

      await expect(page.getElementsCount(chartWrapper.findSeries().toSelector())).resolves.toBe(1);
      await expect(page.getElementsCount(legendWrapper.findItems().toSelector())).resolves.toBe(1);
      await expect(
        page.getElementAttribute(chartWrapper.findSeries().get(1).toSelector(), 'aria-label')
      ).resolves.toEqual('Calories');
    })
  );

  test(
    'maintains series order',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      // Open filter
      await page.click(chartWrapper.findDefaultFilter().findTrigger().toSelector());
      await page.waitForVisible(chartWrapper.findDefaultFilter().findDropdown().findOpenDropdown().toSelector());

      // Filter out two segments and then re-enable them in reverse order
      await page.click(filterWrapper.findDropdown().findOption(3).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(1).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(1).toSelector());
      await page.click(filterWrapper.findDropdown().findOption(3).toSelector());
      await page.keys(['Escape']);

      await expect(page.getElementsCount(chartWrapper.findSeries().toSelector())).resolves.toBe(3);
      await expect(page.getElementsCount(legendWrapper.findItems().toSelector())).resolves.toBe(3);
      await expect(
        page.getElementAttribute(chartWrapper.findSeries().get(1).toSelector(), 'aria-label')
      ).resolves.toEqual('Happiness');
      await expect(
        page.getElementAttribute(chartWrapper.findSeries().get(2).toSelector(), 'aria-label')
      ).resolves.toEqual('Calories');
      await expect(
        page.getElementAttribute(chartWrapper.findSeries().get(3).toSelector(), 'aria-label')
      ).resolves.toEqual('Threshold');
    })
  );
});

describe('Series', () => {
  test(
    'grouped bar chart can be highlighted with keyboard',
    setupTest('#/light/bar-chart/test', async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'ArrowRight']);

      // First group is highlighted
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n77');

      // Move horizontally to the last group
      await page.keys(['ArrowLeft']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Oranges');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n47');

      // Moving down does nothing because there is only one series
      await page.keys(['ArrowDown']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Oranges');

      // Tab to the next chart
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'ArrowRight']);
      await expect(page.getText(popoverHeaderSelector(groupedBarWrapper))).resolves.toContain('Apples');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('John\n5');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('Jane\n2');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('Joe\n3');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('Threshold\n9');

      // Move vertically to the second group
      await page.keys(['ArrowRight']);
      await expect(page.getText(popoverHeaderSelector(groupedBarWrapper))).resolves.toContain('Oranges');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('John\n3');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('Jane\n2');
    })
  );

  test(
    'stacked bar chart can be highlighted with keyboard',
    setupTest('#/light/bar-chart/test', async page => {
      // Scroll down to the other charts
      await page.windowScrollTo({ top: 650 });

      await page.click('#focus-target-2');
      await page.keys(['Tab', 'Tab']);
      await page.keys(['ArrowRight', 'ArrowRight']);

      // Second group is highlighted
      await expect(page.getText(popoverHeaderSelector(stackedBarWrapper))).resolves.toContain('Sep 26, 02:00');
      await expect(page.getText(popoverContentSelector(stackedBarWrapper))).resolves.toContain('Site 1\n374991');
      await expect(page.getText(popoverContentSelector(stackedBarWrapper))).resolves.toContain('Site 2\n432909');
      await expect(page.getText(popoverContentSelector(stackedBarWrapper))).resolves.toContain('Site 6\n99291');

      // Moving vertically does nothing because it's all bars
      await page.keys(['ArrowTop']);
      await expect(page.getText(popoverHeaderSelector(stackedBarWrapper))).resolves.toContain('Sep 26, 02:00');

      // Moving to the next group
      await page.keys(['ArrowRight']);
      await expect(page.getText(popoverHeaderSelector(stackedBarWrapper))).resolves.toContain('Sep 26, 04:00');
      await expect(page.getText(popoverContentSelector(stackedBarWrapper))).resolves.toContain('Site 1\n430357');
    })
  );

  test(
    'horizontal bar chart can be highlighted with keyboard',
    setupTest('#/light/bar-chart/test', async page => {
      // Scroll down to the other charts
      await page.windowScrollTo({ top: 650 });

      await page.click('#focus-target-2');
      await page.keys(['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'ArrowRight']);

      // First group is highlighted
      await expect(page.getText(popoverHeaderSelector(horizontalBarWrapper))).resolves.toContain('Apples');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('John\n5');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('Jane\n2');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('Joe\n3');

      // Move to the last group
      await page.keys(['ArrowLeft']);
      await expect(page.getText(popoverHeaderSelector(horizontalBarWrapper))).resolves.toContain('Bananas');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('John\n2');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('Jane\n1');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('Joe\n2');
    })
  );

  test(
    'mixed bar/line chart can be highlighted with keyboard',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'ArrowRight']);

      // First group is highlighted
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Happiness\n300');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n77');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold\n420');

      // Move horizontally (to a group that has a data gap in the bar series)
      await page.keys(['ArrowRight']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Chocolate');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n546');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold\n420');
      await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Happiness');

      // Moving vertically does nothing because the chart contains bars
      await page.keys(['ArrowDown']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Chocolate');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n546');
      await expect(page.isExisting(highlightedSeriesSelector())).resolves.toBeFalsy();

      // Move right until looping back to the first group
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await page.keys(['ArrowRight']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Happiness\n300');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n77');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold\n420');
    })
  );

  test(
    'clicking outside of the chart removes all highlights for pinned element',
    setupTest('#/light/bar-chart/test', async page => {
      // Click on it to reveal the dismiss button
      await page.hoverElement(chartWrapper.findBarGroups().get(3).toSelector());
      await page.click(chartWrapper.toSelector());
      await expect(page.isDisplayed(dimmedElementsSelector())).resolves.toBe(true);

      await page.click('#focus-target');
      await expect(page.isDisplayed(dimmedElementsSelector())).resolves.toBe(false);
    })
  );
});

describe('Details popover', () => {
  test(
    'shows on hover in bar charts',
    setupTest('#/light/bar-chart/test', async page => {
      // Hover over third group in the first chart
      await page.hoverElement(chartWrapper.findBarGroups().get(3).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Chocolate');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n546');

      // Hover over third group in the second chart
      await page.hoverElement(groupedBarWrapper.findBarGroups().get(3).toSelector());
      await expect(page.getText(popoverHeaderSelector(groupedBarWrapper))).resolves.toContain('Pears');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('John\n4');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('Jane\n3');
      await expect(page.getText(popoverContentSelector(groupedBarWrapper))).resolves.toContain('Threshold\n9');

      // Scroll down to the other charts
      await page.windowScrollTo({ top: 650 });

      // Hover over last group in the third chart
      await page.hoverElement(stackedBarWrapper.findBarGroups().get(5).toSelector());
      await expect(page.getText(popoverHeaderSelector(stackedBarWrapper))).resolves.toContain('Sep 26, 08:00');
      await expect(page.getText(popoverContentSelector(stackedBarWrapper))).resolves.toContain('Site 1\n464442');
      await expect(page.getText(popoverContentSelector(stackedBarWrapper))).resolves.toContain('Site 2\n485630');
      await expect(page.getText(popoverContentSelector(stackedBarWrapper))).resolves.toContain('Site 6\n59321');

      // Hover over second group in the fourth chart
      await page.hoverElement(horizontalBarWrapper.findBarGroups().get(2).toSelector());
      await expect(page.getText(popoverHeaderSelector(horizontalBarWrapper))).resolves.toContain('Oranges');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('John\n3');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('Jane\n2');
      await expect(page.getText(popoverContentSelector(horizontalBarWrapper))).resolves.toContain('Joe\n4');
    })
  );

  test(
    'shows on hover in a mixed line/bar chart',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      // Hover over first group
      await page.hoverElement(chartWrapper.findBarGroups().get(1).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Happiness\n300');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n77');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold\n420');

      // remove hover over the first element to avoid hovering over a popover
      await page.hoverElement('body');

      // Hover over second group
      await page.hoverElement(chartWrapper.findBarGroups().get(2).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Chocolate');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Calories\n546');
      await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold\n420');
      await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Happiness');
    })
  );

  test(
    'can be pinned and unpinned in a bar chart with mouse',
    setupTest('#/light/bar-chart/test', async page => {
      // Hover over third group in the first chart
      await page.hoverElement(chartWrapper.findBarGroups().get(3).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Chocolate');
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);

      // Click on it to reveal the dismiss button
      await page.click(chartWrapper.toSelector());
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(true);
      await page.waitForAssertion(() => expect(page.isFocused(popoverDismissSelector())).resolves.toBe(true));

      // Hovering a different group does not change the popover
      await page.hoverElement(chartWrapper.findBarGroups().get(1).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Chocolate');

      // Click dismiss to unpin
      await page.click(popoverDismissSelector());
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);
      await expect(page.isDisplayed(popoverHeaderSelector())).resolves.toBe(false);
    })
  );

  test(
    'can be pinned and unpinned in a chart with mouse when rendered inside tabs',
    setupTest('#/light/mixed-line-bar-chart/in-tabs', async page => {
      // Hover over third group in the first chart
      await page.hoverElement(chartWrapper.findBarGroups().get(3).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Chocolate');
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);

      // Click on it to reveal the dismiss button
      await page.click(chartWrapper.toSelector());
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(true);
      await page.waitForAssertion(() => expect(page.isFocused(popoverDismissSelector())).resolves.toBe(true));

      // Click inside popover to ensure it remains visible.
      await page.click(popoverContentSelector());
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(true);

      // Ensure the next focus target is the dismiss button.
      await page.keys(['Tab']);
      await page.waitForAssertion(() => expect(page.isFocused(popoverDismissSelector())).resolves.toBe(true));

      // Click dismiss to unpin
      await page.click(popoverDismissSelector());
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);
    })
  );

  test(
    'can be hidden after hover by pressing Escape',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      // Hover over first group
      await page.hoverElement(chartWrapper.findBarGroups().get(1).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');

      // Pressing escape should hide the popover
      await page.keys(['Escape']);
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);
      await expect(page.isDisplayed(popoverHeaderSelector())).resolves.toBe(false);
    })
  );

  test(
    'can be hidden after keyboard navigation by pressing Escape',
    setupTest('#/light/bar-chart/test', async page => {
      // Navigate first group in the first chart
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'ArrowRight']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');

      // Pressing Escape should close the popover
      await page.keys(['Escape']);
      await expect(page.isDisplayed(popoverHeaderSelector())).resolves.toBe(false);
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);
    })
  );

  test(
    'can be hidden by moving focus away',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'ArrowRight']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');
      await page.keys(['Tab']);
      expect(await page.getFocusedElementText()).toBe('Filter by Potatoes');
      await page.keys(['Tab']);
      expect(await page.getFocusedElementText()).toBe('Happiness');
      await expect(page.isDisplayed(popoverContentSelector())).resolves.toBe(false);
    })
  );

  test(
    'can be pinned by clicking on chart background and dismissed by clicking outside chart area in line chart',
    setupTest('#/light/line-chart/test', async page => {
      // Hovers to open popover
      await page.hoverElement(chartWrapper.findChart().toSelector());
      // Clicks background to pin
      await page.click(chartWrapper.findChart().toSelector());
      // Pinned popover
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(true);
      await page.waitForAssertion(() => expect(page.isFocused(popoverDismissSelector())).resolves.toBe(true));

      // Clicking outside the chart area
      await page.click(filterWrapper.findDropdown().toSelector());
      // Popover dismissed
      await expect(page.isDisplayed(popoverContentSelector())).resolves.toBe(false);
    })
  );

  test(
    'can be pinned and unpinned in a bar chart with keyboard',
    setupTest('#/light/bar-chart/test', async page => {
      // Hover over first group in the first chart
      await page.click('#focus-target');
      await page.keys(['Tab', 'Tab', 'ArrowRight']);
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);
      await page.waitForAssertion(() =>
        expect(page.isFocused(chartWrapper.findApplication().toSelector())).resolves.toBe(true)
      );

      // Press enter to reveal the dismiss button
      await page.keys(['Enter']);
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(true);
      await page.waitForAssertion(() => expect(page.isFocused(popoverDismissSelector())).resolves.toBe(true));

      // Press dismiss to unpin
      await page.keys(['Enter']);
      await expect(page.isDisplayed(popoverDismissSelector())).resolves.toBe(false);
      await page.waitForAssertion(() =>
        expect(page.isFocused(chartWrapper.findApplication().toSelector())).resolves.toBe(true)
      );
    })
  );

  describe('keeps the popover position when it resizes due to interacting with the popover itself', () => {
    test.each(['hover', 'click', 'keyboard'])('Interaction type: %s', interactionType =>
      setupPopoverPositionTest(async page => {
        await page.setWindowSize({ width: 900, height: 500 });
        await page.openPopoverOnBarGroup(1, interactionType);
        const popover = page.findDetailPopover();
        expect(page.isDisplayed(popover.toSelector())).resolves.toBe(true);
        const initialRect = await page.getPopoverRect();
        await page.click(popover.findContent().findExpandableSection().toSelector());
        const newRect = await page.getPopoverRect();
        // Verify that the popover actually got bigger after the interaction,
        // but that it didn't change its position nonetheless.
        expect(newRect.height).toBeGreaterThan(initialRect.height);
        expect(newRect.top).toEqual(initialRect.top);
      })()
    );
  });

  test(
    'Allow mouse to enter popover when a group is hovering over a point',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      // Hover over first group
      await page.hoverElement(chartWrapper.findBarGroups().get(1).toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');

      await page.hoverElement(chartWrapper.findDetailPopover().findHeader().toSelector());
      await expect(page.getText(popoverHeaderSelector())).resolves.toContain('Potatoes');
    })
  );
});

describe('Chart container', () => {
  test(
    'Series with computed domain do not overflow',
    setupTest('#/light/mixed-line-bar-chart/test', async page => {
      const seriesSVGBox = await page.getBoundingBox(seriesSVGSelector(computedDomainChartWrapper));

      const numberOfSeries = await page.getElementsCount(computedDomainChartWrapper.findSeries().toSelector());

      for (let i = 0; i < numberOfSeries; i++) {
        const seriesBox = await page.getBoundingBox(
          computedDomainChartWrapper
            .findSeries()
            .get(i + 1)
            .toSelector()
        );

        expect(seriesSVGBox.top).toBeLessThanOrEqual(seriesBox.top);
        expect(seriesSVGBox.right).toBeGreaterThanOrEqual(seriesBox.right);
        expect(seriesSVGBox.bottom).toBeGreaterThanOrEqual(seriesBox.bottom);
        expect(seriesSVGBox.left).toBeLessThanOrEqual(seriesBox.left);
      }
    })
  );
});
