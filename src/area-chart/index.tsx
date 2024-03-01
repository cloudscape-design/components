// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { applyDisplayName } from '../internal/utils/apply-display-name';

import { AreaChartProps } from './interfaces';
import InternalAreaChart from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { AreaChartProps };

function AreaChart<T extends AreaChartProps.DataTypes>({
  height = 500,
  xScaleType = 'linear',
  yScaleType = 'linear',
  statusType = 'finished',
  detailPopoverSize = 'medium',
  i18nStrings = {},
  ...props
}: AreaChartProps<T>) {
  const baseComponentProps = useBaseComponent('AreaChart', {
    props: {
      detailPopoverSize,
      hideLegend: props.hideLegend,
      hideFilter: props.hideFilter,
      fitHeight: props.fitHeight,
      xScaleType,
      yScaleType,
    },
  });
  return (
    <InternalAreaChart
      height={height}
      xScaleType={xScaleType}
      yScaleType={yScaleType}
      statusType={statusType}
      detailPopoverSize={detailPopoverSize}
      i18nStrings={i18nStrings}
      {...props}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(AreaChart, 'AreaChart');

export default AreaChart;
