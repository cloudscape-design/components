// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { isDevelopment } from '../internal/is-development';
import { getBaseProps } from '../internal/base-component';
import ChartStatusContainer, { getChartStatus } from '../internal/components/chart-status-container';

import AreaChartFilter from './elements/area-chart-filter';
import AreaChartLegend from './elements/area-chart-legend';
import { AreaChartProps } from './interfaces';
import ChartContainer from './chart-container';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import useChartModel from './model/use-chart-model';
import useFilterProps from './model/use-filter-props';
import useHighlightProps from './model/use-highlight-props';
import { isSeriesValid } from './model/utils';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';
import { nodeBelongs } from '../internal/utils/node-belongs';
import { ChartWrapper } from '../internal/components/chart-wrapper';
import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

type InternalAreaChartProps<T extends AreaChartProps.DataTypes> = SomeRequired<
  AreaChartProps<T>,
  'height' | 'xScaleType' | 'yScaleType' | 'statusType' | 'detailPopoverSize' | 'i18nStrings'
> &
  InternalBaseComponentProps;

export default function InternalAreaChart<T extends AreaChartProps.DataTypes>({
  fitHeight,
  height,
  xScaleType,
  yScaleType,
  xDomain,
  yDomain,
  xTickFormatter,
  yTickFormatter,
  detailTotalFormatter,
  highlightedSeries: controlledHighlightedSeries,
  visibleSeries: controlledVisibleSeries,
  series: externalSeries,
  onFilterChange: controlledOnVisibleChange,
  onHighlightChange: controlledOnHighlightChange,
  i18nStrings,
  ariaLabel,
  ariaLabelledby,
  ariaDescription,
  xTitle,
  yTitle,
  hideFilter,
  additionalFilters,
  hideLegend,
  legendTitle,
  statusType,
  detailPopoverSize,
  detailPopoverFooter,
  empty,
  noMatch,
  errorText,
  loadingText,
  recoveryText,
  onRecoveryClick,
  __internalRootRef = null,
  ...props
}: InternalAreaChartProps<T>) {
  const baseProps = getBaseProps(props);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  if (isDevelopment) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!isSeriesValid(externalSeries)) {
        warnOnce(
          'AreaChart',
          "The `series` property violates the component's constraints: all `area` " +
            'series must have `data` arrays of the same length and with the same x-values.'
        );
      }
    }, [externalSeries]);
  }

  const [width, setWidth] = useState(0);
  const [visibleSeries, setVisibleSeries] = useFilterProps(
    externalSeries,
    controlledVisibleSeries,
    controlledOnVisibleChange
  );
  const [highlightedSeries, setHighlightedSeries] = useHighlightProps(
    externalSeries,
    controlledHighlightedSeries,
    controlledOnHighlightChange
  );
  const isRtl = containerRef.current ? getIsRtl(containerRef.current) : false;
  const model = useChartModel({
    isRtl,
    fitHeight,
    externalSeries,
    visibleSeries,
    setVisibleSeries,
    highlightedSeries,
    setHighlightedSeries,
    xDomain,
    yDomain,
    xScaleType,
    yScaleType,
    height,
    width,
    popoverRef,
  });

  const { isEmpty, isNoMatch, showChart } = getChartStatus({
    externalData: externalSeries,
    visibleData: visibleSeries,
    statusType,
  });
  const showFilters = statusType === 'finished' && (!isEmpty || isNoMatch) && (additionalFilters || !hideFilter);
  const showLegend = !hideLegend && !isEmpty && statusType === 'finished';
  const reserveLegendSpace = !showChart && !hideLegend;
  const reserveFilterSpace = !showChart && !isNoMatch && (!hideFilter || additionalFilters);

  useEffect(() => {
    const onKeyDown = model.handlers.onDocumentKeyDown;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [model.handlers.onDocumentKeyDown]);

  const onBlur = (event: React.FocusEvent) => {
    if (event.relatedTarget && !nodeBelongs(containerRef.current, event.relatedTarget)) {
      model.handlers.onContainerBlur();
    }
  };

  const mergedRef = useMergeRefs(containerRef, __internalRootRef);

  return (
    <ChartWrapper
      ref={mergedRef}
      {...baseProps}
      className={clsx(baseProps.className, styles.root)}
      fitHeight={!!fitHeight}
      contentMinHeight={height}
      defaultFilter={
        showFilters && !hideFilter ? (
          <AreaChartFilter
            model={model}
            filterLabel={i18nStrings.filterLabel}
            filterPlaceholder={i18nStrings.filterPlaceholder}
            filterSelectedAriaLabel={i18nStrings.filterSelectedAriaLabel}
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
            model={model}
            autoWidth={setWidth}
            detailPopoverSize={detailPopoverSize}
            detailPopoverFooter={detailPopoverFooter}
            xTitle={xTitle}
            yTitle={yTitle}
            xTickFormatter={xTickFormatter}
            yTickFormatter={yTickFormatter}
            detailTotalFormatter={detailTotalFormatter}
            ariaLabel={ariaLabel}
            ariaLabelledby={ariaLabelledby}
            ariaDescription={ariaDescription}
            i18nStrings={i18nStrings}
            fitHeight={fitHeight}
            minHeight={height}
          />
        ) : null
      }
      legend={
        showLegend ? (
          <AreaChartLegend
            plotContainerRef={containerRef}
            model={model}
            legendTitle={legendTitle}
            ariaLabel={i18nStrings.legendAriaLabel}
          />
        ) : null
      }
      onBlur={onBlur}
    />
  );
}
