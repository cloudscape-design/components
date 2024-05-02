// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

import { getXTickCount, getYTickCount, createXTicks, createYTicks } from '../internal/components/cartesian-chart/ticks';
import ChartPlot, { ChartPlotRef } from '../internal/components/chart-plot';
import AxisLabel from '../internal/components/cartesian-chart/axis-label';
import LabelsMeasure from '../internal/components/cartesian-chart/labels-measure';
import InlineStartLabels from '../internal/components/cartesian-chart/inline-start-labels';
import BlockEndLabels, { useBLockEndLabels } from '../internal/components/cartesian-chart/block-end-labels';
import VerticalGridLines from '../internal/components/cartesian-chart/vertical-grid-lines';
import EmphasizedBaseline from '../internal/components/cartesian-chart/emphasized-baseline';
import HighlightedPoint from '../internal/components/cartesian-chart/highlighted-point';
import VerticalMarker from '../internal/components/cartesian-chart/vertical-marker';
import { ChartScale, NumericChartScale } from '../internal/components/cartesian-chart/scales';
import MixedChartPopover from './chart-popover';
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
import { useHeightMeasure } from '../internal/hooks/container-queries/use-height-measure';
import { getIsRtl } from '../internal/direction';

const INLINE_START_LABELS_MARGIN = 16;
const BLOCK_END_LABELS_OFFSET = 12;

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

  detailPopoverSeriesContent?: MixedLineBarChartProps.DetailPopoverSeriesContent<T>;
}

interface BaseAxisProps {
  tickCount: number;
  tickFormatter: TickFormatter;
  title?: string;
  ariaRoleDescription?: string;
}

interface XAxisProps extends BaseAxisProps {
  axis: 'x';
  scale: ChartScale;
  ticks: ChartDataTypes[];
}

interface YAxisProps extends BaseAxisProps {
  axis: 'y';
  scale: NumericChartScale;
  ticks: number[];
}

const fallbackContainerWidth = 500;

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
  detailPopoverSeriesContent,
  ...props
}: ChartContainerProps<T>) {
  const plotRef = useRef<ChartPlotRef>(null);
  const verticalMarkerRef = useRef<SVGLineElement>(null);

  const [inlineStartLabelsWidth, setInlineStartLabelsWidth] = useState(0);
  const [verticalMarkerX, setVerticalMarkerX] = useState<VerticalMarkerX<T> | null>(null);
  const [detailsPopoverText, setDetailsPopoverText] = useState('');
  const [containerWidth, containerMeasureRef] = useContainerWidth(fallbackContainerWidth);
  const maxInlineStartLabelsWidth = Math.round(containerWidth / 2);
  const plotWidth = containerWidth
    ? // Calculate the minimum between inlineStartLabelsWidth and maxInlineStartLabelsWidth for extra safety because inlineStarteLabelsWidth could be out of date
      Math.max(
        0,
        containerWidth - Math.min(inlineStartLabelsWidth, maxInlineStartLabelsWidth) - INLINE_START_LABELS_MARGIN
      )
    : fallbackContainerWidth;
  const containerRefObject = useRef(null);
  const containerRef = useMergeRefs(containerMeasureRef, containerRefObject);
  const popoverRef = useRef<HTMLElement | null>(null);

  const xDomain = (props.xDomain || computeDomainX(series, xScaleType)) as
    | readonly number[]
    | readonly string[]
    | readonly Date[];
  const yDomain = (props.yDomain || computeDomainY(series, yScaleType, stackedBars)) as readonly number[];

  const linesOnly = series.every(({ series }) => series.type === 'line' || series.type === 'threshold');

  function getXAxisProps(size: number, range: [from: number, until: number]): XAxisProps {
    const tickCount = getXTickCount(size);
    const scale = new ChartScale(xScaleType, xDomain, range, linesOnly);
    const ticks = createXTicks(scale, tickCount);
    return {
      axis: 'x',
      tickCount,
      scale,
      ticks,
      tickFormatter: xTickFormatter as TickFormatter,
      title: xTitle,
      ariaRoleDescription: i18nStrings.xAxisAriaRoleDescription,
    };
  }

  function getYAxisProps(size: number, range: [from: number, until: number]): YAxisProps {
    const tickCount = getYTickCount(size);
    const scale = new NumericChartScale(yScaleType, yDomain, range, props.yDomain ? null : tickCount);
    const ticks = createYTicks(scale, tickCount);
    return {
      axis: 'y',
      tickCount,
      scale,
      ticks,
      tickFormatter: yTickFormatter as TickFormatter,
      title: yTitle,
      ariaRoleDescription: i18nStrings.yAxisAriaRoleDescription,
    };
  }

  const isRtl = containerRefObject?.current && getIsRtl(containerRefObject.current);
  const bottomAxisProps = !horizontalBars
    ? getXAxisProps(plotWidth, !isRtl ? [0, plotWidth] : [plotWidth, 0])
    : getYAxisProps(plotWidth, !isRtl ? [0, plotWidth] : [plotWidth, 0]);

  const blockEndLabelsProps = useBLockEndLabels({ ...bottomAxisProps });

  const plotMeasureRef = useRef<SVGLineElement>(null);
  const measuredHeight = useHeightMeasure(() => plotMeasureRef.current, !fitHeight);
  const plotHeight = fitHeight ? measuredHeight ?? 0 : explicitPlotHeight;

  const leftAxisProps = !horizontalBars
    ? getYAxisProps(plotHeight, [plotHeight, 0])
    : getXAxisProps(plotHeight, [0, plotHeight]);

  const xAxisProps = bottomAxisProps.axis === 'x' ? bottomAxisProps : leftAxisProps.axis === 'x' ? leftAxisProps : null;
  const yAxisProps = bottomAxisProps.axis === 'y' ? bottomAxisProps : leftAxisProps.axis === 'y' ? leftAxisProps : null;
  if (!xAxisProps || !yAxisProps) {
    throw new Error('Invariant violation: invalid axis props.');
  }

  /**
   * Interactions
   */
  const highlightedPointRef = useRef<SVGGElement>(null);
  const highlightedGroupRef = useRef<SVGRectElement>(null);

  // Some chart components are rendered against "x" or "y" axes,
  // When "horizontalBars" is enabled, the axes are inverted.
  const x = !horizontalBars ? 'x' : 'y';
  const y = !horizontalBars ? 'y' : 'x';

  const scaledSeries = makeScaledSeries(visibleSeries, xAxisProps.scale, yAxisProps.scale);
  const barGroups: ScaledBarGroup<T>[] = makeScaledBarGroups(visibleSeries, xAxisProps.scale, plotWidth, plotHeight, y);

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
    xScale: xAxisProps.scale,
    yScale: yAxisProps.scale,
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
    isRtl: !!isRtl,
    horizontalBars,
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
        const isSomeElementHighlighted = !!(highlightedPoint || highlightedGroupIndex !== null || verticalMarkerX);
        if (isSomeElementHighlighted) {
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

  const onSVGClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
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

  const onApplicationFocus = (event: React.FocusEvent, trigger: 'mouse' | 'keyboard') => {
    if (trigger === 'keyboard') {
      handlers.onFocus();
    } else {
      // noop: clicks are handled separately
    }
  };

  const onApplicationBlur = (event: React.FocusEvent<Element>) => {
    const blurTarget = event.relatedTarget || event.target;
    if (
      blurTarget === null ||
      !(blurTarget instanceof Element) ||
      !nodeBelongs(containerRefObject.current, blurTarget)
    ) {
      clearHighlightedSeries();
      setVerticalMarkerX(null);

      if (isPopoverOpen && !isPopoverPinned) {
        dismissPopover();
      }
    }
  };

  const onSVGKeyDown = handlers.onKeyDown;

  const xOffset = xAxisProps.scale.isCategorical() ? Math.max(0, xAxisProps.scale.d3Scale.bandwidth() - 1) / 2 : 0;

  let verticalLineX: number | null = null;
  if (verticalMarkerX !== null) {
    verticalLineX = verticalMarkerX.scaledX;
  } else if (isGroupNavigation && highlightedGroupIndex !== null) {
    const x = xAxisProps.scale.d3Scale(barGroups[highlightedGroupIndex].x as any) ?? null;
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
      return formatHighlighted({
        position: highlightedX,
        series: seriesToShow,
        xTickFormatter,
        detailPopoverSeriesContent,
      });
    }

    // Otherwise - show all visible series details.
    return formatHighlighted({
      position: highlightedX,
      series: visibleSeries,
      xTickFormatter,
      detailPopoverSeriesContent,
    });
  }, [highlightedX, highlightedPoint, visibleSeries, xTickFormatter, detailPopoverSeriesContent]);

  const detailPopoverFooterContent = useMemo(
    () => (detailPopoverFooter && highlightedX ? detailPopoverFooter(highlightedX) : null),
    [detailPopoverFooter, highlightedX]
  );

  const activeAriaLabel =
    highlightDetails && detailsPopoverText ? `${highlightDetails.position}, ${detailsPopoverText}` : '';

  // Live region is used when nothing is focused e.g. when hovering.
  const activeLiveRegion =
    activeAriaLabel && !highlightedPoint && highlightedGroupIndex === null ? activeAriaLabel : '';

  const isLineXKeyboardFocused = !highlightedPoint && verticalMarkerX;

  const isRefresh = useVisualRefresh();

  return (
    <CartesianChartContainer
      ref={containerRef}
      minHeight={explicitPlotHeight + blockEndLabelsProps.height}
      fitHeight={!!fitHeight}
      leftAxisLabel={<AxisLabel axis={y} position="left" title={leftAxisProps.title} />}
      leftAxisLabelMeasure={
        <LabelsMeasure
          ticks={leftAxisProps.ticks}
          scale={leftAxisProps.scale}
          tickFormatter={leftAxisProps.tickFormatter as TickFormatter}
          autoWidth={setInlineStartLabelsWidth}
          maxLabelsWidth={maxInlineStartLabelsWidth}
        />
      }
      bottomAxisLabel={<AxisLabel axis={x} position="bottom" title={bottomAxisProps.title} />}
      chartPlot={
        <ChartPlot
          ref={plotRef}
          width="100%"
          height={fitHeight ? `calc(100% - ${blockEndLabelsProps.height}px)` : plotHeight}
          offsetBottom={blockEndLabelsProps.height}
          isClickable={isPopoverOpen && !isPopoverPinned}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledby}
          ariaDescription={ariaDescription}
          ariaRoleDescription={i18nStrings?.chartAriaRoleDescription}
          ariaLiveRegion={activeLiveRegion}
          activeElementRef={highlightedElementRef}
          activeElementKey={
            highlightedGroupIndex?.toString() ??
            (isLineXKeyboardFocused ? `point-index-${handlers.xIndex}` : point?.key)
          }
          activeElementFocusOffset={isGroupNavigation ? 0 : isLineXKeyboardFocused ? { x: 8, y: 0 } : 3}
          onMouseMove={onSVGMouseMove}
          onMouseOut={onSVGMouseOut}
          onClick={onSVGClick}
          onApplicationFocus={onApplicationFocus}
          onApplicationBlur={onApplicationBlur}
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

          <InlineStartLabels
            axis={y}
            ticks={leftAxisProps.ticks}
            scale={leftAxisProps.scale}
            tickFormatter={leftAxisProps.tickFormatter as TickFormatter}
            title={leftAxisProps.title}
            ariaRoleDescription={leftAxisProps.ariaRoleDescription}
            maxLabelsWidth={maxInlineStartLabelsWidth}
            plotWidth={plotWidth}
            plotHeight={plotHeight}
          />

          {horizontalBars && (
            <VerticalGridLines scale={yAxisProps.scale} ticks={yAxisProps.ticks} height={plotHeight} />
          )}

          {emphasizeBaselineAxis && linesOnly && (
            <EmphasizedBaseline axis={x} scale={yAxisProps.scale} width={plotWidth} height={plotHeight} />
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
            xScale={xAxisProps.scale}
            yScale={yAxisProps.scale}
          />

          {emphasizeBaselineAxis && !linesOnly && (
            <EmphasizedBaseline axis={x} scale={yAxisProps.scale} width={plotWidth} height={plotHeight} />
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

          {isGroupNavigation && xAxisProps.scale.isCategorical() && (
            <BarGroups
              ariaLabel={activeAriaLabel}
              isRefresh={isRefresh}
              isPopoverPinned={isPopoverPinned}
              barGroups={barGroups}
              highlightedGroupIndex={highlightedGroupIndex}
              highlightedGroupRef={highlightedGroupRef}
            />
          )}

          <BlockEndLabels
            {...blockEndLabelsProps}
            axis={x}
            scale={bottomAxisProps.scale}
            title={bottomAxisProps.title}
            ariaRoleDescription={bottomAxisProps.ariaRoleDescription}
            height={plotHeight}
            width={plotWidth}
            offsetLeft={inlineStartLabelsWidth + BLOCK_END_LABELS_OFFSET}
            offsetRight={BLOCK_END_LABELS_OFFSET}
          />
        </ChartPlot>
      }
      popover={
        <MixedChartPopover
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
          onBlur={onApplicationBlur}
          setPopoverText={setDetailsPopoverText}
        />
      }
    />
  );
}
