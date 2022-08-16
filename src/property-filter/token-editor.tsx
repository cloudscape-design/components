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
  const fields = [];
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
          ? getAllowedOperators(filteringProperty)
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
  fields.push({
    text: i18nStrings.propertyText,
    className: styles['property-selector'],
    control: propertySelect,
    controlId: propertyControlId,
  });

  const operatorText = temporaryToken.operator;
  const freeTextOperators: PropertyFilterProps.ComparisonOperator[] = [':', '!:'];
  const operatorOptions = (property ? getAllowedOperators(property) : freeTextOperators).map(operator => ({
    value: operator,
    label: operator,
    description: operatorToDescription(operator, i18nStrings),
  }));
  const operatorControlId = useUniqueId('operator');
  const operatorSelect = temporaryToken && (
    <InternalSelect
      controlId={operatorControlId}
      options={operatorOptions}
      triggerVariant="option"
      selectedOption={
        operatorText
          ? {
              value: operatorText,
              label: operatorText,
              description: operatorToDescription(operatorText, i18nStrings),
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
  fields.push({
    text: i18nStrings.operatorText,
    className: styles['operator-selector'],
    control: operatorSelect,
    controlId: operatorControlId,
  });

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
  fields.push({
    text: i18nStrings.valueText,
    className: styles['value-selector'],
    control: valueAutosuggest,
    controlId: valueControlId,
  });
  return (
    <div>
      <InternalSpaceBetween size="l">
        {fields.map(({ text, control, className, controlId }) => (
          <div className={clsx(styles['token-editor-line'], className)} key={text}>
            <label className={styles['token-editor-label']} htmlFor={controlId}>
              {text}
            </label>
            <div className={styles['token-editor-field']}>{control}</div>
          </div>
        ))}
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
