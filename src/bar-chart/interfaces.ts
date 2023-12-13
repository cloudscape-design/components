// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ScaleType } from '../internal/components/cartesian-chart/interfaces';
import { ChartDataTypes, CommonMixedChartProps, MixedLineBarChartProps } from '../mixed-line-bar-chart/interfaces';

type BarSeries<T> = MixedLineBarChartProps.BarDataSeries<T> | MixedLineBarChartProps.ThresholdSeries<T>;

export interface BarChartProps<T extends ChartDataTypes> extends CommonMixedChartProps<T> {
  /**
   * Array that represents the source of data for the displayed chart.
   * Each element can represent a bar series or a threshold, and can have the following properties:
   *
   * * `title` (string): A human-readable title for this series
   * * `type` (string): Series type (`"bar"`, or `"threshold"`)
   * * `data` (Array): An array of data points, represented as objects with `x` and `y` properties
   * * `color` (string): (Optional) A color hex value for this series. When assigned, it takes priority over the automatically assigned color
   * * `valueFormatter` (Function): (Optional) A function that formats data values before rendering in the UI, For example, in the details popover.
   */
  series: ReadonlyArray<BarSeries<T>>;

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
   * Use `categorical` for bar charts.
   */
  xScaleType?: ScaleType;
}

// W/o this documenter injects CartesianChartProps namespace properties into BarChartProps definition.
export namespace BarChartProps {}
