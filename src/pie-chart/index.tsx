// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { fireNonCancelableEvent } from '../internal/events';
import Legend, { ChartLegendProps } from '../internal/components/chart-legend';
import Filter, { ChartFilterProps } from '../internal/components/chart-filter';
import { pie } from 'd3-shape';

import InternalPieChart, { InternalChartDatum } from './pie-chart';
import { PieChartProps } from './interfaces';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import createCategoryColorScale from '../internal/utils/create-category-color-scale';
import useContainerWidth from '../internal/utils/use-container-width';
import { nodeBelongs } from '../internal/utils/node-belongs';
import { ChartWrapper } from '../internal/components/chart-wrapper';
import ChartStatusContainer, { getChartStatus } from '../internal/components/chart-status-container';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { getDimensionsBySize } from './utils';

export { PieChartProps };

const PieChart = function PieChart<T extends PieChartProps.Datum = PieChartProps.Datum>({
  fitHeight,
  variant = 'pie',
  size = 'medium',
  hideTitles = false,
  hideDescriptions = false,
  hideLegend = false,
  hideFilter = false,
  statusType = 'finished',
  data: externalData = [],
  i18nStrings = {},
  highlightedSegment: controlledHighlightedSegment,
  visibleSegments: controlledVisibleSegments,
  onHighlightChange: controlledOnHighlightChange,
  onFilterChange,
  additionalFilters,
  legendTitle,
  detailPopoverSize = 'medium',
  ...props
}: PieChartProps<T>) {
  const { __internalRootRef = null } = useBaseComponent('PieChart');
  const baseProps = getBaseProps(props);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, measureRef] = useContainerWidth();

  const data: ReadonlyArray<InternalChartDatum<T>> = useMemo(() => {
    const colors = createCategoryColorScale(externalData, undefined, it => it.color || null);

    return externalData.map((datum, i) => ({
      index: i,
      color: colors[i],
      datum,
    }));
  }, [externalData]);

  const [highlightedSegment = null, setHighlightedSegment] = useControllable(
    controlledHighlightedSegment,
    controlledOnHighlightChange,
    null,
    {
      componentName: 'PieChart',
      controlledProp: 'highlightedSegment',
      changeHandler: 'onHighlightChange',
    }
  );
  const [legendSegment, setLegendSegment] = useState<null | T>(highlightedSegment);
  useEffect(() => {
    setLegendSegment(controlledHighlightedSegment || null);
  }, [controlledHighlightedSegment]);

  const [visibleSegments, setVisibleSegments] = useControllable(
    controlledVisibleSegments,
    onFilterChange,
    externalData,
    {
      componentName: 'PieChart',
      controlledProp: 'visibleSegments',
      changeHandler: 'onFilterChange',
    }
  );

  const [pinnedSegment, setPinnedSegment] = useState<T | null>(null);

  const visibleData = useMemo(
    () => data.filter(d => visibleSegments?.indexOf(d.datum) !== -1),
    [data, visibleSegments]
  );

  const filterItems: ChartFilterProps<T>['series'] = data?.map(data => ({
    label: data.datum.title,
    color: data.color,
    type: 'rectangle',
    datum: data.datum,
  }));

  const legendItems: ChartLegendProps<T>['series'] = filterItems.filter(d => visibleSegments?.indexOf(d.datum) !== -1);

  const filterChange = useCallback(
    (selectedSeries: ReadonlyArray<T>) => {
      setVisibleSegments(selectedSeries);
      fireNonCancelableEvent(onFilterChange, {
        visibleSegments: selectedSeries,
      });
    },
    [setVisibleSegments, onFilterChange]
  );

  const onHighlightChange = useCallback(
    (segment: T | null) => {
      setLegendSegment(segment);
      setHighlightedSegment(segment);
      fireNonCancelableEvent(controlledOnHighlightChange, { highlightedSegment: segment });
    },
    [controlledOnHighlightChange, setHighlightedSegment]
  );

  const onBlur = (event: React.FocusEvent) => {
    if (event.relatedTarget && !nodeBelongs(containerRef.current, event.relatedTarget)) {
      highlightedSegment && onHighlightChange(null);
      setLegendSegment(null);
    }
  };

  const mergedRef = useMergeRefs(containerRef, measureRef, __internalRootRef);

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

  const hasNoData = !externalData || externalData.length === 0;
  const { isEmpty, showChart } = getChartStatus({ externalData: data, visibleData: pieData, statusType });
  // Pie charts have a special condition for empty/noMatch due to how zero-value segments are handled.
  const isNoMatch = isEmpty && visibleData.length !== data.length;
  const showFilters = statusType === 'finished' && !hasNoData && (additionalFilters || !hideFilter);
  const reserveLegendSpace = !showChart && !hideLegend;
  const reserveFilterSpace = statusType !== 'finished' && !isNoMatch && (!hideFilter || additionalFilters);
  const hasLabels = !(hideTitles && hideDescriptions);

  const isRefresh = useVisualRefresh();
  const defaultDimensions = getDimensionsBySize({ size, hasLabels, visualRefresh: isRefresh });
  const radius = defaultDimensions.outerRadius;
  const height = 2 * (radius + defaultDimensions.padding + (hasLabels ? defaultDimensions.paddingLabels : 0));

  return (
    <ChartWrapper
      ref={mergedRef}
      fitHeight={!!fitHeight}
      {...baseProps}
      className={clsx(baseProps.className, styles.root)}
      contentClassName={clsx(styles.content, styles[`content--${defaultDimensions.size}`], {
        [styles['content--without-labels']]: !hasLabels,
        [styles['content--fit-height']]: fitHeight,
      })}
      defaultFilter={
        showFilters && !hideFilter ? (
          <Filter
            series={filterItems}
            onChange={filterChange}
            selectedSeries={visibleSegments}
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
          empty={props.empty}
          noMatch={props.noMatch}
          loadingText={props.loadingText}
          errorText={props.errorText}
          recoveryText={props.recoveryText}
          onRecoveryClick={props.onRecoveryClick}
        />
      }
      chart={
        showChart ? (
          <InternalPieChart
            {...props}
            variant={variant}
            size={size}
            height={height}
            fitHeight={fitHeight}
            data={externalData}
            width={containerWidth}
            hideTitles={hideTitles}
            hideDescriptions={hideDescriptions}
            i18nStrings={i18nStrings}
            onHighlightChange={onHighlightChange}
            highlightedSegment={highlightedSegment}
            legendSegment={legendSegment}
            pinnedSegment={pinnedSegment}
            setPinnedSegment={setPinnedSegment}
            detailPopoverSize={detailPopoverSize}
            pieData={pieData}
            dataSum={dataSum}
          />
        ) : null
      }
      legend={
        !hideLegend &&
        !hasNoData &&
        statusType === 'finished' && (
          <Legend<T>
            series={legendItems}
            highlightedSeries={legendSegment}
            legendTitle={legendTitle}
            ariaLabel={i18nStrings?.legendAriaLabel}
            onHighlightChange={onHighlightChange}
            plotContainerRef={containerRef}
          />
        )
      }
      onBlur={onBlur}
    />
  );
};

applyDisplayName(PieChart, 'PieChart');
export default PieChart;
