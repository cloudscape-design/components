// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';
import { nodeContains } from '../../internal/utils/dom';

import { ScaledBarGroup } from '../make-scaled-bar-groups';
import { ScaledPoint } from '../make-scaled-series';

import styles from '../styles.css.js';
import { ChartPlotRef } from '../../internal/components/chart-plot';
import { MixedLineBarChartProps } from '../interfaces';

const MAX_HOVER_MARGIN = 6;

export interface UseMouseHoverProps<T> {
  plotRef: React.RefObject<ChartPlotRef>;
  scaledSeries: ReadonlyArray<ScaledPoint<T>>;
  barGroups: ScaledBarGroup<T>[];
  highlightSeries: (series: MixedLineBarChartProps.ChartSeries<T> | null) => void;
  highlightPoint: (point: ScaledPoint<T> | null) => void;
  highlightGroup: (groupIndex: number) => void;
  clearHighlightedSeries: () => void;
  isGroupNavigation: boolean;
  isHandlersDisabled: boolean;
}

export function useMouseHover<T>({
  plotRef,
  scaledSeries,
  barGroups,
  highlightSeries,
  highlightPoint,
  highlightGroup,
  clearHighlightedSeries,
  isGroupNavigation,
  isHandlersDisabled,
}: UseMouseHoverProps<T>) {
  const [verticalMarkerLeft, setVerticalMarkerLeft] = useState<number | null>(null);

  const onSeriesMouseMove = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const svgRect = (event.target as SVGElement).getBoundingClientRect();
    const offsetX = event.clientX - svgRect.left;
    const offsetY = event.clientY - svgRect.top;

    const closestX = scaledSeries
      .map(v => v.x)
      .reduce((prev, curr) => (Math.abs(curr - offsetX) < Math.abs(prev - offsetX) ? curr : prev), -Infinity);

    const closestY = scaledSeries
      .filter(v => v.x === closestX || v.series.type === 'threshold')
      .map(v => v.y)
      .reduce((prev, curr) => (Math.abs(curr - offsetY) < Math.abs(prev - offsetY) ? curr : prev), -Infinity);

    if (isFinite(closestX)) {
      setVerticalMarkerLeft(closestX);
      if (
        isFinite(closestY) &&
        Math.abs(offsetX - closestX) < MAX_HOVER_MARGIN &&
        Math.abs(offsetY - closestY) < MAX_HOVER_MARGIN
      ) {
        const [{ color, datum, series }] = scaledSeries.filter(
          s => (s.x === closestX || s.series.type === 'threshold') && s.y === closestY
        );
        highlightSeries(series);
        highlightPoint({ x: closestX, y: closestY, color, datum, series });
      } else {
        highlightSeries(null);
        highlightPoint(null);
      }
    }
  };

  const onGroupMouseMove = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const svgRect = (event.target as SVGElement).getBoundingClientRect();
    const offsetX = event.clientX - svgRect.left;
    const offsetY = event.clientY - svgRect.top;

    // If hovering over some group - highlight it.
    for (let groupIndex = 0; groupIndex < barGroups.length; groupIndex++) {
      const {
        position: { x, y, width, height },
      } = barGroups[groupIndex];

      if (x <= offsetX && offsetX <= x + width && y <= offsetY && offsetY <= y + height) {
        highlightGroup(groupIndex);
        return;
      }
    }
    // Otherwise - clear the highlight.
    clearHighlightedSeries();
  };

  const onSVGMouseMove = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    if (event.target === plotRef.current!.svg && !isHandlersDisabled) {
      if (isGroupNavigation) {
        onGroupMouseMove(event);
      } else if (scaledSeries.length > 0) {
        onSeriesMouseMove(event);
      }
    }
  };

  const onSVGMouseOut = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    if (isHandlersDisabled) {
      return;
    }
    if (
      !nodeContains(plotRef.current!.svg, event.relatedTarget as Element) ||
      // `classList` is not supported on IE11 for SVG elements
      ((event.relatedTarget && (event.relatedTarget as Element).getAttribute('class')) || '')
        .split(' ')
        .indexOf(styles.series) > -1
    ) {
      setVerticalMarkerLeft(null);
      clearHighlightedSeries();
    }
  };

  return { verticalMarkerLeft, onSVGMouseMove, onSVGMouseOut };
}
