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
  asyncProps: Pick<
    AutosuggestProps,
    'empty' | 'loadingText' | 'finishedText' | 'errorText' | 'recoveryText' | 'statusType'
  >;
}

const EditingFields = ({
  temporaryToken,
  setTemporaryToken,
  asyncProps,
  asyncProperties,
  filteringProperties,
  filteringOptions,
  onLoadItems,
  customGroupsText,
  i18nStrings,
  disableFreeTextFiltering,
}: TokenEditorProps & {
  temporaryToken: PropertyFilterProps.Token;
  setTemporaryToken: (token: PropertyFilterProps.Token) => void;
}) => {
  const property =
    temporaryToken.propertyKey !== undefined
      ? getPropertyByKey(filteringProperties, temporaryToken.propertyKey)
      : undefined;
  const propertySelectHandlers = useLoadItems(onLoadItems);
  const asyncPropertySelectProps = asyncProperties
    ? {
        ...asyncProps,
        ...propertySelectHandlers,
      }
    : {};
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

  const propertyControlId = useUniqueId('property');
  const propertySelect = (
    <InternalSelect
      controlId={propertyControlId}
      options={propertyOptions}
      selectedOption={
        property
          ? {
              value: temporaryToken.propertyKey,
              label: property.propertyLabel,
            }
          : allPropertiesOption
      }
      onChange={e => {
        const filteringProperty = e.detail.selectedOption?.value
          ? filteringProperties.reduce<PropertyFilterProps.FilteringProperty | undefined>(
              (acc, property) => (property.key === e.detail.selectedOption.value ? property : acc),
              undefined
            )
          : undefined;
        const allowedOperators: PropertyFilterProps.ComparisonOperator[] = filteringProperty
          ? getAllowedOperators(filteringProperty).map(op => op.value)
          : freeTextOperators;
        let operator = temporaryToken.operator;
        if (temporaryToken.operator && allowedOperators.indexOf(temporaryToken.operator) === -1) {
          operator = allowedOperators[0];
        }
        setTemporaryToken({
          ...temporaryToken,
          operator,
          propertyKey: e.detail.selectedOption.value,
        });
      }}
      {...asyncPropertySelectProps}
    />
  );

  const operatorText = temporaryToken.operator;
  const freeTextOperators: PropertyFilterProps.ComparisonOperator[] = [':', '!:'];
  const operatorOptions = (
    property ? getAllowedOperators(property) : freeTextOperators.map(value => ({ value, label: value }))
  ).map(operator => ({
    value: operator.value,
    label: operator.label,
    description: !operator.label ? operatorToDescription(operator.value, i18nStrings) : '',
  }));
  const matchedOption = operatorOptions.find(o => o.value === operatorText);
  const operatorControlId = useUniqueId('operator');
  const operatorSelect = temporaryToken && (
    <InternalSelect
      controlId={operatorControlId}
      options={operatorOptions}
      triggerVariant="option"
      selectedOption={
        operatorText
          ? {
              value: matchedOption?.value ?? operatorText,
              label: matchedOption?.label ?? operatorText,
              description: !matchedOption?.label ? operatorToDescription(operatorText, i18nStrings) : '',
            }
          : null
      }
      onChange={e => {
        e.detail.selectedOption.value &&
          setTemporaryToken({
            ...temporaryToken,
            operator: e.detail.selectedOption.value as PropertyFilterProps.ComparisonOperator,
          });
      }}
      disabled={!temporaryToken}
    />
  );

  const valueOptions = property ? getPropertyOptions(property, filteringOptions)?.map(({ value }) => ({ value })) : [];
  const valueAutosuggestHandlers = useLoadItems(onLoadItems, '', property);
  const asyncValueAutosuggesProps = temporaryToken.propertyKey
    ? {
        ...valueAutosuggestHandlers,
        ...asyncProps,
      }
    : { empty: asyncProps.empty };
  const valueControlId = useUniqueId('value');

  const valueAutosuggest = temporaryToken && (
    <InternalAutosuggest
      controlId={valueControlId}
      enteredTextLabel={i18nStrings.enteredTextLabel}
      value={temporaryToken.value || ''}
      onChange={e => {
        setTemporaryToken({
          ...temporaryToken,
          value: e.detail.value,
        });
      }}
      disabled={!operatorText}
      options={valueOptions}
      {...asyncValueAutosuggesProps}
      virtualScroll={true}
    />
  );

  let customValueControl: undefined | React.ReactNode = undefined;
  if (temporaryToken.propertyKey) {
    for (const prop of filteringProperties) {
      if (prop.key === temporaryToken.propertyKey) {
        for (const operator of prop.operators || []) {
          if (typeof operator === 'object' && operator.value === temporaryToken.operator) {
            if (operator.form) {
              const Form = operator.form;
              customValueControl = (
                <Form
                  value={temporaryToken.value}
                  onChange={newValue => setTemporaryToken({ ...temporaryToken, value: newValue })}
                  operator={operator.value}
                  filter=""
                />
              );
            }
          }
        }
      }
    }
  }

  return (
    <div>
      <InternalSpaceBetween size="l">
        <div className={clsx(styles['token-editor-line'], styles['property-selector'])} key={i18nStrings.propertyText}>
          <label className={styles['token-editor-label']} htmlFor={propertyControlId}>
            {i18nStrings.propertyText}
          </label>
          <div className={styles['token-editor-field']}>{propertySelect}</div>
        </div>

        <div className={clsx(styles['token-editor-line'], styles['operator-selector'])} key={i18nStrings.operatorText}>
          <label className={styles['token-editor-label']} htmlFor={operatorControlId}>
            {i18nStrings.operatorText}
          </label>
          <div className={styles['token-editor-field']}>{operatorSelect}</div>
        </div>

        {customValueControl ? (
          <div className={clsx(styles['token-editor-line'], styles['value-selector'])} key={i18nStrings.valueText}>
            {customValueControl}
          </div>
        ) : (
          <div className={clsx(styles['token-editor-line'], styles['value-selector'])} key={i18nStrings.valueText}>
            <label className={styles['token-editor-label']} htmlFor={valueControlId}>
              {i18nStrings.valueText}
            </label>
            <div className={styles['token-editor-field']}>{valueAutosuggest}</div>
          </div>
        )}
      </InternalSpaceBetween>
    </div>
  );
};

export const TokenEditor = (props: TokenEditorProps) => {
  const { token, triggerComponent, setToken, i18nStrings, expandToViewport } = props;
  const [temporaryToken, setTemporaryToken] = useState<PropertyFilterProps.Token>(token);
  const popoverRef = useRef<InternalPopoverRef>(null);
  const closePopover = () => {
    popoverRef.current && popoverRef.current.dismissPopover();
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
          <EditingFields {...props} temporaryToken={temporaryToken} setTemporaryToken={setTemporaryToken} />
        </TokenEditorForm>
      }
    >
      {triggerComponent}
    </InternalPopover>
  );
};
