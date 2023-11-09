// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';
import { ChartSeriesDetailItem } from '../internal/components/chart-series-details';
import { CartesianChartProps } from '../internal/components/cartesian-chart/interfaces';
import { isDataSeries, isXThreshold, isYThreshold, matchesX } from './utils';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export interface HighlightDetails {
  position: string;
  details: ChartSeriesDetailItem[];
}

/** Formats provided x-position and its corresponding series values. */
export default function formatHighlighted<T extends ChartDataTypes>({
  position,
  series,
  xTickFormatter,
  detailPopoverSeriesContent,
}: {
  position: T;
  series: readonly InternalChartSeries<T>[];
  xTickFormatter?: CartesianChartProps.TickFormatter<T>;
  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T>;
}): HighlightDetails {
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
  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T>;
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
        const hasSubItems = !!customContent?.subItems?.length;
        const isExpandable = !!customContent?.expandable && hasSubItems;
        const isKeyString = typeof customContent?.key === 'string';
        const key = customContent?.key && (!isExpandable || isKeyString) ? customContent.key : series.title;

        if (customContent?.expandable && !hasSubItems) {
          warnOnce(
            'MixedLineBarChart',
            '`expandable` was set to `true` for a series without sub-items. This property will be ignored.'
          );
        }
        if (isExpandable && !isKeyString) {
          warnOnce(
            'MixedLineBarChart',
            'A ReactNode was used for the key of an expandable series. The series title will be used instead because nested interactive elements can cause accessiblity issues'
          );
        }
        if (!isKeyString && !isExpandable && customContent?.value && typeof customContent.value !== 'string') {
          warnOnce('MixedLineBarChart', 'Use a ReactNode for the key or the value of a series, but not for both');
        }

        return {
          key,
          value: customContent?.value || (series.valueFormatter ? series.valueFormatter(datum.y, targetX) : datum.y),
          color,
          markerType: series.type === 'line' ? 'line' : 'rectangle',
          subItems: customContent?.subItems,
          expandable: isExpandable,
        };
      }
    }
  }

  return null;
}
