// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

import { getXTickCount, getYTickCount, createXTicks, createYTicks } from '../internal/components/cartesian-chart/ticks';
import ChartPlot, { ChartPlotRef } from '../internal/components/chart-plot';
import AxisLabel from '../internal/components/cartesian-chart/axis-label';
import LabelsMeasure from '../internal/components/cartesian-chart/labels-measure';
import LeftLabels from '../internal/components/cartesian-chart/left-labels';
import BottomLabels from '../internal/components/cartesian-chart/bottom-labels';
import VerticalGridLines from '../internal/components/cartesian-chart/vertical-grid-lines';
import EmphasizedBaseline from '../internal/components/cartesian-chart/emphasized-baseline';
import HighlightedPoint from '../internal/components/cartesian-chart/highlighted-point';
import VerticalMarker from '../internal/components/cartesian-chart/vertical-marker';
import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import ChartPopover from './chart-popover';
import { ChartDataTypes, InternalChartSeries, MixedLineBarChartProps, ScaleType, VerticalMarkerX } from './interfaces';
import { computeDomainX, computeDomainY } from './domain';
import { isXThreshold } from './utils';
import makeScaledSeries, { ScaledPoint } from './make-scaled-series';
import makeScaledBarGroups, { ScaledBarGroup } from './make-scaled-bar-groups';
import formatHighlighted from './format-highlighted';
import DataSeries from './data-series';
import BarGroups from './bar-groups';
import { useMouseHover } from './hooks/use-mouse-hover';
import { useNavigation } from './hooks/use-navigation';
import { usePopover } from './hooks/use-popover';

import { CartesianChartProps } from '../internal/components/cartesian-chart/interfaces';
import useContainerWidth from '../internal/utils/use-container-width';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { nodeBelongs } from '../internal/utils/node-belongs';
import { CartesianChartContainer } from '../internal/components/cartesian-chart/chart-container';
import { useResizeObserver } from '../internal/hooks/container-queries';

const LEFT_LABELS_MARGIN = 16;
const BOTTOM_LABELS_OFFSET = 12;

type TickFormatter = undefined | ((value: ChartDataTypes) => string);

export interface ChartContainerProps<T extends ChartDataTypes> {
  series: ReadonlyArray<InternalChartSeries<T>>;
  visibleSeries: ReadonlyArray<InternalChartSeries<T>>;

  fitHeight?: boolean;
  height: number;
  detailPopoverSize: MixedLineBarChartProps<T>['detailPopoverSize'];
  detailPopoverFooter: MixedLineBarChartProps<T>['detailPopoverFooter'];

  xScaleType: ScaleType;
  yScaleType: 'linear' | 'log';

  xDomain: MixedLineBarChartProps<T>['xDomain'];
  yDomain: MixedLineBarChartProps<T>['yDomain'];

  xTickFormatter?: CartesianChartProps.TickFormatter<T>;
  yTickFormatter?: CartesianChartProps.TickFormatter<number>;

  xTitle?: string;
  yTitle?: string;

  stackedBars?: boolean;
  emphasizeBaselineAxis: boolean;
  horizontalBars?: boolean;

  highlightedSeries?: MixedLineBarChartProps<T>['highlightedSeries'];
  onHighlightChange: (series: InternalChartSeries<T>['series'] | null) => void;
  highlightedPoint: ScaledPoint<T> | null;
  setHighlightedPoint: (point: ScaledPoint<T> | null) => void;
  highlightedGroupIndex: number | null;
  setHighlightedGroupIndex: (groupIndex: number | null) => void;

  ariaLabel: MixedLineBarChartProps<T>['ariaLabel'];
  ariaLabelledby: MixedLineBarChartProps<T>['ariaLabelledby'];
  ariaDescription: MixedLineBarChartProps<T>['ariaDescription'];
  i18nStrings: MixedLineBarChartProps<T>['i18nStrings'];

  plotContainerRef: React.RefObject<HTMLDivElement>;
}

export default function ChartContainer<T extends ChartDataTypes>({
  fitHeight,
  height: explicitPlotHeight,
  series,
  visibleSeries,
  highlightedSeries,
  onHighlightChange,
  highlightedPoint,
  setHighlightedPoint,
  highlightedGroupIndex,
  setHighlightedGroupIndex,
  detailPopoverFooter,
  detailPopoverSize = 'medium',
  stackedBars = false,
  horizontalBars = false,
  xScaleType,
  yScaleType,
  xTickFormatter,
  yTickFormatter,
  emphasizeBaselineAxis,
  xTitle,
  yTitle,
  ariaLabel,
  ariaLabelledby,
  ariaDescription,
  i18nStrings = {},
  plotContainerRef,
  ...props
}: ChartContainerProps<T>) {
  const plotRef = useRef<ChartPlotRef>(null);
  const verticalMarkerRef = useRef<SVGLineElement>(null);

  const [leftLabelsWidth, setLeftLabelsWidth] = useState(0);
  const [bottomLabelsHeight, setBottomLabelsHeight] = useState(0);
  const [verticalMarkerX, setVerticalMarkerX] = useState<VerticalMarkerX<T> | null>(null);
  const [containerWidth, containerMeasureRef] = useContainerWidth(500);
  const plotWidth = containerWidth ? containerWidth - leftLabelsWidth - LEFT_LABELS_MARGIN : 500;
  const containerRefObject = useRef(null);
  const containerRef = useMergeRefs(containerMeasureRef, containerRefObject);
  const popoverRef = useRef<HTMLElement | null>(null);

  const plotMeasureRef = useRef<SVGLineElement>(null);
  const [measuredHeight, setHeight] = useState(0);
  // TODO: optimise
  useResizeObserver(
    () => plotMeasureRef.current,
    entry => setHeight(entry.borderBoxHeight)
  );
  const plotHeight = fitHeight ? measuredHeight : explicitPlotHeight;

  const isRefresh = useVisualRefresh();

  const linesOnly = series.every(({ series }) => series.type === 'line' || series.type === 'threshold');

  const xDomain = (props.xDomain || computeDomainX(series, xScaleType)) as
    | readonly number[]
    | readonly string[]
    | readonly Date[];
  const yDomain = (props.yDomain || computeDomainY(series, yScaleType, stackedBars)) as readonly number[];

  const xTickCount = getXTickCount(plotWidth);
  const yTickCount = getYTickCount(plotHeight);

  const rangeBottomTop: [number, number] = [0, plotHeight];
  const rangeTopBottom: [number, number] = [plotHeight, 0];
  const rangeLeftRight: [number, number] = [0, plotWidth];
  const xScale = new ChartScale(xScaleType, xDomain, horizontalBars ? rangeBottomTop : rangeLeftRight, linesOnly);
  const yScale = new NumericChartScale(
    yScaleType,
    yDomain,
    horizontalBars ? rangeLeftRight : rangeTopBottom,
    props.yDomain ? null : yTickCount
  );

  const xTicks = createXTicks(xScale, xTickCount);
  const yTicks = createYTicks(yScale, yTickCount);

  /**
   * Interactions
   */
  const highlightedPointRef = useRef<SVGGElement>(null);
  const highlightedGroupRef = useRef<SVGRectElement>(null);
  const [isPlotFocused, setPlotFocused] = useState(false);

  // Some chart components are rendered against "x" or "y" axes,
  // When "horizontalBars" is enabled, the axes are inverted.
  const x = !horizontalBars ? 'x' : 'y';
  const y = !horizontalBars ? 'y' : 'x';
  const xy = {
    ticks: { x: xTicks, y: yTicks },
    scale: { x: xScale, y: yScale },
    tickFormatter: { x: xTickFormatter, y: yTickFormatter },
    title: { x: xTitle, y: yTitle },
    ariaRoleDescription: { x: i18nStrings.xAxisAriaRoleDescription, y: i18nStrings.yAxisAriaRoleDescription },
  };

  const scaledSeries = makeScaledSeries(visibleSeries, xScale, yScale);
  const barGroups: ScaledBarGroup<T>[] = makeScaledBarGroups(visibleSeries, xScale, plotWidth, plotHeight, y);

  const { isPopoverOpen, isPopoverPinned, showPopover, pinPopover, dismissPopover } = usePopover();

  // Allows to add a delay between popover is dismissed and handlers are enabled to prevent immediate popover reopening.
  const [isHandlersDisabled, setHandlersDisabled] = useState(!isPopoverPinned);
  useEffect(() => {
    if (isPopoverPinned) {
      setHandlersDisabled(true);
    } else {
      const timeoutId = setTimeout(() => setHandlersDisabled(false), 25);
      return () => clearTimeout(timeoutId);
    }
  }, [isPopoverPinned]);

  const highlightSeries = useCallback(
    (series: MixedLineBarChartProps.ChartSeries<T> | null) => {
      if (series !== highlightedSeries) {
        onHighlightChange(series);
      }
    },
    [highlightedSeries, onHighlightChange]
  );

  const highlightPoint = useCallback(
    (point: ScaledPoint<T> | null) => {
      setHighlightedGroupIndex(null);
      setHighlightedPoint(point);
      if (point) {
        highlightSeries(point.series);
        setVerticalMarkerX({
          scaledX: point.x,
          label: point.datum?.x ?? null,
        });
      }
    },
    [setHighlightedGroupIndex, setHighlightedPoint, highlightSeries]
  );

  const clearAllHighlights = useCallback(() => {
    setHighlightedPoint(null);
    highlightSeries(null);
    setHighlightedGroupIndex(null);
  }, [highlightSeries, setHighlightedGroupIndex, setHighlightedPoint]);

  // Highlight all points at a given X in a line chart
  const highlightX = useCallback(
    (marker: VerticalMarkerX<T> | null) => {
      if (marker) {
        clearAllHighlights();
      }
      setVerticalMarkerX(marker);
    },
    [clearAllHighlights]
  );

  // Highlight all points and bars at a given X index in a mixed line and bar chart
  const highlightGroup = useCallback(
    (groupIndex: number) => {
      highlightSeries(null);
      setHighlightedPoint(null);
      setHighlightedGroupIndex(groupIndex);
    },
    [highlightSeries, setHighlightedPoint, setHighlightedGroupIndex]
  );

  const clearHighlightedSeries = useCallback(() => {
    clearAllHighlights();
    dismissPopover();
  }, [dismissPopover, clearAllHighlights]);

  const { isGroupNavigation, ...handlers } = useNavigation({
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
    clearHighlightedSeries,
    verticalMarkerX,
  });

  const { onSVGMouseMove, onSVGMouseOut, onPopoverLeave } = useMouseHover<T>({
    scaledSeries,
    barGroups,
    plotRef,
    popoverRef,
    highlightPoint,
    highlightGroup,
    clearHighlightedSeries,
    isGroupNavigation,
    isHandlersDisabled,
    highlightX,
  });

  // There are multiple ways to indicate what X is selected.
  // TODO: make a uniform verticalMarkerX state to fit all use-cases.
  const highlightedX = useMemo(() => {
    if (highlightedGroupIndex !== null) {
      return barGroups[highlightedGroupIndex].x;
    }
    if (verticalMarkerX !== null) {
      return verticalMarkerX.label;
    }
    return highlightedPoint?.datum?.x ?? null;
  }, [highlightedPoint, verticalMarkerX, highlightedGroupIndex, barGroups]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissPopover();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dismissPopover]);

  useLayoutEffect(() => {
    if (highlightedX !== null || highlightedPoint !== null) {
      showPopover();
    }
  }, [highlightedX, highlightedPoint, showPopover]);

  const onPopoverDismiss = (outsideClick?: boolean) => {
    dismissPopover();

    if (!outsideClick) {
      // The delay is needed to bypass focus events caused by click or keypress needed to unpin the popover.
      setTimeout(() => {
        const isSomeInnerElementFocused = highlightedPoint || highlightedGroupIndex !== null || verticalMarkerX;
        if (isSomeInnerElementFocused) {
          plotRef.current?.focusApplication();
        } else {
          plotRef.current?.focusPlot();
        }
      }, 0);
    } else {
      clearAllHighlights();
      setVerticalMarkerX(null);
    }
  };

  const onSVGMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isPopoverOpen) {
      if (isPopoverPinned) {
        dismissPopover();
      } else {
        pinPopover();
        e.preventDefault();
      }
    } else {
      showPopover();
    }
  };

  const onSVGFocus = (event: React.FocusEvent, trigger: 'mouse' | 'keyboard') => {
    setPlotFocused(true);
    if (trigger === 'keyboard') {
      handlers.onFocus();
    } else {
      // noop: clicks are handled separately
    }
  };

  const onSVGBlur = (event: React.FocusEvent<Element>) => {
    setPlotFocused(false);
    const blurTarget = event.relatedTarget || event.target;
    if (
      blurTarget === null ||
      !(blurTarget instanceof Element) ||
      !nodeBelongs(containerRefObject.current, blurTarget)
    ) {
      setHighlightedPoint(null);
      setVerticalMarkerX(null);
      if (!plotContainerRef?.current?.contains(blurTarget)) {
        clearHighlightedSeries();
      }

      if (isPopoverOpen && !isPopoverPinned) {
        dismissPopover();
      }
    }
  };

  const onSVGKeyDown = handlers.onKeyDown;

  const xOffset = xScale.isCategorical() ? Math.max(0, xScale.d3Scale.bandwidth() - 1) / 2 : 0;

  let verticalLineX: number | null = null;
  if (verticalMarkerX !== null) {
    verticalLineX = verticalMarkerX.scaledX;
  } else if (isGroupNavigation && highlightedGroupIndex !== null) {
    const x = xScale.d3Scale(barGroups[highlightedGroupIndex].x as any) ?? null;
    if (x !== null) {
      verticalLineX = xOffset + x;
    }
  }

  const point = useMemo(
    () =>
      highlightedPoint
        ? {
            key: `${highlightedPoint.x}-${highlightedPoint.y}`,
            x: highlightedPoint.x,
            y: highlightedPoint.y,
            color: highlightedPoint.color,
          }
        : null,
    [highlightedPoint]
  );

  const verticalMarkers = useMemo(
    () =>
      verticalLineX !== null
        ? scaledSeries
            .filter(({ x, y }) => (x === verticalLineX || isNaN(x)) && !isNaN(y))
            .map(({ x, y, color }, index) => ({
              key: `${index}-${x}-${y}`,
              x: !horizontalBars ? verticalLineX || 0 : y,
              y: !horizontalBars ? y : verticalLineX || 0,
              color: color,
            }))
        : [],
    [scaledSeries, verticalLineX, horizontalBars]
  );

  const highlightedElementRef = isGroupNavigation
    ? highlightedGroupRef
    : highlightedPoint
    ? highlightedPointRef
    : verticalMarkerRef;

  const highlightDetails = useMemo(() => {
    if (highlightedX === null) {
      return null;
    }

    // When series point is highlighted show the corresponding series and matching x-thresholds.
    if (highlightedPoint) {
      const seriesToShow = visibleSeries.filter(
        series => series.series === highlightedPoint?.series || isXThreshold(series.series)
      );
      return formatHighlighted(highlightedX, seriesToShow, xTickFormatter);
    }

    // Otherwise - show all visible series details.
    return formatHighlighted(highlightedX, visibleSeries, xTickFormatter);
  }, [highlightedX, highlightedPoint, visibleSeries, xTickFormatter]);

  const detailPopoverFooterContent = useMemo(
    () => (detailPopoverFooter && highlightedX ? detailPopoverFooter(highlightedX) : null),
    [detailPopoverFooter, highlightedX]
  );

  const activeAriaLabel = useMemo(
    () =>
      highlightDetails
        ? `${highlightDetails.position}, ${highlightDetails.details.map(d => d.key + ' ' + d.value).join(',')}`
        : '',
    [highlightDetails]
  );

  // Live region is used when nothing is focused e.g. when hovering.
  const activeLiveRegion =
    activeAriaLabel && !highlightedPoint && highlightedGroupIndex === null ? activeAriaLabel : '';

  const isLineXKeyboardFocused = isPlotFocused && !highlightedPoint && verticalMarkerX;

  return (
    <CartesianChartContainer
      ref={containerRef}
      fitHeight={!!fitHeight}
      bottomLabelsHeight={bottomLabelsHeight}
      leftAxisLabel={<AxisLabel axis={y} position="left" title={xy.title[y]} />}
      leftAxisLabelMeasure={
        <LabelsMeasure
          ticks={xy.ticks[y]}
          scale={xy.scale[y]}
          tickFormatter={xy.tickFormatter[y] as TickFormatter}
          autoWidth={setLeftLabelsWidth}
        />
      }
      bottomAxisLabel={<AxisLabel axis={x} position="bottom" title={xy.title[x]} />}
      chartPlot={
        <ChartPlot
          ref={plotRef}
          width="100%"
          height={fitHeight ? `calc(100% - ${bottomLabelsHeight}px)` : plotHeight}
          offsetBottom={bottomLabelsHeight}
          isClickable={isPopoverOpen && !isPopoverPinned}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledby}
          ariaDescription={ariaDescription}
          ariaRoleDescription={i18nStrings?.chartAriaRoleDescription}
          ariaLiveRegion={activeLiveRegion}
          activeElementRef={highlightedElementRef}
          activeElementKey={
            isPlotFocused &&
            (highlightedGroupIndex?.toString() ??
              (isLineXKeyboardFocused ? `point-index-${handlers.xIndex}` : point?.key))
          }
          activeElementFocusOffset={isGroupNavigation ? 0 : isLineXKeyboardFocused ? { x: 8, y: 0 } : 3}
          onMouseMove={onSVGMouseMove}
          onMouseOut={onSVGMouseOut}
          onMouseDown={onSVGMouseDown}
          onFocus={onSVGFocus}
          onBlur={onSVGBlur}
          onKeyDown={onSVGKeyDown}
        >
          <line
            ref={plotMeasureRef}
            x1="0"
            x2="0"
            y1="0"
            y2="100%"
            stroke="transparent"
            strokeWidth={1}
            style={{ pointerEvents: 'none' }}
          />

          <LeftLabels
            axis={y}
            ticks={xy.ticks[y]}
            scale={xy.scale[y]}
            tickFormatter={xy.tickFormatter[y] as TickFormatter}
            title={xy.title[y]}
            ariaRoleDescription={xy.ariaRoleDescription[y]}
            width={plotWidth}
            height={plotHeight}
          />

          {horizontalBars && <VerticalGridLines scale={yScale} ticks={yTicks} height={plotHeight} />}

          {emphasizeBaselineAxis && linesOnly && (
            <EmphasizedBaseline axis={x} scale={yScale} width={plotWidth} height={plotHeight} />
          )}

          <DataSeries
            axis={x}
            plotWidth={plotWidth}
            plotHeight={plotHeight}
            highlightedSeries={highlightedSeries ?? null}
            highlightedGroupIndex={highlightedGroupIndex}
            stackedBars={stackedBars}
            isGroupNavigation={isGroupNavigation}
            visibleSeries={visibleSeries}
            xScale={xScale}
            yScale={yScale}
          />

          {emphasizeBaselineAxis && !linesOnly && (
            <EmphasizedBaseline axis={x} scale={yScale} width={plotWidth} height={plotHeight} />
          )}

          <VerticalMarker
            key={verticalLineX || ''}
            height={plotHeight}
            showPoints={highlightedPoint === null}
            showLine={!isGroupNavigation}
            points={verticalMarkers}
            ref={verticalMarkerRef}
          />

          {highlightedPoint && (
            <HighlightedPoint
              ref={highlightedPointRef}
              point={point}
              role="button"
              ariaLabel={activeAriaLabel}
              ariaHasPopup={true}
              ariaExpanded={isPopoverPinned}
            />
          )}

          {isGroupNavigation && xScale.isCategorical() && (
            <BarGroups
              ariaLabel={activeAriaLabel}
              isRefresh={isRefresh}
              isPopoverPinned={isPopoverPinned}
              barGroups={barGroups}
              highlightedGroupIndex={highlightedGroupIndex}
              highlightedGroupRef={highlightedGroupRef}
            />
          )}

          <BottomLabels
            axis={x}
            ticks={xy.ticks[x]}
            scale={xy.scale[x]}
            tickFormatter={xy.tickFormatter[x] as TickFormatter}
            title={xy.title[x]}
            ariaRoleDescription={xy.ariaRoleDescription[x]}
            height={plotHeight}
            width={plotWidth}
            offsetLeft={leftLabelsWidth + BOTTOM_LABELS_OFFSET}
            offsetRight={BOTTOM_LABELS_OFFSET}
            autoHeight={setBottomLabelsHeight}
          />
        </ChartPlot>
      }
      popover={
        <ChartPopover
          ref={popoverRef}
          containerRef={containerRefObject}
          trackRef={highlightedElementRef}
          isOpen={isPopoverOpen}
          isPinned={isPopoverPinned}
          highlightDetails={highlightDetails}
          onDismiss={onPopoverDismiss}
          size={detailPopoverSize}
          footer={detailPopoverFooterContent}
          dismissAriaLabel={i18nStrings.detailPopoverDismissAriaLabel}
          onMouseLeave={onPopoverLeave}
        />
      }
    />
  );
}
