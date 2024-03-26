// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';

import { SelectProps } from '../select/interfaces';
import InternalSelect from '../select/internal';
import InternalAutosuggest from '../autosuggest/internal';
import InternalPopover, { InternalPopoverRef } from '../popover/internal';
import {
  ComparisonOperator,
  GroupText,
  I18nStrings,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  InternalToken,
  LoadItemsDetail,
  Token,
} from './interfaces';
import styles from './styles.css.js';
import { useLoadItems } from './use-load-items';
import {
  createPropertiesCompatibilityMap,
  getAllowedOperators,
  operatorToDescription,
  getPropertySuggestions,
} from './controller';
import { NonCancelableEventHandler } from '../internal/events';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';
import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';
import { matchTokenValue } from './utils';

interface PropertyInputProps {
  asyncProps: null | DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  freeTextFiltering: InternalFreeTextFiltering;
  filteringProperties: readonly InternalFilteringProperty[];
  i18nStrings: I18nStrings;
  onChangePropertyKey: (propertyKey: undefined | string) => void;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  property: null | InternalFilteringProperty;
}

function PropertyInput({
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

  // Disallow selecting properties that have different representation.
  const checkPropertiesCompatible = createPropertiesCompatibilityMap(filteringProperties);
  propertyOptions.forEach(optionGroup => {
    if ('options' in optionGroup) {
      optionGroup.options.forEach(option => {
        if (property?.propertyKey && option.value) {
          option.disabled = !checkPropertiesCompatible(option.value, property.propertyKey);
        }
      });
    }
  });

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
  i18nStrings: I18nStrings;
  onChangeOperator: (operator: ComparisonOperator) => void;
  operator: undefined | ComparisonOperator;
  property: null | InternalFilteringProperty;
  freeTextFiltering: InternalFreeTextFiltering;
}

function OperatorInput({ property, operator, onChangeOperator, i18nStrings, freeTextFiltering }: OperatorInputProps) {
  const operatorOptions = (property ? getAllowedOperators(property) : freeTextFiltering.operators).map(operator => ({
    value: operator,
    label: operator,
    description: operatorToDescription(operator, i18nStrings),
  }));
  return (
    <InternalSelect
      options={operatorOptions}
      triggerVariant="option"
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
  i18nStrings: I18nStrings;
  onChangeValue: (value: string) => void;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  operator: undefined | ComparisonOperator;
  property: null | InternalFilteringProperty;
  value: undefined | string;
}

function ValueInput({
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

  const valueAutosuggestHandlers = useLoadItems(onLoadItems, '', property?.externalProperty);
  const asyncValueAutosuggestProps = property?.propertyKey
    ? { ...valueAutosuggestHandlers, ...asyncProps }
    : { empty: asyncProps.empty };
  const [matchedOption] = valueOptions.filter(option => option.value === value);

  const OperatorForm = property?.propertyKey && operator && property?.getValueFormRenderer(operator);

  return OperatorForm ? (
    <OperatorForm value={value} onChange={onChangeValue} operator={operator} />
  ) : (
    <InternalAutosuggest
      enteredTextLabel={i18nStrings.enteredTextLabel ?? (value => value)}
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

interface TokenEditorProps {
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  disabled?: boolean;
  freeTextFiltering: InternalFreeTextFiltering;
  expandToViewport?: boolean;
  filteringProperties: readonly InternalFilteringProperty[];
  filteringOptions: readonly InternalFilteringOption[];
  i18nStrings: I18nStrings;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  setToken: (newToken: Token) => void;
  token: InternalToken;
  triggerComponent?: React.ReactNode;
}

export function TokenEditor({
  asyncProperties,
  asyncProps,
  customGroupsText,
  freeTextFiltering,
  expandToViewport,
  filteringProperties,
  filteringOptions,
  i18nStrings,
  onLoadItems,
  setToken,
  token,
  triggerComponent,
}: TokenEditorProps) {
  const [temporaryToken, setTemporaryToken] = useState<InternalToken>(token);
  const popoverRef = useRef<InternalPopoverRef>(null);
  const closePopover = () => {
    popoverRef.current && popoverRef.current.dismissPopover();
  };

  const property = temporaryToken.property;
  const onChangePropertyKey = (newPropertyKey: undefined | string) => {
    const filteringProperty = filteringProperties.reduce<InternalFilteringProperty | undefined>(
      (acc, property) => (property.propertyKey === newPropertyKey ? property : acc),
      undefined
    );
    const allowedOperators = filteringProperty ? getAllowedOperators(filteringProperty) : freeTextFiltering.operators;
    const operator =
      temporaryToken.operator && allowedOperators.indexOf(temporaryToken.operator) !== -1
        ? temporaryToken.operator
        : allowedOperators[0];
    const matchedProperty = filteringProperties.find(property => property.propertyKey === newPropertyKey) ?? null;
    setTemporaryToken({ ...temporaryToken, property: matchedProperty, operator });
  };

  const operator = temporaryToken.operator;
  const onChangeOperator = (newOperator: ComparisonOperator) => {
    setTemporaryToken({ ...temporaryToken, operator: newOperator });
  };

  const value = temporaryToken.value;
  const onChangeValue = (newValue: string) => {
    setTemporaryToken({ ...temporaryToken, value: newValue });
  };

  return (
    <InternalPopover
      ref={popoverRef}
      className={styles['token-label']}
      triggerType="text"
      header={i18nStrings.editTokenHeader}
      size="large"
      position="right"
      dismissAriaLabel={i18nStrings.dismissAriaLabel}
      __onOpen={() => setTemporaryToken(token)}
      renderWithPortal={expandToViewport}
      content={
        <div className={styles['token-editor']}>
          <div className={styles['token-editor-form']}>
            <InternalFormField label={i18nStrings.propertyText} className={styles['token-editor-field-property']}>
              <PropertyInput
                property={property}
                onChangePropertyKey={onChangePropertyKey}
                asyncProps={asyncProperties ? asyncProps : null}
                filteringProperties={filteringProperties}
                onLoadItems={onLoadItems}
                customGroupsText={customGroupsText}
                i18nStrings={i18nStrings}
                freeTextFiltering={freeTextFiltering}
              />
            </InternalFormField>

            <InternalFormField label={i18nStrings.operatorText} className={styles['token-editor-field-operator']}>
              <OperatorInput
                property={property}
                operator={operator}
                onChangeOperator={onChangeOperator}
                i18nStrings={i18nStrings}
                freeTextFiltering={freeTextFiltering}
              />
            </InternalFormField>

            <InternalFormField label={i18nStrings.valueText} className={styles['token-editor-field-value']}>
              <ValueInput
                property={property}
                operator={operator}
                value={value}
                onChangeValue={onChangeValue}
                asyncProps={asyncProps}
                filteringOptions={filteringOptions}
                onLoadItems={onLoadItems}
                i18nStrings={i18nStrings}
              />
            </InternalFormField>
          </div>

          <div className={styles['token-editor-actions']}>
            <InternalButton
              formAction="none"
              variant="link"
              className={styles['token-editor-cancel']}
              onClick={closePopover}
            >
              {i18nStrings.cancelActionText}
            </InternalButton>
            <InternalButton
              className={styles['token-editor-submit']}
              formAction="none"
              onClick={() => {
                setToken(matchTokenValue(temporaryToken, filteringOptions));
                closePopover();
              }}
            >
              {i18nStrings.applyActionText}
            </InternalButton>
          </div>
        </div>
      }
    >
      {triggerComponent}
    </InternalPopover>
  );
}
