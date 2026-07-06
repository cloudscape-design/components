// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MixedLineBarChartProps } from './interfaces';

export interface InternalChartSeries<T> {
  index: number;
  color: string;
  series: MixedLineBarChartProps.ChartSeries<T>;
}
