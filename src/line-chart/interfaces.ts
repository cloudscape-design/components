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
   * Specifies custom rendering of the series displayed in the chart popover.
   * Use this for wrapping keys or values in links, or to display an additional
   * level of nested items.
   */
  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T>;
}

// W/o this documenter injects CartesianChartProps namespace properties into LineChartProps definition.
export namespace LineChartProps {}
