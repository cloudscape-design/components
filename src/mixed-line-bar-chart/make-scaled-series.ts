// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { isXThreshold, isYThreshold } from './utils';

export interface ScaledPoint<T> {
  x: number;
  y: number;
  color: string;
  datum?: MixedLineBarChartProps.Datum<T> | undefined;
  series: MixedLineBarChartProps.ChartSeries<T>;
}

/** Combine all line series into an array of scaled data points with the given scales. */
export default function makeScaledSeries<T extends ChartDataTypes>(
  allSeries: ReadonlyArray<InternalChartSeries<T>>,
  xScale: ChartScale,
  yScale: NumericChartScale
): readonly ScaledPoint<T>[] {
  const xOffset = xScale.isCategorical() ? Math.max(0, xScale.d3Scale.bandwidth() - 1) / 2 : 0;
  const scaleX = (x: T) => (xScale.d3Scale(x as any) || 0) + xOffset;
  const scaleY = (y: number) => yScale.d3Scale(y) || 0;
  const allX = getAllX(allSeries);

  function mergeLineSeriesPointsWithXThresholds(
    scaledPoints: ScaledPoint<T>[],
    xThresholdSeries: MixedLineBarChartProps.ThresholdSeries<T> & { x: T },
    xThresholdSeriesColor: string
  ) {
    const x = scaleX(xThresholdSeries.x);

    // Locate a point the x-threshold can be inserted after (if such exists).
    let bisectIndex = -1;
    for (let i = 0; i < scaledPoints.length - 1; i++) {
      if (scaledPoints[i].x < x && x < scaledPoints[i + 1].x) {
        bisectIndex = i;
        break;
      }
    }

    // Insert x-threshold point into the given series using extrapolated Y value.
    // The extrapolated value is only used to render highlighted point on the chart plot.
    if (bisectIndex !== -1) {
      const prevY = scaledPoints[bisectIndex].datum?.y || 0;
      const nextY = scaledPoints[bisectIndex + 1].datum?.y || 0;
      const averageY = (prevY + nextY) / 2;
      scaledPoints.push({
        x: x,
        y: scaleY(averageY),
        datum: { x: xThresholdSeries.x, y: NaN },
        series: scaledPoints[bisectIndex].series,
        color: xThresholdSeriesColor,
      });
    }
  }

  const scaledSeriesX = allSeries.map(({ series, color }) => {
    const scaledPoints: ScaledPoint<T>[] = [];

    // Scale and add all line series data points.
    if (series.type === 'line') {
      for (const datum of series.data as MixedLineBarChartProps.Datum<T>[]) {
        scaledPoints.push({ x: scaleX(datum.x), y: scaleY(datum.y), datum, series, color });
      }

      // Sort scaled points to ensure correct x-thresholds insertion.
      scaledPoints.sort((s1, s2) => s1.x - s2.x);

      // Merge x-thresholds into series if they don't have a shared coordinate.
      for (const otherSeries of allSeries) {
        if (isXThreshold(otherSeries.series)) {
          mergeLineSeriesPointsWithXThresholds(scaledPoints, otherSeries.series, otherSeries.color);
        }
      }
    }
    // Y-thresholds only have Y. To make thresholds navigable they are mapped to all defined X values.
    else if (isYThreshold(series)) {
      for (const x of allX) {
        scaledPoints.push({ x: scaleX(x), y: scaleY(series.y), datum: { x, y: series.y }, series, color });
      }
      // Support threshold-only setup.
      if (allX.length === 0) {
        scaledPoints.push({ x: NaN, y: scaleY(series.y), series, color });
      }
    }
    // X-thresholds only have X. The y value is taken as NaN which means there is no associated point - only vertical marker.
    else if (isXThreshold(series)) {
      scaledPoints.push({ x: scaleX(series.x), y: NaN, datum: { x: series.x, y: NaN }, series, color });
    }
    // Bar series are handled separately.
    return scaledPoints;
  });

  // Sort scaled points by x to ensure their order matches visual order in the chart to support navigation.
  return flatten(scaledSeriesX).sort((s1, s2) => s1.x - s2.x);
}

/** Collect unique x values from all data series. */
function getAllX<T>(series: ReadonlyArray<InternalChartSeries<T>>) {
  const addDataXSet = new Set<T>();
  for (const { series: s } of series) {
    switch (s.type) {
      // Add all X values from data series.
      case 'bar':
      case 'line':
        for (const d of s.data) {
          addDataXSet.add(d.x);
        }
        break;

      case 'threshold':
        // X-thresholds have a single X value.
        if (isXThreshold(s)) {
          addDataXSet.add(s.x);
        }
        // Thresholds don't have X values.
        break;
    }
  }
  const allDataX: T[] = [];
  addDataXSet.forEach(x => allDataX.push(x));

  return allDataX;
}

function flatten<T>(arrays: T[][]): T[] {
  const merged: T[] = [];
  for (const array of arrays) {
    for (const item of array) {
      merged.push(item);
    }
  }
  return merged;
}
