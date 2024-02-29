// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BarChartProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import InternalMixedLineBarChart from '../mixed-line-bar-chart/internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { BarChartProps };

function BarChart<T extends number | string | Date>({
  series = [],
  height = 500,
  xScaleType = 'categorical',
  yScaleType = 'linear',
  stackedBars = false,
  horizontalBars = false,
  detailPopoverSize = 'medium',
  statusType = 'finished',
  emphasizeBaselineAxis = true,
  detailPopoverSeriesContent,
  ...props
}: BarChartProps<T>) {
  const baseComponentProps = useBaseComponent('BarChart', {
    props: {
      detailPopoverSize,
      emphasizeBaselineAxis,
      fitHeight: props.fitHeight,
      hideFilter: props.hideFilter,
      hideLegend: props.hideLegend,
      horizontalBars,
      stackedBars,
      xScaleType,
      yScaleType,
    },
  });
  const baseProps = getBaseProps(props);
  const className = clsx(baseProps.className, styles.root);

  return (
    <InternalMixedLineBarChart
      {...props}
      {...baseComponentProps}
      className={className}
      height={height}
      xScaleType={xScaleType}
      yScaleType={yScaleType}
      stackedBars={stackedBars}
      horizontalBars={horizontalBars}
      series={series}
      detailPopoverSize={detailPopoverSize}
      statusType={statusType}
      emphasizeBaselineAxis={emphasizeBaselineAxis}
      detailPopoverSeriesContent={detailPopoverSeriesContent}
    />
  );
}

applyDisplayName(BarChart, 'BarChart');

export default BarChart;
