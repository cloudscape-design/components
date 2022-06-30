// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { ChartScale } from '../internal/components/cartesian-chart/scales';
import { matchesX } from './utils';

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
        if (series.type === 'threshold') {
          // If there is a threshold series, every valid group will have a data point
          return true;
        }
        return (series.data as ReadonlyArray<MixedLineBarChartProps.Datum<T>>).some(datum => matchesX(datum.x, x));
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
