// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NumericChartScale } from '../../../../../lib/components/internal/components/cartesian-chart/scales';
import {
  formatTicks,
  getVisibleTicks,
} from '../../../../../lib/components/internal/components/cartesian-chart/label-utils';

describe('formatTicks', () => {
  it('uses formatter or falls back to toString', () => {
    const ticks = [10, 20, 30];
    const scale = new NumericChartScale('linear', [10, 20, 30], [0, 30], null);
    const getLabelSpace = (label: string) => label.length * 10;
    const tickFormatter = (tick: number) => (tick * 4).toString();

    expect(formatTicks({ ticks, scale, getLabelSpace })).toEqual([
      { position: 0, label: '10', lines: ['10'], space: 20 },
      { position: 30, label: '20', lines: ['20'], space: 20 },
      { position: 60, label: '30', lines: ['30'], space: 20 },
    ]);
    expect(formatTicks({ ticks, scale, getLabelSpace, tickFormatter })).toEqual([
      { position: 0, label: '40', lines: ['40'], space: 20 },
      { position: 30, label: '80', lines: ['80'], space: 20 },
      { position: 60, label: '120', lines: ['120'], space: 30 },
    ]);
  });

  it('split labels by lines and returns max line space', () => {
    const ticks = [10, 20, 30];
    const scale = new NumericChartScale('linear', [10, 20, 30], [0, 30], null);
    const getLabelSpace = (label: string) => label.length * 10;
    const tickFormatter = (tick: number) => [1, 2, 3].map(pow => Math.pow(tick, pow).toString()).join('\n');

    expect(formatTicks({ ticks, scale, getLabelSpace, tickFormatter })).toEqual([
      { position: 0, label: '10\n100\n1000', lines: ['10', '100', '1000'], space: 40 },
      { position: 30, label: '20\n400\n8000', lines: ['20', '400', '8000'], space: 40 },
      { position: 60, label: '30\n900\n27000', lines: ['30', '900', '27000'], space: 50 },
    ]);
  });
});

describe('getVisibleTicks', () => {
  it('returns a single tick that fits the range asc', () => {
    const ticks = [
      { position: 0, label: '', lines: [], space: 20 }, // -10 : 10
      { position: 30, label: '', lines: [], space: 20 }, // 20 : 40
      { position: 60, label: '', lines: [], space: 20 }, // 50 : 70
    ];

    expect(getVisibleTicks(ticks, -10, 10)).toEqual(ticks.slice(0, 1));
    expect(getVisibleTicks(ticks, 20, 40)).toEqual(ticks.slice(1, 2));
    expect(getVisibleTicks(ticks, 50, 70)).toEqual(ticks.slice(2, 3));
  });

  it('returns a single tick that fits the range desc', () => {
    const ticks = [
      { position: 60, label: '', lines: [], space: 20 }, // 50 : 70
      { position: 30, label: '', lines: [], space: 20 }, // 20 : 40
      { position: 0, label: '', lines: [], space: 20 }, // -10 : 10
    ];

    expect(getVisibleTicks(ticks, 50, 70)).toEqual(ticks.slice(0, 1));
    expect(getVisibleTicks(ticks, 20, 40)).toEqual(ticks.slice(1, 2));
    expect(getVisibleTicks(ticks, -10, 10)).toEqual(ticks.slice(2, 3));
  });

  it('returns no ticks if range is too narrow', () => {
    const ticks = [
      { position: 0, label: '', lines: [], space: 20 }, // -10 : 10
      { position: 30, label: '', lines: [], space: 20 }, // 20 : 40
      { position: 60, label: '', lines: [], space: 20 }, // 50 : 70
    ];

    expect(getVisibleTicks(ticks, -9, 10)).toHaveLength(0);
    expect(getVisibleTicks(ticks, -10, 9)).toHaveLength(0);
    expect(getVisibleTicks(ticks, 21, 40)).toHaveLength(0);
    expect(getVisibleTicks(ticks, 20, 39)).toHaveLength(0);
    expect(getVisibleTicks(ticks, 51, 70)).toHaveLength(0);
    expect(getVisibleTicks(ticks, 50, 69)).toHaveLength(0);
  });

  it('returns all ticks that have not overlap considering margin', () => {
    const ticks = [
      { position: 0, label: '', lines: [], space: 30 }, // -15 : 15
      { position: 25, label: '', lines: [], space: 20 }, // 15 : 35
      { position: 60, label: '', lines: [], space: 60 }, // 30 : 90
      { position: 99, label: '', lines: [], space: 10 }, // 94 : 104
    ];

    expect(getVisibleTicks(ticks, -15, 104)).toEqual([ticks[0], ticks[2], ticks[3]]);
  });

  it('returns balanced ticks within given range', () => {
    const ticks = [
      { position: 5, label: '', lines: [], space: 10 }, // 0 : 10
      { position: 15, label: '', lines: [], space: 10 }, // 10 : 20
      { position: 25, label: '', lines: [], space: 10 }, // 20 : 30
      { position: 45, label: '', lines: [], space: 10 }, // 40 : 50
      { position: 75, label: '', lines: [], space: 10 }, // 70 : 80
    ];

    expect(getVisibleTicks(ticks, 0, 80)).toEqual([ticks[0], ticks[2], ticks[3], ticks[4]]);
    expect(getVisibleTicks(ticks, 0, 80, true)).toEqual([ticks[0], ticks[2], ticks[4]]);
  });

  it('returns balanced ticks within given range desc', () => {
    const ticks = [
      { position: 75, label: '', lines: [], space: 10 }, // 80 : 70
      { position: 45, label: '', lines: [], space: 10 }, // 50 : 40
      { position: 25, label: '', lines: [], space: 10 }, // 30 : 20
      { position: 15, label: '', lines: [], space: 10 }, // 20 : 10
      { position: 5, label: '', lines: [], space: 10 }, // 10 : 0
    ];

    expect(getVisibleTicks(ticks, 0, 80)).toEqual([ticks[0], ticks[1], ticks[2], ticks[4]]);
    expect(getVisibleTicks(ticks, 0, 80, true)).toEqual([ticks[0], ticks[2], ticks[4]]);
  });
});
