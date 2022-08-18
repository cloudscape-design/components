// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { pie } from 'd3-shape';

import { KeyCode } from '../internal/keycode';
import { nodeContains } from '../internal/utils/dom';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import ChartPopover from '../internal/components/chart-popover';
import SeriesDetails from '../internal/components/chart-series-details';
import SeriesMarker from '../internal/components/chart-series-marker';
import ChartStatusContainer, { getChartStatus } from '../internal/components/chart-status-container';
import InternalBox from '../box/internal';

import Labels from './labels';
import { PieChartProps, SeriesInfo } from './interfaces';
import styles from './styles.css.js';
import { defaultDetails, dimensionsBySize, refreshDimensionsBySize } from './utils';
import Segments from './segments';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import ChartPlot, { ChartPlotRef } from '../internal/components/chart-plot';
import { SomeRequired } from '../internal/types';

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
  const isRefresh = useVisualRefresh();

  const dimensions = isRefresh ? refreshDimensionsBySize[size] : dimensionsBySize[size];
  const radius = dimensions.outerRadius;

  const hasLabels = !(hideTitles && hideDescriptions);
  const height = 2 * (radius + dimensions.padding + (hasLabels ? dimensions.paddingLabels : 0));

  // Inner content is only available for donut charts and the inner description is not displayed for small charts
  const hasInnerContent = variant === 'donut' && (innerMetricValue || (innerMetricDescription && size !== 'small'));

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

  const detailFunction = detailPopoverContent || defaultDetails(i18nStrings);
  const details = tooltipData ? detailFunction(tooltipData.datum, dataSum) : [];
  const tooltipContent = tooltipData && <SeriesDetails details={details} />;

  const { isEmpty, showChart } = getChartStatus({ externalData: data, visibleData: pieData, statusType });

  // Pie charts have a special condition for empty/noMatch due to how zero-value segments are handled.
  const isNoMatch = isEmpty && visibleData.length !== data.length;

  const reserveLegendSpace = !showChart && !hideLegend;
  const reserveFilterSpace = statusType !== 'finished' && !isNoMatch && (!hideFilter || additionalFilters);

  const popoverDismissedRecently = useRef(false);

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

  const onClick = useCallback(
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
      if (pinnedSegment !== null) {
        return;
      }
      highlightSegment(internalDatum);
    },
    [pinnedSegment, highlightSegment]
  );
  const onMouseOut = useCallback(() => {
    if (pinnedSegment !== null) {
      return;
    }

    clearHighlightedSegment();
  }, [pinnedSegment, clearHighlightedSegment]);
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode !== KeyCode.right && event.keyCode !== KeyCode.left && event.keyCode !== KeyCode.enter) {
        return;
      }

      event.preventDefault();

      let nextIndex = highlightedSegmentIndex || 0;
      const MAX = pieData.length - 1;
      if (event.keyCode === KeyCode.right) {
        nextIndex++;
        if (nextIndex > MAX) {
          nextIndex = 0;
        }
      } else if (event.keyCode === KeyCode.left) {
        nextIndex--;
        if (nextIndex < 0) {
          nextIndex = MAX;
        }
      }
      if (event.keyCode === KeyCode.enter) {
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
      if (blurTarget === null || !(blurTarget instanceof Element) || !nodeContains(containerRef.current, blurTarget)) {
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
    }
  };

  return (
    <div
      className={clsx(styles.content, styles[`content--${size}`], {
        [styles['content--without-labels']]: !hasLabels,
        [styles['content--reserve-filter']]: reserveFilterSpace,
        [styles['content--reserve-legend']]: reserveLegendSpace,
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
        <div className={styles['chart-container']} ref={containerRef}>
          <ChartPlot
            ref={plotRef}
            width={width}
            height={height}
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
          >
            <Segments
              pieData={pieData}
              size={size}
              variant={variant}
              focusedSegmentRef={focusedSegmentRef}
              popoverTrackRef={popoverTrackRef}
              highlightedSegment={highlightedSegment}
              segmentAriaRoleDescription={i18nStrings?.segmentAriaRoleDescription}
              onClick={onClick}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
            />
            {hasLabels && (
              <Labels
                pieData={pieData}
                size={size}
                segmentDescription={segmentDescription}
                visibleDataSum={dataSum}
                hideTitles={hideTitles}
                hideDescriptions={hideDescriptions}
                highlightedSegment={highlightedSegment}
                containerRef={containerRef}
              />
            )}
          </ChartPlot>
          {hasInnerContent && (
            <div className={styles['inner-content']} id={innerMetricId}>
              {innerMetricValue && (
                <InternalBox variant={size === 'small' ? 'h3' : 'h1'} tagOverride="div" color="inherit" padding="n">
                  {innerMetricValue}
                </InternalBox>
              )}
              {innerMetricDescription && size !== 'small' && (
                <InternalBox variant="h3" color="text-body-secondary" tagOverride="div" padding="n">
                  {innerMetricDescription}
                </InternalBox>
              )}
            </div>
          )}
          {isTooltipOpen && tooltipData && (
            <ChartPopover
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
            >
              {tooltipContent}
            </ChartPopover>
          )}
        </div>
      )}
    </div>
  );
};
