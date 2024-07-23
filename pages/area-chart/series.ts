// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import range from 'lodash/range';

import { AreaChartProps } from '~components/area-chart';
import { XScaleType, YScaleType } from '~components/internal/components/cartesian-chart/interfaces';

import pseudoRandom from '../utils/pseudo-random';
import { numberFormatter } from './example';

export function createLinearTimeLatencyProps() {
  const seconds = 2 * 60;
  const valueFormatter = numberFormatter;

  const rawData = range(0, seconds).map(index => {
    const p50 = 28 + 2 * (pseudoRandom() + 1);
    const p60 = p50 * 1.2 * (pseudoRandom() + 1);
    const p70 = p50 * 1.4 * (pseudoRandom() + 1);
    const p80 = p50 * 1.6 * (pseudoRandom() + 1);
    const p90 = p50 * 2 * (pseudoRandom() + 1);

    return { index, p50, p60, p70, p80, p90 };
  });

  const data = rawData.map(it => it.index);

  const series: AreaChartProps.Series<number>[] = [
    { title: 'p50', type: 'area', data: rawData.map(it => ({ x: it.index, y: it.p50 })), valueFormatter },
    { title: 'p60', type: 'area', data: rawData.map(it => ({ x: it.index, y: it.p60 })), valueFormatter },
    { title: 'p70', type: 'area', data: rawData.map(it => ({ x: it.index, y: it.p70 })), valueFormatter },
    { title: 'Limit', type: 'threshold', y: 150, valueFormatter },
    { title: 'p80', type: 'area', data: rawData.map(it => ({ x: it.index, y: it.p80 })), valueFormatter },
    { title: 'p90', type: 'area', data: rawData.map(it => ({ x: it.index, y: it.p90 })), valueFormatter },
  ];

  const xScaleType: XScaleType = 'linear';
  const yScaleType: YScaleType = 'linear';

  return {
    data,
    series,
    xTitle: 'Time',
    xScaleType,
    yTitle: 'Latency (ms)',
    yScaleType,
    xTickFormatter: (index: number) => `${index + 1}s`,
    yTickFormatter: valueFormatter,
  };
}

export function createLinearCloseProps() {
  const valueFormatter = numberFormatter;

  const rawData = range(0, 100).map(index => {
    const main = 5 + pseudoRandom() * 2;
    const delta = Number(pseudoRandom() > 0.7);

    return { index, main, delta };
  });

  const data = rawData.map(it => it.index);

  const series: AreaChartProps.Series<number>[] = [
    { title: 'main', type: 'area', data: rawData.map(it => ({ x: it.index, y: it.main })), valueFormatter },
    { title: 'delta', type: 'area', data: rawData.map(it => ({ x: it.index, y: it.delta })), valueFormatter },
  ];

  const xScaleType: XScaleType = 'linear';
  const yScaleType: YScaleType = 'linear';

  return {
    data,
    series,
    xTitle: 'X',
    xScaleType,
    yTitle: 'Y',
    yDomain: [0, 10],
    yScaleType,
    xTickFormatter: numberFormatter,
    yTickFormatter: valueFormatter,
  };
}

export function createLogXYProps({ xLog, yLog }: { xLog?: boolean; yLog?: boolean }) {
  const valueFormatter = numberFormatter;

  const rawData = range(0, 100).map(index => {
    const x = 1 + index * 10;
    const y1 = 1 + index * 5 * (pseudoRandom() + 1);
    const y2 = 1 + index * 15 * (pseudoRandom() + 1);
    const y3 = 1 + index * 30 * (pseudoRandom() + 1);

    return { x, y1, y2, y3 };
  });

  const data = rawData.map(it => it.x);
  const series: AreaChartProps.Series<number>[] = [
    { title: 'y1', type: 'area', data: rawData.map(it => ({ x: it.x, y: it.y1 })), valueFormatter },
    { title: 'y2', type: 'area', data: rawData.map(it => ({ x: it.x, y: it.y2 })), valueFormatter },
    { title: 'y3', type: 'area', data: rawData.map(it => ({ x: it.x, y: it.y3 })), valueFormatter },
    { title: 'Limit', type: 'threshold', y: 2500, valueFormatter },
  ];

  const xScaleType: XScaleType = xLog ? 'log' : 'linear';
  const yScaleType: YScaleType = yLog ? 'log' : 'linear';

  return {
    data,
    series,
    xTitle: 'X',
    xScaleType,
    yTitle: 'Y',
    yScaleType,
    xTickFormatter: numberFormatter,
    yTickFormatter: valueFormatter,
  };
}

export function createCategoricalProps() {
  const valueFormatter = numberFormatter;

  const rawData = [
    'Black',
    'Blue',
    'Gray',
    'Mint',
    'Navy',
    'Orange',
    'Pink',
    'Purple',
    'Red',
    'Silver',
    'White',
    'Yellow',
  ].map(name => {
    const or = (arr: number[]) => arr.reduce((acc, x) => acc | x);
    const and = (arr: number[]) => arr.reduce((acc, x) => acc & x);
    const xor = (arr: number[]) => arr.reduce((acc, x) => acc ^ x);

    const y1 = or(name.split('').map(s => s.charCodeAt(0)));
    const y2 = and(name.split('').map(s => s.charCodeAt(0)));
    const y3 = xor(name.split('').map(s => s.charCodeAt(0)));

    return { name, y1, y2, y3 };
  });

  const data = rawData.map(it => it.name);
  const series: AreaChartProps.Series<string>[] = [
    { title: 'y1', type: 'area', data: rawData.map(it => ({ x: it.name, y: it.y1 })), valueFormatter, color: '#666' },
    { title: 'y2', type: 'area', data: rawData.map(it => ({ x: it.name, y: it.y2 })), valueFormatter, color: '#888' },
    { title: 'y3', type: 'area', data: rawData.map(it => ({ x: it.name, y: it.y3 })), valueFormatter, color: '#aaa' },
    { title: 'Limit', type: 'threshold', y: 200, valueFormatter },
  ];

  const xScaleType: XScaleType = 'categorical';
  const yScaleType: YScaleType = 'linear';

  return {
    data,
    series,
    xTitle: 'X',
    xScaleType,
    yTitle: 'Y',
    yScaleType,
    yTickFormatter: valueFormatter,
  };
}
