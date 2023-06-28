// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { fireNonCancelableEvent } from '../internal/events';
import Legend, { ChartLegendProps } from '../internal/components/chart-legend';
import Filter, { ChartFilterProps } from '../internal/components/chart-filter';
import InternalSpaceBetween from '../space-between/internal';
import InternalBox from '../box/internal';

import InternalPieChart, { InternalChartDatum } from './pie-chart';
import { PieChartProps } from './interfaces';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import createCategoryColorScale from '../internal/utils/create-category-color-scale';
import useContainerWidth from '../internal/utils/use-container-width';
import { nodeBelongs } from '../internal/utils/node-belongs';

export { PieChartProps };

const PieChart = function PieChart<T extends PieChartProps.Datum = PieChartProps.Datum>({
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
  const isEmpty = !externalData || externalData.length === 0;
  const containerAttr = {
    ...baseProps,
    className: clsx(baseProps.className, styles.root),
  };
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

  return (
    <div {...containerAttr} ref={mergedRef} onBlur={onBlur}>
      {statusType === 'finished' && !isEmpty && (additionalFilters || !hideFilter) && (
        <InternalBox className={styles['filter-container']} margin={{ bottom: 'l' }}>
          <InternalSpaceBetween
            size="l"
            direction="horizontal"
            className={clsx({
              [styles['has-default-filter']]: !hideFilter,
            })}
          >
            {!hideFilter && (
              <Filter
                series={filterItems}
                onChange={filterChange}
                selectedSeries={visibleSegments}
                i18nStrings={i18nStrings}
              />
            )}
            {additionalFilters}
          </InternalSpaceBetween>
        </InternalBox>
      )}

      <InternalPieChart
        {...props}
        variant={variant}
        size={size}
        data={externalData}
        visibleData={visibleData}
        width={containerWidth}
        statusType={statusType}
        hideTitles={hideTitles}
        hideDescriptions={hideDescriptions}
        hideLegend={hideLegend}
        hideFilter={hideFilter}
        additionalFilters={additionalFilters}
        i18nStrings={i18nStrings}
        onHighlightChange={onHighlightChange}
        highlightedSegment={highlightedSegment}
        legendSegment={legendSegment}
        pinnedSegment={pinnedSegment}
        setPinnedSegment={setPinnedSegment}
        detailPopoverSize={detailPopoverSize}
      />

      {!hideLegend && !isEmpty && statusType === 'finished' && (
        <InternalBox margin={{ top: 'm' }}>
          <Legend<T>
            series={legendItems}
            highlightedSeries={legendSegment}
            legendTitle={legendTitle}
            ariaLabel={i18nStrings?.legendAriaLabel}
            onHighlightChange={onHighlightChange}
            plotContainerRef={containerRef}
          />
        </InternalBox>
      )}
    </div>
  );
};

applyDisplayName(PieChart, 'PieChart');
export default PieChart;
