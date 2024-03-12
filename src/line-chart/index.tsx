// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { LineChartProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import InternalMixedLineBarChart from '../mixed-line-bar-chart/internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { LineChartProps };

function LineChart<T extends number | string | Date>({
  series = [],
  height = 500,
  xScaleType = 'linear',
  yScaleType = 'linear',
  detailPopoverSize = 'medium',
  statusType = 'finished',
  emphasizeBaselineAxis = true,
  ...props
}: LineChartProps<T>) {
  const baseComponentProps = useBaseComponent('LineChart', {
    props: {
      detailPopoverSize,
      emphasizeBaselineAxis,
      fitHeight: props.fitHeight,
      hideFilter: props.hideFilter,
      hideLegend: props.hideLegend,
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
      stackedBars={false}
      horizontalBars={false}
      series={series}
      detailPopoverSize={detailPopoverSize}
      statusType={statusType}
      emphasizeBaselineAxis={emphasizeBaselineAxis}
    />
  );
}

applyDisplayName(LineChart, 'LineChart');

export default LineChart;
