// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';

import ChartFilter from '../../internal/components/chart-filter';
import { AreaChartProps } from '../interfaces';
import { ChartModel } from '../model';

export default memo(AreaChartFilter) as typeof AreaChartFilter;

function AreaChartFilter<T extends AreaChartProps.DataTypes>({
  model,
  filterLabel,
  filterPlaceholder,
  filterSelectedAriaLabel,
}: {
  model: ChartModel<T>;
  filterLabel?: string;
  filterPlaceholder?: string;
  filterSelectedAriaLabel?: string;
}) {
  const filterItems = model.allSeries.map(s => {
    const { title, color, markerType } = model.getInternalSeries(s);
    return { label: title, color, type: markerType, datum: s };
  });

  return (
    <ChartFilter
      series={filterItems}
      onChange={model.handlers.onFilterSeries}
      selectedSeries={model.series}
      i18nStrings={{
        filterLabel,
        filterPlaceholder,
        filterSelectedAriaLabel,
      }}
    />
  );
}
