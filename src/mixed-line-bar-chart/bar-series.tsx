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

type RoundedSide = 'left' | 'right' | 'top' | 'bottom' | 'none';

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

        return (
          <Rect
            key={`bar-${i}`}
            fill={color}
            className={className}
            {...rectPlacement}
            rx={rx}
            axis={axis}
            isMin={isMin}
            isMax={isMax}
            isStacked={isStacked}
          />
        );
      })}
    </g>
  );
}

function Rect({
  x,
  y,
  height,
  width,
  fill,
  className,
  rx,
  axis,
  isMin,
  isMax,
  isStacked,
}: {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  className: string;
  rx: number;
  axis: 'x' | 'y';
  isMin: boolean;
  isMax: boolean;
  isStacked: boolean;
}) {
  if (!isStacked || (isMin && isMax)) {
    return <rect fill={fill} x={x} y={y} width={width} height={height} rx={rx} className={className} />;
  }
  const coordinates = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ];
  const side = getRoundedSide({ axis, isMin, isMax });
  return <path d={createSemiRoundedRectPath(coordinates, rx, side)} fill={fill} className={className} />;
}

function getRoundedSide({ axis, isMin, isMax }: { axis: 'x' | 'y'; isMin: boolean; isMax: boolean }): RoundedSide {
  if (isMin && isMax) {
    throw new Error('Invariant violation: both sides must be rounded.');
  }
  if (axis === 'x' && isMax) {
    return 'top';
  }
  if (axis === 'x' && isMin) {
    return 'bottom';
  }
  if (axis === 'y' && isMax) {
    return 'right';
  }
  if (axis === 'y' && isMin) {
    return 'left';
  }
  return 'none';
}

// TODO: pass placement instead of coordinates because order matters
function createSemiRoundedRectPath(coordinates: { x: number; y: number }[], radius: number, side: RoundedSide) {
  let path = '';
  const length = coordinates.length + 1;
  for (let i = 0; i < length; i++) {
    const a = coordinates[i % coordinates.length];
    const b = coordinates[(i + 1) % coordinates.length];
    let t = radius ? Math.min(radius / Math.hypot(b.x - a.x, b.y - a.y), 0.5) : 0;

    const matchedSides = new Array<string>();

    if (i === 0) {
      matchedSides.push('top');
      matchedSides.push('right');
    }
    if (i === 1) {
      matchedSides.push('top');
      matchedSides.push('right');
      matchedSides.push('bottom');
    }
    if (i === 2) {
      matchedSides.push('right');
      matchedSides.push('bottom');
      matchedSides.push('left');
    }
    if (i === 3) {
      matchedSides.push('top');
      matchedSides.push('bottom');
      matchedSides.push('left');
    }
    if (i === 4) {
      matchedSides.push('top');
      matchedSides.push('left');
    }

    if (!matchedSides.includes(side)) {
      t = 0;
    }

    if (i > 0) {
      path += `Q${a.x},${a.y} ${a.x * (1 - t) + b.x * t},${a.y * (1 - t) + b.y * t}`;
    }
    if (i === 0) {
      path += `M${a.x * (1 - t) + b.x * t},${a.y * (1 - t) + b.y * t}`;
    }
    if (i < length - 1) {
      path += `L${a.x * t + b.x * (1 - t)},${a.y * t + b.y * (1 - t)}`;
    }
  }
  return path + 'Z';
}
