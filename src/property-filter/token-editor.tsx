// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';

import { SelectProps } from '../select/interfaces';
import InternalSelect from '../select/internal';
import InternalSpaceBetween from '../space-between/internal';
import InternalAutosuggest from '../autosuggest/internal';
import { AutosuggestProps } from '../autosuggest/interfaces';
import InternalPopover, { InternalPopoverRef } from '../popover/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id/index';

import { PropertyFilterProps } from './interfaces';
import styles from './styles.css.js';
import { useLoadItems } from './use-load-items';
import {
  getAllowedOperators,
  getPropertyOptions,
  getPropertyByKey,
  operatorToDescription,
  getPropertySuggestions,
} from './controller';
import TokenEditorForm from './token-editor-form';

const freeTextOperators: PropertyFilterProps.ComparisonOperator[] = [':', '!:'];

type AsyncProps = Pick<
  AutosuggestProps,
  'empty' | 'loadingText' | 'finishedText' | 'errorText' | 'recoveryText' | 'statusType'
>;

interface TokenEditorProps
  extends Pick<
    PropertyFilterProps,
    | 'filteringProperties'
    | 'filteringOptions'
    | 'onLoadItems'
    | 'i18nStrings'
    | 'asyncProperties'
    | 'customGroupsText'
    | 'disableFreeTextFiltering'
    | 'disabled'
    | 'expandToViewport'
  > {
  token: PropertyFilterProps.Token;
  triggerComponent?: React.ReactNode;
  setToken: (newToken: PropertyFilterProps.Token) => void;
  asyncProps: AsyncProps;
}

interface PropertyInputProps
  extends Pick<
    PropertyFilterProps,
    'filteringProperties' | 'onLoadItems' | 'i18nStrings' | 'customGroupsText' | 'disableFreeTextFiltering'
  > {
  propertyKey: undefined | string;
  onChangePropertyKey: (propertyKey: undefined | string) => void;
  asyncProps: null | AsyncProps;
}

function PropertyInput({
  propertyKey,
  onChangePropertyKey,
  asyncProps,
  filteringProperties,
  onLoadItems,
  customGroupsText,
  i18nStrings,
  disableFreeTextFiltering,
}: PropertyInputProps) {
  const property = propertyKey !== undefined ? getPropertyByKey(filteringProperties, propertyKey) : undefined;
  const propertySelectHandlers = useLoadItems(onLoadItems);
  const asyncPropertySelectProps = asyncProps ? { ...asyncProps, ...propertySelectHandlers } : {};
  const propertyOptions: (SelectProps.Option | SelectProps.OptionGroup)[] = getPropertySuggestions(
    filteringProperties,
    customGroupsText,
    i18nStrings,
    ({ propertyLabel, key }) => ({
      value: key,
      label: propertyLabel,
      dontCloseOnSelect: true,
    })
  );
  const allPropertiesOption = {
    label: i18nStrings.allPropertiesLabel,
    value: undefined,
  };
  if (!disableFreeTextFiltering) {
    propertyOptions.unshift(allPropertiesOption);
  }
  const controlId = useUniqueId('property');

  return (
    <div className={clsx(styles['token-editor-line'], styles['property-selector'])} key={i18nStrings.propertyText}>
      <label className={styles['token-editor-label']} htmlFor={controlId}>
        {i18nStrings.propertyText}
      </label>
      <div className={styles['token-editor-field']}>
        <InternalSelect
          controlId={controlId}
          options={propertyOptions}
          selectedOption={
            property
              ? {
                  value: propertyKey ?? undefined,
                  label: property.propertyLabel,
                }
              : allPropertiesOption
          }
          onChange={e => onChangePropertyKey(e.detail.selectedOption.value)}
          {...asyncPropertySelectProps}
        />
      </div>
    </div>
  );
}

interface OperatorInputProps extends Pick<PropertyFilterProps, 'filteringProperties' | 'i18nStrings'> {
  propertyKey: undefined | string;
  operator: undefined | PropertyFilterProps.ComparisonOperator;
  onChangeOperator: (operator: PropertyFilterProps.ComparisonOperator) => void;
}

function OperatorInput({
  propertyKey,
  operator,
  onChangeOperator,
  filteringProperties,
  i18nStrings,
}: OperatorInputProps) {
  const property = propertyKey !== undefined ? getPropertyByKey(filteringProperties, propertyKey) : undefined;
  const freeTextOperators: PropertyFilterProps.ComparisonOperator[] = [':', '!:'];
  const operatorOptions = (property ? getAllowedOperators(property) : freeTextOperators).map(operator => ({
    value: operator,
    label: operator,
    description: operatorToDescription(operator, i18nStrings),
  }));
  const contorlId = useUniqueId('operator');

  return (
    <div className={clsx(styles['token-editor-line'], styles['operator-selector'])} key={i18nStrings.operatorText}>
      <label className={styles['token-editor-label']} htmlFor={contorlId}>
        {i18nStrings.operatorText}
      </label>
      <div className={styles['token-editor-field']}>
        <InternalSelect
          controlId={contorlId}
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
          onChange={e => onChangeOperator(e.detail.selectedOption.value as PropertyFilterProps.ComparisonOperator)}
        />
      </div>
    </div>
  );
}

interface ValueInputProps
  extends Pick<PropertyFilterProps, 'filteringProperties' | 'filteringOptions' | 'onLoadItems' | 'i18nStrings'> {
  propertyKey: undefined | string;
  operator: undefined | PropertyFilterProps.ComparisonOperator;
  value: undefined | string;
  onChangeValue: (value: string) => void;
  asyncProps: AsyncProps;
}

function ValueInput({
  propertyKey,
  operator: selectedOperator,
  value,
  onChangeValue,
  asyncProps,
  filteringProperties,
  filteringOptions,
  onLoadItems,
  i18nStrings,
}: ValueInputProps) {
  const property = propertyKey !== undefined ? getPropertyByKey(filteringProperties, propertyKey) : undefined;
  const valueOptions = property ? getPropertyOptions(property, filteringOptions)?.map(({ value }) => ({ value })) : [];
  const valueAutosuggestHandlers = useLoadItems(onLoadItems, '', property);
  const asyncValueAutosuggesProps = propertyKey
    ? { ...valueAutosuggestHandlers, ...asyncProps }
    : { empty: asyncProps.empty };
  const controlId = useUniqueId('value');

  let customInput: undefined | React.ReactNode = undefined;
  if (propertyKey) {
    for (const prop of filteringProperties) {
      if (prop.key === propertyKey) {
        for (const operator of prop.operators || []) {
          if (typeof operator === 'object' && operator.operator === selectedOperator) {
            if (operator.form) {
              const Form = operator.form;
              customInput = <Form value={value} onChange={onChangeValue} operator={operator.operator} filter="" />;
            }
          }
        }
      }
    }
  }

  return (
    <div
      className={clsx({
        [styles['token-editor-line']]: true,
        [styles['token-editor-line-custom']]: !!customInput,
        [styles['value-selector']]: true,
      })}
      key={i18nStrings.valueText}
    >
      <label className={styles['token-editor-label']} htmlFor={controlId}>
        {i18nStrings.valueText}
      </label>
      <div
        className={clsx({
          [styles['token-editor-field']]: true,
          [styles['token-editor-field-custom']]: !!customInput,
        })}
      >
        {customInput || (
          <InternalAutosuggest
            controlId={controlId}
            enteredTextLabel={i18nStrings.enteredTextLabel}
            value={value ?? ''}
            onChange={e => onChangeValue(e.detail.value)}
            disabled={!selectedOperator}
            options={valueOptions}
            {...asyncValueAutosuggesProps}
            virtualScroll={true}
          />
        )}
      </div>
    </div>
  );
}

export const TokenEditor = ({
  asyncProperties,
  asyncProps,
  customGroupsText,
  disableFreeTextFiltering,
  expandToViewport,
  filteringOptions,
  filteringProperties,
  i18nStrings,
  onLoadItems,
  setToken,
  token,
  triggerComponent,
}: TokenEditorProps) => {
  const [temporaryToken, setTemporaryToken] = useState<PropertyFilterProps.Token>(token);
  const popoverRef = useRef<InternalPopoverRef>(null);
  const closePopover = () => {
    popoverRef.current && popoverRef.current.dismissPopover();
  };

  const propertyKey = temporaryToken.propertyKey;
  const onChangePropertyKey = (newPropertyKey: undefined | string) => {
    const filteringProperty = filteringProperties.reduce<PropertyFilterProps.FilteringProperty | undefined>(
      (acc, property) => (property.key === newPropertyKey ? property : acc),
      undefined
    );
    const allowedOperators = filteringProperty ? getAllowedOperators(filteringProperty) : freeTextOperators;
    const operator =
      temporaryToken.operator && allowedOperators.indexOf(temporaryToken.operator) !== -1
        ? temporaryToken.operator
        : allowedOperators[0];
    setTemporaryToken({ ...temporaryToken, propertyKey: newPropertyKey, operator });
  };

  const operator = temporaryToken.operator;
  const onChangeOperator = (newOperator: PropertyFilterProps.ComparisonOperator) => {
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
        <TokenEditorForm
          onClose={closePopover}
          onSubmit={() => {
            setToken(temporaryToken as PropertyFilterProps.Token);
            closePopover();
          }}
          i18nStrings={i18nStrings}
        >
          <InternalSpaceBetween size="l">
            <PropertyInput
              propertyKey={propertyKey}
              onChangePropertyKey={onChangePropertyKey}
              asyncProps={asyncProperties ? asyncProps : null}
              filteringProperties={filteringProperties}
              onLoadItems={onLoadItems}
              customGroupsText={customGroupsText}
              i18nStrings={i18nStrings}
              disableFreeTextFiltering={disableFreeTextFiltering}
            />

            <OperatorInput
              propertyKey={propertyKey}
              operator={operator}
              onChangeOperator={onChangeOperator}
              filteringProperties={filteringProperties}
              i18nStrings={i18nStrings}
            />

            <ValueInput
              propertyKey={propertyKey}
              operator={operator}
              value={value}
              onChangeValue={onChangeValue}
              asyncProps={asyncProps}
              filteringProperties={filteringProperties}
              filteringOptions={filteringOptions}
              onLoadItems={onLoadItems}
              i18nStrings={i18nStrings}
            />
          </InternalSpaceBetween>
        </TokenEditorForm>
      }
    >
      {triggerComponent}
    </InternalPopover>
  );
};
