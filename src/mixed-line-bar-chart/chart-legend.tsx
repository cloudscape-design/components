// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import { ChartFilterProps } from '../internal/components/chart-filter';
import ChartLegend from '../internal/components/chart-legend';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { chartLegendMap } from './utils';

interface InternalChartLegendProps<T extends ChartDataTypes> {
  series: ReadonlyArray<InternalChartSeries<T>>;
  visibleSeries: ReadonlyArray<MixedLineBarChartProps.ChartSeries<T>>;
  plotContainerRef: React.RefObject<HTMLDivElement>;
  highlightedSeries?: MixedLineBarChartProps.ChartSeries<T> | null;
  onHighlightChange: (series: MixedLineBarChartProps.ChartSeries<T> | null) => void;
  legendTitle?: string;
  ariaLabel?: string;
}

export default function InternalChartLegend<T extends number | string | Date>({
  series,
  visibleSeries,
  highlightedSeries,
  onHighlightChange,
  legendTitle,
  ariaLabel,
  plotContainerRef,
}: InternalChartLegendProps<T>) {
  const legendItems: ChartFilterProps<MixedLineBarChartProps.ChartSeries<T>>['series'] = useMemo(() => {
    return series
      .filter(s => visibleSeries.indexOf(s.series) !== -1)
      .map(({ series, color }) => ({
        label: series.title,
        type: chartLegendMap[series.type],
        color,
        datum: series,
      }));
  }, [series, visibleSeries]);

  return (
    <ChartLegend<MixedLineBarChartProps.ChartSeries<T>>
      series={legendItems}
      highlightedSeries={highlightedSeries || null}
      onHighlightChange={onHighlightChange}
      legendTitle={legendTitle}
      ariaLabel={ariaLabel}
      plotContainerRef={plotContainerRef}
    />
  );
}
