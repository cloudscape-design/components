// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartDataTypes, CommonMixedChartProps, MixedLineBarChartProps } from '../mixed-line-bar-chart/interfaces';

type LineSeries<T> = MixedLineBarChartProps.LineDataSeries<T> | MixedLineBarChartProps.ThresholdSeries<T>;

export interface LineChartProps<T extends ChartDataTypes> extends CommonMixedChartProps<T> {
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
}

// W/o this documenter injects CartesianChartProps namespace properties into LineChartProps definition.
export namespace LineChartProps {}
