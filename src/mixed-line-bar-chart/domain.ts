// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { InternalChartSeries, MixedLineBarChartProps, ScaleType } from './interfaces';
import { isDataSeries, isXThreshold, isYThreshold, matchesX } from './utils';

export function computeDomainX<T>(series: readonly InternalChartSeries<T>[], xScaleType: ScaleType) {
  if (xScaleType === 'categorical') {
    return series.reduce((acc, s) => {
      if (isDataSeries(s.series)) {
        s.series.data.forEach(({ x }) => {
          if (acc.indexOf(x) === -1) {
            acc.push(x);
          }
        });
      }
      if (isXThreshold(s.series)) {
        if (acc.indexOf(s.series.x) === -1) {
          acc.push(s.series.x);
        }
      }
      return acc;
    }, [] as T[]);
  }

  return series.reduce((acc, curr) => {
    // Y-thresholds don't have X value.
    if (isYThreshold(curr.series)) {
      return acc;
    }

    // Compare x-threshold X with current min, max.
    if (isXThreshold(curr.series)) {
      const [min, max] = acc;
      const newMin = min === undefined || min === null || curr.series.x < min ? curr.series.x : min;
      const newMax = max === undefined || max === null || max < curr.series.x ? curr.series.x : max;
      return [newMin, newMax] as T[];
    }

    // Compare all series X values with current min, max.
    if (isDataSeries(curr.series)) {
      return curr.series.data.reduce(([min, max], { x }) => {
        const newMin = min === undefined || min === null || x < min ? x : min;
        const newMax = max === undefined || max === null || max < x ? x : max;
        return [newMin, newMax] as T[];
      }, acc);
    }

    return acc;
  }, [] as T[]);
}

function find<Q>(arr: readonly Q[], func: (el: Q) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    const found = func(arr[i]);
    if (found) {
      return arr[i];
    }
  }
  return null;
}

export function computeDomainY<T>(
  series: readonly InternalChartSeries<T>[],
  scaleType: 'linear' | 'log',
  stackedBars: boolean
) {
  let _series = series;

  // For stacked bars, we need to accumulate all the bar series into a positive and a negative series
  if (stackedBars) {
    const { positiveData, negativeData } = series.reduce(
      (acc, curr) => {
        if (curr.series.type === 'bar') {
          curr.series.data.forEach(({ x, y }) => {
            const data = y < 0 ? acc.negativeData : acc.positiveData;
            const stackedDatum = find(data, el => matchesX(el.x, x));
            if (stackedDatum) {
              stackedDatum.y += y;
            } else {
              data.push({ x, y });
            }
            return acc;
          });
        }
        return acc;
      },
      {
        positiveData: [] as MixedLineBarChartProps.Datum<T>[],
        negativeData: [] as MixedLineBarChartProps.Datum<T>[],
      }
    );

    // Artificial series with the sum of all bars when stacked
    const stackedSeries: InternalChartSeries<T>[] = [
      {
        color: '',
        index: NaN,
        series: {
          type: 'bar',
          title: 'positive',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: positiveData as any,
        },
      },
      {
        color: '',
        index: NaN,
        series: {
          type: 'bar',
          title: 'negative',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: negativeData as any,
        },
      },
    ];

    // MixedLineBarChart can also contain other non-bar series,
    // so we replace all bars with the artificial bar series
    // Then proceed to compute range with it and the remaining (non-bar) series
    _series = [...stackedSeries, ..._series.filter(s => s.series.type !== 'bar')];
  }

  const domain = _series.reduce(
    (acc, curr) => {
      // Compare threshold Y value with current min, max.
      if (isYThreshold(curr.series)) {
        const [min, max] = acc;
        const newMin = min === undefined || curr.series.y < min ? curr.series.y : min;
        const newMax = max === undefined || max < curr.series.y ? curr.series.y : max;
        return [newMin, newMax];
      }

      // X-thresholds don't have Y value.
      if (isXThreshold(curr.series)) {
        return acc;
      }

      // Compare all series Y values with current min, max.
      if (isDataSeries(curr.series)) {
        return curr.series.data.reduce(([min, max], { y }) => {
          const newMin = min === undefined || y < min ? y : min;
          const newMax = max === undefined || max < y ? y : max;
          return [newMin, newMax];
        }, acc);
      }

      return acc;
    },
    [0, 0]
  );

  // Log scales can't start from 0, so if possible, start from 1.
  if (scaleType === 'log' && domain[0] === 0 && domain[1] > 1) {
    return [1, domain[1]];
  }
  return domain;
}
