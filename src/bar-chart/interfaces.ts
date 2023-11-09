// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CartesianChartProps, ScaleType } from '../internal/components/cartesian-chart/interfaces';
import { ChartDataTypes, MixedLineBarChartProps } from '../mixed-line-bar-chart/interfaces';

type BarSeries<T> = MixedLineBarChartProps.BarDataSeries<T> | MixedLineBarChartProps.ThresholdSeries<T>;

export interface BarChartProps<T extends ChartDataTypes>
  extends CartesianChartProps<T, MixedLineBarChartProps.ChartSeries<T>> {
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
   * When set to `true`, adds a visual emphasis on the zero baseline axis.
   * See the usage guidelines for more details.
   */
  emphasizeBaselineAxis?: boolean;

  /**
   * Determines the type of scale for values on the x axis.
   * Use `categorical` for bar charts.
   */
  xScaleType?: ScaleType;

  /**
   * Specifies custom rendering of the series displayed in the chart popover.
   * Use this for wrapping keys or values in links, or to display an additional
   * level of nested items.
   */
  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T, BarSeries<T>>;
}

// W/o this documenter injects CartesianChartProps namespace properties into BarChartProps definition.
export namespace BarChartProps {}
