// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartScale } from '../internal/components/cartesian-chart/scales';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { isDataSeries, isXThreshold, isYThreshold, matchesX } from './utils';

export interface ScaledBarGroup<T> {
  x: T;
  hasData: boolean;
  isValid: boolean;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Creates a list of all bar (and mixed) groups in the series with their scaled positions.
 */
export default function makeScaledBarGroups<T extends ChartDataTypes>(
  series: ReadonlyArray<InternalChartSeries<T>>,
  xScale: ChartScale,
  plotWidth: number,
  plotHeight: number,
  axis: 'x' | 'y'
): ScaledBarGroup<T>[] {
  if (!xScale.isCategorical()) {
    return [];
  }

  return (xScale.domain as ReadonlyArray<T>).map(x => {
    const scaledX = xScale.d3Scale(x);
    const isValid = typeof scaledX !== 'undefined' && isFinite(scaledX);

    return {
      x,
      isValid,
      hasData: series.some(({ series }) => {
        // If there is a threshold series, every valid group will have a data point.
        if (isYThreshold(series)) {
          return true;
        }
        // X-thresholds do not have associated value.
        if (isXThreshold(series)) {
          return false;
        }
        if (isDataSeries(series)) {
          return (series.data as ReadonlyArray<MixedLineBarChartProps.Datum<T>>).some(datum => matchesX(datum.x, x));
        }
        return false;
      }),
      position:
        axis === 'x'
          ? {
              x: 0,
              y: isValid ? scaledX || 0 : 0,
              width: plotWidth,
              height: xScale.d3Scale.bandwidth(),
            }
          : {
              x: isValid ? scaledX || 0 : 0,
              y: 0,
              width: xScale.d3Scale.bandwidth(),
              height: plotHeight,
            },
    };
  });
}
