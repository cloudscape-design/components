// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { applyDisplayName } from '../internal/utils/apply-display-name';

import { MixedLineBarChartProps } from './interfaces';
import InternalMixedLineBarChart from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { MixedLineBarChartProps };

function MixedLineBarChart<T extends number | string | Date>({
  series = [],
  height = 500,
  xScaleType = 'categorical',
  yScaleType = 'linear',
  stackedBars = false,
  horizontalBars = false,
  statusType = 'finished',
  detailPopoverSize = 'medium',
  emphasizeBaselineAxis = true,
  ...props
}: MixedLineBarChartProps<T>) {
  const baseComponentProps = useBaseComponent('MixedLineBarChart');
  return (
    <InternalMixedLineBarChart
      series={series}
      height={height}
      xScaleType={xScaleType}
      yScaleType={yScaleType}
      stackedBars={stackedBars}
      horizontalBars={horizontalBars}
      statusType={statusType}
      detailPopoverSize={detailPopoverSize}
      emphasizeBaselineAxis={emphasizeBaselineAxis}
      {...props}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(MixedLineBarChart, 'MixedLineBarChart');

export default MixedLineBarChart;
