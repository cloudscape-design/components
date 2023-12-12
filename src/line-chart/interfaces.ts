// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CartesianChartProps } from '../internal/components/cartesian-chart/interfaces';
import { ChartDataTypes, MixedLineBarChartProps } from '../mixed-line-bar-chart/interfaces';

type LineSeries<T> = MixedLineBarChartProps.LineDataSeries<T> | MixedLineBarChartProps.ThresholdSeries<T>;

export interface LineChartProps<T extends ChartDataTypes>
  extends CartesianChartProps<T, MixedLineBarChartProps.ChartSeries<T>> {
  /**
   * Array that represents the source of data for the displayed chart.
   * Each element can represent a line series or a threshold, and can have the following properties:
   *
   * * `title` (string): A human-readable title for this series
   * * `type` (string): Series type (`"line"`, or `"threshold"`)
   * * `data` (Array): An array of data points, represented as objects with `x` and `y` properties
   * * `color` (string): (Optional) A color hex value for this series. When assigned, it takes priority over the automatically assigned color
   * * `valueFormatter` (Function): (Optional) A function that formats data values before rendering in the UI, For example, in the details popover.
   */
  series: ReadonlyArray<LineSeries<T>>;

  /**
   * When set to `true`, adds a visual emphasis on the zero baseline axis.
   * See the usage guidelines for more details.
   */
  emphasizeBaselineAxis?: boolean;

  /**
   * A function that determines the details that are displayed in the popover for each series.
   * Use this for wrapping keys or values in links, or to display an additional level of nested items.
   *
   * The function expects an object with the shape `{ series, x, y }` representing the series, the highlighted x value and its corresponding y value,
   * and should return the following properties:
   * * `key` (ReactNode) - Name of the series.
   * * `value` (ReactNode) - Value of the series at the highlighted coordinate.
   * * `subItems` (ReadonlyArray<{ key: ReactNode; value: ReactNode }>) - (Optional) List of nested key-value pairs.
   * * `expandable` (boolean) - (Optional) Determines whether the optional list of nested items provided via `subItems` is expandable. Defaults to `false`.
   */
  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T>;
}

// W/o this documenter injects CartesianChartProps namespace properties into LineChartProps definition.
export namespace LineChartProps {}
