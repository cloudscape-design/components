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

export type StackedBarValues = Map<string | number, Map<number, number>>;

// Unlike for regular bars, stacked bar series values depend on the predecessors.
// The function computes all stacked values grouped by X and series index.
export function calculateStackedBarValues(
  dataBySeries: Array<readonly MixedLineBarChartProps.Datum<ChartDataTypes>[]>
): StackedBarValues {
  const negativeValues = new Map<string | number, number>();
  const positiveValues = new Map<string | number, number>();
  const values = new Map<string | number, Map<number, number>>();
  for (let seriesIndex = 0; seriesIndex < dataBySeries.length; seriesIndex++) {
    for (const datum of dataBySeries[seriesIndex]) {
      const key = getKeyValue(datum.x);
      if (datum.y < 0) {
        negativeValues.set(key, (negativeValues.get(key) ?? 0) + datum.y);
      } else {
        positiveValues.set(key, (positiveValues.get(key) ?? 0) + datum.y);
      }
      const seriesValue = (datum.y < 0 ? negativeValues.get(key) : positiveValues.get(key)) ?? 0;
      const valuesByIndex = values.get(key) ?? new Map<number, number>();
      valuesByIndex.set(seriesIndex, seriesValue);
      values.set(key, valuesByIndex);
    }
  }
  return values;
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

// Source https://stackoverflow.com/a/65186378/16648714
export function createOneSideRoundedRectPath(
  { x, y, width, height }: { x: number; y: number; width: number; height: number },
  radius: number,
  side: 'left' | 'right' | 'top' | 'bottom'
) {
  const coordinates = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ];

  // Starting from the target side.
  const startIndex = { left: 2, right: 0, top: 3, bottom: 1 }[side];

  let path = '';
  for (let i = startIndex; i < startIndex + coordinates.length + 1; i++) {
    const start = coordinates[i % coordinates.length];
    const end = coordinates[(i + 1) % coordinates.length];

    // Define curvature for the first 3 points to only add rounded corners to the first side.
    const c = radius && i < startIndex + 3 ? Math.min(radius / Math.hypot(end.x - start.x, end.y - start.y), 0.5) : 0;

    // Insert start point. When c=0 the start point is [start.x, start.y].
    if (i === startIndex) {
      path += `M${start.x * (1 - c) + end.x * c},${start.y * (1 - c) + end.y * c}`;
    }
    // Insert quadratic curve.
    if (i > startIndex) {
      path += `Q${start.x},${start.y} ${start.x * (1 - c) + end.x * c},${start.y * (1 - c) + end.y * c}`;
    }
    // Draw line to the end point. When c=0 the end point is [end.x, end.y].
    if (i < startIndex + coordinates.length) {
      path += `L${start.x * c + end.x * (1 - c)},${start.y * c + end.y * (1 - c)}`;
    }
  }
  return path + 'Z';
}
