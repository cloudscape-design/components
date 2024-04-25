// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { ScaleContinuousNumeric, ScaleTime } from '../internal/vendor/d3-scale';

import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import { ChartDataTypes, MixedLineBarChartProps } from './interfaces';
import { matchesX, getKeyValue, StackedBarValues } from './utils';
import styles from './styles.css.js';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

interface Placement {
  x: number;
  y: number;
  width: number;
  height: number;
}

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

  // Contains values to be used for stacked bars.
  stackedBarValues?: StackedBarValues;
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
  totalSeriesCount,
  seriesIndex,
  plotSize,
  chartAreaClipPath,
  stackedBarValues,
}: BarSeriesProps<T>) {
  const isRefresh = useVisualRefresh();
  const isStacked = !!stackedBarValues;
  const isVertical = axis === 'x';

  const xCoordinates = (() => {
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

    if (!isStacked && totalSeriesCount > 1) {
      // Regular grouped bars
      barWidth = (barWidth - (totalSeriesCount - 1) * PADDING) / totalSeriesCount;
      barWidth = Math.max(barWidth, MINWIDTH);
    }

    return xPoints.map((x, i) => {
      const d = series.data[i];
      const key = getKeyValue(d.x);
      let barX = x;
      let yValue = d.y;
      let isMin = !isStacked;
      let isMax = !isStacked;

      // Stacked bars
      if (isStacked) {
        const allXValues = stackedBarValues.get(key) ?? new Map();
        yValue = allXValues.get(seriesIndex) ?? 0;
        const allXValuesSorted = Array.from(allXValues.values()).sort((a, b) => a - b);
        isMin = yValue === allXValuesSorted[0];
        isMax = yValue === allXValuesSorted[allXValuesSorted.length - 1];
      }
      // Regular grouped bars
      else if (totalSeriesCount > 1) {
        barX += seriesIndex * (barWidth + PADDING);
      }

      // Account for negative values growing "down" instead of "up"
      yValue = yValue < 0 ? yValue - d.y : yValue;

      return {
        x: barX,
        y: yContinuosScale(yValue) ?? NaN,
        width: barWidth,
        height: Math.abs((yContinuosScale(d.y) ?? NaN) - baseY),
        isMin,
        isMax,
      };
    });
  })();

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
      {xCoordinates.map(({ x, y, width, height, isMin, isMax }, i) => {
        if (!isFinite(x) || !isFinite(height)) {
          return;
        }

        // Create margins between stacked series but only when series data is not too small.
        const baseHeightOffset = isStacked ? 3 : 0;
        const isSmallBar = height < 4;
        const heightOffset = isSmallBar ? 0 : baseHeightOffset;
        const widthOffset = 2;

        const rx = isRefresh ? (isSmallBar ? 2 : 4) : 0;
        const placement = isVertical
          ? {
              x: x + widthOffset / 2,
              y: y + heightOffset / 2,
              width: width - widthOffset,
              height: height - heightOffset,
            }
          : {
              x: y - height + heightOffset / 2,
              y: x + widthOffset / 2,
              width: height - heightOffset,
              height: width - widthOffset,
            };

        const className = clsx(styles.series__rect, {
          [styles['series--dimmed']]: highlightedXValue !== null && !matchesX(highlightedXValue, series.data[i].x),
        });
        const styleProps = { fill: color, className };

        if (isMin && isMax) {
          return <rect key={i} {...placement} {...styleProps} rx={rx} />;
        }
        if (!isMin && !isMax) {
          return <rect key={i} {...placement} {...styleProps} rx={0} />;
        }
        const side =
          !isVertical && !isMax ? 'left' : !isVertical && isMax ? 'right' : isVertical && isMax ? 'top' : 'bottom';
        return <path key={i} d={createOneSideRoundedRectPath(placement, rx, side)} {...styleProps} {...styleProps} />;
      })}
    </g>
  );
}

function createOneSideRoundedRectPath(
  { x, y, width, height }: Placement,
  radius: number,
  side: 'left' | 'right' | 'top' | 'bottom'
) {
  const coordinates = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ];

  // Starting from the target side.
  const startIndex = { left: 2, right: 0, top: 3, bottom: 1 }[side];

  let path = '';
  for (let i = startIndex; i < startIndex + coordinates.length + 1; i++) {
    const start = coordinates[i % coordinates.length];
    const end = coordinates[(i + 1) % coordinates.length];

    // Define curvature for the first 3 points to only add rounded corners to the first side.
    const c = radius && i < startIndex + 3 ? Math.min(radius / Math.hypot(end.x - start.x, end.y - start.y), 0.5) : 0;

    // Insert start point. When c=0 the start point is [start.x, start.y].
    if (i === startIndex) {
      path += `M${start.x * (1 - c) + end.x * c},${start.y * (1 - c) + end.y * c}`;
    }
    // Insert quadratic curve.
    if (i > startIndex) {
      path += `Q${start.x},${start.y} ${start.x * (1 - c) + end.x * c},${start.y * (1 - c) + end.y * c}`;
    }
    // Draw line to the end point. When c=0 the end point is [end.x, end.y].
    if (i < startIndex + coordinates.length) {
      path += `L${start.x * c + end.x * (1 - c)},${start.y * c + end.y * (1 - c)}`;
    }
  }
  return path + 'Z';
}
