// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AreaChartProps } from '../interfaces';
import React, { useEffect, useMemo, useRef, RefObject, MouseEvent } from 'react';
import { findClosest, circleIndex } from './utils';

import { nodeContains } from '../../internal/utils/dom';
import { KeyCode } from '../../internal/keycode';
import { XDomain, XScaleType, YDomain, YScaleType } from '../../internal/components/cartesian-chart/interfaces';
import computeChartProps from './compute-chart-props';
import createSeriesDecorator from './create-series-decorator';
import InteractionsStore from './interactions-store';
import { ChartModel } from './index';
import { ChartPlotRef } from '../../internal/components/chart-plot';
import { throttle } from '../../internal/utils/throttle';
import { useReaction } from '../async-store';
import { useHeightMeasure } from '../../internal/hooks/container-queries/use-height-measure';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

const MAX_HOVER_MARGIN = 6;
const SVG_HOVER_THROTTLE = 25;
const POPOVER_DEADZONE = 12;

export interface UseChartModelProps<T extends AreaChartProps.DataTypes> {
  fitHeight?: boolean;
  externalSeries: readonly AreaChartProps.Series<T>[];
  visibleSeries: readonly AreaChartProps.Series<T>[];
  setVisibleSeries: (series: readonly AreaChartProps.Series<T>[]) => void;
  highlightedSeries: null | AreaChartProps.Series<T>;
  setHighlightedSeries: (series: null | AreaChartProps.Series<T>) => void;
  xDomain?: XDomain<T>;
  yDomain?: YDomain;
  xScaleType: XScaleType;
  yScaleType: YScaleType;
  height: number;
  width: number;
  popoverRef: RefObject<HTMLElement>;
}

// Represents the core the chart logic, including the model of all allowed user interactions.
export default function useChartModel<T extends AreaChartProps.DataTypes>({
  fitHeight,
  externalSeries: allSeries,
  visibleSeries: series,
  setVisibleSeries,
  highlightedSeries,
  setHighlightedSeries,
  xDomain,
  yDomain,
  xScaleType,
  yScaleType,
  height: explicitHeight,
  width,
  popoverRef,
}: UseChartModelProps<T>): ChartModel<T> {
  // Chart elements refs used in handlers.
  const plotRef = useRef<ChartPlotRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const verticalMarkerRef = useRef<SVGLineElement>(null);

  const plotMeasureRef = useRef<SVGLineElement>(null);
  const hasVisibleSeries = series.length > 0;
  const height = useHeightMeasure(() => plotMeasureRef.current, !fitHeight, [hasVisibleSeries]) ?? explicitHeight;

  const stableSetVisibleSeries = useStableCallback(setVisibleSeries);

  const model = useMemo(() => {
    // Compute scales, ticks and two-dimensional plots.
    const computed = computeChartProps({
      series,
      xDomain,
      yDomain,
      xScaleType,
      yScaleType,
      height,
      width,
    });

    // A store for chart interactions that don't require plot recomputation.
    const interactions = new InteractionsStore(series, computed.plot);

    const containsMultipleSeries = interactions.series.length > 1;

    // A series decorator to provide extra props such as color and marker type.
    const getInternalSeries = createSeriesDecorator(allSeries);

    const isMouseOverPopover = (clientX: number, clientY: number) => {
      if (popoverRef.current?.firstChild) {
        const popoverPosition = (popoverRef.current.firstChild as HTMLElement).getBoundingClientRect();
        if (
          clientX > popoverPosition.x - POPOVER_DEADZONE &&
          clientX < popoverPosition.x + popoverPosition.width + POPOVER_DEADZONE &&
          clientY > popoverPosition.y - POPOVER_DEADZONE &&
          clientY < popoverPosition.y + popoverPosition.height + POPOVER_DEADZONE
        ) {
          return true;
        }
      }
      return false;
    };

    // A Callback for svg mouseover to hover the plot points.
    // Throttling is necessary for a substantially smoother customer experience.
    const onSVGMouseMoveThrottled = throttle((clientX: number, clientY: number) => {
      // No hover logic when the popover is pinned or no data available.
      if (
        interactions.get().isPopoverPinned ||
        !plotRef.current ||
        interactions.plot.xy.length === 0 ||
        isMouseOverPopover(clientX, clientY)
      ) {
        return;
      }

      const svgRect = plotRef.current.svg.getBoundingClientRect();
      const offsetX = clientX - svgRect.left;
      const offsetY = clientY - svgRect.top;

      const closestX = findClosest(interactions.plot.xy, offsetX, xPoints => xPoints[0].scaled.x);
      const closestPoint = findClosest(closestX, offsetY, point => point.scaled.y1);

      // If close enough to the point - highlight the point and its column.
      // If not - only highlight the closest column.
      if (
        Math.abs(offsetX - closestPoint.scaled.x) < MAX_HOVER_MARGIN &&
        Math.abs(offsetY - closestPoint.scaled.y1) < MAX_HOVER_MARGIN
      ) {
        interactions.highlightPoint(closestPoint);
      } else {
        interactions.highlightX(closestX);
      }
    }, SVG_HOVER_THROTTLE);

    const onSVGMouseMove = ({ clientX, clientY }: React.MouseEvent<SVGElement>) =>
      onSVGMouseMoveThrottled(clientX, clientY);

    // A callback for svg mouseout to clear all highlights.
    const onSVGMouseOut = (event: React.MouseEvent<SVGElement>) => {
      // Because the mouseover is throttled, in can occur slightly after the mouseout,
      // neglecting its effect; cancelling the throttled function prevents that.
      onSVGMouseMoveThrottled.cancel();

      // No hover logic when the popover is pinned or mouse is over popover
      if (interactions.get().isPopoverPinned || isMouseOverPopover(event.clientX, event.clientY)) {
        return;
      }

      // Check if the target is contained within svg to allow hovering on the popover body.
      if (!nodeContains(plotRef.current!.svg, event.relatedTarget as Element)) {
        interactions.clearHighlightedLegend();
        interactions.clearHighlight();
      }
    };

    // A callback for svg click to pin/unpin the popover.
    const onSVGMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
      interactions.togglePopoverPin();
      event.preventDefault();
    };

    const moveWithinXAxis = (direction: -1 | 1) => {
      if (interactions.get().highlightedPoint) {
        return moveWithinSeries(direction);
      } else if (containsMultipleSeries) {
        const { highlightedX } = interactions.get();
        if (highlightedX) {
          const currentXIndex = highlightedX[0].index.x;
          const nextXIndex = circleIndex(currentXIndex + direction, [0, interactions.plot.xy.length - 1]);
          interactions.highlightX(interactions.plot.xy[nextXIndex]);
        }
      }
    };

    // A helper function to highlight the next or previous point within selected series.
    const moveWithinSeries = (direction: -1 | 1) => {
      // Can only use motion when a particular point is highlighted.
      const point = interactions.get().highlightedPoint;
      if (!point) {
        return;
      }

      // Take the index of the currently highlighted series.
      const sIndex = point.index.s;
      // Take the incremented(circularly) x-index of the currently highlighted point.
      const xIndex = circleIndex(point.index.x + direction, [0, interactions.plot.xs.length - 1]);
      // Highlight the next point using x:s grouped data.
      interactions.highlightPoint(interactions.plot.xs[xIndex][sIndex]);
    };

    // A helper function to highlight the next or previous point within the selected column.
    const moveBetweenSeries = (direction: -1 | 1) => {
      const point = interactions.get().highlightedPoint;
      if (!point) {
        const { highlightedX } = interactions.get();
        if (highlightedX) {
          const xIndex = highlightedX[0].index.x;
          const points = interactions.plot.xy[xIndex];
          const yIndex = direction === 1 ? 0 : points.length - 1;
          interactions.highlightPoint(points[yIndex]);
        }
        return;
      }

      // Take the index of the currently highlighted column.
      const xIndex = point.index.x;
      const currentYIndex = point.index.y;

      if (
        containsMultipleSeries &&
        ((currentYIndex === 0 && direction === -1) ||
          (currentYIndex === interactions.plot.xy[xIndex].length - 1 && direction === 1))
      ) {
        interactions.highlightX(interactions.plot.xy[xIndex]);
      } else {
        // Take the incremented(circularly) y-index of the currently highlighted point.
        const nextYIndex = circleIndex(currentYIndex + direction, [0, interactions.plot.xy[xIndex].length - 1]);
        // Highlight the next point using x:y grouped data.
        interactions.highlightPoint(interactions.plot.xy[xIndex][nextYIndex]);
      }
    };

    // A callback for svg keydown to enable motions and popover pin with the keyboard.
    const onSVGKeyDown = (event: React.KeyboardEvent) => {
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

      // Preventing default fixes an issue in Safari+VO when VO additionally interprets arrow keys as its commands.
      event.preventDefault();

      // No keydown logic when the popover is pinned.
      if (interactions.get().isPopoverPinned) {
        return;
      }

      // Move up/down.
      if (keyCode === KeyCode.down || keyCode === KeyCode.up) {
        moveBetweenSeries(keyCode === KeyCode.down ? -1 : 1);
      }
      // Move left/right.
      else if (keyCode === KeyCode.left || keyCode === KeyCode.right) {
        moveWithinXAxis(keyCode === KeyCode.right ? 1 : -1);
      }
      // Pin popover.
      else if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
        interactions.pinPopover();
      }
    };

    const highlightFirstX = () => {
      interactions.highlightX(interactions.plot.xy[0]);
    };

    // A callback for svg focus to highlight series.
    const onSVGFocus = (_event: React.FocusEvent, trigger: 'mouse' | 'keyboard') => {
      // When focus is caused by a click event nothing is expected as clicks are handled separately.
      if (trigger === 'keyboard') {
        const { highlightedX, highlightedPoint, highlightedSeries, legendSeries } = interactions.get();
        if (containsMultipleSeries && !highlightedX && !highlightedPoint && !highlightedSeries && !legendSeries) {
          highlightFirstX();
        } else if (!highlightedX) {
          interactions.highlightFirstPoint();
        }
      }
    };

    // A callback for svg blur to clear all highlights unless the popover is pinned.
    const onSVGBlur = () => {
      // Pinned popover stays pinned even if the focus is lost.
      // If blur is not caused by the popover, forget the previously highlighted point.
      if (!interactions.get().isPopoverPinned) {
        interactions.clearHighlight();
      }
    };

    const onFilterSeries = (series: readonly AreaChartProps.Series<T>[]) => {
      stableSetVisibleSeries(series);
    };

    const onLegendHighlight = (series: null | AreaChartProps.Series<T>) => {
      interactions.highlightSeries(series);
    };

    const onPopoverDismiss = (outsideClick?: boolean) => {
      interactions.unpinPopover();

      // Return focus back to the application or plot (when no point is highlighted).
      if (!outsideClick) {
        // The delay is needed to bypass focus events caused by click or keypress needed to unpin the popover.
        setTimeout(() => {
          if (interactions.get().highlightedPoint || interactions.get().highlightedX) {
            plotRef.current!.focusApplication();
          } else {
            interactions.clearHighlight();
            plotRef.current!.focusPlot();
          }
        }, 0);
      }
    };

    const onContainerBlur = () => {
      interactions.clearState();
    };

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        interactions.clearHighlight();
        interactions.clearHighlightedLegend();
      }
    };

    const onPopoverLeave = (event: MouseEvent) => {
      if (plotRef.current!.svg.contains(event.relatedTarget as Node) || interactions.get().isPopoverPinned) {
        return;
      }
      interactions.clearHighlight();
      interactions.clearHighlightedLegend();
    };
    return {
      width,
      height,
      series,
      allSeries,
      getInternalSeries,
      computed,
      interactions,
      handlers: {
        onSVGMouseMove,
        onSVGMouseOut,
        onSVGMouseDown,
        onSVGKeyDown,
        onSVGFocus,
        onSVGBlur,
        onFilterSeries,
        onLegendHighlight,
        onPopoverDismiss,
        onContainerBlur,
        onDocumentKeyDown,
        onPopoverLeave,
      },
      refs: {
        plot: plotRef,
        plotMeasure: plotMeasureRef,
        container: containerRef,
        verticalMarker: verticalMarkerRef,
        popoverRef,
      },
    };
  }, [allSeries, series, xDomain, yDomain, xScaleType, yScaleType, height, width, stableSetVisibleSeries, popoverRef]);

  // Notify client when series highlight change.
  useReaction(model.interactions, state => state.highlightedSeries, setHighlightedSeries);

  // Update interactions store when series highlight in a controlled way.
  useEffect(() => {
    if (highlightedSeries !== model.interactions.get().highlightedSeries) {
      model.interactions.highlightSeries(highlightedSeries);
    }
  }, [model, highlightedSeries]);

  return model;
}
