// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartModel } from './index';
import { AreaChartProps } from '../interfaces';
import AsyncStore from '../../internal/async-store';

const initialState = Object.freeze({
  highlightedX: null,
  highlightedPoint: null,
  highlightedSeries: null,
  legendSeries: null,
  isPopoverPinned: false,
});

export default class InteractionsStore<T extends AreaChartProps.DataTypes> extends AsyncStore<
  ChartModel.InteractionsState<T>
> {
  series: readonly AreaChartProps.Series<T>[];
  plot: ChartModel.ComputedProps<T>['plot'];

  constructor(series: readonly AreaChartProps.Series<T>[], plot: ChartModel.ComputedProps<T>['plot']) {
    super(initialState);

    this.series = series;
    this.plot = plot;
  }

  highlightPoint(point: ChartModel.PlotPoint<T>) {
    this.set(state => ({
      ...state,
      highlightedX: this.plot.xy[point.index.x],
      highlightedPoint: point,
      highlightedSeries: this.series[point.index.s],
      legendSeries: this.series[point.index.s],
    }));
  }

  highlightX(points: readonly ChartModel.PlotPoint<T>[]) {
    this.set(state => ({
      ...state,
      highlightedX: points,
      highlightedPoint: null,
      highlightedSeries: null,
      legendSeries: null,
    }));
  }

  highlightFirstPoint() {
    this.set(state => {
      const series = state.legendSeries || state.highlightedSeries;
      const firstSeriesPoint = series && this._getFirstSeriesPoint(series);
      const point = state.highlightedPoint || firstSeriesPoint || this.plot.sx[0][0];
      return {
        ...state,
        highlightedX: this.plot.xy[point.index.x],
        highlightedPoint: point,
        highlightedSeries: this.series[point.index.s],
        legendSeries: this.series[point.index.s],
      };
    });
  }

  highlightSeries(s: null | AreaChartProps.Series<T>) {
    this.set(state => ({
      ...state,
      highlightedSeries: s,
      legendSeries: s,
    }));
  }

  clearHighlight() {
    this.set(state => ({
      ...state,
      highlightedX: null,
      highlightedPoint: null,
      highlightedSeries: null,
    }));
  }
  clearHighlightedLegend() {
    this.set(state => ({
      ...state,
      legendSeries: null,
    }));
  }

  clearState() {
    this.set(() => initialState);
  }

  pinPopover() {
    this.set(state => ({ ...state, isPopoverPinned: true }));
  }

  unpinPopover() {
    this.set(state => ({ ...state, isPopoverPinned: false }));
  }

  togglePopoverPin() {
    this.set(state => ({ ...state, isPopoverPinned: !state.isPopoverPinned }));
  }

  _getFirstSeriesPoint(s: AreaChartProps.Series<T>): null | ChartModel.PlotPoint<T> {
    const seriesIndex = this.series.indexOf(s);
    const [firstSeriesPoint] = this.plot.sx[seriesIndex] || [];
    return firstSeriesPoint || null;
  }
}
