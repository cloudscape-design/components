// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, memo } from 'react';

import { NonCancelableEventHandler } from '../../events';
import InternalFormField from '../../../form-field/internal';
import InternalMultiselect from '../../../multiselect/internal';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import { MultiselectProps } from '../../../multiselect/interfaces';
import SeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import { useInternalI18n } from '../../i18n/context';

import styles from './styles.css.js';

interface I18nStrings {
  filterLabel?: string;
  filterPlaceholder?: string;
  filterSelectedAriaLabel?: string;
}

export interface ChartFilterItem<T> {
  label: string;
  color: string;
  type: ChartSeriesMarkerType;
  datum: T;
}

export interface ChartFilterProps<T> extends BaseComponentProps {
  series: ReadonlyArray<ChartFilterItem<T>>;
  selectedSeries?: ReadonlyArray<T>;
  onChange: (selectedSeries: ReadonlyArray<T>) => void;
  i18nStrings?: I18nStrings;
}

export default memo(ChartFilter) as typeof ChartFilter;

function ChartFilter<T>({ series, i18nStrings, selectedSeries, onChange, ...restProps }: ChartFilterProps<T>) {
  const baseProps = getBaseProps(restProps);
  const className = clsx(baseProps.className, styles.root);
  const i18n = useInternalI18n('[charts]');

  const defaultOptions = series.map((d, i) => ({
    label: d.label,
    value: '' + i,
    datum: d.datum,
    __customIcon: (
      <span className={styles['custom-icon-wrapper']}>
        <SeriesMarker color={d.color} type={d.type} />
      </span>
    ),
  }));

  const selectedOptions = defaultOptions.filter(option => selectedSeries?.indexOf(option.datum) !== -1);

  const updateSelection = useCallback<NonCancelableEventHandler<MultiselectProps.MultiselectChangeDetail>>(
    ({ detail: { selectedOptions } }) => {
      const selectedSeries = defaultOptions
        .filter(option => selectedOptions.indexOf(option) !== -1)
        .map(option => option.datum);
      onChange(selectedSeries);
    },
    [onChange, defaultOptions]
  );

  return (
    <InternalFormField
      {...baseProps}
      label={i18n('i18nStrings.filterLabel', i18nStrings?.filterLabel)}
      className={className}
    >
      <InternalMultiselect
        placeholder={i18n('i18nStrings.filterPlaceholder', i18nStrings?.filterPlaceholder)}
        options={defaultOptions}
        selectedOptions={selectedOptions}
        onChange={updateSelection}
        className={styles['chart-filter']}
        selectedAriaLabel={i18nStrings?.filterSelectedAriaLabel}
        hideTokens={true}
      />
    </InternalFormField>
  );
}
