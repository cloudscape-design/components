// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { memo, useCallback } from 'react';

import InternalButton from '../../../button/internal';
import { useInternalI18n } from '../../../i18n/context';
import { MultiselectProps } from '../../../multiselect/interfaces';
import InternalMultiselect from '../../../multiselect/internal';
import { BaseComponentProps } from '../../base-component';
import { NonCancelableEventHandler } from '../../events';
import SeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';

import styles from './styles.css.js';

interface I18nStrings {
  filterLabel?: string;
  filterPlaceholder?: string;
  filterSelectedAriaLabel?: string;
}

interface ChartFilterItem<T> {
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

function ChartFilter<T>({ series, i18nStrings, selectedSeries, onChange }: ChartFilterProps<T>) {
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
    <InternalMultiselect
      ariaLabel={i18n('i18nStrings.filterLabel', i18nStrings?.filterLabel)}
      placeholder={i18n('i18nStrings.filterPlaceholder', i18nStrings?.filterPlaceholder)}
      options={defaultOptions}
      selectedOptions={selectedOptions}
      onChange={updateSelection}
      className={styles['chart-filter']}
      selectedAriaLabel={i18nStrings?.filterSelectedAriaLabel}
      filteringType="auto"
      statusType="finished"
      keepOpen={true}
      hideTokens={true}
      enableSelectAll={true}
      i18nStrings={{ selectAllText: 'Select all' }}
      customTriggerBuilder={props => (
        <InternalButton
          variant="icon"
          iconName="filter"
          ref={props.triggerRef}
          ariaLabel={props.ariaLabel}
          ariaExpanded={props.ariaExpanded}
          disabled={props.disabled}
          onClick={props.onClick}
        />
      )}
    />
  );
}
