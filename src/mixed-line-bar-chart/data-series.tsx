// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '../internal/hooks/use-unique-id';
import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import LineSeries from './line-series';
import BarSeries from './bar-series';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';

import styles from './styles.css.js';
import { calculateStackedBarValues } from './utils';

// Should have the same value as the `border-line-chart-width` token.
const STROKE_WIDTH = 2;

export interface DataSeriesProps<T> {
  axis: 'x' | 'y';

  plotHeight: number;
  plotWidth: number;

  highlightedSeries: MixedLineBarChartProps.ChartSeries<T> | null;
  highlightedGroupIndex: number | null;

  stackedBars: boolean;
  isGroupNavigation: boolean;

  visibleSeries: ReadonlyArray<InternalChartSeries<T>>;
  xScale: ChartScale;
  yScale: NumericChartScale;
}

export default function DataSeries<T extends ChartDataTypes>({
  axis,
  plotHeight,
  plotWidth,
  highlightedGroupIndex,
  highlightedSeries,
  stackedBars,
  isGroupNavigation,
  visibleSeries,
  xScale,
  yScale,
}: DataSeriesProps<T>) {
  const chartAreaClipPath = useUniqueId('awsui-mixed-line-bar-chart__chart-area-');

  // Lines get a small extra space at the top and bottom to account for the strokes when they are at the edge of the graph.
  const lineAreaClipPath = useUniqueId('awsui-line-chart__chart-area-');

  const stackedBarValues = useMemo(() => {
    if (!stackedBars) {
      return undefined;
    }
    const barData: Array<readonly MixedLineBarChartProps.Datum<ChartDataTypes>[]> = [];
    visibleSeries.forEach(({ series }) => {
      if (series.type === 'bar') {
        barData.push(series.data);
      } else {
        barData.push([]);
      }
    });
    return calculateStackedBarValues(barData);
  }, [visibleSeries, stackedBars]);

  return (
    <>
      <defs aria-hidden="true">
        <clipPath id={chartAreaClipPath}>
          <rect x={0} y={0} width={plotWidth} height={plotHeight} />
        </clipPath>
        <clipPath id={lineAreaClipPath}>
          <rect x={0} y={-STROKE_WIDTH / 2} width={plotWidth} height={plotHeight + STROKE_WIDTH} />
        </clipPath>
      </defs>
      <g aria-hidden={isGroupNavigation ? true : undefined} role="group">
        {visibleSeries.map(({ series, color }, index) => {
          const isHighlighted = series === highlightedSeries;
          const isDimmed = !!highlightedSeries && !isHighlighted;

          switch (series.type) {
            case 'line':
            case 'threshold': {
              return (
                <g
                  key={index}
                  role="group"
                  aria-label={series.title}
                  className={clsx(styles.series, styles[`series--${series.type}`], {
                    [styles['series--highlighted']]: isHighlighted,
                    [styles['series--dimmed']]: isDimmed,
                  })}
                >
                  <LineSeries
                    axis={axis}
                    series={series}
                    color={color}
                    xScale={xScale}
                    yScale={yScale}
                    chartAreaClipPath={lineAreaClipPath}
                  />
                </g>
              );
            }

            case 'bar':
              return (
                <BarSeries
                  key={index}
                  axis={axis}
                  series={series}
                  color={color}
                  totalSeriesCount={visibleSeries.filter(s => s.series.type === 'bar').length}
                  seriesIndex={index}
                  xScale={xScale}
                  yScale={yScale}
                  plotSize={axis === 'y' ? plotWidth : plotHeight}
                  highlighted={isHighlighted}
                  dimmed={isDimmed}
                  chartAreaClipPath={chartAreaClipPath}
                  stackedBarValues={stackedBarValues}
                  highlightedGroupIndex={highlightedGroupIndex}
                />
              );
          }
        })}
      </g>
    </>
  );
}
