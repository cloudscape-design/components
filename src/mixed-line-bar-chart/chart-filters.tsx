// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';

import InternalSpaceBetween from '../space-between/internal';
import Filter, { ChartFilterProps } from '../internal/components/chart-filter';

import { ChartDataTypes, MixedLineBarChartProps, InternalChartSeries } from './interfaces';
import { chartLegendMap } from './utils';
import styles from './styles.css.js';

interface InternalChartFiltersProps<T extends ChartDataTypes> {
  series: ReadonlyArray<InternalChartSeries<T>>;
  visibleSeries: ReadonlyArray<MixedLineBarChartProps.ChartSeries<T>>;
  onChange: (selectedSeries: ReadonlyArray<MixedLineBarChartProps.ChartSeries<T>>) => void;
  i18nStrings: MixedLineBarChartProps<T>['i18nStrings'];
  hideFilter?: boolean;
  additionalFilters?: React.ReactNode;
}

function InternalChartFilters<T extends number | string | Date>({
  series,
  visibleSeries,
  onChange,
  i18nStrings,
  hideFilter,
  additionalFilters,
}: InternalChartFiltersProps<T>) {
  const filterItems: ChartFilterProps<MixedLineBarChartProps.ChartSeries<T>>['series'] = useMemo(
    () =>
      series.map(({ series, color }) => ({
        label: series.title,
        type: chartLegendMap[series.type],
        color,
        datum: series,
      })),
    [series]
  );

  return (
    <InternalSpaceBetween
      size="l"
      direction="horizontal"
      className={clsx({
        [styles['has-default-filter']]: !hideFilter,
      })}
    >
      {!hideFilter && (
        <Filter series={filterItems} onChange={onChange} selectedSeries={visibleSeries} i18nStrings={i18nStrings} />
      )}
      {additionalFilters}
    </InternalSpaceBetween>
  );
}

export default InternalChartFilters;
