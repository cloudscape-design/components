// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  ChartScale,
  NumericChartScale,
} from '../../../../../lib/components/internal/components/cartesian-chart/scales';
import { createXTicks, createYTicks } from '../../../../../lib/components/internal/components/cartesian-chart/ticks';

describe('createXTicks', () => {
  it('creates uniformly-spaced time intervals for 1-day intervals', () => {
    const scale = new ChartScale(
      'time',
      [new Date(2021, 4, 28, 0, 0, 0, 0), new Date(2021, 5, 4, 0, 0, 0, 0)],
      [0, 450]
    );
    const ticks = createXTicks(scale, 8) as Date[];
    expect(ticks).toEqual([
      new Date(2021, 4, 28, 0, 0, 0, 0),
      new Date(2021, 4, 29, 0, 0, 0, 0),
      new Date(2021, 4, 30, 0, 0, 0, 0),
      new Date(2021, 4, 31, 0, 0, 0, 0),
      new Date(2021, 5, 1, 0, 0, 0, 0),
      new Date(2021, 5, 2, 0, 0, 0, 0),
      new Date(2021, 5, 3, 0, 0, 0, 0),
      new Date(2021, 5, 4, 0, 0, 0, 0),
    ]);
  });
  it('creates uniformly-spaced intervals for 2-day intervals', () => {
    const scale = new ChartScale(
      'time',
      [new Date(2021, 4, 25, 0, 0, 0, 0), new Date(2021, 5, 7, 0, 0, 0, 0)],
      [0, 450]
    );
    const ticks = createXTicks(scale, 8) as Date[];
    expect(ticks).toEqual([
      new Date(2021, 4, 25, 0, 0, 0, 0),
      new Date(2021, 4, 27, 0, 0, 0, 0),
      new Date(2021, 4, 29, 0, 0, 0, 0),
      new Date(2021, 4, 31, 0, 0, 0, 0),
      new Date(2021, 5, 2, 0, 0, 0, 0),
      new Date(2021, 5, 4, 0, 0, 0, 0),
      new Date(2021, 5, 6, 0, 0, 0, 0),
    ]);
  });
  it('creates uniformly-spaced intervals for minute intervals', () => {
    const scale = new ChartScale(
      'time',
      [new Date(2021, 4, 25, 13, 0, 0, 0), new Date(2021, 4, 25, 13, 20, 0, 0)],
      [0, 450]
    );
    const ticks = createXTicks(scale, 8) as Date[];
    expect(ticks).toEqual([
      new Date(2021, 4, 25, 13, 0, 0, 0),
      new Date(2021, 4, 25, 13, 5, 0, 0),
      new Date(2021, 4, 25, 13, 10, 0, 0),
      new Date(2021, 4, 25, 13, 15, 0, 0),
      new Date(2021, 4, 25, 13, 20, 0, 0),
    ]);
  });
});

describe('createYTicks', () => {
  it('creates linear Y scale', () => {
    const scale = new NumericChartScale('linear', [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], [0, 450], null);
    const ticks = createYTicks(scale, 8);
    expect(ticks).toEqual([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]);
  });

  it('creates logarithmic Y scale', () => {
    const scale = new NumericChartScale('log', [1, 2, 4, 8, 16, 32, 64, 128, 256, 512], [0, 450], null);
    const ticks = createYTicks(scale, 8);
    expect(ticks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500]);
  });

  it('creates logarithmic Y scale with reduced number of ticks', () => {
    const scale = new NumericChartScale('log', [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], [0, 450], null);
    const ticks = createYTicks(scale, 8);
    expect(ticks).toEqual([1, 10, 100, 1000]);
  });
});
