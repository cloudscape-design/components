// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartScale } from '../../../lib/components/internal/components/cartesian-chart/scales';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import makeScaledBarGroups from '../../../lib/components/mixed-line-bar-chart/make-scaled-bar-groups';
import { barSeries, barSeries2, lineSeries1, lineSeries3, thresholdSeries } from './common';

function createInternalSeries<T>(externalSeries: readonly MixedLineBarChartProps.ChartSeries<T>[]) {
  return externalSeries.map((series, index) => ({ series, index, color: '' }));
}

const categoricalDomain = ['Potatoes', 'Chocolate', 'Apples', 'Oranges'];
const linearScale = new ChartScale('linear', [0, 100], [0, 100]);
const categoricalScale = new ChartScale('categorical', categoricalDomain, [0, 100]);

const emptyBarSeries: MixedLineBarChartProps.ChartSeries<string> = { type: 'bar', title: '', data: [] };
const emptyLineSeries: MixedLineBarChartProps.ChartSeries<number> = { type: 'line', title: '', data: [] };

describe('makeScaledBarGroups', () => {
  it('is empty when not categorical', () => {
    expect(makeScaledBarGroups(createInternalSeries([emptyLineSeries]), linearScale, 0, 0, 'y')).toHaveLength(0);
    expect(makeScaledBarGroups(createInternalSeries([lineSeries1]), linearScale, 0, 0, 'y')).toHaveLength(0);
  });

  it('creates groups for every domain category when empty series is given', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries([emptyBarSeries]), categoricalScale, 0, 0, 'y');

    expect(barGroups).toEqual([
      { x: 'Potatoes', isValid: true, hasData: false, position: expect.anything() },
      { x: 'Chocolate', isValid: true, hasData: false, position: expect.anything() },
      { x: 'Apples', isValid: true, hasData: false, position: expect.anything() },
      { x: 'Oranges', isValid: true, hasData: false, position: expect.anything() },
    ]);
  });

  it('creates groups for bar series with all values', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries([barSeries]), categoricalScale, 0, 0, 'y');

    expect(barGroups).toEqual(
      categoricalDomain.map(x => ({ x, isValid: true, hasData: true, position: expect.anything() }))
    );
  });

  it('creates groups for bar series with all gaps', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries([barSeries2]), categoricalScale, 0, 0, 'y');

    expect(barGroups).toEqual(
      categoricalDomain.map(x => ({ x, isValid: true, hasData: x !== 'Apples', position: expect.anything() }))
    );
  });

  it('creates groups of multiple bar series', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries([barSeries2, barSeries]), categoricalScale, 0, 0, 'y');

    expect(barGroups).toEqual(
      categoricalDomain.map(x => ({ x, isValid: true, hasData: true, position: expect.anything() }))
    );
  });

  it('creates groups of mixed line/bar series', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries([barSeries2, lineSeries3]), categoricalScale, 0, 0, 'y');

    expect(barGroups).toEqual(
      categoricalDomain.map(x => ({ x, isValid: true, hasData: true, position: expect.anything() }))
    );
  });

  it('creates groups of mixed line/bar/threshold series', () => {
    const barGroups = makeScaledBarGroups(
      createInternalSeries([barSeries2, lineSeries3, thresholdSeries]),
      categoricalScale,
      0,
      0,
      'y'
    );

    expect(barGroups).toEqual(
      categoricalDomain.map(x => ({ x, isValid: true, hasData: true, position: expect.anything() }))
    );
  });

  it('creates groups of threshold-only series', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries<string>([thresholdSeries]), categoricalScale, 0, 0, 'y');

    expect(barGroups).toEqual(
      categoricalDomain.map(x => ({ x, isValid: true, hasData: true, position: expect.anything() }))
    );
  });

  it('computes bars positions for y axis', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries([barSeries2]), categoricalScale, 100, 200, 'y');

    expect(barGroups).toEqual([
      {
        x: 'Potatoes',
        isValid: true,
        hasData: true,
        position: { x: expect.any(Number), y: 0, width: expect.any(Number), height: 200 },
      },
      {
        x: 'Chocolate',
        isValid: true,
        hasData: true,
        position: { x: expect.any(Number), y: 0, width: expect.any(Number), height: 200 },
      },
      {
        x: 'Apples',
        isValid: true,
        hasData: false,
        position: { x: expect.any(Number), y: 0, width: expect.any(Number), height: 200 },
      },
      {
        x: 'Oranges',
        isValid: true,
        hasData: true,
        position: { x: expect.any(Number), y: 0, width: expect.any(Number), height: 200 },
      },
    ]);
  });

  it('computes bars positions for x axis', () => {
    const barGroups = makeScaledBarGroups(createInternalSeries([barSeries2]), categoricalScale, 100, 200, 'x');

    expect(barGroups).toEqual([
      {
        x: 'Potatoes',
        isValid: true,
        hasData: true,
        position: { x: 0, y: expect.any(Number), width: 100, height: expect.any(Number) },
      },
      {
        x: 'Chocolate',
        isValid: true,
        hasData: true,
        position: { x: 0, y: expect.any(Number), width: 100, height: expect.any(Number) },
      },
      {
        x: 'Apples',
        isValid: true,
        hasData: false,
        position: { x: 0, y: expect.any(Number), width: 100, height: expect.any(Number) },
      },
      {
        x: 'Oranges',
        isValid: true,
        hasData: true,
        position: { x: 0, y: expect.any(Number), width: 100, height: expect.any(Number) },
      },
    ]);
  });
});
