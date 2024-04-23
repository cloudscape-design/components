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
import { useUniqueId } from '../internal/hooks/use-unique-id';
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
      let isMin = false;
      let isMax = false;

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
  const clipPathId = useUniqueId();

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

        const rx = isRefresh ? (isSmallBar ? '2px' : '4px') : '0px';
        const className = clsx(styles.series__rect, {
          [styles['series--dimmed']]: highlightedXValue !== null && !matchesX(highlightedXValue, series.data[i].x),
        });

        const rectPlacement =
          axis === 'x'
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

        // Non-stacked bars have all corners rounded.
        // Stacked bars only require rounded corners for the min/max segments.
        const rxProps = !isStacked || (isMin && isMax) ? { rx } : { clipPath: `url(#${clipPathId}-${i})` };

        return (
          <React.Fragment key={`bar-${i}`}>
            {/* Render the bar rectangle */}
            <rect fill={color} {...rectPlacement} {...rxProps} className={className} />

            {/* Render clip paths to provide rounded corners for the min/max stacked bars  */}
            {rxProps.clipPath && (isMin || isMax) && (
              <clipPath aria-hidden="true" id={`${clipPathId}-${i}`}>
                {isMin && (
                  <rect
                    {...(axis === 'x' ? clipRect(rectPlacement, 'down') : clipRect(rectPlacement, 'left'))}
                    rx={rx}
                  />
                )}
                {isMax && (
                  <rect
                    {...(axis === 'x' ? clipRect(rectPlacement, 'up') : clipRect(rectPlacement, 'right'))}
                    rx={rx}
                  />
                )}
              </clipPath>
            )}
          </React.Fragment>
        );
      })}
    </g>
  );
}

// Creates a rectangle by adding 10px offset to the provided one in the given direction.
// This makes one side ignored when using the rectangle in a clip path.
function clipRect(
  rect: { x: number; y: number; height: number; width: number },
  direction: 'left' | 'right' | 'up' | 'down'
) {
  switch (direction) {
    case 'up':
      return { ...rect, height: rect.height + 10 };
    case 'down':
      return { ...rect, y: rect.y - 10, height: rect.height + 10 };
    case 'left':
      return { ...rect, width: rect.width + 10 };
    case 'right':
      return { ...rect, x: rect.x - 10, width: rect.width + 10 };
  }
}
