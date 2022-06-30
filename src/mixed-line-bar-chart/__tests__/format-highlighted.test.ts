// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import formatHighlighted from '../../../lib/components/mixed-line-bar-chart/format-highlighted';

import { barSeries, barSeries2, lineSeries1, lineSeries3, thresholdSeries } from './common';

function createInternalSeries<T>(externalSeries: readonly MixedLineBarChartProps.ChartSeries<T>[]) {
  return externalSeries.map((series, index) => ({ series, index, color: '' }));
}

describe('formatHighlighted', () => {
  it('formats position values', () => {
    const formatted = formatHighlighted(1, []);

    expect(formatted.position).toBe('1');
  });

  it('formats threshold series details', () => {
    const formatted = formatHighlighted(1, createInternalSeries([thresholdSeries]));

    expect(formatted.details).toEqual([{ key: 'Threshold 1', value: 8, markerType: 'dashed', color: '' }]);
  });

  it('formats line series details', () => {
    const formatted = formatHighlighted(1, createInternalSeries([lineSeries1]));

    expect(formatted.details).toEqual([{ key: 'Line Series 1', value: 8, markerType: 'line', color: '' }]);
  });

  it('formats bar series details', () => {
    const formatted = formatHighlighted('Apples', createInternalSeries([barSeries]));

    expect(formatted.details).toEqual([{ key: 'Bar Series 1', value: 52, markerType: 'rectangle', color: '' }]);
  });

  it('formats mixed series details', () => {
    const formatted = formatHighlighted('Potatoes', createInternalSeries([lineSeries3, barSeries, thresholdSeries]));

    expect(formatted.details).toEqual([
      { key: 'Line Series 3', value: 7, markerType: 'line', color: '' },
      { key: 'Bar Series 1', value: 77, markerType: 'rectangle', color: '' },
      { key: 'Threshold 1', value: 8, markerType: 'dashed', color: '' },
    ]);
  });

  it('does not include missing y values', () => {
    const formatted = formatHighlighted('Apples', createInternalSeries([barSeries, barSeries2, thresholdSeries]));

    expect(formatted.details).toEqual([
      { key: 'Bar Series 1', value: 52, markerType: 'rectangle', color: '' },
      { key: 'Threshold 1', value: 8, markerType: 'dashed', color: '' },
    ]);
  });

  it('uses xTickFormatter when available', () => {
    const formatted = formatHighlighted(1, [], value => 60 * value + 's');

    expect(formatted.position).toBe('60s');
  });

  it('uses valueFormatter when available', () => {
    const formatted = formatHighlighted(
      'Potatoes',
      createInternalSeries([
        { ...barSeries, valueFormatter: (y: number, x: string) => x.toUpperCase() + y },
        { ...thresholdSeries, valueFormatter: (y: number) => y.toFixed(2) },
      ])
    );
    expect(formatted.details).toEqual([
      { key: 'Bar Series 1', value: 'POTATOES77', markerType: 'rectangle', color: '' },
      { key: 'Threshold 1', value: '8.00', markerType: 'dashed', color: '' },
    ]);
  });
});
