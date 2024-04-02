// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartScale, NumericChartScale } from '../../../lib/components/internal/components/cartesian-chart/scales';
import { ChartModel } from '../../../lib/components/area-chart/model';
import {
  computeDomainX,
  computeDomainY,
  computePlotPoints,
  findClosest,
  circleIndex,
  isSeriesValid,
} from '../../../lib/components/area-chart/model/utils';

function getPointIndices(matrix: ChartModel.PlotPoint<number>[][]) {
  const indices = [];

  for (const row of matrix) {
    for (const cell of row) {
      indices.push(cell.index);
    }
  }

  return indices;
}

describe('AreaChart computeDomainX', () => {
  it('returns empty domain if data is empty', () => {
    const domain = computeDomainX([]);
    expect(domain).toHaveLength(0);
  });

  it('returns categorical domain', () => {
    const domain = computeDomainX([
      {
        type: 'area',
        title: 'A',
        data: [
          { x: 'one', y: 1 },
          { x: 'two', y: 2 },
          { x: 'two', y: 2 },
          { x: 'three', y: 3 },
        ],
      },
    ]);
    expect(domain).toEqual(['one', 'two', 'three']);
  });

  it('returns min/max numerical domain', () => {
    const domain = computeDomainX([
      {
        type: 'area',
        title: 'A',
        data: [
          { x: 2, y: 0 },
          { x: 1, y: 0 },
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 3, y: 0 },
        ],
      },
    ]);
    expect(domain).toEqual([1, 5]);
  });

  it('returns min/max date domain', () => {
    const data = [
      new Date('2020-01-02'),
      new Date('2020-01-01'),
      new Date('2020-01-04'),
      new Date('2020-01-05'),
      new Date('2020-01-03'),
    ];
    const domain = computeDomainX([{ type: 'area', title: 'A', data: data.map(x => ({ x, y: 0 })) }]);
    expect(domain).toEqual([data[1], data[3]]);
  });
});

describe('AreaChart computeDomainY', () => {
  it('returns empty domain if series is empty', () => {
    const domain = computeDomainY([], 'linear');
    expect(domain).toHaveLength(0);
  });

  it('returns empty domain if data is empty', () => {
    const domain = computeDomainY([{ type: 'area', title: 'A', data: [] }], 'linear');
    expect(domain).toHaveLength(0);
  });

  it('returns min/max domain for linear series', () => {
    const domain = computeDomainY([{ type: 'threshold', y: 10, title: 'T10' }], 'linear');
    expect(domain).toEqual([10, 10]);
  });

  it('returns min/max domain for log series', () => {
    const domain = computeDomainY([{ type: 'threshold', y: 10, title: 'T10' }], 'linear');
    expect(domain).toEqual([10, 10]);
  });

  it('replaces lower range bound with 1 for log scale type', () => {
    const domain = computeDomainY(
      [
        { type: 'threshold', y: 0, title: 'T0' },
        { type: 'threshold', y: 10, title: 'T10' },
      ],
      'linear'
    );
    expect(domain).toEqual([0, 10]);
  });

  it('computes stacked min/max', () => {
    const data = [1, 2, 3, 4, 5];
    const domain = computeDomainY(
      [
        { type: 'area', data: data.map(x => ({ x, y: x * 1 })), title: 'A1x' },
        { type: 'area', data: data.map(x => ({ x, y: x * 2 })), title: 'A2x' },
      ],
      'linear'
    );
    expect(domain).toEqual([1, 15]);
  });

  it('computes min/max with both series and threshold', () => {
    const data = [1, 2, 3, 4, 5];
    const domain = computeDomainY(
      [
        { type: 'area', data: data.map(x => ({ x, y: x * 1 })), title: 'A1x' },
        { type: 'area', data: data.map(x => ({ x, y: x * 2 })), title: 'A2x' },
        { type: 'threshold', y: 20, title: 'T20' },
      ],
      'linear'
    );
    expect(domain).toEqual([1, 20]);
  });
});

describe('AreaChart computePlotPoints', () => {
  const xScale = new ChartScale('linear', [0, 100], [0, 1000]);
  const yScale = new NumericChartScale('linear', [0, 100], [1000, 0], null);

  it('should return empty arrays if no area series', () => {
    const { xy, xs, sx } = computePlotPoints([{ type: 'threshold', y: 10, title: 'T10' }], xScale, yScale);
    expect(xy.length + xs.length + sx.length).toBe(0);
  });

  it('should return empty arrays if series data is empty', () => {
    const { xy, xs, sx } = computePlotPoints([{ type: 'area', title: 'A', data: [] }], xScale, yScale);
    expect(xy.length + xs.length + sx.length).toBe(0);
  });

  it('should compute threshold and area points', () => {
    const data = [1, 2, 3];
    const { xy } = computePlotPoints(
      [
        { type: 'threshold', y: 5, title: 'T5' },
        { type: 'area', data: data.map(x => ({ x, y: x * 1 })), title: 'Ax1' },
        { type: 'area', data: data.map(x => ({ x, y: x * 2 })), title: 'Ax2' },
      ],
      xScale,
      yScale
    );

    expect(xy).toEqual([
      [
        { x: 1, y0: 0, y1: 1, scaled: { x: 10, y0: 1000, y1: 990 }, index: { x: 0, y: 0, s: 1 }, value: 1 },
        { x: 1, y0: 1, y1: 3, scaled: { x: 10, y0: 990, y1: 970 }, index: { x: 0, y: 1, s: 2 }, value: 2 },
        { x: 1, y0: 5, y1: 5, scaled: { x: 10, y0: 950, y1: 950 }, index: { x: 0, y: 2, s: 0 }, value: 0 },
      ],
      [
        { x: 2, y0: 0, y1: 2, scaled: { x: 20, y0: 1000, y1: 980 }, index: { x: 1, y: 0, s: 1 }, value: 2 },
        { x: 2, y0: 5, y1: 5, scaled: { x: 20, y0: 950, y1: 950 }, index: { x: 1, y: 1, s: 0 }, value: 0 },
        { x: 2, y0: 2, y1: 6, scaled: { x: 20, y0: 980, y1: 940 }, index: { x: 1, y: 2, s: 2 }, value: 4 },
      ],
      [
        { x: 3, y0: 0, y1: 3, scaled: { x: 30, y0: 1000, y1: 970 }, index: { x: 2, y: 0, s: 1 }, value: 3 },
        { x: 3, y0: 5, y1: 5, scaled: { x: 30, y0: 950, y1: 950 }, index: { x: 2, y: 1, s: 0 }, value: 0 },
        { x: 3, y0: 3, y1: 9, scaled: { x: 30, y0: 970, y1: 910 }, index: { x: 2, y: 2, s: 2 }, value: 6 },
      ],
    ]);
  });

  it('should create complementary arrays xy:xs:sx', () => {
    const data = [1, 2, 3];
    const { xy, xs, sx } = computePlotPoints(
      [
        { type: 'threshold', y: 5, title: 'T5' },
        { type: 'area', data: data.map(x => ({ x, y: x * 1 })), title: 'Ax1' },
        { type: 'area', data: data.map(x => ({ x, y: x * 2 })), title: 'Ax2' },
      ],
      xScale,
      yScale
    );
    // Iterate X, then Y
    expect(getPointIndices(xy)).toEqual([
      { x: 0, y: 0, s: 1 },
      { x: 0, y: 1, s: 2 },
      { x: 0, y: 2, s: 0 },
      { x: 1, y: 0, s: 1 },
      { x: 1, y: 1, s: 0 },
      { x: 1, y: 2, s: 2 },
      { x: 2, y: 0, s: 1 },
      { x: 2, y: 1, s: 0 },
      { x: 2, y: 2, s: 2 },
    ]);
    // Iterate X, then S
    expect(getPointIndices(xs)).toEqual([
      { x: 0, s: 0, y: 2 },
      { x: 0, s: 1, y: 0 },
      { x: 0, s: 2, y: 1 },
      { x: 1, s: 0, y: 1 },
      { x: 1, s: 1, y: 0 },
      { x: 1, s: 2, y: 2 },
      { x: 2, s: 0, y: 1 },
      { x: 2, s: 1, y: 0 },
      { x: 2, s: 2, y: 2 },
    ]);
    // Iterate S, then X
    expect(getPointIndices(sx)).toEqual([
      { s: 0, x: 0, y: 2 },
      { s: 0, x: 1, y: 1 },
      { s: 0, x: 2, y: 1 },
      { s: 1, x: 0, y: 0 },
      { s: 1, x: 1, y: 0 },
      { s: 1, x: 2, y: 0 },
      { s: 2, x: 0, y: 1 },
      { s: 2, x: 1, y: 2 },
      { s: 2, x: 2, y: 2 },
    ]);
  });
});

describe('AreaChart findClosest', () => {
  it('throws exception when passing an empty array', () => {
    expect(() => findClosest([], 0, x => x)).toThrow();
  });

  it('finds closest in an asc sorted array', () => {
    const closest = findClosest([1, 2, 3, 3.5, 5, 6], 4, x => x);
    expect(closest).toBe(3.5);
  });

  it('finds closest in an desc sorted array', () => {
    const closest = findClosest([6, 5, 3.5, 3, 2, 1], 4, x => x);
    expect(closest).toBe(3.5);
  });
});

describe('AreaChart circleIndex', () => {
  it('returns same index if in range', () => {
    expect(circleIndex(1, [1, 5])).toBe(1);
    expect(circleIndex(5, [1, 5])).toBe(5);
  });

  it('returns opposite boundary if not in range', () => {
    expect(circleIndex(0, [1, 5])).toBe(5);
    expect(circleIndex(6, [1, 5])).toBe(1);
  });
});

describe('AreaChart isSeriesValid', () => {
  it('returns true if series is empty', () => {
    expect(isSeriesValid([])).toBe(true);
  });

  it('returns true if only threshold series', () => {
    expect(isSeriesValid([{ type: 'threshold', title: 'T1', y: 1 }])).toBe(true);
  });

  it('returns true if all series x-values are the same', () => {
    expect(
      isSeriesValid([
        {
          type: 'area',
          title: 'A1x',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
          ],
        },
        {
          type: 'area',
          title: 'A2x',
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 4 },
            { x: 3, y: 6 },
          ],
        },
      ])
    ).toBe(true);
  });

  it('returns false if series data lengths are not the same', () => {
    expect(
      isSeriesValid([
        {
          type: 'area',
          title: 'A1x',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
          ],
        },
        {
          type: 'area',
          title: 'A2x',
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 4 },
          ],
        },
      ])
    ).toBe(false);

    expect(
      isSeriesValid([
        {
          type: 'area',
          title: 'A1x',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
          ],
        },
        {
          type: 'area',
          title: 'A2x',
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 4 },
            { x: 3, y: 6 },
          ],
        },
      ])
    ).toBe(false);
  });

  it('returns false if series data values are not the same', () => {
    expect(
      isSeriesValid([
        {
          type: 'area',
          title: 'A1x',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 },
          ],
        },
        {
          type: 'area',
          title: 'A2x',
          data: [
            { x: 1, y: 2 },
            { x: 3, y: 4 },
            { x: 3, y: 6 },
          ],
        },
      ])
    ).toBe(false);
  });
});
