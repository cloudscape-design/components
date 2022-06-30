// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AreaChartProps } from '../interfaces';
import React, { useEffect, useMemo, useRef } from 'react';
import { findClosest, circleIndex, throttle } from './utils';

import { nodeContains } from '../../internal/utils/dom';
import { KeyCode } from '../../internal/keycode';
import { XDomain, XScaleType, YDomain, YScaleType } from '../../internal/components/cartesian-chart/interfaces';
import { useReaction } from './async-store';
import computeChartProps from './compute-chart-props';
import createSeriesDecorator from './create-series-decorator';
import InteractionsStore from './interactions-store';
import { useStableEventHandler } from '../../internal/hooks/use-stable-event-handler';
import { ChartModel } from './index';
import { ChartPlotRef } from '../../internal/components/chart-plot';

const MAX_HOVER_MARGIN = 6;
const SVG_HOVER_THROTTLE = 25;

interface UseChartModelProps<T extends AreaChartProps.DataTypes> {
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
}

// Represents the core the chart logic, including the model of all allowed user interactions.
export default function useChartModel<T extends AreaChartProps.DataTypes>({
  externalSeries: allSeries,
  visibleSeries: series,
  setVisibleSeries,
  highlightedSeries,
  setHighlightedSeries,
  xDomain,
  yDomain,
  xScaleType,
  yScaleType,
  height,
  width,
}: UseChartModelProps<T>): ChartModel<T> {
  // Chart elements refs used in handlers.
  const plotRef = useRef<ChartPlotRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const verticalMarkerRef = useRef<SVGLineElement>(null);

  const stableSetVisibleSeries = useStableEventHandler(setVisibleSeries);

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

    // A series decorator to provide extra props such as color and marker type.
    const getInternalSeries = createSeriesDecorator(allSeries);

    // A Callback for svg mouseover to hover the plot points.
    // Throttling is necessary for a substantially smoother customer experience.
    const onSVGMouseMoveThrottled = throttle((clientX: number, clientY: number) => {
      // No hover logic when the popover is pinned or no data available.
      if (interactions.get().isPopoverPinned || !plotRef.current || interactions.plot.xy.length === 0) {
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

    const onSVGMouseMove = ({ clientX, clientY }: React.MouseEvent<SVGElement, MouseEvent>) =>
      onSVGMouseMoveThrottled(clientX, clientY);

    // A callback for svg mouseout to clear all highlights.
    const onSVGMouseOut = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
      // Because the mouseover is throttled, in can occur slightly after the mouseout,
      // neglecting its effect; cancelling the throttled function prevents that.
      onSVGMouseMoveThrottled.cancel();

      // No hover logic when the popover is pinned.
      if (interactions.get().isPopoverPinned) {
        return;
      }

      // Check if the target is contained within svg to allow hovering on the popover body.
      if (!nodeContains(plotRef.current!.svg, event.relatedTarget as Element)) {
        interactions.clearHighlightedLegend();
        interactions.clearHighlight();
      }
    };

    // A callback for svg click to pin/unpin the popover.
    const onSVGMouseDown = () => {
      interactions.togglePopoverPin();
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

    // A helper function to highlight the next or previous point withing selected column.
    const moveBetweenSeries = (direction: -1 | 1) => {
      // Can only use motion when a particular point is highlighted.
      const point = interactions.get().highlightedPoint;
      if (!point) {
        return;
      }

      // Take the index of the currently highlighted column.
      const xIndex = point.index.x;
      // Take the incremented(circularly) y-index of the currently highlighted point.
      const yIndex = circleIndex(point.index.y + direction, [0, interactions.plot.xy[xIndex].length - 1]);
      // Highlight the next point using x:y grouped data.
      interactions.highlightPoint(interactions.plot.xy[xIndex][yIndex]);
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
        moveWithinSeries(keyCode === KeyCode.right ? 1 : -1);
      }
      // Pin popover.
      else if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
        interactions.pinPopover();
      }
    };

    // A callback for svg focus to highlight series.
    const onSVGFocus = (_event: React.FocusEvent, trigger: 'mouse' | 'keyboard') => {
      // When focus is caused by a click event nothing is expected as clicks are handled separately.
      // Otherwise, select the first series point.
      if (trigger === 'keyboard') {
        interactions.highlightFirstPoint();
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
          if (interactions.get().highlightedPoint) {
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
      },
      refs: {
        plot: plotRef,
        container: containerRef,
        verticalMarker: verticalMarkerRef,
      },
    };
  }, [allSeries, series, xDomain, yDomain, xScaleType, yScaleType, height, width, stableSetVisibleSeries]);

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
