// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { matchesX, calculateStackedBarValues } from '../../../lib/components/mixed-line-bar-chart/utils';
import { createOneSideRoundedRectPath } from '../../../lib/components/mixed-line-bar-chart/create-one-side-rounded-rect-path';

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

describe('calculateStackedBarValues', () => {
  test('without data', () => {
    expect(calculateStackedBarValues([])).toEqual(new Map());
  });

  test('with categorical data', () => {
    const data = [barSeries.data, barSeries2.data, barSeries.data];
    const computed = calculateStackedBarValues(data);
    expect(computed).toEqual(
      new Map([
        [
          'Potatoes',
          new Map([
            [0, 77],
            [1, 77 + 10],
            [2, 77 + 10 + 77],
          ]),
        ],
        [
          'Chocolate',
          new Map([
            [0, 546],
            [1, 546 + 20],
            [2, 546 + 20 + 546],
          ]),
        ],
        [
          'Apples',
          new Map([
            [0, 52],
            [2, 52 + 0 + 52],
          ]),
        ],
        [
          'Oranges',
          new Map([
            [0, 47],
            [1, 47 + 50],
            [2, 47 + 50 + 47],
          ]),
        ],
      ])
    );
  });

  test('with timeseries data', () => {
    const date = new Date('1995-12-17T03:24:00');
    const data = [[{ x: date, y: 1 }], [{ x: date, y: 2 }], [{ x: date, y: 3 }]];
    const computed = calculateStackedBarValues(data);
    expect(computed).toEqual(
      new Map([
        [
          date.getTime(),
          new Map([
            [0, 1],
            [1, 1 + 2],
            [2, 1 + 2 + 3],
          ]),
        ],
      ])
    );
  });

  test('with numeric data', () => {
    const data = [[{ x: 1, y: 1 }], [{ x: 1, y: 2 }], [{ x: 1, y: 3 }]];
    const computed = calculateStackedBarValues(data);
    expect(computed).toEqual(
      new Map([
        [
          1,
          new Map([
            [0, 1],
            [1, 1 + 2],
            [2, 1 + 2 + 3],
          ]),
        ],
      ])
    );
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
    const computed = calculateStackedBarValues(data);
    expect(computed).toEqual(
      new Map([
        [
          1,
          new Map([
            [0, -1],
            [1, 2],
            [2, 2 + 2],
          ]),
        ],
        [
          2,
          new Map([
            [0, 3],
            [1, -3],
            [2, -3 + -1],
          ]),
        ],
        [
          3,
          new Map([
            [0, -4],
            [1, -4 + -4],
            [2, 10],
          ]),
        ],
      ])
    );
  });
});

describe('createOneSideRoundedRectPath', () => {
  test.each(['left', 'right', 'top', 'bottom'] as const)('creates path with rx=0 and side="%s"', side => {
    const path = createOneSideRoundedRectPath({ x: 1, y: 2, width: 3, height: 4 }, 0, side);
    expect(path).toMatchSnapshot();
  });

  test.each(['left', 'right', 'top', 'bottom'] as const)('creates path with rx=4 and side="%s"', side => {
    const path = createOneSideRoundedRectPath({ x: 1, y: 2, width: 3, height: 4 }, 0, side);
    expect(path).toMatchSnapshot();
  });
});
