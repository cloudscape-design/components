// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useMemo } from 'react';

import { AreaChartProps } from '../interfaces';
import ChartLegend from '../../internal/components/chart-legend';
import { useSelector } from '../../internal/async-store';
import { ChartModel } from '../model';

export default memo(AreaChartLegend) as typeof AreaChartLegend;

function AreaChartLegend<T extends AreaChartProps.DataTypes>({
  model,
  legendTitle,
  ariaLabel,
  plotContainerRef,
}: {
  model: ChartModel<T>;
  plotContainerRef: React.RefObject<HTMLDivElement>;
  legendTitle?: string;
  ariaLabel?: string;
}) {
  const legendItems = useMemo(
    () =>
      model.series.map(s => {
        const { title, color, markerType } = model.getInternalSeries(s);
        return { label: title, color, type: markerType, datum: s };
      }),
    [model]
  );

  const legendSeries = useSelector(model.interactions, state => state.legendSeries);

  return (
    <ChartLegend
      series={legendItems}
      highlightedSeries={legendSeries}
      onHighlightChange={model.handlers.onLegendHighlight}
      legendTitle={legendTitle}
      ariaLabel={ariaLabel}
      plotContainerRef={plotContainerRef}
    />
  );
}
