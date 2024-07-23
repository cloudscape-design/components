// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { computeDomainX, computeDomainY } from '../../../lib/components/mixed-line-bar-chart/domain';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import {
  barSeries,
  barSeries2,
  lineSeries1,
  lineSeries2,
  lineSeries3,
  stackedDateBarSeries,
  thresholdSeries,
  xThresholdSeries1,
  xThresholdSeries2,
} from './common';

function createInternalSeries<T>(externalSeries: readonly MixedLineBarChartProps.ChartSeries<T>[]) {
  return externalSeries.map((series, index) => ({
    series,
    index,
    color: '',
  }));
}

describe('computeDomainX', () => {
  test('on non-categorical scale', () => {
    const [from, to] = computeDomainX(createInternalSeries([lineSeries1, lineSeries2]), 'linear');
    expect(from).toBe(0);
    expect(to).toBe(3);
  });

  test('on categorical scale', () => {
    const domain = computeDomainX(createInternalSeries([lineSeries3, barSeries, thresholdSeries]), 'categorical');
    expect(domain.length).toBe(4);
    expect(domain).toEqual(expect.arrayContaining(['Potatoes', 'Chocolate', 'Apples', 'Oranges']));
  });

  test('ignores threshold', () => {
    const domain = computeDomainX(createInternalSeries([thresholdSeries]), 'linear');
    expect(domain).toHaveLength(0);
  });

  test('x-thresholds are included in x-domain when scale is linear', () => {
    const domain = computeDomainX(createInternalSeries([xThresholdSeries1, xThresholdSeries2]), 'linear');
    expect(domain).toEqual([3, 10]);
  });

  test('x-thresholds are included in x-domain when scale is categorical', () => {
    const domain = computeDomainX(createInternalSeries([xThresholdSeries1, xThresholdSeries2]), 'categorical');
    expect(domain).toEqual([3, 10]);
  });
});

describe('computeDomainY', () => {
  test('on line charts', () => {
    const [from, to] = computeDomainY(createInternalSeries([lineSeries1, lineSeries2]), 'linear', false);
    expect(from).toBe(0);
    expect(to).toBe(12);
  });

  test('includes threshold', () => {
    const [from, to] = computeDomainY(createInternalSeries([barSeries2, thresholdSeries]), 'linear', false);
    expect(from).toBe(0);
    expect(to).toBe(50);
  });

  test('on regular bars', () => {
    const [from, to] = computeDomainY(createInternalSeries([barSeries, barSeries2]), 'linear', false);
    expect(from).toBe(0);
    expect(to).toBe(546);
  });

  test('on stacked bars', () => {
    const [from, to] = computeDomainY(createInternalSeries([barSeries, barSeries2]), 'linear', true);
    expect(from).toBe(0);
    expect(to).toBe(566);
  });

  test('on stacked bars with dates', () => {
    const [from, to] = computeDomainY(createInternalSeries(stackedDateBarSeries), 'linear', true);
    expect(from).toBe(0);
    expect(to).toBe(46);
  });

  test('can go into the negative with line charts', () => {
    const series: MixedLineBarChartProps.DataSeries<number> = {
      type: 'line',
      title: 'Line Series 1',
      data: [
        { x: 0, y: 10 },
        { x: 1, y: -8 },
        { x: 2, y: 12 },
        { x: 3, y: 10 },
      ],
    };

    const [from, to] = computeDomainY(createInternalSeries([series]), 'linear', false);
    expect(from).toBe(-8);
    expect(to).toBe(12);
  });

  test('can be completely negative with line charts', () => {
    const series: MixedLineBarChartProps.DataSeries<number> = {
      type: 'line',
      title: 'Line Series 1',
      data: [
        { x: 0, y: -10 },
        { x: 1, y: -8 },
        { x: 2, y: -12 },
        { x: 3, y: -10 },
      ],
    };

    const [from, to] = computeDomainY(createInternalSeries([series]), 'linear', false);
    expect(from).toBe(-12);
    expect(to).toBe(0);
  });

  test('does not start the series at 0 for log charts', () => {
    const series: MixedLineBarChartProps.DataSeries<number> = {
      type: 'line',
      title: 'Line Series 1',
      data: [
        { x: 0, y: 5 },
        { x: 1, y: 52 },
        { x: 2, y: 100000 },
        { x: 3, y: 5600 },
      ],
    };

    const [from, to] = computeDomainY(createInternalSeries([series]), 'log', false);
    expect(from).toBe(1);
    expect(to).toBe(100000);
  });

  test('can go into the negative with regular bar charts', () => {
    const series: MixedLineBarChartProps.DataSeries<string> = {
      type: 'bar',
      title: 'Bar Series 1',
      data: [
        { x: 'Category 0', y: 10 },
        { x: 'Category 1', y: 8 },
        { x: 'Category 2', y: -12 },
        { x: 'Category 3', y: 10 },
      ],
    };

    const [from, to] = computeDomainY(createInternalSeries([series]), 'linear', false);
    expect(from).toBe(-12);
    expect(to).toBe(10);
  });

  test('supports stacked bars with mixed positive and negative data', () => {
    const mixedData = [
      [
        { x: 1, y: -1 },
        { x: 2, y: 3 },
        { x: 3, y: -4 },
      ],
      [
        { x: 1, y: 2 },
        { x: 2, y: -3 },
        { x: 3, y: -4 },
      ],
      [
        { x: 1, y: 2 },
        { x: 2, y: -1 },
        { x: 3, y: 10 },
      ],
    ];

    const series = mixedData.map(data => ({
      type: 'bar' as const,
      title: 'Stacked bars',
      data,
    }));

    const [from, to] = computeDomainY(createInternalSeries(series), 'linear', true);
    expect(from).toBe(-8);
    expect(to).toBe(10);
  });
});
