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

export interface MixedLineBarChartProps<T extends ChartDataTypes>
  extends CartesianChartProps<T, MixedLineBarChartProps.ChartSeries<T>> {
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
   * When set to `true`, adds a visual emphasis on the zero baseline axis.
   * See the usage guidelines for more details.
   */
  emphasizeBaselineAxis?: boolean;

  /**
   * Determines the type of scale for values on the x axis.
   * Use `categorical` for charts with bars.
   */
  xScaleType?: ScaleType;

  /**
   * Specifies custom rendering of the series displayed in the chart popover.
   * Use this for wrapping keys or values in links, or to display an additional
   * level of nested items.
   */
  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T>;
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

  export interface DetailPopoverSeriesContent<T> {
    ({ series, x, y }: { series: ChartSeries<T>; x: T; y: number }): {
      key: ReactNode;
      value: ReactNode;
      expandable?: boolean;
      subItems?: ReadonlyArray<{ key: ReactNode; value: ReactNode }>;
    };
  }
}

export interface VerticalMarkerX<T> {
  scaledX: number;
  label: T | null;
}
