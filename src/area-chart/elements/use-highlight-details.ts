// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useSelector } from '../async-store';
import { CartesianChartProps } from '../../internal/components/cartesian-chart/interfaces';
import { useInternalI18n } from '../../i18n/context';
import { AreaChartProps } from '../interfaces';
import { ChartModel } from '../model';
import formatHighlightedDataSeries, {
  ChartSeriesDetailItem,
} from '../../internal/components/chart-series-details/format-highlighted-data-series';

export interface HighlightDetails {
  isPopoverPinned: boolean;
  highlightIndex: number;
  formattedX: string;
  seriesTitle: string;
  formattedY: number | string;
  seriesDetails: readonly ChartSeriesDetailItem[];
  totalDetails: readonly ChartSeriesDetailItem[];
  pointDetails: null | ChartSeriesDetailItem;
  activeLabel: string;
}

export default function useHighlightDetails<T extends AreaChartProps.DataTypes>({
  model,
  xTickFormatter,
  yTickFormatter,
  detailTotalFormatter,
  detailTotalLabel,
  detailPopoverSeriesContent,
}: {
  model: ChartModel<T>;
  xTickFormatter?: CartesianChartProps.TickFormatter<T>;
  yTickFormatter?: CartesianChartProps.TickFormatter<number>;
  detailTotalFormatter?: CartesianChartProps.TickFormatter<number>;
  detailTotalLabel?: string;
  detailPopoverSeriesContent?: CartesianChartProps.DetailPopoverSeriesContent<T, AreaChartProps.AreaSeries<T>>;
}): null | HighlightDetails {
  const i18n = useInternalI18n('area-chart');
  const hX = useSelector(model.interactions, state => state.highlightedX);
  const hPoint = useSelector(model.interactions, state => state.highlightedPoint);
  const isPopoverPinned = useSelector(model.interactions, state => state.isPopoverPinned);

  if (!hX) {
    return null;
  }

  const [firstPoint] = hX;
  const highlightIndex = firstPoint.index.x;
  const seriesPoints = [...model.computed.plot.xs[highlightIndex]];
  const detailsTotal = seriesPoints.reduce((total, point) => total + point.value, 0);
  const formattedX = xTickFormatter ? xTickFormatter(firstPoint.x) : firstPoint.x.toString();
  const seriesTitle = hPoint ? getInternalSeries(hPoint).title : '';
  const formattedY = hPoint ? getInternalSeries(hPoint).formatValue(hPoint.value, hPoint.x) : '';
  const seriesDetails = seriesPoints.map(point => {
    const series = model.series[point.index.s];
    const isDimmed = Boolean(hPoint) && point !== hPoint;
    const { title, formatValue, color, markerType } = getInternalSeries(point);
    if (series.type === 'threshold') {
      return { key: title, value: formatValue(point.value, point.x), color, markerType, isDimmed };
    }
    const formattedSeries = formatHighlightedDataSeries<T, AreaChartProps.AreaSeries<T>>({
      componentName: 'AreaChart',
      series,
      x: point.x,
      y: point.value,
      detailPopoverSeriesContent,
    });
    return { ...formattedSeries, color, isDimmed, markerType };
  });
  const totalDetails = [
    {
      key: i18n('i18nStrings.detailTotalLabel', detailTotalLabel) || '',
      value: detailTotalFormatter
        ? detailTotalFormatter(detailsTotal)
        : yTickFormatter
        ? yTickFormatter(detailsTotal)
        : detailsTotal,
    },
  ];
  const pointDetails = hPoint ? seriesDetails[hPoint.index.s] : null;
  const activeLabel = `${seriesTitle} ${formattedX} ${formattedY}, ${totalDetails[0].key} ${totalDetails[0].value}`;

  return {
    isPopoverPinned,
    highlightIndex,
    formattedX,
    seriesTitle,
    formattedY,
    activeLabel,
    seriesDetails,
    totalDetails,
    pointDetails,
  };

  function getInternalSeries(point: ChartModel.PlotPoint<T>) {
    return model.getInternalSeries(model.series[point.index.s]);
  }
}
