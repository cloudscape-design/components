// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartSeriesMarkerType } from '../internal/components/chart-series-marker';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps, ScaleType } from './interfaces';
import { ScaledBarGroup } from './make-scaled-bar-groups';

export const chartLegendMap: Record<string, ChartSeriesMarkerType> = {
  line: 'line',
  bar: 'rectangle',
  threshold: 'dashed',
};

export function computeDomainX<T>(series: readonly InternalChartSeries<T>[], xScaleType: ScaleType) {
  if (xScaleType === 'categorical') {
    return series.reduce((acc, s) => {
      if (s.series.type !== 'threshold') {
        s.series.data.forEach(({ x }) => {
          if (acc.indexOf(x) === -1) {
            acc.push(x);
          }
        });
      }
      return acc;
    }, [] as T[]);
  }

  return series.reduce((acc, curr) => {
    if (curr.series.type === 'threshold') {
      return acc;
    }

    return curr.series.data.reduce(([min, max], { x }) => {
      const newMin = min === undefined || x < min ? x : min;
      const newMax = max === undefined || max < x ? x : max;
      return [newMin, newMax] as T[];
    }, acc);
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
          data: positiveData as any,
        },
      },
      {
        color: '',
        index: NaN,
        series: {
          type: 'bar',
          title: 'negative',
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
      if (curr.series.type === 'threshold') {
        const [min, max] = acc;
        const y = curr.series.y;
        const newMin = min === undefined || y < min ? y : min;
        const newMax = max === undefined || max < y ? y : max;
        return [newMin, newMax];
      }

      return curr.series.data.reduce(([min, max], { y }) => {
        const newMin = min === undefined || y < min ? y : min;
        const newMax = max === undefined || max < y ? y : max;
        return [newMin, newMax];
      }, acc);
    },
    [0, 0]
  );

  // Log scales can't start from 0, so if possible, start from 1.
  if (scaleType === 'log' && domain[0] === 0 && domain[1] > 1) {
    return [1, domain[1]];
  }
  return domain;
}

// Starting from the given index, find the first x value in the x domain that has bar data attached to it.
export const nextValidDomainIndex = <T>(nextGroupIndex: number, barGroups: ScaledBarGroup<T>[], direction = 1) => {
  let index = nextGroupIndex;

  if (index < 0 || index >= barGroups.length) {
    index = 0;
  }

  do {
    if (barGroups[index].isValid && barGroups[index].hasData) {
      return index;
    }
    index += direction;

    // Loop back to the beginning if necessary
    if (index >= barGroups.length) {
      index = 0;
    } else if (index < 0) {
      index = barGroups.length - 1;
    }
  } while (index !== nextGroupIndex);
  return 0;
};

/**
 * Find the subset of series that are individually navigable with keyboard.
 * Lines and thresholds are navigated individually, while bar series are grouped as one.
 */
export function findNavigableSeries<T extends ChartDataTypes>(series: ReadonlyArray<InternalChartSeries<T>>) {
  const navigableSeries: Array<MixedLineBarChartProps.ChartSeries<T>> = [];
  let navigableBarSeriesIndex = -1;

  series.forEach(internalSeries => {
    if (internalSeries.series.type === 'bar') {
      // Only include the first bar series because all bar series are handled as one
      if (navigableBarSeriesIndex === -1) {
        navigableBarSeriesIndex = navigableSeries.length;
        navigableSeries.push(internalSeries.series);
      }
    } else {
      navigableSeries.push(internalSeries.series);
    }
  });
  return { navigableSeries, navigableBarSeriesIndex };
}

/**
 * Checks if two x values are equal.
 * With a special treat for Date values which need to be converted to numbers first.
 */
export const matchesX = <T>(x1: T, x2: T) => {
  if (x1 instanceof Date && x2 instanceof Date) {
    return x1.getTime() === x2.getTime();
  }
  return x1 === x2;
};

export type OffsetMap = Record<string | number, number>;

export interface StackedOffsets {
  positiveOffsets: OffsetMap;
  negativeOffsets: OffsetMap;
}

/**
 * Calculates list of offset maps from all data by accumulating each value
 */
export function calculateOffsetMaps(
  data: Array<readonly MixedLineBarChartProps.Datum<ChartDataTypes>[]>
): StackedOffsets[] {
  return data.reduce((acc, curr, idx) => {
    // First series receives empty offsets map
    if (idx === 0) {
      acc.push({ positiveOffsets: {}, negativeOffsets: {} });
    }
    const lastMap = acc[idx];
    const map: StackedOffsets = lastMap
      ? { positiveOffsets: { ...lastMap.positiveOffsets }, negativeOffsets: { ...lastMap.negativeOffsets } }
      : { positiveOffsets: {}, negativeOffsets: {} };

    curr.forEach(({ x, y }) => {
      const key = getKeyValue(x);
      if (y < 0) {
        const lastValue = lastMap?.negativeOffsets[key] || 0;
        map.negativeOffsets[key] = lastValue + y;
      } else {
        const lastValue = lastMap?.positiveOffsets[key] || 0;
        map.positiveOffsets[key] = lastValue + y;
      }
    });

    // Ignore last value for map but still run it for logging
    if (idx < data.length - 1) {
      acc.push(map);
    }

    return acc;
  }, [] as StackedOffsets[]);
}

/**
 * Returns string or number value for ChartDataTypes key
 */
export const getKeyValue = (key: ChartDataTypes) => (key instanceof Date ? key.getTime() : key);
