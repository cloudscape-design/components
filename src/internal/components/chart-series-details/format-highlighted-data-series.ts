// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import { AreaChartProps } from '../../../area-chart/interfaces';
import { MixedLineBarChartProps } from '../../../mixed-line-bar-chart/interfaces';
import { CartesianChartProps } from '../cartesian-chart/interfaces';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { ChartDetailPair } from '../../../pie-chart/interfaces';
import { ChartSeriesMarkerType } from '../chart-series-marker';

export interface ChartSeriesDetailItem extends ChartDetailPair {
  markerType?: ChartSeriesMarkerType;
  color?: string;
  isDimmed?: boolean;
  subItems?: ReadonlyArray<{ key: ReactNode; value: ReactNode }>;
  expandable?: boolean;
}

type CartesianChartSeries<T> = AreaChartProps.AreaSeries<T> | MixedLineBarChartProps.DataSeries<T>;

export default function formatHighlightedDataSeries<T, Series extends CartesianChartSeries<T>>({
  componentName,
  series,
  x,
  y,
  detailPopoverSeriesContent,
}: {
  componentName: string;
  x: T;
  y: number;
  series: Series;
  detailPopoverSeriesContent?: CartesianChartProps.DetailPopoverSeriesContent<T, Series>;
}): ChartSeriesDetailItem {
  const customContent = detailPopoverSeriesContent ? detailPopoverSeriesContent({ series, x, y }) : undefined;
  const hasSubItems = !!customContent?.subItems?.length;
  const isExpandable = !!customContent?.expandable && hasSubItems;
  const isKeyString = typeof customContent?.key === 'string';
  const key = customContent?.key && (!isExpandable || isKeyString) ? customContent.key : series.title;

  if (customContent?.expandable && !hasSubItems) {
    warnOnce(
      componentName,
      '`expandable` was set to `true` for a series without sub-items. This property will be ignored.'
    );
  }
  if (isExpandable && !isKeyString) {
    warnOnce(
      componentName,
      'A ReactNode was used for the key of an expandable series. The series title will be used instead because nested interactive elements can cause accessiblity issues'
    );
  }
  if (!isKeyString && !isExpandable && customContent?.value && typeof customContent.value !== 'string') {
    warnOnce(componentName, 'Use a ReactNode for the key or the value of a series, but not for both');
  }

  return {
    key,
    value: customContent?.value || (series.valueFormatter ? series.valueFormatter(y, x) : y),
    subItems: customContent?.subItems,
    expandable: isExpandable,
  };
}
