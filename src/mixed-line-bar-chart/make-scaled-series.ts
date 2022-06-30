// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';

export interface ScaledPoint<T> {
  x: number;
  y: number;
  color: string;
  datum?: MixedLineBarChartProps.Datum<T> | undefined;
  series: MixedLineBarChartProps.ChartSeries<T>;
}

/**
 * Combine all line series into an array of scaled data points with the given scales.
 */
export default function makeScaledSeries<T extends ChartDataTypes>(
  series: ReadonlyArray<InternalChartSeries<T>>,
  xScale: ChartScale,
  yScale: NumericChartScale
): readonly ScaledPoint<T>[] {
  const xOffset = xScale.isCategorical() ? Math.max(0, xScale.d3Scale.bandwidth() - 1) / 2 : 0;
  const scaleX = (x: T) => (xScale.d3Scale(x as any) || 0) + xOffset;
  const scaleY = (y: number) => yScale.d3Scale(y) || 0;
  const allScaledX = getAllScaledX(series, scaleX);

  // Support threshold-only setup.
  if (allScaledX.length === 0) {
    allScaledX.push(NaN);
  }

  return series.reduce((acc, { series, color }) => {
    if (series.type === 'line') {
      for (const datum of series.data as MixedLineBarChartProps.Datum<T>[]) {
        acc.push({ x: scaleX(datum.x), y: scaleY(datum.y), datum, series, color });
      }
    } else if (series.type === 'threshold') {
      for (const x of allScaledX) {
        acc.push({ x, y: scaleY(series.y), series, color });
      }
    }
    return acc;
  }, [] as ScaledPoint<T>[]);
}

/**
 * Collect unique x values from all data series.
 */
function getAllScaledX<T>(series: ReadonlyArray<InternalChartSeries<T>>, scaleX: (x: T) => number) {
  const addDataXSet = new Set<number>();
  for (const { series: s } of series) {
    if (s.type !== 'threshold') {
      for (const d of s.data) {
        addDataXSet.add(scaleX(d.x));
      }
    }
  }
  const allDataX: number[] = [];
  addDataXSet.forEach(x => allDataX.push(x));

  return allDataX;
}
