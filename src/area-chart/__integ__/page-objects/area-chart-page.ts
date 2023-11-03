// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper, { AreaChartWrapper } from '../../../../lib/components/test-utils/selectors';
import ChartFilterWrapper from '../../../../lib/components/test-utils/selectors/internal/chart-filter';
import ChartLegendWrapper from '../../../../lib/components/test-utils/selectors/internal/chart-legend';
import seriesDetailStyles from '../../../../lib/components/internal/components/chart-series-details/styles.selectors.js';
import cartesianChartStyles from '../../../../lib/components/internal/components/cartesian-chart/styles.selectors.js';

export default class AreaChartPageObject extends BasePageObject {
  chart: AreaChartWrapper;
  filter: ChartFilterWrapper;
  legend: ChartLegendWrapper;

  constructor(browser: ConstructorParameters<typeof BasePageObject>[0], id: string) {
    super(browser);

    this.chart = createWrapper().findAreaChart(id);
    this.filter = this.chart.findDefaultFilter();
    this.legend = this.chart.findLegend();
  }

  async getSeriesCount() {
    const totalSeries = await this.getElementsCount(this.chart.findSeries().toSelector());
    const totalLegendItems = await this.getElementsCount(this.legend.findItems().toSelector());

    if (totalSeries !== totalLegendItems) {
      throw new Error(`Found ${totalSeries} series but ${totalLegendItems} legend items.`);
    }

    return totalSeries;
  }

  async getSeriesLabel(serialIndex: number) {
    const label = await this.getElementAttribute(this.chart.findSeries().get(serialIndex).toSelector(), 'aria-label');
    return label;
  }

  async getHighlightedSeriesLabel() {
    const selector = this.chart.findHighlightedSeries().toSelector();
    try {
      const label = await this.getElementAttribute(selector, 'aria-label');
      return label;
    } catch (ignore) {
      return null;
    }
  }

  async focusPlot() {
    await this.openFilter();
    await this.keys(['Tab', 'ArrowRight']);
  }

  async openFilter() {
    await this.click(this.filter.findTrigger().toSelector());
    await this.waitForVisible(this.filter.findDropdown().findOpenDropdown().toSelector());
  }

  async toggleFilterOption(serialIndex: number) {
    await this.openFilter();
    await this.click(this.filter.findDropdown().findOption(serialIndex).toSelector());
    await this.keys(['Escape']);
  }

  async focusLegend() {
    await this.openFilter();
    await this.keys(['Tab', 'Tab']);
  }

  async hoverLegendItem(serialIndex: number) {
    await this.hoverElement(this.legend.findItems().get(serialIndex).toSelector());
  }

  async hasPopover() {
    const count = await this.getElementsCount(this.chart.findDetailPopover().toSelector());
    return count === 1;
  }

  async isPopoverPinned() {
    const detailsDismissSelector = this.chart.findDetailPopover().findDismissButton().toSelector();
    const count = await this.getElementsCount(detailsDismissSelector);
    return count === 1 && this.isFocused(detailsDismissSelector);
  }

  async getPopoverTitle() {
    const title = await this.getText(this.chart.findDetailPopover().findHeader().toSelector());
    return title;
  }

  async getPopoverDetail(serialIndex: number) {
    const detailText = await this.getText(
      this.chart
        .findDetailPopover()
        .findContent()
        .findByClassName(seriesDetailStyles.root)
        .findAll('li')
        .get(serialIndex)
        .findByClassName(seriesDetailStyles.key)
        .toSelector()
    );
    return detailText;
  }

  async dismissPopover() {
    await this.click(this.chart.findDetailPopover().findDismissButton().toSelector());
  }

  async getPointOffset(serialIndex: number, totalPoints: number) {
    const leftLabelsSelector = this.chart.findByClassName(cartesianChartStyles['labels-left']).toSelector();
    const chartWidth = (await this.getBoundingBox(this.chart.toSelector())).width;
    const labelsWidth = (await this.getBoundingBox(leftLabelsSelector)).width;
    const distanceBetweenPoints = (chartWidth - labelsWidth) / totalPoints;
    return labelsWidth + distanceBetweenPoints * serialIndex;
  }

  getPopover() {
    return this.chart.findDetailPopover();
  }
}
