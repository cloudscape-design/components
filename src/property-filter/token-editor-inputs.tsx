// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import InternalAutosuggest from '../autosuggest/internal.js';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces.js';
import { NonCancelableEventHandler } from '../internal/events/index.js';
import InternalMultiselect from '../multiselect/internal.js';
import { SelectProps } from '../select/interfaces.js';
import InternalSelect from '../select/internal.js';
import { getAllowedOperators, getPropertySuggestions } from './controller.js';
import { I18nStringsInternal, operatorToDescription } from './i18n-utils.js';
import {
  ComparisonOperator,
  GroupText,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  LoadItemsDetail,
} from './interfaces.js';
import { useLoadItems } from './use-load-items.js';

import styles from './styles.css.js';

interface PropertyInputProps {
  asyncProps: null | DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  freeTextFiltering: InternalFreeTextFiltering;
  filteringProperties: readonly InternalFilteringProperty[];
  i18nStrings: I18nStringsInternal;
  onChangePropertyKey: (propertyKey: undefined | string) => void;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  property: null | InternalFilteringProperty;
}

export function PropertyInput({
  property,
  onChangePropertyKey,
  asyncProps,
  filteringProperties,
  onLoadItems,
  customGroupsText,
  i18nStrings,
  freeTextFiltering,
}: PropertyInputProps) {
  const propertySelectHandlers = useLoadItems(onLoadItems);
  const asyncPropertySelectProps = asyncProps ? { ...asyncProps, ...propertySelectHandlers } : {};
  const propertyOptions: (SelectProps.Option | SelectProps.OptionGroup)[] = getPropertySuggestions(
    filteringProperties,
    customGroupsText,
    i18nStrings,
    ({ propertyKey, propertyLabel }) => ({
      value: propertyKey,
      label: propertyLabel,
      dontCloseOnSelect: true,
    })
  );

  const allPropertiesOption = {
    label: i18nStrings.allPropertiesLabel,
    value: undefined,
  };
  if (!freeTextFiltering.disabled) {
    propertyOptions.unshift(allPropertiesOption);
  }
  return (
    <InternalSelect
      options={propertyOptions}
      selectedOption={
        property
          ? {
              value: property.propertyKey ?? undefined,
              label: property.propertyLabel,
            }
          : allPropertiesOption
      }
      onChange={e => onChangePropertyKey(e.detail.selectedOption.value)}
      {...asyncPropertySelectProps}
    />
  );
}

interface OperatorInputProps {
  i18nStrings: I18nStringsInternal;
  onChangeOperator: (operator: ComparisonOperator) => void;
  operator: undefined | ComparisonOperator;
  property: null | InternalFilteringProperty;
  freeTextFiltering: InternalFreeTextFiltering;
  triggerVariant: 'option' | 'label';
}

export function OperatorInput({
  property,
  operator,
  onChangeOperator,
  i18nStrings,
  freeTextFiltering,
  triggerVariant,
}: OperatorInputProps) {
  const operatorOptions = (property ? getAllowedOperators(property) : freeTextFiltering.operators).map(operator => ({
    value: operator,
    label: operator,
    description: operatorToDescription(operator, i18nStrings),
  }));
  return (
    <InternalSelect
      options={operatorOptions}
      triggerVariant={triggerVariant}
      selectedOption={
        operator
          ? {
              value: operator,
              label: operator,
              description: operatorToDescription(operator, i18nStrings),
            }
          : null
      }
      onChange={e => onChangeOperator(e.detail.selectedOption.value as ComparisonOperator)}
    />
  );
}

interface ValueInputProps {
  asyncProps: DropdownStatusProps;
  filteringOptions: readonly InternalFilteringOption[];
  i18nStrings: I18nStringsInternal;
  onChangeValue: (value: unknown) => void;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  operator: undefined | ComparisonOperator;
  property: null | InternalFilteringProperty;
  value: unknown;
}

export function ValueInput(props: ValueInputProps) {
  const { property, operator, value, onChangeValue } = props;
  const OperatorForm = property?.propertyKey && operator && property?.getValueFormRenderer(operator);

  if (OperatorForm) {
    return <OperatorForm value={value} onChange={onChangeValue} operator={operator} />;
  }
  if (property && operator && property.getTokenType(operator) === 'enum') {
    return <ValueInputEnum {...props} property={property} operator={operator} />;
  }
  return <ValueInputAuto {...props} />;
}

function ValueInputAuto({
  property,
  operator,
  value,
  onChangeValue,
  asyncProps,
  filteringOptions,
  onLoadItems,
  i18nStrings,
}: ValueInputProps) {
  const valueOptions = property
    ? filteringOptions
        .filter(option => option.property?.propertyKey === property.propertyKey)
        .map(({ label, value }) => ({ label, value }))
    : [];

  const valueFilter = typeof value === 'string' ? value : '';
  const valueAutosuggestHandlers = useLoadItems(onLoadItems, '', property?.externalProperty, valueFilter, operator);
  const asyncValueAutosuggestProps = property?.propertyKey
    ? { ...valueAutosuggestHandlers, ...asyncProps }
    : { empty: asyncProps.empty };
  const [matchedOption] = valueOptions.filter(option => option.value === value);

  return (
    <InternalAutosuggest
      enteredTextLabel={i18nStrings.enteredTextLabel}
      value={matchedOption?.label ?? value ?? ''}
      clearAriaLabel={i18nStrings.clearAriaLabel}
      onChange={e => onChangeValue(e.detail.value)}
      disabled={!operator}
      options={valueOptions}
      {...asyncValueAutosuggestProps}
      virtualScroll={true}
    />
  );
}

interface ValueInputPropsEnum extends ValueInputProps {
  property: InternalFilteringProperty;
  operator: ComparisonOperator;
}

function ValueInputEnum({
  property,
  operator,
  value: unknownValue,
  onChangeValue,
  asyncProps,
  filteringOptions,
  onLoadItems,
}: ValueInputPropsEnum) {
  const valueOptions = filteringOptions
    .filter(option => option.property?.propertyKey === property.propertyKey)
    .map(({ label, value }) => ({ label, value }));
  const valueAutosuggestHandlers = useLoadItems(onLoadItems, '', property.externalProperty, undefined, operator);
  const asyncValueAutosuggestProps = { statusType: 'finished' as const, ...valueAutosuggestHandlers, ...asyncProps };
  const value = !unknownValue ? [] : Array.isArray(unknownValue) ? unknownValue : [unknownValue];
  const selectedOptions = valueOptions.filter(option => value.includes(option.value));
  return (
    <div className={styles['token-editor-multiselect-wrapper']}>
      <div className={styles['token-editor-multiselect-wrapper-inner']}>
        <InternalMultiselect
          filteringType="auto"
          selectedOptions={selectedOptions}
          onChange={e => onChangeValue(e.detail.selectedOptions.map(o => o.value))}
          options={valueOptions.length > 0 ? [{ options: valueOptions, label: property.groupValuesLabel }] : []}
          {...asyncValueAutosuggestProps}
          inlineTokens={true}
          hideTokens={true}
          keepOpen={true}
        />
      </div>
    </div>
  );
}
