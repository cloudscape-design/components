// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useMemo, useState } from 'react';
import { KeyCode } from '../../internal/keycode';
import { ChartContainerProps } from '../chart-container';
import { ChartDataTypes, MixedLineBarChartProps } from '../interfaces';
import { ChartScale, NumericChartScale } from '../../internal/components/cartesian-chart/scales';
import { findNavigableSeries, nextValidDomainIndex } from '../utils';
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
  legendSeries: null | MixedLineBarChartProps.ChartSeries<T>;
  isHandlersDisabled: boolean;

  pinPopover(pinned?: boolean): void;
  highlightSeries(series: MixedLineBarChartProps.ChartSeries<T> | null): void;
  highlightGroup(groupIndex: number): void;
  highlightPoint(point: ScaledPoint<T> | null): void;
  clearHighlightedSeries(): void;
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
  legendSeries,
  isHandlersDisabled,
  pinPopover,
  highlightSeries,
  highlightGroup,
  highlightPoint,
}: UseNavigationProps<T>) {
  const [targetX, setTargetX] = useState<T | null>(null);

  // There are two different types of navigation:
  // 1) Group navigation for any chart that contains a bar series
  // 2) Line navigation for any chart that only contains lines and thresholds
  const isGroupNavigation = visibleSeries.some(({ series }) => series.type === 'bar');

  // Make a list of series that can be navigated between. Bar series are treated as one.
  const { navigableSeries } = useMemo(() => findNavigableSeries(visibleSeries), [visibleSeries]);

  const onBarGroupFocus = () => {
    const groupIndex = highlightedGroupIndex ?? 0;
    setTargetX((xScale.domain as T[])[groupIndex]);
    highlightGroup(groupIndex);
  };

  const onLineGroupFocus = () => {
    if (!highlightedSeries || !highlightedPoint) {
      const targetSeries = highlightedSeries ?? legendSeries ?? series[0]?.series ?? null;
      highlightSeries(targetSeries);
      for (const scaledS of scaledSeries) {
        if (scaledS.series === targetSeries) {
          highlightPoint(scaledS);
          return;
        }
      }
    }
  };

  const onFocus = () => {
    if (isGroupNavigation) {
      onBarGroupFocus();
    } else {
      onLineGroupFocus();
    }
  };

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
      let nextSeriesIndex = 0;
      if (previousSeriesIndex !== -1) {
        nextSeriesIndex = previousSeriesIndex + direction;
        if (nextSeriesIndex > MAX_SERIES_INDEX) {
          nextSeriesIndex = 0;
        } else if (nextSeriesIndex < 0) {
          nextSeriesIndex = MAX_SERIES_INDEX;
        }
      }

      const nextSeries = navigableSeries[nextSeriesIndex];
      const nextInternalSeries = series.filter(({ series }) => series === nextSeries)[0];

      // 2. Find point in the next series
      let targetXPoint = (xScale.d3Scale(targetX as any) ?? NaN) + xOffset;
      if (!isFinite(targetXPoint)) {
        targetXPoint = 0;
      }

      if (nextSeries.type === 'line') {
        const nextSeriesData = nextSeries.data as ReadonlyArray<MixedLineBarChartProps.Datum<T>>;
        const lookingForScaled = targetXPoint; // scaled X in previous series

        const nextPoint = nextSeriesData
          // scale all points in series
          .map(d => ({
            x: (xScale.d3Scale(d.x as any) || 0) + xOffset,
            y: yScale.d3Scale(d.y) || 0,
            datum: d,
          }))
          // find the closest point to previous X
          .reduce(
            (prev, curr) => (Math.abs(curr.x - lookingForScaled) < Math.abs(prev.x - lookingForScaled) ? curr : prev),
            { x: -Infinity, y: -Infinity }
          );

        highlightSeries(nextSeries);
        highlightPoint({ ...nextPoint, color: nextInternalSeries.color, series: nextSeries });
      } else if (nextSeries.type === 'threshold') {
        const scaledTargetIndex = scaledSeries.map(it => it.datum?.x || null).indexOf(targetX);
        highlightSeries(nextSeries);
        highlightPoint({
          x: targetXPoint,
          y: yScale.d3Scale(nextSeries.y) ?? NaN,
          color: nextInternalSeries.color,
          series: nextSeries,
          datum: scaledSeries[scaledTargetIndex]?.datum,
        });
      }
    },
    [
      isGroupNavigation,
      xScale,
      navigableSeries,
      highlightedSeries,
      scaledSeries,
      series,
      targetX,
      highlightSeries,
      highlightPoint,
      yScale,
    ]
  );

  const moveWithinSeries = useCallback(
    (direction: number) => {
      const series = highlightedSeries || visibleSeries[0].series;
      const previousPoint = highlightedPoint || scaledSeries[0];

      if (series.type === 'line') {
        // find previous point in series
        const indexOfPreviousPoint = previousPoint?.datum
          ? (series.data as ReadonlyArray<MixedLineBarChartProps.Datum<T>>).indexOf(previousPoint.datum)
          : 0;
        const nextPointIndex = circleIndex(indexOfPreviousPoint + direction, [0, series.data.length - 1]);
        const nextPoint = series.data[nextPointIndex];

        // find scaled next point
        const nextPointScaled = scaledSeries.filter(s => s.datum === nextPoint)[0] || null;

        setTargetX(nextPoint.x as T);
        highlightSeries(series);
        highlightPoint(nextPointScaled);
      } else if (series.type === 'threshold') {
        const [scaledThresholdSeries] = scaledSeries.filter(it => it.series === series);
        const scaledDataSeries = scaledSeries.filter(it => it.datum);
        const indexOfPreviousPoint = scaledDataSeries.map(it => it.x).indexOf(previousPoint.x);
        const nextPointIndex = circleIndex(indexOfPreviousPoint + direction, [0, scaledDataSeries.length - 1]);
        setTargetX(scaledDataSeries[nextPointIndex].datum?.x || null);
        highlightSeries(series);
        highlightPoint({
          ...scaledThresholdSeries,
          datum: scaledDataSeries[nextPointIndex].datum,
          x: scaledDataSeries[nextPointIndex].x,
        });
      } else if (series.type === 'bar') {
        const xDomain = xScale.domain as T[];
        const MAX_GROUP_INDEX = xDomain.length - 1;

        let nextGroupIndex = 0;
        if (highlightedGroupIndex !== null) {
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
      highlightedPoint,
      scaledSeries,
      highlightSeries,
      highlightPoint,
      xScale.domain,
      highlightedGroupIndex,
      barGroups,
      highlightGroup,
    ]
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
        moveWithinSeries(keyCode === KeyCode.right ? 1 : -1);
      } else if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
        pinPopover();
      }
    },
    [moveWithinSeries, moveBetweenSeries, isHandlersDisabled, pinPopover]
  );

  return { isGroupNavigation, onFocus, onKeyDown };
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
