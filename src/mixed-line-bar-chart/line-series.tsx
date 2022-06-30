// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { line } from 'd3-shape';

import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import { MixedLineBarChartProps } from './interfaces';

export interface LineSeriesProps<T> {
  axis: 'x' | 'y';
  series: MixedLineBarChartProps.LineDataSeries<T> | MixedLineBarChartProps.ThresholdSeries;

  color: string;
  chartAreaClipPath: string;

  xScale: ChartScale;
  yScale: NumericChartScale;
}

export default function LineSeries<T>({ axis, series, color, xScale, yScale, chartAreaClipPath }: LineSeriesProps<T>) {
  const commonProps = {
    'aria-hidden': true,
    stroke: color,
    clipPath: `url(#${chartAreaClipPath})`,
  };

  // Ignore axis for line series as we only support horizontally-oriented lines.
  if (series.type === 'line') {
    const lineGenerator = line<MixedLineBarChartProps.Datum<T>>()
      .x((d: MixedLineBarChartProps.Datum<T>) => {
        let x = xScale.d3Scale(d.x as any) || 0;
        if (xScale.isCategorical()) {
          const offset = Math.max(0, xScale.d3Scale.bandwidth() - 1) / 2;
          x += offset;
        }
        return x;
      })
      .y((d: MixedLineBarChartProps.Datum<T>) => yScale.d3Scale(d.y) || 0);

    // Filter out any data that is not part of the xScale
    const visibleData = series.data.filter(({ x }) => xScale.d3Scale(x as any) !== undefined);

    return (
      <path
        {...commonProps}
        d={lineGenerator(visibleData as unknown as Array<MixedLineBarChartProps.Datum<T>>) || ''}
      />
    );
  } else {
    const range = xScale.d3Scale.range();
    const y = yScale.d3Scale(series.y);
    const coordinates =
      axis === 'x' ? { x1: range[0], x2: range[1], y1: y, y2: y } : { x1: y, x2: y, y1: range[0], y2: range[1] };
    return <line {...commonProps} {...coordinates} />;
  }
}
