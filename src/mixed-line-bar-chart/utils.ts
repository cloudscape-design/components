// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartSeriesMarkerType } from '../internal/components/chart-series-marker';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { ScaledBarGroup } from './make-scaled-bar-groups';

export const chartLegendMap: Record<string, ChartSeriesMarkerType> = {
  line: 'line',
  bar: 'rectangle',
  threshold: 'dashed',
};

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

export type OffsetMap = Map<string | number, number>;

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
      acc.push({ positiveOffsets: new Map(), negativeOffsets: new Map() });
    }
    const lastMap = acc[idx];
    const map: StackedOffsets = lastMap
      ? { positiveOffsets: new Map(lastMap.positiveOffsets), negativeOffsets: new Map(lastMap.negativeOffsets) }
      : { positiveOffsets: new Map(), negativeOffsets: new Map() };

    curr.forEach(({ x, y }) => {
      const key = getKeyValue(x);
      if (y < 0) {
        const lastValue = lastMap?.negativeOffsets.get(key) || 0;
        map.negativeOffsets.set(key, lastValue + y);
      } else {
        const lastValue = lastMap?.positiveOffsets.get(key) || 0;
        map.positiveOffsets.set(key, lastValue + y);
      }
    });

    // Ignore last value for map but still run it for logging
    if (idx < data.length - 1) {
      acc.push(map);
    }

    return acc;
  }, [] as StackedOffsets[]);
}

/** Returns string or number value for ChartDataTypes key */
export const getKeyValue = (key: ChartDataTypes) => (key instanceof Date ? key.getTime() : key);

export function isYThreshold<T>(
  series: MixedLineBarChartProps.ChartSeries<T>
): series is MixedLineBarChartProps.YThresholdSeries {
  return series.type === 'threshold' && 'y' in series;
}

export function isXThreshold<T>(
  series: MixedLineBarChartProps.ChartSeries<T>
): series is MixedLineBarChartProps.XThresholdSeries<T> {
  return series.type === 'threshold' && 'x' in series;
}

export function isDataSeries<T>(
  series: MixedLineBarChartProps.ChartSeries<T>
): series is MixedLineBarChartProps.DataSeries<T> {
  return series.type === 'line' || series.type === 'bar';
}
