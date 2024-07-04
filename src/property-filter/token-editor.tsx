// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef, useEffect } from 'react';

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
  InternalTokenGroup,
  JoinOperation,
  LoadItemsDetail,
  Token,
  TokenGroup,
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
import { DROPDOWN_WIDTH_CUSTOM_FORM, matchTokenValue } from './utils';
import ButtonTrigger from '../internal/components/button-trigger';
import Dropdown from '../internal/components/dropdown';
import { useFormFieldContext } from '../contexts/form-field';
import { PropertyEditorForm } from './property-editor';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings';

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
  onChangeValue: (value: unknown) => void;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  operator: undefined | ComparisonOperator;
  property: null | InternalFilteringProperty;
  value: unknown;
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
  const formattedValue = property?.getValueFormatter(operator)?.(value) ?? value;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const formFieldProps = useFormFieldContext({});
  const valueId = useUniqueId();

  return OperatorForm ? (
    <Dropdown
      minWidth={DROPDOWN_WIDTH_CUSTOM_FORM}
      stretchBeyondTriggerWidth={true}
      open={isDropdownOpen}
      onDropdownClose={() => setDropdownOpen(false)}
      trigger={
        <>
          <ButtonTrigger
            onClick={() => setDropdownOpen(true)}
            ariaHasPopup="dialog"
            pressed={isDropdownOpen}
            ariaLabelledby={joinStrings(formFieldProps.ariaLabelledby, formattedValue ? valueId : undefined)}
          >
            {typeof formattedValue === 'string' ? formattedValue : ''}
          </ButtonTrigger>
          <ScreenreaderOnly id={valueId}>{formattedValue}</ScreenreaderOnly>
        </>
      }
    >
      <PropertyEditorForm
        value={value}
        property={property}
        customForm={(value, onChange) => <OperatorForm value={value} onChange={onChange} operator={operator} />}
        onCancel={() => setDropdownOpen(false)}
        onSubmit={value => {
          onChangeValue(value);
          setDropdownOpen(false);
        }}
        i18nStrings={i18nStrings}
      />
    </Dropdown>
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
  setToken: (newToken: TokenGroup, newStandalone?: Token[]) => void;
  token: InternalTokenGroup;
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
  const firstLevelTokens: InternalToken[] = [];
  for (const tokenOrGroup of token.tokens) {
    if ('operation' in tokenOrGroup) {
      // ignore as deeply nested tokens are not supported
    } else {
      firstLevelTokens.push(tokenOrGroup);
    }
  }
  const [operation, setOperation] = useState(token.operation);
  const [temp, setTemp] = useState<InternalToken[]>(firstLevelTokens);
  const popoverRef = useRef<InternalPopoverRef>(null);
  const closePopover = () => {
    popoverRef.current && popoverRef.current.dismissPopover();
  };

  const groups = temp.map((temporaryToken, index) => {
    const setTemporaryToken = (newToken: InternalToken) => {
      setTemp(prev => {
        const copy = [...prev];
        copy[index] = newToken;
        return copy;
      });
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
    const onChangeValue = (newValue: unknown) => {
      setTemporaryToken({ ...temporaryToken, value: newValue });
    };

    return { token: temporaryToken, property, onChangePropertyKey, operator, onChangeOperator, value, onChangeValue };
  });

  return (
    <InternalPopover
      ref={popoverRef}
      className={styles['token-label']}
      triggerType="text"
      header={i18nStrings.editTokenHeader}
      size="large"
      __maxSize={true}
      fixedWidth={true}
      position="right"
      dismissAriaLabel={i18nStrings.dismissAriaLabel}
      __onOpen={() => setTemp(firstLevelTokens)}
      renderWithPortal={expandToViewport}
      content={
        <div className={styles['token-editor']}>
          <TokenEditorFields
            fields={groups.length}
            removeButton={{
              label: 'Remove',
              onRemove: index =>
                setTemp(prev => {
                  const copy = [...prev];
                  copy.splice(index, 1);
                  return copy;
                }),
            }}
            operationSelector={{
              label: 'Operation',
              selectedOption: operation,
              onSelect: operation => setOperation(operation),
            }}
            property={{
              label: i18nStrings.propertyText ?? '',
              render: index => (
                <PropertyInput
                  property={groups[index].property}
                  onChangePropertyKey={groups[index].onChangePropertyKey}
                  asyncProps={asyncProperties ? asyncProps : null}
                  filteringProperties={filteringProperties}
                  onLoadItems={onLoadItems}
                  customGroupsText={customGroupsText}
                  i18nStrings={i18nStrings}
                  freeTextFiltering={freeTextFiltering}
                />
              ),
            }}
            operator={{
              label: i18nStrings.operatorText ?? '',
              render: index => (
                <OperatorInput
                  property={groups[index].property}
                  operator={groups[index].operator}
                  onChangeOperator={groups[index].onChangeOperator}
                  i18nStrings={i18nStrings}
                  freeTextFiltering={freeTextFiltering}
                />
              ),
            }}
            value={{
              label: i18nStrings.valueText ?? '',
              render: index => (
                <ValueInput
                  property={groups[index].property}
                  operator={groups[index].operator}
                  value={groups[index].value}
                  onChangeValue={groups[index].onChangeValue}
                  asyncProps={asyncProps}
                  filteringOptions={filteringOptions}
                  onLoadItems={onLoadItems}
                  i18nStrings={i18nStrings}
                />
              ),
            }}
          />

          {/* TODO: i18n */}
          <div className={styles['token-editor-add-token']}>
            <InternalButton
              iconName="add-plus"
              onClick={() => setTemp(prev => [...prev, { property: null, operator: ':', value: null }])}
            >
              Add token
            </InternalButton>
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
                setToken({
                  operation,
                  tokens: temp.map(temporaryToken => matchTokenValue(temporaryToken, filteringOptions)),
                });
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

interface TokenEditorLayout {
  fields: number;
  removeButton: {
    label: string;
    onRemove: (index: number) => void;
  };
  operationSelector: {
    label: string;
    selectedOption: JoinOperation;
    onSelect: (operation: JoinOperation) => void;
  };
  property: {
    label: string;
    render: (index: number) => React.ReactNode;
  };
  operator: {
    label: string;
    render: (index: number) => React.ReactNode;
  };
  value: {
    label: string;
    render: (index: number) => React.ReactNode;
  };
}

function TokenEditorFields({ fields, removeButton, operationSelector, property, operator, value }: TokenEditorLayout) {
  const breakpoint = 912;
  const [isNarrow, setIsNarrow] = useState(window.innerWidth <= breakpoint);
  // const operationOptions = [{ value: 'and' }, { value: 'or' }];

  useEffect(() => {
    const onWindowResize = () => {
      setIsNarrow(window.innerWidth <= breakpoint);
    };
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  const indices: number[] = [];
  for (let i = 0; i < fields; i++) {
    indices.push(i);
  }

  if (isNarrow) {
    return (
      <div className={styles['token-editor-list']}>
        {indices.map(index => (
          <div key={index} className={styles['token-editor-list-item']}>
            {/* {index > 0 && (
              <div className={styles['token-editor-operation']}>
                <InternalSelect
                  options={operationOptions}
                  selectedOption={operationOptions.find(option => option.value === operationSelector.selectedOption)!}
                  onChange={event => operationSelector.onSelect(event.detail.selectedOption.value as 'and' | 'or')}
                  ariaLabel={operationSelector.label}
                />
              </div>
            )} */}

            <InternalFormField label={property.label} className={styles['token-editor-field-property']}>
              {property.render(index)}
            </InternalFormField>

            <InternalFormField label={operator.label} className={styles['token-editor-field-operator']}>
              {operator.render(index)}
            </InternalFormField>

            <InternalFormField label={value.label} className={styles['token-editor-field-value']}>
              {value.render(index)}
            </InternalFormField>

            <div className={styles['token-editor-remove-token']}>
              <InternalButton variant="normal" iconName="close" onClick={() => removeButton.onRemove(index)}>
                {removeButton.label}
              </InternalButton>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles['token-editor-table']}>
      <div className={styles['token-editor-table-row']}>
        {/* <div className={styles['token-editor-table-header-cell']}>
          <ScreenreaderOnly>{removeButton.label}</ScreenreaderOnly>
        </div> */}

        <div className={styles['token-editor-table-header-cell']}>{property.label}</div>
        <div className={styles['token-editor-table-header-cell']}>{operator.label}</div>
        <div className={styles['token-editor-table-header-cell']}>{value.label}</div>
        <div className={styles['token-editor-table-header-cell']}>
          <ScreenreaderOnly>{operationSelector.label}</ScreenreaderOnly>
        </div>
      </div>

      {indices.map(index => (
        <div key={index} className={styles['token-editor-table-row']}>
          {/* <div className={styles['token-editor-table-cell']}>
            {index > 0 && (
              <div className={styles['token-editor-operation']}>
                <InternalSelect
                  options={operationOptions}
                  selectedOption={operationOptions.find(option => option.value === operationSelector.selectedOption)!}
                  onChange={event => operationSelector.onSelect(event.detail.selectedOption.value as 'and' | 'or')}
                  ariaLabel={operationSelector.label}
                />
              </div>
            )}
          </div> */}

          <div className={styles['token-editor-table-cell']}>
            <InternalFormField
              label={property.label}
              className={styles['token-editor-field-property']}
              __hideLabel={true}
            >
              {property.render(index)}
            </InternalFormField>
          </div>

          <div className={styles['token-editor-table-cell']}>
            <InternalFormField
              label={operator.label}
              className={styles['token-editor-field-operator']}
              __hideLabel={true}
            >
              {operator.render(index)}
            </InternalFormField>
          </div>

          <div className={styles['token-editor-table-cell']}>
            <InternalFormField label={value.label} className={styles['token-editor-field-value']} __hideLabel={true}>
              {value.render(index)}
            </InternalFormField>
          </div>

          <div className={styles['token-editor-table-cell']}>
            <div className={styles['token-editor-remove-token']}>
              <InternalButton
                variant="normal"
                // iconName="close"
                onClick={() => removeButton.onRemove(index)}
                // ariaLabel={removeButton.label}
              >
                {removeButton.label}
              </InternalButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
