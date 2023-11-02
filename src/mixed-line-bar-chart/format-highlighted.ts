// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { ChartSeriesDetailItem } from '../internal/components/chart-series-details';
import { CartesianChartProps } from '../internal/components/cartesian-chart/interfaces';
import { isDataSeries, isXThreshold, isYThreshold, matchesX } from './utils';

export interface HighlightDetails {
  position: string;
  details: ChartSeriesDetailItem[];
}

/** Formats provided x-position and its corresponding series values. */
export default function formatHighlighted<T extends ChartDataTypes>(
  position: T,
  series: readonly InternalChartSeries<T>[],
  xTickFormatter?: CartesianChartProps.TickFormatter<T>,
  detailPopoverSeriesContent?: CartesianChartProps.DetailPopoverSeriesContent<T, MixedLineBarChartProps.ChartSeries<T>>
): HighlightDetails {
  const formattedPosition = xTickFormatter ? xTickFormatter(position) : position.toString();

  const details: ChartSeriesDetailItem[] = [];
  series.forEach(s => {
    const detail = getSeriesDetail({ internalSeries: s, targetX: position, detailPopoverSeriesContent });
    if (detail) {
      details.push(detail);
    }
  });

  return { position: formattedPosition, details };
}

function getSeriesDetail<T>({
  internalSeries,
  targetX,
  detailPopoverSeriesContent,
}: {
  internalSeries: InternalChartSeries<T>;
  targetX: T;
  detailPopoverSeriesContent?: CartesianChartProps.DetailPopoverSeriesContent<T, MixedLineBarChartProps.ChartSeries<T>>;
}): ChartSeriesDetailItem | null {
  const { series, color } = internalSeries;

  // X-thresholds are only shown when X matches.
  if (isXThreshold(series)) {
    return series.x === targetX
      ? {
          key: series.title,
          value: '',
          color,
          markerType: 'dashed',
        }
      : null;
  }

  if (isYThreshold(series)) {
    return {
      key: series.title,
      value: series.valueFormatter ? series.valueFormatter(series.y) : series.y,
      color,
      markerType: 'dashed',
    };
  }

  if (isDataSeries(series)) {
    for (const datum of series.data) {
      if (matchesX(targetX, datum.x)) {
        const customContent = detailPopoverSeriesContent
          ? detailPopoverSeriesContent({ series, x: targetX, y: datum.y })
          : undefined;
        return {
          key: customContent?.key || series.title,
          value: customContent?.value || (series.valueFormatter ? series.valueFormatter(datum.y, targetX) : datum.y),
          color,
          markerType: series.type === 'line' ? 'line' : 'rectangle',
          details: customContent?.details,
        };
      }
    }
  }

  return null;
}
