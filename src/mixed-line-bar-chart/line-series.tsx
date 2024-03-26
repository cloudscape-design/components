// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { line } from 'd3-shape';

import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import { MixedLineBarChartProps } from './interfaces';
import { isXThreshold, isYThreshold } from './utils';

export interface LineSeriesProps<T> {
  axis: 'x' | 'y';
  series: MixedLineBarChartProps.LineDataSeries<T> | MixedLineBarChartProps.ThresholdSeries<T>;

  color: string;
  chartAreaClipPath: string;

  xScale: ChartScale;
  yScale: NumericChartScale;
}

export default function LineSeries<T>({ axis, series, color, xScale, yScale, chartAreaClipPath }: LineSeriesProps<T>) {
  const commonProps = { 'aria-hidden': true, stroke: color, clipPath: `url(#${chartAreaClipPath})` };

  // Render data path. The chart orientation is ignored as only horizontally-oriented lines are supported.
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
    let visibleData = series.data.filter(({ x }) => xScale.d3Scale(x as any) !== undefined);

    if (xScale.isCategorical()) {
      // sort the data points in the same order as the categories provided in `xDomain`
      visibleData = visibleData.sort(
        (a, b) => xScale.domain.indexOf(a.x as string) - xScale.domain.indexOf(b.x as string)
      );
    }

    return (
      <path
        {...commonProps}
        d={lineGenerator(visibleData as unknown as Array<MixedLineBarChartProps.Datum<T>>) || ''}
      />
    );
  }
  // Render a horizontal line (vertical if chart orientation is inverted).
  else if (isYThreshold(series)) {
    const [x1, x2] = xScale.d3Scale.range();
    const y = yScale.d3Scale(series.y);
    const coordinates = axis === 'x' ? { x1, x2, y1: y, y2: y } : { x1: y, x2: y, y1: x1, y2: x2 };
    return <line {...commonProps} {...coordinates} />;
  }
  // Render a vertical line (horizontal if chart orientation is inverted).
  // The offset is necessary for categorical scale to render the line in the middle of the category bar.
  else if (isXThreshold(series)) {
    const [y1, y2] = yScale.d3Scale.range();
    const xOffset = xScale.isCategorical() ? Math.max(0, xScale.d3Scale.bandwidth() - 1) / 2 : 0;
    const x = (xScale.d3Scale(series.x as any) ?? NaN) + xOffset;
    const coordinates = axis === 'x' ? { x1: x, x2: x, y1, y2 } : { x1: y1, x2: y2, y1: x, y2: x };
    return <line {...commonProps} {...coordinates} />;
  }
  // Bar series are handled separately.
  else {
    return null;
  }
}
