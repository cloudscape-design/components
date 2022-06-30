// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import {
  computeDomainX,
  computeDomainY,
  matchesX,
  calculateOffsetMaps,
} from '../../../lib/components/mixed-line-bar-chart/utils';

import {
  barSeries,
  barSeries2,
  lineSeries1,
  lineSeries2,
  lineSeries3,
  thresholdSeries,
  stackedDateBarSeries,
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
    const res = computeDomainX(createInternalSeries([thresholdSeries]), 'linear');
    expect(res.length).toBe(0);
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

describe('matchesX', () => {
  test('with numbers', () => {
    expect(matchesX(5, 10)).toBeFalsy();
    expect(matchesX(10, 5)).toBeFalsy();

    expect(matchesX(33, 33)).toBeTruthy();

    expect(matchesX(20, null)).toBeFalsy();
  });

  test('with strings', () => {
    expect(matchesX('test', 'foo')).toBeFalsy();
    expect(matchesX('foo', 'test')).toBeFalsy();

    expect(matchesX('bar', 'bar')).toBeTruthy();

    expect(matchesX('foo', null)).toBeFalsy();
  });

  test('with dates', () => {
    const date1 = new Date(2020, 10, 5);
    const date2 = new Date(2020, 10, 7);

    expect(matchesX(date1, date2)).toBeFalsy();
    expect(matchesX(date2, date1)).toBeFalsy();

    expect(matchesX(date1, date1)).toBeTruthy();
    expect(matchesX(date1, new Date(+date1))).toBeTruthy();

    expect(matchesX(date1, null)).toBeFalsy();
  });
});

describe('calculateOffsetMaps', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('without data', () => {
    expect(calculateOffsetMaps([])).toEqual([]);
  });

  test('with categorical data', () => {
    const data = [barSeries.data, barSeries2.data, barSeries.data];

    const actual = calculateOffsetMaps(data);

    expect(actual).toEqual([
      { positiveOffsets: {}, negativeOffsets: {} },
      { positiveOffsets: { Potatoes: 77, Chocolate: 546, Apples: 52, Oranges: 47 }, negativeOffsets: {} },
      { positiveOffsets: { Potatoes: 87, Chocolate: 566, Apples: 52, Oranges: 97 }, negativeOffsets: {} },
    ]);
  });

  test('with timeseries data', () => {
    const date = new Date('1995-12-17T03:24:00');
    const data = [[{ x: date, y: 1 }], [{ x: date, y: 2 }], [{ x: date, y: 3 }]];

    const actual = calculateOffsetMaps(data);

    expect(actual).toEqual([
      { positiveOffsets: {}, negativeOffsets: {} },
      {
        positiveOffsets: { [date.getTime()]: 1 },
        negativeOffsets: {},
      },
      {
        positiveOffsets: { [date.getTime()]: 3 },
        negativeOffsets: {},
      },
    ]);
  });

  test('with number data', () => {
    const data = [[{ x: 1, y: 1 }], [{ x: 1, y: 2 }], [{ x: 1, y: 3 }]];

    const actual = calculateOffsetMaps(data);

    expect(actual).toEqual([
      { positiveOffsets: {}, negativeOffsets: {} },
      {
        positiveOffsets: { 1: 1 },
        negativeOffsets: {},
      },
      {
        positiveOffsets: { 1: 3 },
        negativeOffsets: {},
      },
    ]);
  });

  test('with mixed positive and negative numbers', () => {
    const data = [
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

    const actual = calculateOffsetMaps(data);

    expect(actual).toEqual([
      { positiveOffsets: {}, negativeOffsets: {} },
      {
        positiveOffsets: { 2: 3 },
        negativeOffsets: { 1: -1, 3: -4 },
      },
      {
        positiveOffsets: { 1: 2, 2: 3 },
        negativeOffsets: { 1: -1, 2: -3, 3: -8 },
      },
    ]);
  });
});
