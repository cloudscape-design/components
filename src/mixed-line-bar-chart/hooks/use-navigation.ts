// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo, useState } from 'react';
import { KeyCode } from '../../internal/keycode';
import { ChartContainerProps } from '../chart-container';
import { ChartDataTypes, MixedLineBarChartProps, VerticalMarkerX } from '../interfaces';
import { ChartScale, NumericChartScale } from '../../internal/components/cartesian-chart/scales';
import { findNavigableSeries, isXThreshold, isYThreshold, nextValidDomainIndex } from '../utils';
import { ScaledPoint } from '../make-scaled-series';
import { ScaledBarGroup } from '../make-scaled-bar-groups';

export type UseNavigationProps<T extends ChartDataTypes> = Pick<
  ChartContainerProps<T>,
  'highlightedSeries' | 'series' | 'visibleSeries'
> & {
  xScale: ChartScale;
  yScale: NumericChartScale;
  barGroups: ScaledBarGroup<T>[];
  scaledSeries: ReadonlyArray<ScaledPoint<T>>;

  highlightedPoint: ScaledPoint<T> | null;
  highlightedGroupIndex: number | null;
  isHandlersDisabled: boolean;

  pinPopover(pinned?: boolean): void;
  highlightSeries(series: MixedLineBarChartProps.ChartSeries<T> | null): void;
  highlightGroup(groupIndex: number): void;
  highlightPoint(point: ScaledPoint<T> | null): void;
  highlightX: (verticalMarker: VerticalMarkerX<T> | null) => void;
  clearHighlightedSeries(): void;
  verticalMarkerX: VerticalMarkerX<T> | null;

  isRtl?: boolean;
  horizontalBars: boolean;
};

export function useNavigation<T extends ChartDataTypes>({
  series,
  visibleSeries,
  scaledSeries,
  barGroups,
  xScale,
  yScale,
  highlightedPoint,
  highlightedGroupIndex,
  highlightedSeries,
  isHandlersDisabled,
  pinPopover,
  highlightSeries,
  highlightGroup,
  highlightPoint,
  highlightX,
  verticalMarkerX,
  isRtl,
  horizontalBars,
}: UseNavigationProps<T>) {
  const [targetX, setTargetX] = useState<T | null>(null);
  const [xIndex, setXIndex] = useState(0);

  // There are two different types of navigation:
  // 1) Group navigation for any chart that contains a bar series
  // 2) Line navigation for any chart that only contains lines and thresholds
  const isGroupNavigation = useMemo(() => visibleSeries.some(({ series }) => series.type === 'bar'), [visibleSeries]);

  // Make a list of series that can be navigated between. Bar series are treated as one.
  const { navigableSeries } = useMemo(() => findNavigableSeries(visibleSeries), [visibleSeries]);
  const containsMultipleSeries = navigableSeries.length > 1;

  const onBarGroupFocus = () => {
    const groupIndex = highlightedGroupIndex ?? 0;
    setTargetX((xScale.domain as T[])[groupIndex]);
    highlightGroup(groupIndex);
  };

  const onLineFocus = () => {
    if (verticalMarkerX === null) {
      const index = !isRtl ? 0 : allUniqueX.length - 1;
      moveToLineGroupIndex(index);
    }
  };

  const onFocus = () => {
    if (isGroupNavigation) {
      onBarGroupFocus();
    } else {
      onLineFocus();
    }
  };

  // Returns all the unique X coordinates in scaledSeries.
  // Assumes scaledSeries is sorted by `x`.
  const allUniqueX = useMemo(() => {
    const result = [];
    for (let i = 0; i < scaledSeries.length; i += 1) {
      const point = scaledSeries[i];
      if (point !== undefined && (!result.length || result[result.length - 1].scaledX !== point.x)) {
        result.push({ scaledX: point.x, datum: point.datum });
      }
    }
    return result;
  }, [scaledSeries]);

  const moveBetweenSeries = useCallback(
    (direction: number) => {
      if (isGroupNavigation) {
        return;
      }

      const xOffset = xScale.isCategorical() ? Math.max(0, xScale.d3Scale.bandwidth() - 1) / 2 : 0;
      const MAX_SERIES_INDEX = navigableSeries.length - 1;

      // Find the index of the currently highlighted series (if any)
      let previousSeriesIndex = -1;
      if (highlightedSeries) {
        previousSeriesIndex = navigableSeries.indexOf(highlightedSeries);
      }

      // Move forwards or backwards to the new series
      // If index === -1, show all data points from all series at the given X instead of one single series
      const firstPossibleIndex = containsMultipleSeries ? -1 : 0;
      let nextSeriesIndex = 0;
      if (previousSeriesIndex !== null) {
        nextSeriesIndex = previousSeriesIndex + direction;
        if (nextSeriesIndex > MAX_SERIES_INDEX) {
          nextSeriesIndex = firstPossibleIndex;
        } else if (nextSeriesIndex < firstPossibleIndex) {
          nextSeriesIndex = MAX_SERIES_INDEX;
        }
      }
      if (nextSeriesIndex === -1) {
        highlightSeries(null);
        highlightPoint(null);
        return;
      }
      const nextSeries = navigableSeries[nextSeriesIndex];
      const nextInternalSeries = series.filter(({ series }) => series === nextSeries)[0];

      // 2. Find point in the next series
      let targetXPoint = (xScale.d3Scale(targetX as any) ?? NaN) + xOffset;
      if (!isFinite(targetXPoint)) {
        targetXPoint = 0;
      }

      if (nextSeries.type === 'line') {
        const nextScaledSeries = scaledSeries.filter(it => it.series === nextSeries);
        const closestNextSeriesPoint = nextScaledSeries.reduce(
          (prev, curr) => (Math.abs(curr.x - targetXPoint) < Math.abs(prev.x - targetXPoint) ? curr : prev),
          { x: -Infinity, y: -Infinity }
        );
        highlightPoint({ ...closestNextSeriesPoint, color: nextInternalSeries.color, series: nextSeries });
      } else if (isYThreshold(nextSeries)) {
        const scaledTargetIndex = scaledSeries.map(it => it.datum?.x || null).indexOf(targetX);
        highlightPoint({
          x: targetXPoint,
          y: yScale.d3Scale(nextSeries.y) ?? NaN,
          color: nextInternalSeries.color,
          series: nextSeries,
          datum: scaledSeries[scaledTargetIndex]?.datum,
        });
      } else if (isXThreshold(nextSeries)) {
        highlightPoint({
          x: xScale.d3Scale(nextSeries.x as any) ?? NaN,
          y: yScale.d3Scale.range()[0],
          color: nextInternalSeries.color,
          series: nextSeries,
          datum: { x: nextSeries.x, y: NaN },
        });
      }
    },
    [
      isGroupNavigation,
      xScale,
      navigableSeries,
      highlightedSeries,
      containsMultipleSeries,
      highlightSeries,
      highlightPoint,
      series,
      targetX,
      scaledSeries,
      yScale,
    ]
  );

  const moveWithinSeries = useCallback(
    (direction: number) => {
      const series = highlightedSeries || visibleSeries[0].series;

      if (series.type === 'line' || isYThreshold(series)) {
        const targetScaledSeries = scaledSeries.filter(it => it.series === series);
        const previousPoint = highlightedPoint || targetScaledSeries[0];
        const indexOfPreviousPoint = targetScaledSeries.map(it => it.x).indexOf(previousPoint.x);
        const nextPointIndex = circleIndex(indexOfPreviousPoint + direction, [0, targetScaledSeries.length - 1]);
        const nextPoint = targetScaledSeries[nextPointIndex];

        setTargetX(nextPoint.datum?.x || null);
        setXIndex(nextPointIndex);
        highlightPoint(nextPoint);
      } else if (series.type === 'bar') {
        const xDomain = xScale.domain as T[];
        const MAX_GROUP_INDEX = xDomain.length - 1;

        let nextGroupIndex = 0;
        if (highlightedGroupIndex !== null) {
          if (isRtl && !horizontalBars) {
            direction = -direction;
          }

          // find next group
          nextGroupIndex = highlightedGroupIndex + direction;
          if (nextGroupIndex > MAX_GROUP_INDEX) {
            nextGroupIndex = 0;
          } else if (nextGroupIndex < 0) {
            nextGroupIndex = MAX_GROUP_INDEX;
          }
        }

        const nextDomainIndex = nextValidDomainIndex(nextGroupIndex, barGroups, direction);
        setTargetX(xDomain[nextDomainIndex]);
        highlightGroup(nextDomainIndex);
      }
    },
    [
      highlightedSeries,
      visibleSeries,
      scaledSeries,
      highlightedPoint,
      highlightPoint,
      xScale.domain,
      highlightedGroupIndex,
      barGroups,
      highlightGroup,
      isRtl,
      horizontalBars,
    ]
  );

  const moveToLineGroupIndex = useCallback(
    (index: number) => {
      const point = allUniqueX[index];
      setXIndex(index);
      setTargetX(point.datum?.x || null);
      highlightX({ scaledX: point?.scaledX ?? null, label: point.datum?.x ?? null });
    },
    [allUniqueX, highlightX]
  );

  const moveWithinXAxis = useCallback(
    (direction: number) => {
      if (highlightedSeries || isGroupNavigation) {
        moveWithinSeries(direction);
      } else {
        const nextPointGroupIndex = circleIndex(xIndex + direction, [0, allUniqueX.length - 1]);
        moveToLineGroupIndex(nextPointGroupIndex);
      }
    },
    [highlightedSeries, isGroupNavigation, moveWithinSeries, xIndex, allUniqueX.length, moveToLineGroupIndex]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const keyCode = event.keyCode;
      if (
        keyCode !== KeyCode.up &&
        keyCode !== KeyCode.right &&
        keyCode !== KeyCode.down &&
        keyCode !== KeyCode.left &&
        keyCode !== KeyCode.space &&
        keyCode !== KeyCode.enter
      ) {
        return;
      }

      event.preventDefault();

      if (isHandlersDisabled) {
        return;
      }

      if (keyCode === KeyCode.down || keyCode === KeyCode.up) {
        moveBetweenSeries(keyCode === KeyCode.down ? 1 : -1);
      } else if (keyCode === KeyCode.left || keyCode === KeyCode.right) {
        moveWithinXAxis(keyCode === KeyCode.right ? 1 : -1);
      } else if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
        pinPopover();
      }
    },
    [isHandlersDisabled, moveBetweenSeries, moveWithinXAxis, pinPopover]
  );

  return { isGroupNavigation, onFocus, onKeyDown, xIndex };
}

// Returns given index if it is in range or the opposite range boundary otherwise.
function circleIndex(index: number, [from, to]: [number, number]): number {
  if (index < from) {
    return to;
  }
  if (index > to) {
    return from;
  }
  return index;
}
