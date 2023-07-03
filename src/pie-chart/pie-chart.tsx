// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { pie } from 'd3-shape';

import { KeyCode } from '../internal/keycode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import ChartPopover from '../internal/components/chart-popover';
import SeriesDetails from '../internal/components/chart-series-details';
import SeriesMarker from '../internal/components/chart-series-marker';
import ChartStatusContainer, { getChartStatus } from '../internal/components/chart-status-container';
import InternalBox from '../box/internal';

import Labels from './labels';
import { PieChartProps, SeriesInfo } from './interfaces';
import styles from './styles.css.js';
import { defaultDetails, getDimensionsBySize } from './utils';
import Segments from './segments';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import ChartPlot, { ChartPlotRef } from '../internal/components/chart-plot';
import { SomeRequired } from '../internal/types';
import { useInternalI18n } from '../internal/i18n/context';
import { nodeBelongs } from '../internal/utils/node-belongs';
import { useResizeObserver } from '../internal/hooks/container-queries';

export interface InternalChartDatum<T> {
  index: number;
  color: string;
  datum: Readonly<T>;
}

interface InternalPieChartProps<T extends PieChartProps.Datum>
  extends SomeRequired<
    Omit<PieChartProps<T>, 'onHighlightChange'>,
    'variant' | 'size' | 'i18nStrings' | 'hideTitles' | 'hideDescriptions' | 'statusType'
  > {
  visibleData: Array<InternalChartDatum<T>>;
  width: number;

  highlightedSegment: T | null;
  onHighlightChange: (segment: null | T) => void;

  legendSegment: T | null;

  pinnedSegment: T | null;
  setPinnedSegment: React.Dispatch<React.SetStateAction<T | null>>;
}

export interface TooltipData<T> {
  datum: T;
  trackRef: React.RefObject<SVGElement>;
  series: SeriesInfo;
}

export default <T extends PieChartProps.Datum>({
  fitHeight,
  variant,
  size,
  i18nStrings,
  ariaLabel,
  ariaLabelledby,
  data,
  visibleData,
  ariaDescription,
  innerMetricValue,
  innerMetricDescription,
  hideTitles,
  hideDescriptions,
  detailPopoverContent,
  detailPopoverSize,
  detailPopoverFooter,
  width,
  additionalFilters,
  hideFilter,
  hideLegend,
  statusType,
  empty,
  noMatch,
  errorText,
  recoveryText,
  loadingText,
  onRecoveryClick,
  segmentDescription,
  highlightedSegment,
  onHighlightChange,
  legendSegment,
  pinnedSegment,
  setPinnedSegment,
}: InternalPieChartProps<T>) => {
  const plotRef = useRef<ChartPlotRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const focusedSegmentRef = useRef<SVGGElement>(null);
  const popoverTrackRef = useRef<SVGCircleElement>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const isRefresh = useVisualRefresh();

  const defaultDimensions = getDimensionsBySize({ size, visualRefresh: isRefresh });
  const radius = defaultDimensions.outerRadius;

  const hasLabels = !(hideTitles && hideDescriptions);
  const explicitHeight = 2 * (radius + defaultDimensions.padding + (hasLabels ? defaultDimensions.paddingLabels : 0));

  const plotMeasureRef = useRef<SVGLineElement>(null);
  const [measuredHeight, setHeight] = useState(0);
  useResizeObserver(
    () => plotMeasureRef.current,
    entry => setHeight(entry.borderBoxHeight)
  );
  const height = fitHeight ? measuredHeight : explicitHeight;

  const dimensions = getDimensionsBySize({ size: fitHeight ? height : size, visualRefresh: isRefresh });

  // Inner content is only available for donut charts and the inner description is not displayed for small charts
  const hasInnerContent =
    variant === 'donut' && (innerMetricValue || (innerMetricDescription && dimensions.size !== 'small'));

  const innerMetricId = useUniqueId('awsui-pie-chart__inner');

  const [isTooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [tooltipData, setTooltipData] = useState<TooltipData<T>>();

  const { pieData, dataSum } = useMemo(() => {
    const dataSum = visibleData.reduce((sum, d) => sum + d.datum.value, 0);

    const pieFactory = pie<InternalChartDatum<T>>()
      // Minimum 1% segment size
      .value(d => (d.datum.value < dataSum / 100 ? dataSum / 100 : d.datum.value))
      .sort(null);

    // Filter out segments with value of zero or below
    const pieData = pieFactory(visibleData.filter(d => d.datum.value > 0));

    return { pieData, dataSum };
  }, [visibleData]);

  const highlightedSegmentIndex = useMemo(() => {
    for (let index = 0; index < pieData.length; index++) {
      if (pieData[index].data.datum === highlightedSegment) {
        return index;
      }
    }
    return null;
  }, [pieData, highlightedSegment]);

  const detailPopoverFooterContent = useMemo(
    () => (detailPopoverFooter && highlightedSegment ? detailPopoverFooter(highlightedSegment) : null),
    [detailPopoverFooter, highlightedSegment]
  );

  const i18n = useInternalI18n('pie-chart');
  const detailFunction = detailPopoverContent || defaultDetails(i18n, i18nStrings);
  const details = tooltipData ? detailFunction(tooltipData.datum, dataSum) : [];
  const tooltipContent = tooltipData && <SeriesDetails details={details} />;

  const { isEmpty, showChart } = getChartStatus({ externalData: data, visibleData: pieData, statusType });

  // Pie charts have a special condition for empty/noMatch due to how zero-value segments are handled.
  const isNoMatch = isEmpty && visibleData.length !== data.length;

  const reserveLegendSpace = !showChart && !hideLegend;
  const reserveFilterSpace = statusType !== 'finished' && !isNoMatch && (!hideFilter || additionalFilters);

  const popoverDismissedRecently = useRef(false);
  const escapePressed = useRef(false);

  const highlightSegment = useCallback(
    (internalDatum: InternalChartDatum<T>) => {
      const segment = internalDatum.datum;
      if (segment !== highlightedSegment) {
        onHighlightChange(segment);
      }

      if (popoverTrackRef.current) {
        setTooltipData({
          datum: internalDatum.datum,
          series: {
            color: internalDatum.color,
            index: internalDatum.index,
            label: internalDatum.datum.title,
            markerType: 'rectangle',
          },
          trackRef: popoverTrackRef,
        });
        setTooltipOpen(true);
      }
    },
    [highlightedSegment, setTooltipOpen, onHighlightChange]
  );

  const clearHighlightedSegment = useCallback(() => {
    setTooltipOpen(false);
    onHighlightChange(null);
  }, [onHighlightChange, setTooltipOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearHighlightedSegment();
        escapePressed.current = true;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [clearHighlightedSegment]);

  const onMouseDown = useCallback(
    (internalDatum: InternalChartDatum<T>) => {
      if (pinnedSegment === internalDatum.datum) {
        setPinnedSegment(null);
        clearHighlightedSegment();
      } else {
        setPinnedSegment(internalDatum.datum);
        highlightSegment(internalDatum);
      }
    },
    [pinnedSegment, clearHighlightedSegment, setPinnedSegment, highlightSegment]
  );
  const onMouseOver = useCallback(
    (internalDatum: InternalChartDatum<T>) => {
      if (escapePressed.current) {
        escapePressed.current = false;
        return;
      }
      if (pinnedSegment !== null) {
        return;
      }
      highlightSegment(internalDatum);
    },
    [pinnedSegment, highlightSegment]
  );
  const onMouseOut = useCallback(
    (event: React.MouseEvent<SVGElement, MouseEvent>) => {
      if (pinnedSegment !== null || popoverRef.current?.contains(event.relatedTarget as Node)) {
        return;
      }

      clearHighlightedSegment();
    },
    [pinnedSegment, clearHighlightedSegment]
  );
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const keyCode = event.keyCode;
      if (
        keyCode !== KeyCode.right &&
        keyCode !== KeyCode.left &&
        keyCode !== KeyCode.enter &&
        keyCode !== KeyCode.space
      ) {
        return;
      }

      event.preventDefault();

      let nextIndex = highlightedSegmentIndex || 0;
      const MAX = pieData.length - 1;
      if (keyCode === KeyCode.right) {
        nextIndex++;
        if (nextIndex > MAX) {
          nextIndex = 0;
        }
      } else if (keyCode === KeyCode.left) {
        nextIndex--;
        if (nextIndex < 0) {
          nextIndex = MAX;
        }
      }
      if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
        setPinnedSegment(pieData[nextIndex].data.datum);
      }
      highlightSegment(pieData[nextIndex].data);
    },
    [setPinnedSegment, highlightSegment, pieData, highlightedSegmentIndex]
  );
  const onFocus = useCallback(
    (_event: any, target: 'keyboard' | 'mouse') => {
      // We need to make sure that we do not re-show the popover when we focus the segment after the popover is dismissed.
      // Normally we would check `event.relatedTarget` for the previously focused element,
      // but this is not supported for SVG elements in IE11. The workaround is this `popoverDismissedRecently` ref.
      if (pinnedSegment !== null || popoverDismissedRecently.current || target === 'mouse') {
        return;
      }

      const segment = highlightedSegment || legendSegment || pieData[0].data.datum;
      const matched = pieData.filter(d => d.data.datum === segment);
      highlightSegment(matched[0].data);
    },
    [pinnedSegment, pieData, highlightSegment, highlightedSegment, legendSegment]
  );

  const onBlur = useCallback(
    (event: React.FocusEvent) => {
      const blurTarget = event.relatedTarget || event.target;
      if (blurTarget === null || !(blurTarget instanceof Element) || !nodeBelongs(containerRef.current, blurTarget)) {
        // We only need to close the tooltip and remove the pinned segment so that we keep track of the current
        // highlighted legendSeries. using clearHighlightedSegment() would set the legendSeries to null, in that case
        // using Keyboard Tab will always highlight the first legend item in the legend component.
        setTooltipOpen(false);
        setPinnedSegment(null);
      }
    },
    [setPinnedSegment]
  );
  const onPopoverDismiss = (outsideClick?: boolean) => {
    setTooltipOpen(false);
    setPinnedSegment(null);

    if (!outsideClick) {
      // The delay is needed to bypass focus events caused by click or keypress needed to unpin the popover.
      setTimeout(() => {
        popoverDismissedRecently.current = true;
        plotRef.current!.focusApplication();
        popoverDismissedRecently.current = false;
      }, 0);
    } else {
      onHighlightChange(null);
    }
  };

  const onPopoverLeave = (event: React.MouseEvent) => {
    if (pinnedSegment !== null || focusedSegmentRef.current!.contains(event.relatedTarget as Node)) {
      return;
    }
    clearHighlightedSegment();
  };

  const chartPlot = (
    <ChartPlot
      ref={plotRef}
      width="100%"
      height={fitHeight ? '100%' : height}
      transform={`translate(${width / 2} ${height / 2})`}
      isPrecise={true}
      isClickable={!isTooltipOpen}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescription={ariaDescription}
      ariaDescribedby={hasInnerContent ? innerMetricId : undefined}
      ariaRoleDescription={i18nStrings?.chartAriaRoleDescription}
      ariaLiveRegion={tooltipContent}
      activeElementRef={focusedSegmentRef}
      activeElementKey={highlightedSegmentIndex?.toString()}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onMouseOut={onMouseOut}
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
      <Segments
        height={height}
        fitHeight={fitHeight}
        pieData={pieData}
        size={dimensions.size}
        variant={variant}
        focusedSegmentRef={focusedSegmentRef}
        popoverTrackRef={popoverTrackRef}
        highlightedSegment={highlightedSegment}
        segmentAriaRoleDescription={i18nStrings?.segmentAriaRoleDescription}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />
      {hasLabels && (
        <Labels
          height={height}
          fitHeight={fitHeight}
          pieData={pieData}
          size={dimensions.size}
          segmentDescription={segmentDescription}
          visibleDataSum={dataSum}
          hideTitles={hideTitles}
          hideDescriptions={hideDescriptions}
          highlightedSegment={highlightedSegment}
          containerRef={containerRef}
        />
      )}
    </ChartPlot>
  );

  return (
    <div
      className={clsx(styles.content, styles[`content--${defaultDimensions.size}`], {
        [styles['content--without-labels']]: !hasLabels,
        [styles['content--reserve-filter']]: reserveFilterSpace,
        [styles['content--reserve-legend']]: reserveLegendSpace,
        [styles['content--fit-height']]: fitHeight,
      })}
    >
      <ChartStatusContainer
        isEmpty={isEmpty}
        isNoMatch={isNoMatch}
        showChart={showChart}
        statusType={statusType}
        empty={empty}
        noMatch={noMatch}
        loadingText={loadingText}
        errorText={errorText}
        recoveryText={recoveryText}
        onRecoveryClick={onRecoveryClick}
      />
      {showChart && (
        <div
          className={clsx(styles['chart-container'], fitHeight && styles['chart-container--fit-height'])}
          ref={containerRef}
        >
          {fitHeight ? (
            <div className={styles['chart-container-chart-plot-fit-height-wrapper']}>{chartPlot}</div>
          ) : (
            chartPlot
          )}

          {hasInnerContent && (
            <div className={styles['inner-content']} id={innerMetricId}>
              {innerMetricValue && (
                <InternalBox
                  variant={dimensions.size === 'small' ? 'h3' : 'h1'}
                  tagOverride="div"
                  color="inherit"
                  padding="n"
                >
                  {innerMetricValue}
                </InternalBox>
              )}
              {innerMetricDescription && dimensions.size !== 'small' && (
                <InternalBox variant="h3" color="text-body-secondary" tagOverride="div" padding="n">
                  {innerMetricDescription}
                </InternalBox>
              )}
            </div>
          )}

          {isTooltipOpen && tooltipData && (
            <ChartPopover
              ref={popoverRef}
              title={
                tooltipData.series && (
                  <InternalBox className={styles['popover-header']} variant="strong">
                    <SeriesMarker color={tooltipData.series.color} type={tooltipData.series.markerType} />{' '}
                    {tooltipData.series.label}
                  </InternalBox>
                )
              }
              trackRef={tooltipData.trackRef}
              trackKey={tooltipData.series.index}
              dismissButton={pinnedSegment !== null}
              dismissAriaLabel={i18nStrings.detailPopoverDismissAriaLabel}
              onDismiss={onPopoverDismiss}
              container={plotRef.current?.svg || null}
              size={detailPopoverSize}
              onMouseLeave={onPopoverLeave}
            >
              {tooltipContent}
              {detailPopoverFooterContent && (
                <InternalBox margin={{ top: 's' }}>{detailPopoverFooterContent}</InternalBox>
              )}
            </ChartPopover>
          )}
        </div>
      )}
    </div>
  );
};
