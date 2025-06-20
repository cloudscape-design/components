// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useMemo } from 'react';

import ChartLegend from '../../internal/components/chart-legend/index.js';
import ChartSeriesMarker from '../../internal/components/chart-series-marker/index.js';
import { useSelector } from '../async-store/index.js';
import { AreaChartProps } from '../interfaces.js';
import { ChartModel } from '../model/index.js';

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
        return { label: title, marker: <ChartSeriesMarker color={color} type={markerType} />, datum: s };
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
