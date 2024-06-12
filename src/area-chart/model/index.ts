// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ChartSeriesMarkerType } from '../../internal/components/chart-series-marker';
import { ChartScale, NumericChartScale } from '../../internal/components/cartesian-chart/scales';
import { XDomain, YDomain } from '../../internal/components/cartesian-chart/interfaces';
import { AreaChartProps } from '../interfaces';
import { ChartPlotRef } from '../../internal/components/chart-plot';
import { ReadonlyAsyncStore } from '../async-store';

export interface ChartModel<T extends AreaChartProps.DataTypes> {
  height: number;
  width: number;
  series: readonly AreaChartProps.Series<T>[];
  allSeries: readonly AreaChartProps.Series<T>[];
  getInternalSeries(series: AreaChartProps.Series<T>): ChartModel.InternalSeries<T>;
  computed: ChartModel.ComputedProps<T>;
  handlers: {
    onSVGMouseMove: (event: React.MouseEvent<SVGElement>) => void;
    onSVGMouseOut: (event: React.MouseEvent<SVGElement>) => void;
    onSVGMouseDown: (event: React.MouseEvent<SVGSVGElement>) => void;
    onSVGKeyDown: (event: React.KeyboardEvent<HTMLElement | SVGElement>) => void;
    onApplicationFocus: (event: React.FocusEvent<Element>, trigger: 'mouse' | 'keyboard') => void;
    onApplicationBlur: (event: React.FocusEvent<Element>) => void;
    onFilterSeries: (series: readonly AreaChartProps.Series<T>[]) => void;
    onLegendHighlight: (series: null | AreaChartProps.Series<T>) => void;
    onPopoverDismiss: (outsideClick?: boolean) => void;
    onContainerBlur: () => void;
    onDocumentKeyDown: (event: KeyboardEvent) => void;
    onPopoverLeave: (event: React.MouseEvent) => void;
  };
  interactions: ReadonlyAsyncStore<ChartModel.InteractionsState<T>>;
  refs: {
    plot: React.RefObject<ChartPlotRef>;
    plotMeasure: React.Ref<SVGLineElement>;
    container: React.RefObject<HTMLDivElement>;
    verticalMarker: React.RefObject<SVGLineElement>;
    popoverRef: React.RefObject<HTMLElement>;
  };
}

export namespace ChartModel {
  export interface ComputedProps<T extends AreaChartProps.DataTypes> {
    xDomain: XDomain<T>;
    yDomain: YDomain;
    xScale: ChartScale;
    yScale: NumericChartScale;
    xTicks: AreaChartProps.DataTypes[];
    yTicks: number[];
    plot: {
      xy: readonly PlotPoint<T>[][];
      xs: readonly PlotPoint<T>[][];
      sx: readonly PlotPoint<T>[][];
    };
  }

  export interface InteractionsState<T> {
    highlightedX: null | readonly PlotPoint<T>[];
    highlightedPoint: null | PlotPoint<T>;
    highlightedSeries: null | AreaChartProps.Series<T>;
    legendSeries: null | AreaChartProps.Series<T>;
    isPopoverPinned: boolean;
  }

  export interface InternalSeries<T> {
    series: AreaChartProps.Series<T>;
    title: string;
    color: string;
    markerType: ChartSeriesMarkerType;
    formatValue: (y: number, x: T) => string | number;
  }

  export interface PlotPoint<T> {
    x: T;
    y0: number;
    y1: number;
    scaled: { x: number; y0: number; y1: number };
    index: { x: number; y: number; s: number };
    value: number;
  }
}
