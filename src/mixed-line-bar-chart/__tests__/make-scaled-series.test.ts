// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartScale, NumericChartScale } from '../../../lib/components/internal/components/cartesian-chart/scales';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import makeScaledSeries from '../../../lib/components/mixed-line-bar-chart/make-scaled-series';
import { lineSeries1, lineSeries3, thresholdSeries } from './common';

function createInternalSeries<T>(externalSeries: readonly MixedLineBarChartProps.ChartSeries<T>[]) {
  return externalSeries.map((series, index) => ({ series, index, color: series.color ?? '' }));
}

const xScaleLinear = new ChartScale('linear', [0, 100], [0, 100]);
const xScaleCategorical = new ChartScale('categorical', ['Potatoes', 'Chocolate', 'Apples', 'Oranges'], [0, 100]);
const yScaleLinear = new NumericChartScale('linear', [0, 15], [0, 15], null);

describe('makeScaledSeries', () => {
  it('returns an empty array if no series provided', () => {
    const scaled = makeScaledSeries([], xScaleLinear, yScaleLinear);

    expect(scaled).toHaveLength(0);
  });

  it('scales a single line series with linear scale', () => {
    const scaled = makeScaledSeries(createInternalSeries([lineSeries1]), xScaleLinear, yScaleLinear);

    expect(scaled).toEqual([
      { color: '', datum: { x: 0, y: 10 }, series: lineSeries1, x: 0, y: 10 },
      { color: '', datum: { x: 1, y: 8 }, series: lineSeries1, x: 1, y: 8 },
      { color: '', datum: { x: 2, y: 12 }, series: lineSeries1, x: 2, y: 12 },
      { color: '', datum: { x: 3, y: 10 }, series: lineSeries1, x: 3, y: 10 },
    ]);
  });

  it('scales a single line series with categorical scale', () => {
    const scaled = makeScaledSeries(createInternalSeries([lineSeries3]), xScaleCategorical, yScaleLinear);

    expect(scaled).toEqual([
      { color: '', datum: { x: 'Potatoes', y: 7 }, series: lineSeries3, x: expect.any(Number), y: 7 },
      { color: '', datum: { x: 'Chocolate', y: 5 }, series: lineSeries3, x: expect.any(Number), y: 5 },
      { color: '', datum: { x: 'Apples', y: 9 }, series: lineSeries3, x: expect.any(Number), y: 9 },
      { color: '', datum: { x: 'Oranges', y: 7 }, series: lineSeries3, x: expect.any(Number), y: 7 },
    ]);
  });

  it('scales threshold series', () => {
    const scaled = makeScaledSeries(createInternalSeries<string>([thresholdSeries]), xScaleLinear, yScaleLinear);

    expect(scaled).toEqual([{ color: '', series: thresholdSeries, x: NaN, y: 8 }]);
  });

  it('scales mixed line/threshold series', () => {
    const scaled = makeScaledSeries(createInternalSeries([lineSeries1, thresholdSeries]), xScaleLinear, yScaleLinear);

    expect(scaled).toEqual([
      { color: '', datum: { x: 0, y: 10 }, series: lineSeries1, x: 0, y: 10 },
      { color: '', datum: { x: 0, y: 8 }, series: thresholdSeries, x: 0, y: 8 },
      { color: '', datum: { x: 1, y: 8 }, series: lineSeries1, x: 1, y: 8 },
      { color: '', datum: { x: 1, y: 8 }, series: thresholdSeries, x: 1, y: 8 },
      { color: '', datum: { x: 2, y: 12 }, series: lineSeries1, x: 2, y: 12 },
      { color: '', datum: { x: 2, y: 8 }, series: thresholdSeries, x: 2, y: 8 },
      { color: '', datum: { x: 3, y: 10 }, series: lineSeries1, x: 3, y: 10 },
      { color: '', datum: { x: 3, y: 8 }, series: thresholdSeries, x: 3, y: 8 },
    ]);
  });

  it('sorts scaled points on scaled x value', () => {
    const data = [...lineSeries1.data];
    data[0] = lineSeries1.data[data.length - 1];
    data[data.length - 1] = lineSeries1.data[0];
    const scaled = makeScaledSeries(createInternalSeries([{ ...lineSeries1, data }]), xScaleLinear, yScaleLinear);

    expect(scaled.map(p => p.x)).toEqual([0, 1, 2, 3]);
  });

  it('does not inject x-thresholds if series is defined on the same coordinates', () => {
    const series = createInternalSeries([
      {
        type: 'line',
        title: 'Data',
        data: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ],
      },
      {
        type: 'threshold',
        title: 'X-Threshold 0',
        x: 0,
      },
      {
        type: 'threshold',
        title: 'X-Threshold 1',
        x: 1,
      },
      {
        type: 'threshold',
        title: 'X-Threshold 2',
        x: 2,
      },
    ]);
    const scaled = makeScaledSeries(series, xScaleLinear, yScaleLinear);
    const scaledDataPoints = scaled.filter(p => p.series === series[0].series);

    expect(scaledDataPoints).toEqual([
      { color: '', datum: { x: 0, y: 0 }, series: series[0].series, x: 0, y: 0 },
      { color: '', datum: { x: 1, y: 1 }, series: series[0].series, x: 1, y: 1 },
      { color: '', datum: { x: 2, y: 2 }, series: series[0].series, x: 2, y: 2 },
    ]);
  });

  it('does not inject x-thresholds if thresholds are defined outside series domain', () => {
    const series = createInternalSeries([
      {
        type: 'line',
        title: 'Data',
        data: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ],
      },
      {
        type: 'threshold',
        title: 'X-Threshold before',
        x: -0.1,
      },
      {
        type: 'threshold',
        title: 'X-Threshold after',
        x: 2.1,
      },
    ]);
    const scaled = makeScaledSeries(series, xScaleLinear, yScaleLinear);
    const scaledDataPoints = scaled.filter(p => p.series === series[0].series);

    expect(scaledDataPoints).toEqual([
      { color: '', datum: { x: 0, y: 0 }, series: series[0].series, x: 0, y: 0 },
      { color: '', datum: { x: 1, y: 1 }, series: series[0].series, x: 1, y: 1 },
      { color: '', datum: { x: 2, y: 2 }, series: series[0].series, x: 2, y: 2 },
    ]);
  });

  it('injects x-thresholds if within series but other coordinate', () => {
    const series = createInternalSeries([
      {
        type: 'line',
        title: 'Data',
        color: 'data',
        data: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ],
      },
      {
        type: 'threshold',
        title: 'X-Threshold 0',
        color: 'threshold',
        x: 0.1,
      },
      {
        type: 'threshold',
        title: 'X-Threshold 1',
        color: 'threshold',
        x: 1.1,
      },
    ]);
    const scaled = makeScaledSeries(series, xScaleLinear, yScaleLinear);
    const scaledDataPoints = scaled.filter(p => p.series === series[0].series);

    expect(scaledDataPoints).toEqual([
      { color: 'data', datum: { x: 0, y: 0 }, series: series[0].series, x: 0, y: 0 },
      { color: 'threshold', datum: { x: 0.1, y: NaN }, series: series[0].series, x: 0.1, y: 0.5 },
      { color: 'data', datum: { x: 1, y: 1 }, series: series[0].series, x: 1, y: 1 },
      { color: 'threshold', datum: { x: 1.1, y: NaN }, series: series[0].series, x: 1.1, y: 1.5 },
      { color: 'data', datum: { x: 2, y: 2 }, series: series[0].series, x: 2, y: 2 },
    ]);
  });
});
