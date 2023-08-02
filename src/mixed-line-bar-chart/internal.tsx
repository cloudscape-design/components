// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import ChartStatusContainer, { getChartStatus } from '../internal/components/chart-status-container';
import { useControllable } from '../internal/hooks/use-controllable';
import { usePrevious } from '../internal/hooks/use-previous';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ChartDataTypes, MixedLineBarChartProps } from './interfaces';
import InternalChartLegend from './chart-legend';
import ChartContainer from './chart-container';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { isDevelopment } from '../internal/is-development';
import createCategoryColorScale from '../internal/utils/create-category-color-scale';
import { ScaledPoint } from './make-scaled-series';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';
import { chartLegendMap, isXThreshold, isYThreshold } from './utils';
import { nodeBelongs } from '../internal/utils/node-belongs';
import Filter from '../internal/components/chart-filter';
import { ChartWrapper } from '../internal/components/chart-wrapper';

type InternalMixedLineBarChartProps<T extends ChartDataTypes> = SomeRequired<
  MixedLineBarChartProps<T>,
  | 'series'
  | 'height'
  | 'xScaleType'
  | 'yScaleType'
  | 'stackedBars'
  | 'horizontalBars'
  | 'statusType'
  | 'detailPopoverSize'
  | 'emphasizeBaselineAxis'
> &
  InternalBaseComponentProps;

export default function InternalMixedLineBarChart<T extends number | string | Date>({
  fitHeight,
  height,
  xScaleType,
  yScaleType,
  xDomain,
  yDomain,
  xTickFormatter,
  yTickFormatter,
  highlightedSeries: controlledHighlightedSeries,
  visibleSeries: controlledVisibleSeries,
  series: externalSeries,
  onFilterChange,
  onHighlightChange: controlledOnHighlightChange,
  i18nStrings,
  ariaLabel,
  ariaLabelledby,
  ariaDescription,
  xTitle,
  yTitle,
  stackedBars,
  horizontalBars,
  hideFilter,
  additionalFilters,
  hideLegend,
  legendTitle,
  statusType,
  detailPopoverSize,
  detailPopoverFooter,
  emphasizeBaselineAxis,
  empty,
  noMatch,
  errorText,
  loadingText,
  recoveryText,
  onRecoveryClick,
  __internalRootRef = null,
  ...props
}: InternalMixedLineBarChartProps<T>) {
  const baseProps = getBaseProps(props);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gotBarSeries = externalSeries.some(s => s.type === 'bar');
    const gotLineSeries = externalSeries.some(s => s.type === 'line');

    if (xScaleType !== 'categorical' && gotBarSeries) {
      warnOnce(
        'MixedLineBarChart',
        `Bar series cannot be used with a ${xScaleType} scale. Use a categorical x axis instead.`
      );
    }

    if (horizontalBars && gotLineSeries) {
      warnOnce(
        'MixedLineBarChart',
        `Property horizontalBars can only be used with charts that contain only bar or threshold series.`
      );
    }

    for (const s of externalSeries) {
      if (s.type === 'threshold' && s.x !== undefined && s.y !== undefined) {
        warnOnce('MixedLineBarChart', `Series of type "threshold" must contain either x or y property.`);
      }
      if (s.type === 'threshold' && s.x === undefined && s.y === undefined) {
        warnOnce('MixedLineBarChart', `Series of type "threshold" must contain either x or y property.`);
      }
    }
  }, [xScaleType, horizontalBars, externalSeries]);

  const series = useMemo(() => {
    // Generate series colors if not explicitly provided.
    // The thresholds use a dedicated colour scale.
    const colors = createCategoryColorScale(
      externalSeries,
      it => isYThreshold(it) || isXThreshold(it),
      it => it.color || null
    );

    return externalSeries.map((s, i) => ({ index: i, color: colors[i], series: s }));
  }, [externalSeries]);

  const [highlightedPoint, setHighlightedPoint] = useState<ScaledPoint<T> | null>(null);
  const [highlightedGroupIndex, setHighlightedGroupIndex] = useState<number | null>(null);
  const [highlightedSeries = null, setHighlightedSeries] = useControllable(
    controlledHighlightedSeries,
    controlledOnHighlightChange,
    null,
    {
      componentName: 'MixedLineBarChart',
      controlledProp: 'highlightedSeries',
      changeHandler: 'onHighlightChange',
    }
  );
  const [legendSeries, setLegendSeries] = useState<MixedLineBarChartProps.ChartSeries<T> | null>(highlightedSeries);
  useEffect(() => {
    setLegendSeries(controlledHighlightedSeries || null);
  }, [controlledHighlightedSeries]);

  const [externalVisibleSeries, setExternalVisibleSeries] = useControllable(
    controlledVisibleSeries,
    onFilterChange,
    externalSeries,
    {
      componentName: 'MixedLineBarChart',
      controlledProp: 'visibleSeries',
      changeHandler: 'onFilterChange',
    }
  );

  if (isDevelopment) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const previousSeries = usePrevious(externalSeries);

    const hasPrevious = !!(previousSeries && previousSeries.length);
    const hasCurrent = !!externalSeries.length;

    if (hasPrevious && hasCurrent && externalSeries !== previousSeries && !controlledVisibleSeries && !hideFilter) {
      warnOnce(
        'MixedLineBarChart',
        'The `series` value passed into the component changed. ' +
          'This may cause problems with filtering - we recommend that you make the `series` value constant, ' +
          'or provide a `visibleSeries` value that derives from the current `series` value.'
      );
    }
  }

  const visibleSeries = useMemo(
    () => series.filter(s => externalVisibleSeries?.indexOf(s.series) !== -1),
    [series, externalVisibleSeries]
  );

  const filterChange = (selectedSeries: ReadonlyArray<MixedLineBarChartProps.ChartSeries<T>>) => {
    setExternalVisibleSeries(selectedSeries);
    fireNonCancelableEvent(onFilterChange, {
      visibleSeries: selectedSeries,
    });
  };

  const onHighlightChange = (series: MixedLineBarChartProps.ChartSeries<T> | null) => {
    setHighlightedSeries(series);
    fireNonCancelableEvent(controlledOnHighlightChange, {
      highlightedSeries: series,
    });
    setLegendSeries(series);
  };

  const onBlur = (event: React.FocusEvent) => {
    if (event.relatedTarget && !nodeBelongs(containerRef.current, event.relatedTarget)) {
      highlightedSeries && onHighlightChange(highlightedSeries);
      setHighlightedPoint(null);
      setHighlightedGroupIndex(null);
      setLegendSeries(null);
    }
  };

  const { isEmpty, isNoMatch, showChart } = getChartStatus({
    externalData: externalSeries,
    visibleData: visibleSeries || [],
    statusType,
  });
  const showFilters = statusType === 'finished' && (!isEmpty || isNoMatch) && (additionalFilters || !hideFilter);
  const showLegend = !hideLegend && !isEmpty && statusType === 'finished';
  const reserveLegendSpace = !showChart && !hideLegend;
  const reserveFilterSpace = !showChart && !isNoMatch && (!hideFilter || additionalFilters);
  const mergedRef = useMergeRefs(containerRef, __internalRootRef);

  const filterItems = series.map(({ series, color }) => ({
    label: series.title,
    type: chartLegendMap[series.type],
    color,
    datum: series,
  }));

  return (
    <ChartWrapper
      ref={mergedRef}
      {...baseProps}
      className={clsx(baseProps.className, styles.root)}
      fitHeight={!!fitHeight}
      contentMinHeight={height}
      defaultFilter={
        showFilters && !hideFilter ? (
          <Filter
            series={filterItems}
            onChange={filterChange}
            selectedSeries={externalVisibleSeries || []}
            i18nStrings={i18nStrings}
          />
        ) : null
      }
      additionalFilters={showFilters ? additionalFilters : null}
      reserveFilterSpace={!!reserveFilterSpace}
      reserveLegendSpace={!!reserveLegendSpace}
      chartStatus={
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
      }
      chart={
        showChart ? (
          <ChartContainer
            fitHeight={fitHeight}
            height={height}
            xScaleType={xScaleType}
            yScaleType={yScaleType}
            xDomain={xDomain}
            yDomain={yDomain}
            xTickFormatter={xTickFormatter ?? i18nStrings?.xTickFormatter}
            yTickFormatter={yTickFormatter ?? i18nStrings?.yTickFormatter}
            emphasizeBaselineAxis={emphasizeBaselineAxis}
            stackedBars={stackedBars}
            horizontalBars={horizontalBars}
            series={series}
            visibleSeries={visibleSeries}
            highlightedSeries={highlightedSeries}
            onHighlightChange={onHighlightChange}
            highlightedPoint={highlightedPoint}
            setHighlightedPoint={setHighlightedPoint}
            highlightedGroupIndex={highlightedGroupIndex}
            setHighlightedGroupIndex={setHighlightedGroupIndex}
            detailPopoverSize={detailPopoverSize}
            detailPopoverFooter={detailPopoverFooter}
            xTitle={xTitle}
            yTitle={yTitle}
            ariaLabel={ariaLabel}
            ariaLabelledby={ariaLabelledby}
            ariaDescription={ariaDescription}
            i18nStrings={i18nStrings}
            plotContainerRef={containerRef}
          />
        ) : null
      }
      legend={
        showLegend ? (
          <InternalChartLegend
            series={series}
            visibleSeries={externalVisibleSeries || []}
            highlightedSeries={legendSeries}
            onHighlightChange={onHighlightChange}
            legendTitle={legendTitle}
            ariaLabel={i18nStrings?.legendAriaLabel}
            plotContainerRef={containerRef}
          />
        ) : null
      }
      onBlur={onBlur}
    />
  );
}
