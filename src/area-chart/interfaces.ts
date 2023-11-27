// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CartesianChartProps, ChartDataTypes } from '../internal/components/cartesian-chart/interfaces';

export interface AreaChartProps<T extends AreaChartProps.DataTypes>
  extends Omit<CartesianChartProps<T, AreaChartProps.Series<T>>, 'detailPopoverSeriesContent'> {
  /**
   * Array that represents the source of data for the displayed chart.
   * Each element can represent an area series, or a threshold, and can have the following properties:
   *
   * * `title` (string): A human-readable title for this series
   * * `type` (string): Series type (`"area"`, or `"threshold"`)
   * * `data` (Array): An array of data points, represented as objects with `x` and `y` properties. The `x` values must be consistent across all series
   * * `color` (string): (Optional) A color hex value for this series. When assigned, it takes priority over the automatically assigned color
   * * `valueFormatter` (Function): (Optional) A function that formats data values before rendering in the UI, For example, in the details popover.
   */
  series: ReadonlyArray<AreaChartProps.Series<T>>;

  /**
   * Function to format the displayed values total.
   */
  detailTotalFormatter?: AreaChartProps.TickFormatter<number>;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: AreaChartProps.I18nStrings<T>;
}

export namespace AreaChartProps {
  export type DataTypes = ChartDataTypes;

  export interface Datum<T> {
    x: T;
    y: number;
  }

  export type Series<T> = AreaSeries<T> | ThresholdSeries;

  export interface AreaSeries<T> {
    type: 'area';
    title: string;
    color?: string;
    data: T extends unknown ? ReadonlyArray<Datum<T>> : ReadonlyArray<Datum<T>>;
    valueFormatter?: ValueFormatter<number, T>;
  }

  export interface ThresholdSeries {
    type: 'threshold';
    title: string;
    color?: string;
    y: number;
    valueFormatter?: TickFormatter<number>;
  }

  export type FilterChangeDetail<T> = CartesianChartProps.FilterChangeDetail<Series<T>>;

  export type HighlightChangeDetail<T> = CartesianChartProps.HighlightChangeDetail<Series<T>>;

  export type TickFormatter<T> = CartesianChartProps.TickFormatter<T>;

  export type ValueFormatter<YType, XType = null> = CartesianChartProps.ValueFormatter<YType, XType>;

  export interface I18nStrings<T> extends CartesianChartProps.I18nStrings<T> {
    /** The title of the values total in the popover. */
    detailTotalLabel?: string;
    /** @deprecated Use `detailTotalFormatter` on the component instead. */
    detailTotalFormatter?: TickFormatter<number>;
  }
}
