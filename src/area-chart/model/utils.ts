// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AreaChartProps } from '../interfaces';
import { ChartScale, NumericChartScale } from '../../internal/components/cartesian-chart/scales';
import { ChartDataTypes, XDomain, YDomain, YScaleType } from '../../internal/components/cartesian-chart/interfaces';
import { ChartModel } from './index';

// A sufficiently small value.
// The Number.EPSILON is not available in the target ECMA version.
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
const EPSILON = 0.0000000000001;

// When x-domain is not set explicitly - guess it based on the available data.
export function computeDomainX<T extends ChartDataTypes>(series: readonly AreaChartProps.Series<T>[]): XDomain<T> {
  const xValues = getXValues(series);

  if (xValues.length === 0) {
    return [] as unknown as XDomain<T>;
  }

  // Assuming categorical domain.
  // In that case, all values are to be included.
  if (typeof xValues[0] === 'string') {
    return uniq(xValues) as unknown as XDomain<T>;
  }

  // For non-categorical domain find min and max bounds.
  return xValues.reduce(
    ([min, max], x) => [x < min ? x : min, max < x ? x : max],
    [xValues[0], xValues[0]]
  ) as unknown as XDomain<T>;
}

// When y-domain is not set explicitly - guess it based on the available data and series.
export function computeDomainY<T>(series: readonly AreaChartProps.Series<T>[], scaleType: YScaleType): YDomain {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  // Find the min and max for threshold series.
  series.forEach(s => {
    if (s.type === 'threshold') {
      min = Math.min(min, s.y);
      max = Math.max(max, s.y);
    }
  });

  // Find the min and max for area series considering their stacking.
  getXValues(series).forEach((_, xIndex) => {
    // Maintains the prev stack level.
    let stackY = scaleType === 'linear' ? 0 : EPSILON;

    for (const s of series) {
      if (s.type === 'area') {
        stackY = stackY + (s.data[xIndex]?.y || 0);
        min = Math.min(min, stackY);
        max = Math.max(max, stackY);
      }
    }
  });

  // If min/max is not overridden than either series or series data is empty.
  if (min === Number.POSITIVE_INFINITY) {
    return [];
  }

  // Log scales can't start from 0, so, if possible, start from 1.
  if (scaleType === 'log' && min === 0 && max > 1) {
    return [1, max];
  }

  return [min, max];
}

// For given data, series and scales, compute all points and group them as
// x:y, x:series and series:x to allow constant time access to the required point or subset.
export function computePlotPoints<T extends AreaChartProps.DataTypes>(
  series: readonly AreaChartProps.Series<T>[],
  xScale: ChartScale,
  yScale: NumericChartScale
): {
  xy: ChartModel.PlotPoint<T>[][];
  xs: ChartModel.PlotPoint<T>[][];
  sx: ChartModel.PlotPoint<T>[][];
} {
  const xValues = getXValues(series);

  // Lookup for xy[xIndex][yIndex]
  const xy: ChartModel.PlotPoint<T>[][] = [];
  // Lookup for xs[xIndex][seriesIndex]
  const xs: ChartModel.PlotPoint<T>[][] = [];
  // Lookup for sx[seriesIndex][xIndex]
  const sx: ChartModel.PlotPoint<T>[][] = [];

  // Filter out the data which is beyond the plot for whatever reason.
  getVisibleData(xValues, xScale).forEach(({ x, scaledX }, xIndex) => {
    // Maintains the prev stack level. Starting from epsilon to not break log scales.
    let stackY = yScale.scaleType === 'linear' ? 0 : EPSILON;

    // A column of series points related to the same x.
    const points: ChartModel.PlotPoint<T>[] = [];

    // Collect the points, leaving y-index as 0 for now.
    series.forEach((s, sIndex) => {
      if (s.type === 'threshold') {
        const scaledY = yScale.d3Scale(s.y) || 0;
        points.push({
          x: x,
          y0: s.y,
          y1: s.y,
          scaled: { x: scaledX, y0: scaledY, y1: scaledY },
          index: { x: xIndex, s: sIndex, y: 0 },
          value: 0,
        });
      } else {
        const value = s.data[xIndex]?.y || 0;
        const y0 = stackY;
        const y1 = stackY + value;
        points.push({
          x: x,
          y0: y0,
          y1: y1,
          scaled: { x: scaledX, y0: yScale.d3Scale(y0) || 0, y1: yScale.d3Scale(y1) || 0 },
          index: { x: xIndex, s: sIndex, y: 0 },
          value: value,
        });

        stackY = y1;
      }
    });

    // Sort points by y and insert the missing y-index.
    points
      .sort((p1, p2) => p1.y1 - p2.y1)
      .forEach((point, index) => {
        point.index.y = index;

        // Insert the points to the respective two-dimensional lookup arrays.
        insertIntoMatrix(xy, point.index.x, point.index.y, point);
        insertIntoMatrix(xs, point.index.x, point.index.s, point);
        insertIntoMatrix(sx, point.index.s, point.index.x, point);
      });
  });

  return { xy, xs, sx };
}

// Finds the closest point in the sorted array.
export function findClosest<T>(sortedArray: readonly T[], target: number, getter: (item: T) => number): T {
  // The method guarantees to return a point hence empty arrays are not allowed.
  if (sortedArray.length === 0) {
    throw new Error('Invariant violation: array is empty.');
  }

  const isAscending = getter(sortedArray[0]) < getter(sortedArray[sortedArray.length - 1]);
  const compare = (x: T) => (isAscending ? getter(x) < target : getter(x) > target);
  const delta = (x: T) => Math.abs(getter(x) - target);

  // Use binary search to find the closest value in a sorted array.
  let lo = 0;
  let hi = sortedArray.length - 1;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (compare(sortedArray[mid])) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return delta(sortedArray[lo]) < delta(sortedArray[hi]) ? sortedArray[lo] : sortedArray[hi];
}

// Returns given index if it is in range or the opposite range boundary otherwise.
export function circleIndex(index: number, [from, to]: [number, number]): number {
  if (index < from) {
    return to;
  }
  if (index > to) {
    return from;
  }
  return index;
}

// Compares all x-values between series to ensure they are consistent.
export function isSeriesValid<T>(series: readonly AreaChartProps.Series<T>[]) {
  const sampleXValues = getXValues(series);

  for (const s of series) {
    if (s.type === 'area') {
      for (let i = 0; i < Math.max(s.data.length, sampleXValues.length); i++) {
        if (s.data[i]?.x !== sampleXValues[i]) {
          return false;
        }
      }
    }
  }

  return true;
}

// Takes first area series x-values as all data x-values are to match across series.
function getXValues<T>(series: readonly AreaChartProps.Series<T>[]) {
  for (const s of series) {
    if (s.type === 'area') {
      return s.data.map(({ x }) => x);
    }
  }

  return [];
}

// Returns data that is visible in the given scale.
function getVisibleData<T extends AreaChartProps.DataTypes>(data: readonly T[], xScale: ChartScale) {
  const scaledOffsetX = xScale.isCategorical() ? Math.max(0, xScale.d3Scale.bandwidth() - 1) / 2 : 0;

  const visibleData = [];
  for (const x of data) {
    type Scale = ChartScale['d3Scale'] & ((x: T) => undefined);

    const scaledX = (xScale.d3Scale as Scale)(x);

    if (scaledX !== undefined) {
      visibleData.push({ x, scaledX: scaledX + scaledOffsetX });
    }
  }
  return visibleData;
}

// Inserts given value into a two-dimensional array.
function insertIntoMatrix<T>(matrix: T[][], row: number, col: number, value: T) {
  if (!matrix[row]) {
    matrix[row] = [];
  }
  matrix[row][col] = value;
}

// Creates new array with only unique elements of the given array.
function uniq<T>(arr: readonly T[]): readonly T[] {
  const set = new Set();
  const uniqArray: T[] = [];

  for (const value of arr) {
    if (!set.has(value)) {
      set.add(value);
      uniqArray.push(value);
    }
  }

  return uniqArray;
}
