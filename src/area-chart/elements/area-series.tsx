// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';
import { area, line } from 'd3-shape';

import { ChartModel } from '../model';

export interface AreaSeriesProps<T> {
  data: readonly ChartModel.PlotPoint<T>[];
  color: string;
  chartAreaClipPath: string;
}

export default memo(AreaSeries) as typeof AreaSeries;

function AreaSeries<T>({ data, color, chartAreaClipPath }: AreaSeriesProps<T>) {
  const areaGenerator = area<ChartModel.PlotPoint<T>>()
    .x((p: ChartModel.PlotPoint<T>) => p.scaled.x)
    .y0((p: ChartModel.PlotPoint<T>) => p.scaled.y0)
    .y1((p: ChartModel.PlotPoint<T>) => p.scaled.y1);
  const areaPath = areaGenerator(data as ChartModel.PlotPoint<T>[]) || '';

  const lineGenerator = line<ChartModel.PlotPoint<T>>()
    .x((p: ChartModel.PlotPoint<T>) => p.scaled.x)
    .y((p: ChartModel.PlotPoint<T>) => p.scaled.y1);
  const linePath = lineGenerator(data as ChartModel.PlotPoint<T>[]) || '';

  return (
    <>
      <path
        aria-hidden={true}
        fill={color}
        stroke={color}
        style={{ opacity: 0.4 }}
        clipPath={`url(#${chartAreaClipPath})`}
        d={areaPath}
      />
      <path aria-hidden={true} stroke={color} clipPath={`url(#${chartAreaClipPath})`} d={linePath} />
    </>
  );
}
