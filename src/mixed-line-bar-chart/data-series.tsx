// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '../internal/hooks/use-unique-id';
import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import LineSeries from './line-series';
import BarSeries from './bar-series';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps } from './interfaces';

import styles from './styles.css.js';
import { calculateOffsetMaps, StackedOffsets } from './utils';

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
  const seriesRef = useRef<SVGGElement | null>(null);
  const strokeWidth = useRef(0);

  const stackedBarOffsetMaps: StackedOffsets[] = useMemo(() => {
    if (!stackedBars) {
      return [];
    }

    const barData: Array<readonly MixedLineBarChartProps.Datum<ChartDataTypes>[]> = [];
    visibleSeries.forEach(({ series }) => {
      if (series.type === 'bar') {
        barData.push(series.data);
      }
    });
    return calculateOffsetMaps(barData);
  }, [visibleSeries, stackedBars]);

  useLayoutEffect(() => {
    if (!strokeWidth.current && seriesRef.current) {
      strokeWidth.current = parseInt(getComputedStyle(seriesRef.current).strokeWidth);
    }
  });

  return (
    <>
      <defs aria-hidden="true">
        <clipPath id={chartAreaClipPath}>
          <rect x={0} y={-strokeWidth.current / 2} width={plotWidth} height={plotHeight + strokeWidth.current} />
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
                  ref={index === 0 ? seriesRef : undefined}
                >
                  <LineSeries
                    axis={axis}
                    series={series}
                    color={color}
                    xScale={xScale}
                    yScale={yScale}
                    chartAreaClipPath={chartAreaClipPath}
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
                  stackedBarOffsets={stackedBarOffsetMaps[index]}
                  highlightedGroupIndex={highlightedGroupIndex}
                />
              );
          }
        })}
      </g>
    </>
  );
}
