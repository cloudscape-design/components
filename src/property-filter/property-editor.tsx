// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal';
import { DropdownStatusProps } from '../internal/components/dropdown-status';
import { FormFieldContext } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import EmbeddedMultiselect from '../multiselect/embedded';
import { I18nStringsInternal } from './i18n-utils';
import {
  ComparisonOperator,
  ExtendedOperatorForm,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalToken,
  LoadItemsDetail,
} from './interfaces';
import { useLoadItems } from './use-load-items';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export function PropertyEditorContentCustom<TokenValue = any>({
  property,
  operator,
  filter,
  value,
  onChange,
  operatorForm,
}: {
  property: InternalFilteringProperty;
  operator: ComparisonOperator;
  filter: string;
  value: null | TokenValue;
  onChange: (value: null | TokenValue) => void;
  operatorForm: ExtendedOperatorForm<TokenValue>;
}) {
  const labelId = useUniqueId();
  return (
    <div className={styles['property-editor']}>
      <div className={styles['property-editor-header']} id={labelId}>
        {property.groupValuesLabel}
      </div>

      <div className={styles['property-editor-form']}>
        <FormFieldContext.Provider value={{ ariaLabelledby: labelId }}>
          {operatorForm({ value, onChange, operator, filter })}
        </FormFieldContext.Provider>
      </div>
    </div>
  );
}

export function PropertyEditorContentEnum({
  property,
  filter,
  value: unknownValue,
  onChange,
  asyncProps,
  filteringOptions,
  onLoadItems,
}: {
  property: InternalFilteringProperty;
  filter: string;
  value: null | string[];
  onChange: (value: null | string[]) => void;
  asyncProps: DropdownStatusProps;
  filteringOptions: readonly InternalFilteringOption[];
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
}) {
  const labelId = useUniqueId();

  const valueOptions = property
    ? filteringOptions
        .filter(option => option.property?.propertyKey === property.propertyKey)
        .map(({ label, value }) => ({ label, value }))
    : [];

  const valueHandlers = useLoadItems(onLoadItems, '', property?.externalProperty);
  const asyncValueOptionListProps = property?.propertyKey
    ? { statusType: 'finished' as const, ...valueHandlers, ...asyncProps, noMatch: asyncProps.empty }
    : { statusType: 'finished' as const, empty: asyncProps.empty, noMatch: asyncProps.empty };

  const value = !unknownValue ? [] : Array.isArray(unknownValue) ? unknownValue : [unknownValue];
  const selectedOptions = valueOptions.filter(option => value.includes(option.value));

  return (
    <div className={clsx(styles['property-editor'], styles['property-editor-enum'])}>
      <div className={styles['property-editor-header']} id={labelId}>
        {property.groupValuesLabel}
      </div>

      <FormFieldContext.Provider value={{ ariaLabelledby: labelId }}>
        <EmbeddedMultiselect
          filteringType="auto"
          selectedOptions={selectedOptions}
          onChange={e => onChange(e.detail.selectedOptions.map(o => o.value!))}
          options={valueOptions}
          filteringText={filter}
          {...asyncValueOptionListProps}
        />
      </FormFieldContext.Provider>
    </div>
  );
}

export function PropertyEditorFooter<TokenValue = any>({
  property,
  operator,
  value,
  onCancel,
  onSubmit,
  i18nStrings,
}: {
  property: InternalFilteringProperty;
  operator: ComparisonOperator;
  value: null | TokenValue;
  onCancel: () => void;
  onSubmit: (value: InternalToken) => void;
  i18nStrings: I18nStringsInternal;
}) {
  const submitToken = () => onSubmit({ property, operator, value });
  return (
    <div className={styles['property-editor-actions']}>
      <InternalButton
        variant="link"
        className={clsx(styles['property-editor-cancel'], testUtilStyles['property-editor-cancel'])}
        onClick={onCancel}
      >
        {i18nStrings.cancelActionText}
      </InternalButton>
      <InternalButton className={testUtilStyles['property-editor-submit']} onClick={submitToken}>
        {i18nStrings.applyActionText}
      </InternalButton>
    </div>
  );
}
