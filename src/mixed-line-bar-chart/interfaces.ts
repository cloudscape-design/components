// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

import { CartesianChartProps } from '../internal/components/cartesian-chart/interfaces';

export type ChartDataTypes = number | string | Date;

export type SeriesType = 'line' | 'bar';
export type ScaleType = 'linear' | 'log' | 'time' | 'categorical';
export type ScaleRange = [number, number];

export interface InternalChartSeries<T> {
  index: number;
  color: string;
  series: MixedLineBarChartProps.ChartSeries<T>;
}

// Properties that are shared as is (including API doc comments) by mixed, line and bar charts.
export interface CommonMixedChartProps<T extends ChartDataTypes>
  extends CartesianChartProps<T, MixedLineBarChartProps.ChartSeries<T>> {
  /**
   * When set to `true`, adds a visual emphasis on the zero baseline axis.
   * See the usage guidelines for more details.
   */
  emphasizeBaselineAxis?: boolean;

  /**
   * A function that determines the details that are displayed in the popover for each series.
   * Use this for wrapping keys or values in external links, or to display a metric breakdown by adding an additional level of nested items.
   *
   * The function is called with the parameters `{ series, x, y }` representing the series, the highlighted x coordinate value and its corresponding y value respectively,
   * and should return the following properties:
   * * `key` (ReactNode) - Name of the series.
   * * `value` (ReactNode) - Value of the series at the highlighted x coordinate.
   * * `subItems` (ReadonlyArray<{ key: ReactNode; value: ReactNode }>) - (Optional) List of nested key-value pairs.
   * * `expandable` (boolean) - (Optional) Determines whether the optional list of nested items provided via `subItems` is expandable. This is `false` by default.
   */
  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T>;
}

export interface MixedLineBarChartProps<T extends ChartDataTypes> extends CommonMixedChartProps<T> {
  /**
   * Array that represents the source of data for the displayed chart.
   * Each element can represent a line series, bar series, or a threshold, and can have the following properties:
   *
   * * `title` (string): A human-readable title for this series.
   * * `type` (string): Series type (`"line"`, `"bar"`, or `"threshold"`).
   * * `data` (Array): For line and bar series, an array of data points, represented as objects with `x` and `y` properties.
   * * `y` (number): For threshold series, the value of the threshold.
   * * `color` (string): (Optional) A color hex value for this series. When assigned, it takes priority over the automatically assigned color.
   * * `valueFormatter` (Function): (Optional) A function that formats data values before rendering in the UI, For example, in the details popover.
   */
  series: ReadonlyArray<MixedLineBarChartProps.ChartSeries<T>>;

  /**
   * When set to `true`, bars in the same data point are stacked instead of grouped next to each other.
   */
  stackedBars?: boolean;

  /**
   * When set to `true`, the x and y axes are flipped, which causes any bars to be rendered horizontally instead of vertically.
   * This can only be used when the chart consists exclusively of bar series.
   */
  horizontalBars?: boolean;

  /**
   * Determines the type of scale for values on the x axis.
   * Use `categorical` for charts with bars.
   */
  xScaleType?: ScaleType;
}

export namespace MixedLineBarChartProps {
  export interface Datum<T> {
    x: T;
    y: number;
  }

  interface IDataSeries<T> {
    type: 'line' | 'bar' | 'threshold';
    title: string;
    color?: string;

    // This makes sure that the element type of the array is reduced to just one type,
    // even if `T` is a union type, e.g. `number | string`.
    data: T extends unknown ? ReadonlyArray<Datum<T>> : ReadonlyArray<Datum<T>>;
    valueFormatter?: T extends unknown
      ? CartesianChartProps.ValueFormatter<number, T>
      : CartesianChartProps.ValueFormatter<number, T>;
  }

  export interface BarDataSeries<T> extends IDataSeries<T> {
    type: 'bar';
  }

  export interface LineDataSeries<T> extends IDataSeries<T> {
    type: 'line';
  }

  export interface ThresholdSeries<T = any> extends Omit<IDataSeries<never>, 'data' | 'valueFormatter'> {
    type: 'threshold';
    y?: number;
    x?: T;
    valueFormatter?: CartesianChartProps.TickFormatter<number>;
  }

  export interface YThresholdSeries extends Omit<ThresholdSeries<never>, 'x'> {
    type: 'threshold';
    y: number;
    valueFormatter?: CartesianChartProps.TickFormatter<number>;
  }

  export interface XThresholdSeries<T> extends Omit<ThresholdSeries<T>, 'y' | 'valueFormatter'> {
    type: 'threshold';
    x: T;
  }

  export type DataSeries<T> = LineDataSeries<T> | BarDataSeries<T>;

  export type ChartSeries<T> = DataSeries<T> | ThresholdSeries<T>;

  export type FilterChangeDetail<T> = CartesianChartProps.FilterChangeDetail<ChartSeries<T>>;

  export type HighlightChangeDetail<T> = CartesianChartProps.HighlightChangeDetail<ChartSeries<T>>;

  export type TickFormatter<T> = CartesianChartProps.TickFormatter<T>;

  export type ValueFormatter<YType, XType = null> = CartesianChartProps.ValueFormatter<YType, XType>;

  export type I18nStrings<T> = CartesianChartProps.I18nStrings<T>;

  export interface DetailPopoverSeriesData<T> {
    series: ChartSeries<T>;
    x: T;
    y: number;
  }

  export interface DetailPopoverSeriesKeyValuePair {
    key: ReactNode;
    value: ReactNode;
    expandable?: boolean;
    subItems?: ReadonlyArray<{ key: ReactNode; value: ReactNode }>;
  }

  export interface DetailPopoverSeriesContent<T> {
    (data: DetailPopoverSeriesData<T>): DetailPopoverSeriesKeyValuePair;
  }
}

export interface VerticalMarkerX<T> {
  scaledX: number;
  label: T | null;
}
