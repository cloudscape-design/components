// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import InternalAutosuggest from '../autosuggest/internal';
import InternalButton from '../button/internal';
import InternalButtonDropdown from '../button-dropdown/internal';
import InternalFormField from '../form-field/internal';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';
import { FormFieldContext } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { SelectProps } from '../select/interfaces';
import InternalSelect from '../select/internal';
import { getAllowedOperators, getPropertySuggestions, operatorToDescription } from './controller';
import {
  ComparisonOperator,
  FormattedToken,
  GroupText,
  I18nStrings,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  InternalToken,
  LoadItemsDetail,
} from './interfaces';
import { useLoadItems } from './use-load-items';
import { getFormattedToken } from './utils';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

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
      triggerVariant="label"
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

export interface TokenEditorProps {
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  freeTextFiltering: InternalFreeTextFiltering;
  filteringProperties: readonly InternalFilteringProperty[];
  filteringOptions: readonly InternalFilteringOption[];
  i18nStrings: I18nStrings;
  i18nStringsExt: {
    tokenEditorTokenActionsLabel: (token: FormattedToken) => string;
    tokenEditorTokenRemoveLabel: (token: FormattedToken) => string;
    tokenEditorTokenRemoveFromGroupLabel: (token: FormattedToken) => string;
    tokenEditorAddNewTokenLabel: string;
    tokenEditorAddTokenActionsLabel: string;
    tokenEditorAddExistingTokenLabel: (token: FormattedToken) => string;
  };
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  onSubmit: () => void;
  onDismiss: () => void;
  standaloneTokens: InternalToken[];
  onChangeStandalone: (newStandalone: InternalToken[]) => void;
  tempGroup: InternalToken[];
  onChangeTempGroup: (token: InternalToken[]) => void;
}

export function TokenEditor({
  asyncProperties,
  asyncProps,
  customGroupsText,
  freeTextFiltering,
  filteringProperties,
  filteringOptions,
  i18nStrings,
  i18nStringsExt,
  onLoadItems,
  onSubmit,
  onDismiss,
  standaloneTokens,
  onChangeStandalone,
  tempGroup,
  onChangeTempGroup,
}: TokenEditorProps) {
  const groups = tempGroup.map((temporaryToken, index) => {
    const setTemporaryToken = (newToken: InternalToken) => {
      const copy = [...tempGroup];
      copy[index] = newToken;
      onChangeTempGroup(copy);
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
      setTemporaryToken({ ...temporaryToken, property: matchedProperty, operator, value: null });
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
    <div className={styles['token-editor-grouped']}>
      <TokenEditorFields
        fields={groups.length}
        groupLabel={index => getFormattedToken(groups[index].token).label}
        removeButton={{
          labelRemove: index => i18nStringsExt.tokenEditorTokenRemoveLabel(getFormattedToken(groups[index].token)),
          labelRemoveFromGroup: index =>
            i18nStringsExt.tokenEditorTokenRemoveFromGroupLabel(getFormattedToken(groups[index].token)),
          labelRemoveMore: index => i18nStringsExt.tokenEditorTokenActionsLabel(getFormattedToken(groups[index].token)),
          onRemove: index => {
            const copy = [...tempGroup];
            copy.splice(index, 1);
            onChangeTempGroup(copy);
          },
          onRemoveFromGroup: index => {
            const removedToken = tempGroup[index];
            const copy = [...tempGroup];
            copy.splice(index, 1);
            onChangeTempGroup(copy);
            onChangeStandalone([...standaloneTokens, removedToken]);
          },
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

      <div className={clsx(styles['token-editor-grouped-add-token'], testUtilStyles['token-editor-token-add-actions'])}>
        <InternalButtonDropdown
          variant="normal"
          ariaLabel={i18nStringsExt.tokenEditorAddTokenActionsLabel}
          items={standaloneTokens.map((token, index) => ({
            id: index.toString(),
            text: i18nStringsExt.tokenEditorAddExistingTokenLabel(getFormattedToken(token)),
          }))}
          onItemClick={({ detail }) => {
            const index = parseInt(detail.id);
            const addedToken = standaloneTokens[index];
            const copy = [...standaloneTokens];
            copy.splice(index, 1);
            onChangeStandalone(copy);
            onChangeTempGroup([...tempGroup, addedToken]);
          }}
          disabled={standaloneTokens.length === 0}
          mainAction={{
            text: i18nStringsExt.tokenEditorAddNewTokenLabel,
            onClick: () => onChangeTempGroup([...tempGroup, { property: null, operator: ':', value: null }]),
          }}
        />
      </div>

      <div className={styles['token-editor-grouped-actions']}>
        <InternalButton
          formAction="none"
          variant="link"
          className={clsx(styles['token-editor-grouped-cancel'], testUtilStyles['token-editor-cancel'])}
          onClick={onDismiss}
        >
          {i18nStrings.cancelActionText}
        </InternalButton>
        <InternalButton
          className={clsx(styles['token-editor-grouped-submit'], testUtilStyles['token-editor-submit'])}
          formAction="none"
          onClick={onSubmit}
        >
          {i18nStrings.applyActionText}
        </InternalButton>
      </div>
    </div>
  );
}

interface TokenEditorLayout {
  fields: number;
  groupLabel: (index: number) => string;
  removeButton: {
    labelRemove: (index: number) => string;
    labelRemoveFromGroup: (index: number) => string;
    labelRemoveMore: (index: number) => string;
    onRemove: (index: number) => void;
    onRemoveFromGroup: (index: number) => void;
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

function TokenEditorFields({ fields, groupLabel, removeButton, property, operator, value }: TokenEditorLayout) {
  const breakpoint = 912;
  const [isNarrow, setIsNarrow] = useState(window.innerWidth <= breakpoint);

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

  const propertyLabelId = useUniqueId();
  const operatorLabelId = useUniqueId();
  const valueLabelId = useUniqueId();

  if (isNarrow) {
    return (
      <div className={styles['token-editor-grouped-list']}>
        {indices.map(index => (
          <div
            key={index}
            className={styles['token-editor-grouped-list-item']}
            role="group"
            aria-label={groupLabel(index)}
          >
            <InternalFormField
              label={property.label}
              className={clsx(
                styles['token-editor-grouped-field-property'],
                testUtilStyles['token-editor-field-property']
              )}
              data-testindex={index}
            >
              {property.render(index)}
            </InternalFormField>

            <InternalFormField
              label={operator.label}
              className={clsx(
                styles['token-editor-grouped-field-operator'],
                testUtilStyles['token-editor-field-operator']
              )}
              data-testindex={index}
            >
              {operator.render(index)}
            </InternalFormField>

            <InternalFormField
              label={value.label}
              className={clsx(styles['token-editor-grouped-field-value'], testUtilStyles['token-editor-field-value'])}
              data-testindex={index}
            >
              {value.render(index)}
            </InternalFormField>

            <div className={styles['token-editor-grouped-remove-token']}>
              <InternalButtonDropdown
                variant="normal"
                ariaLabel={removeButton.labelRemoveMore(index)}
                items={[{ id: 'remove-from-group', text: removeButton.labelRemoveFromGroup(index) }]}
                onItemClick={({ detail }) => {
                  switch (detail.id) {
                    case 'remove-from-group':
                      return removeButton.onRemoveFromGroup(index);
                  }
                }}
                disabled={fields === 1}
                mainAction={{
                  text: removeButton.labelRemove(index),
                  onClick: () => removeButton.onRemove(index),
                  disabled: fields === 1,
                }}
                className={testUtilStyles['token-editor-token-remove-actions']}
                data-testindex={index}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles['token-editor-grouped-table']}>
      <div className={styles['token-editor-grouped-table-row']}>
        <div id={propertyLabelId} className={styles['token-editor-grouped-table-header-cell']}>
          {property.label}
        </div>
        <div id={operatorLabelId} className={styles['token-editor-grouped-table-header-cell']}>
          {operator.label}
        </div>
        <div id={valueLabelId} className={styles['token-editor-grouped-table-header-cell']}>
          {value.label}
        </div>
      </div>

      {indices.map(index => (
        <div
          key={index}
          className={styles['token-editor-grouped-table-row']}
          role="group"
          aria-label={groupLabel(index)}
        >
          <div className={styles['token-editor-grouped-table-cell']}>
            <FormFieldContext.Provider value={{ ariaLabelledby: propertyLabelId }}>
              <InternalFormField
                className={clsx(
                  styles['token-editor-grouped-field-property'],
                  testUtilStyles['token-editor-field-property']
                )}
                data-testindex={index}
              >
                {property.render(index)}
              </InternalFormField>
            </FormFieldContext.Provider>
          </div>

          <div className={styles['token-editor-grouped-table-cell']}>
            <FormFieldContext.Provider value={{ ariaLabelledby: operatorLabelId }}>
              <InternalFormField
                className={clsx(
                  styles['token-editor-grouped-field-operator'],
                  testUtilStyles['token-editor-field-operator']
                )}
                data-testindex={index}
              >
                {operator.render(index)}
              </InternalFormField>
            </FormFieldContext.Provider>
          </div>

          <div className={styles['token-editor-grouped-table-cell']}>
            <FormFieldContext.Provider value={{ ariaLabelledby: valueLabelId }}>
              <InternalFormField
                className={clsx(styles['token-editor-grouped-field-value'], testUtilStyles['token-editor-field-value'])}
                data-testindex={index}
              >
                {value.render(index)}
              </InternalFormField>
            </FormFieldContext.Provider>
          </div>

          <div className={styles['token-editor-grouped-table-cell']}>
            <div className={styles['token-editor-grouped-remove-token']}>
              <InternalButtonDropdown
                variant="icon"
                ariaLabel={removeButton.labelRemoveMore(index)}
                items={[
                  { id: 'remove', text: removeButton.labelRemove(index) },
                  { id: 'remove-from-group', text: removeButton.labelRemoveFromGroup(index) },
                ]}
                onItemClick={({ detail }) => {
                  switch (detail.id) {
                    case 'remove':
                      return removeButton.onRemove(index);
                    case 'remove-from-group':
                      return removeButton.onRemoveFromGroup(index);
                  }
                }}
                disabled={fields === 1}
                className={testUtilStyles['token-editor-token-remove-actions']}
                data-testindex={index}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
