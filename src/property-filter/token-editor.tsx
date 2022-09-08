// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';

import { SelectProps } from '../select/interfaces';
import InternalSelect from '../select/internal';
import InternalSpaceBetween from '../space-between/internal';
import InternalAutosuggest from '../autosuggest/internal';
import InternalPopover, { InternalPopoverRef } from '../popover/internal';
import { InternalButton } from '../button/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id/index';

import {
  ComparisonOperator,
  FilteringOption,
  FilteringProperty,
  GroupText,
  I18nStrings,
  LoadItemsDetail,
  Token,
} from './interfaces';
import styles from './styles.css.js';
import { useLoadItems } from './use-load-items';
import {
  getAllowedOperators,
  getPropertyOptions,
  getPropertyByKey,
  operatorToDescription,
  getPropertySuggestions,
} from './controller';
import { NonCancelableEventHandler } from '../internal/events';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';

const freeTextOperators: ComparisonOperator[] = [':', '!:'];

interface TokenEditorFieldProps {
  label: React.ReactNode;
  className: string;
  children: ({ controlId }: { controlId: string }) => React.ReactNode;
}

function TokenEditorField({ className, label, children }: TokenEditorFieldProps) {
  const controlId = useUniqueId();
  return (
    <div className={clsx(styles['token-editor-line'], className)}>
      <label className={styles['token-editor-label']} htmlFor={controlId}>
        {label}
      </label>
      <div className={styles['token-editor-field']}>{children({ controlId })}</div>
    </div>
  );
}

interface PropertyInputProps {
  controlId: string;
  asyncProps: null | DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  disableFreeTextFiltering?: boolean;
  filteringProperties: readonly FilteringProperty[];
  i18nStrings: I18nStrings;
  onChangePropertyKey: (propertyKey: undefined | string) => void;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  propertyKey: undefined | string;
}

function PropertyInput({
  controlId,
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
  return (
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
  );
}

interface OperatorInputProps {
  controlId: string;
  filteringProperties: readonly FilteringProperty[];
  i18nStrings: I18nStrings;
  onChangeOperator: (operator: ComparisonOperator) => void;
  operator: undefined | ComparisonOperator;
  propertyKey: undefined | string;
}

function OperatorInput({
  controlId,
  propertyKey,
  operator,
  onChangeOperator,
  filteringProperties,
  i18nStrings,
}: OperatorInputProps) {
  const property = propertyKey !== undefined ? getPropertyByKey(filteringProperties, propertyKey) : undefined;
  const freeTextOperators: ComparisonOperator[] = [':', '!:'];
  const operatorOptions = (property ? getAllowedOperators(property) : freeTextOperators).map(operator => ({
    value: operator,
    label: operator,
    description: operatorToDescription(operator, i18nStrings),
  }));
  return (
    <InternalSelect
      controlId={controlId}
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
  controlId: string;
  asyncProps: DropdownStatusProps;
  filteringOptions: readonly FilteringOption[];
  filteringProperties: readonly FilteringProperty[];
  i18nStrings: I18nStrings;
  onChangeValue: (value: string) => void;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  operator: undefined | ComparisonOperator;
  propertyKey: undefined | string;
  value: undefined | string;
}

function ValueInput({
  controlId,
  propertyKey,
  operator,
  value,
  onChangeValue,
  asyncProps,
  filteringProperties,
  filteringOptions,
  onLoadItems,
  i18nStrings,
}: ValueInputProps) {
  const property = propertyKey !== undefined ? getPropertyByKey(filteringProperties, propertyKey) : undefined;
  const valueOptions = property ? getPropertyOptions(property, filteringOptions).map(({ value }) => ({ value })) : [];
  const valueAutosuggestHandlers = useLoadItems(onLoadItems, '', property);
  const asyncValueAutosuggesProps = propertyKey
    ? { ...valueAutosuggestHandlers, ...asyncProps }
    : { empty: asyncProps.empty };
  return (
    <InternalAutosuggest
      controlId={controlId}
      enteredTextLabel={i18nStrings.enteredTextLabel}
      value={value ?? ''}
      onChange={e => onChangeValue(e.detail.value)}
      disabled={!operator}
      options={valueOptions}
      {...asyncValueAutosuggesProps}
      virtualScroll={true}
    />
  );
}

interface TokenEditorFormProps {
  i18nStrings: I18nStrings;
  onCancel(): void;
  onSubmit(): void;
  children: React.ReactNode;
}

function TokenEditorForm({ i18nStrings, onCancel, onSubmit, children }: TokenEditorFormProps) {
  return (
    <div className={styles['token-editor']}>
      {children}

      <div className={styles['token-editor-actions']}>
        <InternalButton variant="link" className={styles['token-editor-cancel']} onClick={onCancel}>
          {i18nStrings.cancelActionText}
        </InternalButton>
        <InternalButton className={styles['token-editor-submit']} onClick={onSubmit}>
          {i18nStrings.applyActionText}
        </InternalButton>
      </div>
    </div>
  );
}

interface TokenEditorProps {
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  disabled?: boolean;
  disableFreeTextFiltering?: boolean;
  expandToViewport?: boolean;
  filteringOptions: readonly FilteringOption[];
  filteringProperties: readonly FilteringProperty[];
  i18nStrings: I18nStrings;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  setToken: (newToken: Token) => void;
  token: Token;
  triggerComponent?: React.ReactNode;
}

export function TokenEditor({
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
}: TokenEditorProps) {
  const [temporaryToken, setTemporaryToken] = useState<Token>(token);
  const popoverRef = useRef<InternalPopoverRef>(null);
  const closePopover = () => {
    popoverRef.current && popoverRef.current.dismissPopover();
  };

  const propertyKey = temporaryToken.propertyKey;
  const onChangePropertyKey = (newPropertyKey: undefined | string) => {
    const filteringProperty = filteringProperties.reduce<FilteringProperty | undefined>(
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
        <TokenEditorForm
          i18nStrings={i18nStrings}
          onCancel={closePopover}
          onSubmit={() => {
            setToken(temporaryToken as Token);
            closePopover();
          }}
        >
          <InternalSpaceBetween size="l">
            <TokenEditorField label={i18nStrings.propertyText} className={styles['property-selector']}>
              {({ controlId }) => (
                <PropertyInput
                  controlId={controlId}
                  propertyKey={propertyKey}
                  onChangePropertyKey={onChangePropertyKey}
                  asyncProps={asyncProperties ? asyncProps : null}
                  filteringProperties={filteringProperties}
                  onLoadItems={onLoadItems}
                  customGroupsText={customGroupsText}
                  i18nStrings={i18nStrings}
                  disableFreeTextFiltering={disableFreeTextFiltering}
                />
              )}
            </TokenEditorField>

            <TokenEditorField label={i18nStrings.operatorText} className={styles['operator-selector']}>
              {({ controlId }) => (
                <OperatorInput
                  controlId={controlId}
                  propertyKey={propertyKey}
                  operator={operator}
                  onChangeOperator={onChangeOperator}
                  filteringProperties={filteringProperties}
                  i18nStrings={i18nStrings}
                />
              )}
            </TokenEditorField>

            <TokenEditorField label={i18nStrings.valueText} className={styles['value-selector']}>
              {({ controlId }) => (
                <ValueInput
                  controlId={controlId}
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
              )}
            </TokenEditorField>
          </InternalSpaceBetween>
        </TokenEditorForm>
      }
    >
      {triggerComponent}
    </InternalPopover>
  );
}
