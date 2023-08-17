// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { ScaleContinuousNumeric, ScaleTime } from '../internal/vendor/d3-scale';

import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import { ChartDataTypes, MixedLineBarChartProps } from './interfaces';
import { matchesX, getKeyValue, StackedOffsets } from './utils';
import styles from './styles.css.js';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
export interface BarSeriesProps<T> {
  axis: 'x' | 'y';

  series: MixedLineBarChartProps.BarDataSeries<T>;

  color: string;
  totalSeriesCount: number;
  seriesIndex: number;

  xScale: ChartScale;
  yScale: NumericChartScale;

  plotSize: number;
  chartAreaClipPath: string;

  highlighted: boolean;
  dimmed: boolean;
  highlightedGroupIndex: number | null;

  // Contains the cumulative offset for each x value in a stacked bar chart
  stackedBarOffsets?: StackedOffsets;
}

export default function BarSeries<T extends ChartDataTypes>({
  axis,
  series,
  color,
  xScale,
  yScale,
  highlighted,
  dimmed,
  highlightedGroupIndex,
  stackedBarOffsets,
  totalSeriesCount,
  seriesIndex,
  plotSize,
  chartAreaClipPath,
}: BarSeriesProps<T>) {
  const isRefresh = useVisualRefresh();

  const xCoordinates = useMemo(() => {
    if (series.type !== 'bar' || !xScale.isCategorical()) {
      return [];
    }

    const yContinuosScale: ScaleContinuousNumeric<number, number> | ScaleTime<number, number> = yScale.d3Scale;
    const xPoints = (series.data as ReadonlyArray<MixedLineBarChartProps.Datum<ChartDataTypes>>).map(
      ({ x }) => xScale.d3Scale(x) || NaN
    );

    const zeroY = yScale.d3Scale(0) ?? NaN;
    const baseY = isFinite(zeroY) ? Math.min(plotSize, zeroY) : plotSize;

    let barWidth = xScale.d3Scale.bandwidth();

    const PADDING = 4;
    const MINWIDTH = 4;

    if (!stackedBarOffsets && totalSeriesCount > 1) {
      // Regular grouped bars
      barWidth = (barWidth - (totalSeriesCount - 1) * PADDING) / totalSeriesCount;
      barWidth = Math.max(barWidth, MINWIDTH);
    }

    return xPoints.map((x, i) => {
      const d = series.data[i];
      let barX = x;
      let yValue = d.y;

      if (stackedBarOffsets) {
        // Stacked bars
        const offsetMap = d.y < 0 ? stackedBarOffsets.negativeOffsets : stackedBarOffsets.positiveOffsets;
        yValue = d.y + (offsetMap[getKeyValue(d.x)] || 0);
      } else if (totalSeriesCount > 1) {
        // Regular grouped bars
        barX += seriesIndex * (barWidth + PADDING);
      }

      // Account for negative values growing "down" instead of "up"
      yValue = yValue < 0 ? yValue - d.y : yValue;

      return {
        x: barX,
        y: yContinuosScale(yValue) ?? NaN,
        width: barWidth,
        height: Math.abs((yContinuosScale(d.y) ?? NaN) - baseY),
      };
    });
  }, [series, xScale, yScale, plotSize, stackedBarOffsets, totalSeriesCount, seriesIndex]);

  const highlightedXValue = highlightedGroupIndex !== null ? xScale.domain[highlightedGroupIndex] : null;

  return (
    <g
      aria-label={series.title}
      clipPath={`url(#${chartAreaClipPath})`}
      className={clsx(styles.series, styles['series--bar'], {
        [styles['series--highlighted']]: highlighted,
        [styles['series--dimmed']]: dimmed,
      })}
    >
      {xCoordinates.map(({ x, y, width, height }, i) => {
        if (!isFinite(x) || !isFinite(height)) {
          return;
        }

        // Create margins between stacked series but only when series data is not too small.
        const baseOffset = stackedBarOffsets ? 2 : 0;
        const isSmall = height < baseOffset * 2;
        const appliedOffset = isSmall ? 0 : baseOffset;

        const rx = isRefresh ? (isSmall ? '2px' : '4px') : '0px';
        const className = clsx(styles.series__rect, {
          [styles['series--dimmed']]: highlightedXValue !== null && !matchesX(highlightedXValue, series.data[i].x),
        });

        return axis === 'x' ? (
          <rect
            key={`bar-${i}`}
            fill={color}
            x={x}
            y={y + appliedOffset / 2}
            width={width}
            height={height - appliedOffset}
            rx={rx}
            className={className}
          />
        ) : (
          <rect
            key={`bar-${i}`}
            fill={color}
            x={y - height + appliedOffset / 2}
            y={x}
            width={height - appliedOffset}
            height={width}
            rx={rx}
            className={className}
          />
        );
      })}
    </g>
  );
}
