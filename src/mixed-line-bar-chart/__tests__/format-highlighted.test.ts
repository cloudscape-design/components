// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import formatHighlighted from '../../../lib/components/mixed-line-bar-chart/format-highlighted';

import { barSeries, barSeries2, lineSeries1, lineSeries3, thresholdSeries, xThresholdSeries1 } from './common';

function createInternalSeries<T>(externalSeries: readonly MixedLineBarChartProps.ChartSeries<T>[]) {
  return externalSeries.map((series, index) => ({ series, index, color: '' }));
}

describe('formatHighlighted', () => {
  it('formats position values', () => {
    const formatted = formatHighlighted({ position: 1, series: [] });

    expect(formatted.position).toBe('1');
  });

  it('formats threshold series details', () => {
    const formatted = formatHighlighted({ position: 1, series: createInternalSeries([thresholdSeries]) });

    expect(formatted.details).toEqual([{ key: 'Threshold 1', value: 8, markerType: 'dashed', color: '' }]);
  });

  it('formats line series details', () => {
    const formatted = formatHighlighted({ position: 1, series: createInternalSeries([lineSeries1]) });

    expect(formatted.details).toEqual([
      { key: 'Line Series 1', value: 8, markerType: 'line', color: '', seriesTitle: 'Line Series 1' },
    ]);
  });

  it('formats bar series details', () => {
    const formatted = formatHighlighted({ position: 'Apples', series: createInternalSeries([barSeries]) });

    expect(formatted.details).toEqual([
      { key: 'Bar Series 1', value: 52, markerType: 'rectangle', color: '', seriesTitle: 'Bar Series 1' },
    ]);
  });

  it('formats mixed series details', () => {
    const formatted = formatHighlighted({
      position: 'Potatoes',
      series: createInternalSeries([lineSeries3, barSeries, thresholdSeries]),
    });

    expect(formatted.details).toEqual([
      { key: 'Line Series 3', value: 7, markerType: 'line', color: '', seriesTitle: 'Line Series 3' },
      { key: 'Bar Series 1', value: 77, markerType: 'rectangle', color: '', seriesTitle: 'Bar Series 1' },
      { key: 'Threshold 1', value: 8, markerType: 'dashed', color: '' },
    ]);
  });

  it('does not include missing y values', () => {
    const formatted = formatHighlighted({
      position: 'Apples',
      series: createInternalSeries([barSeries, barSeries2, thresholdSeries]),
    });

    expect(formatted.details).toEqual([
      { key: 'Bar Series 1', value: 52, markerType: 'rectangle', color: '', seriesTitle: 'Bar Series 1' },
      { key: 'Threshold 1', value: 8, markerType: 'dashed', color: '' },
    ]);
  });

  it('uses xTickFormatter when available', () => {
    const formatted = formatHighlighted({ position: 1, series: [], xTickFormatter: value => 60 * value + 's' });

    expect(formatted.position).toBe('60s');
  });

  it('uses valueFormatter when available', () => {
    const formatted = formatHighlighted({
      position: 'Potatoes',
      series: createInternalSeries([
        { ...barSeries, valueFormatter: (y: number, x: string) => x.toUpperCase() + y },
        { ...thresholdSeries, valueFormatter: (y: number) => y.toFixed(2) },
      ]),
    });
    expect(formatted.details).toEqual([
      { key: 'Bar Series 1', value: 'POTATOES77', markerType: 'rectangle', color: '', seriesTitle: 'Bar Series 1' },
      { key: 'Threshold 1', value: '8.00', markerType: 'dashed', color: '' },
    ]);
  });

  it('includes x-thresholds if x matched', () => {
    const formatted = formatHighlighted({
      position: 3,
      series: createInternalSeries([lineSeries1, xThresholdSeries1]),
    });
    expect(formatted.details).toEqual([
      { key: 'Line Series 1', value: 10, markerType: 'line', color: '', seriesTitle: 'Line Series 1' },
      { key: 'X-Threshold 1', value: '', markerType: 'dashed', color: '' },
    ]);
  });
});
