// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { matchesX, calculateOffsetMaps } from '../../../lib/components/mixed-line-bar-chart/utils';

import { barSeries, barSeries2 } from './common';

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
      { positiveOffsets: new Map(), negativeOffsets: new Map() },
      {
        positiveOffsets: new Map([
          ['Potatoes', 77],
          ['Chocolate', 546],
          ['Apples', 52],
          ['Oranges', 47],
        ]),
        negativeOffsets: new Map(),
      },
      {
        positiveOffsets: new Map([
          ['Potatoes', 87],
          ['Chocolate', 566],
          ['Apples', 52],
          ['Oranges', 97],
        ]),
        negativeOffsets: new Map(),
      },
    ]);
  });

  test('with timeseries data', () => {
    const date = new Date('1995-12-17T03:24:00');
    const data = [[{ x: date, y: 1 }], [{ x: date, y: 2 }], [{ x: date, y: 3 }]];

    const actual = calculateOffsetMaps(data);

    expect(actual).toEqual([
      { positiveOffsets: new Map(), negativeOffsets: new Map() },
      {
        positiveOffsets: new Map([[date.getTime(), 1]]),
        negativeOffsets: new Map(),
      },
      {
        positiveOffsets: new Map([[date.getTime(), 3]]),
        negativeOffsets: new Map(),
      },
    ]);
  });

  test('with number data', () => {
    const data = [[{ x: 1, y: 1 }], [{ x: 1, y: 2 }], [{ x: 1, y: 3 }]];

    const actual = calculateOffsetMaps(data);

    expect(actual).toEqual([
      { positiveOffsets: new Map(), negativeOffsets: new Map() },
      {
        positiveOffsets: new Map([[1, 1]]),
        negativeOffsets: new Map(),
      },
      {
        positiveOffsets: new Map([[1, 3]]),
        negativeOffsets: new Map(),
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
      { positiveOffsets: new Map(), negativeOffsets: new Map() },
      {
        positiveOffsets: new Map([[2, 3]]),
        negativeOffsets: new Map([
          [1, -1],
          [3, -4],
        ]),
      },
      {
        positiveOffsets: new Map([
          [1, 2],
          [2, 3],
        ]),
        negativeOffsets: new Map([
          [1, -1],
          [2, -3],
          [3, -8],
        ]),
      },
    ]);
  });
});
