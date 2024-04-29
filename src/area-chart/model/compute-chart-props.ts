// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AreaChartProps } from '../interfaces';
import { computePlotPoints, computeDomainX, computeDomainY } from './utils';

import {
  ChartDomain,
  XDomain,
  XScaleType,
  YDomain,
  YScaleType,
} from '../../internal/components/cartesian-chart/interfaces';
import {
  createXTicks,
  createYTicks,
  getXTickCount,
  getYTickCount,
} from '../../internal/components/cartesian-chart/ticks';
import { ChartScale, NumericChartScale } from '../../internal/components/cartesian-chart/scales';

export default function computeChartProps<T extends AreaChartProps.DataTypes>({
  isRtl,
  series,
  xDomain: externalXDomain,
  yDomain: externalYDomain,
  xScaleType,
  yScaleType,
  height,
  width,
}: {
  isRtl?: boolean;
  series: readonly AreaChartProps.Series<T>[];
  xDomain?: XDomain<T>;
  yDomain?: YDomain;
  xScaleType: XScaleType;
  yScaleType: YScaleType;
  height: number;
  width: number;
}) {
  const xDomain = externalXDomain ? ([...externalXDomain] as unknown as ChartDomain<T>) : computeDomainX(series);
  if (isRtl && Array.isArray(xDomain)) {
    xDomain.reverse();
  }

  const xTickCount = getXTickCount(width);
  const xScale = new ChartScale(xScaleType, xDomain, [0, width]);
  const xTicks = xScale.domain.length > 0 ? createXTicks(xScale, xTickCount) : [];

  const yDomain = externalYDomain || computeDomainY(series, yScaleType);
  const yTickCount = getYTickCount(height);
  const yScale = new NumericChartScale(yScaleType, yDomain, [height, 0], externalYDomain ? null : yTickCount);
  const yTicks = createYTicks(yScale, yTickCount);

  const plot = computePlotPoints(series, xScale, yScale);

  return { xDomain, yDomain, xScale, yScale, xTicks, yTicks, plot };
}
