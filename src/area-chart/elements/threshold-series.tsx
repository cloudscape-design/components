// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';

import { ChartScale } from '../../internal/components/cartesian-chart/scales';
import { ChartModel } from '../model';

export interface ThresholdSeriesProps<T> {
  data: readonly ChartModel.PlotPoint<T>[];
  xScale: ChartScale;
  color: string;
  chartAreaClipPath: string;
}

export default memo(ThresholdSeries) as typeof ThresholdSeries;

function ThresholdSeries<T>({ data, xScale, color, chartAreaClipPath }: ThresholdSeriesProps<T>) {
  const range = xScale.d3Scale.range();
  const y = data[0].scaled.y0;
  const path = { x1: range[0], x2: range[1], y1: y, y2: y };

  return <line aria-hidden={true} stroke={color} clipPath={`url(#${chartAreaClipPath})`} {...path} />;
}
