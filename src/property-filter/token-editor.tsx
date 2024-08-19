// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal.js';
import { ButtonDropdownProps } from '../button-dropdown/interfaces.js';
import InternalButtonDropdown from '../button-dropdown/internal.js';
import InternalFormField from '../form-field/internal.js';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces.js';
import { FormFieldContext } from '../internal/context/form-field-context.js';
import { NonCancelableEventHandler } from '../internal/events/index.js';
import { useContainerBreakpoints } from '../internal/hooks/container-queries/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { getAllowedOperators } from './controller.js';
import { getFormattedToken } from './i18n-utils.js';
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
} from './interfaces.js';
import { I18nStringsExt } from './internal.js';
import { OperatorInput, PropertyInput, ValueInput } from './token-editor-inputs.js';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export interface TokenEditorProps {
  supportsGroups: boolean;
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  freeTextFiltering: InternalFreeTextFiltering;
  filteringProperties: readonly InternalFilteringProperty[];
  filteringOptions: readonly InternalFilteringOption[];
  i18nStrings: I18nStrings & I18nStringsExt;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  onSubmit: () => void;
  onDismiss: () => void;
  standaloneTokens: InternalToken[];
  onChangeStandalone: (newStandalone: InternalToken[]) => void;
  tempGroup: InternalToken[];
  onChangeTempGroup: (token: InternalToken[]) => void;
}

export function TokenEditor({
  supportsGroups,
  asyncProperties,
  asyncProps,
  customGroupsText,
  freeTextFiltering,
  filteringProperties,
  filteringOptions,
  i18nStrings,
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
    <div className={styles['token-editor']}>
      <TokenEditorFields
        supportsGroups={supportsGroups}
        tokens={groups.map(group => getFormattedToken(group.token, i18nStrings))}
        onRemove={index => {
          const updated = tempGroup.filter((_, existingIndex) => existingIndex !== index);
          onChangeTempGroup(updated);
        }}
        onRemoveFromGroup={index => {
          const removedToken = tempGroup[index];
          const updated = tempGroup.filter((_, existingIndex) => existingIndex !== index);
          onChangeTempGroup(updated);
          onChangeStandalone([...standaloneTokens, removedToken]);
        }}
        onSubmit={onSubmit}
        renderProperty={index => (
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
        )}
        renderOperator={index => (
          <OperatorInput
            property={groups[index].property}
            operator={groups[index].operator}
            onChangeOperator={groups[index].onChangeOperator}
            i18nStrings={i18nStrings}
            freeTextFiltering={freeTextFiltering}
            triggerVariant={supportsGroups ? 'label' : 'option'}
          />
        )}
        renderValue={index => (
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
        )}
        i18nStrings={i18nStrings}
      />

      {supportsGroups && (
        <div className={clsx(styles['token-editor-add-token'], testUtilStyles['token-editor-token-add-actions'])}>
          <InternalButtonDropdown
            variant="normal"
            ariaLabel={i18nStrings.tokenEditorAddTokenActionsLabel}
            items={standaloneTokens.map((token, index) => ({
              id: index.toString(),
              text: i18nStrings.tokenEditorAddExistingTokenLabel?.(getFormattedToken(token, i18nStrings)) ?? '',
            }))}
            onItemClick={({ detail }) => {
              const index = parseInt(detail.id);
              if (!isNaN(index) && standaloneTokens[index]) {
                const addedToken = standaloneTokens[index];
                const updated = standaloneTokens.filter((_, existingIndex) => existingIndex !== index);
                onChangeStandalone(updated);
                onChangeTempGroup([...tempGroup, addedToken]);
              }
            }}
            disabled={standaloneTokens.length === 0}
            mainAction={{
              text: i18nStrings?.tokenEditorAddNewTokenLabel ?? '',
              onClick: () => onChangeTempGroup([...tempGroup, { property: null, operator: ':', value: null }]),
            }}
          />
        </div>
      )}

      <div className={styles['token-editor-actions']}>
        <InternalButton
          formAction="none"
          variant="link"
          className={clsx(styles['token-editor-cancel'], testUtilStyles['token-editor-cancel'])}
          onClick={onDismiss}
        >
          {i18nStrings.cancelActionText}
        </InternalButton>
        <InternalButton
          className={clsx(styles['token-editor-submit'], testUtilStyles['token-editor-submit'])}
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
  tokens: FormattedToken[];
  supportsGroups: boolean;
  onRemove: (index: number) => void;
  onRemoveFromGroup: (index: number) => void;
  onSubmit: () => void;
  renderProperty: (index: number) => React.ReactNode;
  renderOperator: (index: number) => React.ReactNode;
  renderValue: (index: number) => React.ReactNode;
  i18nStrings: I18nStrings & I18nStringsExt;
}

function TokenEditorFields({
  tokens,
  supportsGroups,
  onRemove,
  onRemoveFromGroup,
  onSubmit,
  renderProperty,
  renderOperator,
  renderValue,
  i18nStrings,
}: TokenEditorLayout) {
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xs']);
  const isNarrow = breakpoint === 'default' || !supportsGroups;

  const propertyLabelId = useUniqueId();
  const operatorLabelId = useUniqueId();
  const valueLabelId = useUniqueId();
  const headers = (
    <div className={styles['token-editor-grid-group']}>
      <div id={propertyLabelId} className={styles['token-editor-grid-header']}>
        {i18nStrings.propertyText}
      </div>
      <div id={operatorLabelId} className={styles['token-editor-grid-header']}>
        {i18nStrings.operatorText}
      </div>
      <div id={valueLabelId} className={styles['token-editor-grid-header']}>
        {i18nStrings.valueText}
      </div>
      <div className={styles['token-editor-grid-header']}></div>
    </div>
  );

  return (
    <form
      className={clsx(
        styles['token-editor-grid'],
        isNarrow && styles['token-editor-narrow'],
        styles['token-editor-form']
      )}
      ref={breakpointRef}
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {!isNarrow && headers}

      {tokens.map((token, index) => (
        <div
          key={index}
          role="group"
          aria-label={`${token.propertyLabel} ${token.operator} ${token.value}`}
          className={styles['token-editor-grid-group']}
        >
          <div className={clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow'])}>
            <TokenEditorField
              isNarrow={isNarrow}
              label={i18nStrings.propertyText}
              labelId={propertyLabelId}
              className={clsx(styles['token-editor-field-property'], testUtilStyles['token-editor-field-property'])}
              index={index}
            >
              {renderProperty(index)}
            </TokenEditorField>
          </div>

          <div className={clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow'])}>
            <TokenEditorField
              isNarrow={isNarrow}
              label={i18nStrings.operatorText}
              labelId={operatorLabelId}
              className={clsx(styles['token-editor-field-operator'], testUtilStyles['token-editor-field-operator'])}
              index={index}
            >
              {renderOperator(index)}
            </TokenEditorField>
          </div>

          <div className={clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow'])}>
            <TokenEditorField
              isNarrow={isNarrow}
              label={i18nStrings.valueText}
              labelId={valueLabelId}
              className={clsx(styles['token-editor-field-value'], testUtilStyles['token-editor-field-value'])}
              index={index}
            >
              {renderValue(index)}
            </TokenEditorField>
          </div>

          {supportsGroups && (
            <div className={clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow'])}>
              <div className={styles['token-editor-remove-token']}>
                <TokenEditorRemoveActions
                  isNarrow={isNarrow}
                  ariaLabel={i18nStrings.tokenEditorTokenActionsLabel?.(token) ?? ''}
                  disabled={tokens.length === 1}
                  items={[
                    { id: 'remove', text: i18nStrings.tokenEditorTokenRemoveLabel?.(token) ?? '' },
                    { id: 'remove-from-group', text: i18nStrings.tokenEditorTokenRemoveFromGroupLabel?.(token) ?? '' },
                  ]}
                  onItemClick={itemId => {
                    switch (itemId) {
                      case 'remove':
                        return onRemove(index);
                      case 'remove-from-group':
                        return onRemoveFromGroup(index);
                    }
                  }}
                  index={index}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </form>
  );
}

function TokenEditorField({
  isNarrow,
  label,
  labelId,
  children,
  className,
  index,
}: {
  isNarrow: boolean;
  label: React.ReactNode;
  labelId: string;
  children: React.ReactNode;
  className: string;
  index: number;
}) {
  return isNarrow ? (
    <InternalFormField label={label} className={className} stretch={true} data-testindex={index}>
      {children}
    </InternalFormField>
  ) : (
    <FormFieldContext.Provider value={{ ariaLabelledby: labelId }}>
      <InternalFormField className={className} data-testindex={index}>
        {children}
      </InternalFormField>
    </FormFieldContext.Provider>
  );
}

function TokenEditorRemoveActions({
  isNarrow,
  ariaLabel,
  disabled,
  items,
  onItemClick,
  index,
}: {
  isNarrow: boolean;
  ariaLabel: string;
  disabled: boolean;
  items: ButtonDropdownProps.Item[];
  onItemClick: (itemId: string) => void;
  index: number;
}) {
  return isNarrow ? (
    <InternalButtonDropdown
      variant="normal"
      ariaLabel={ariaLabel}
      items={items.slice(1)}
      onItemClick={({ detail }) => onItemClick(detail.id)}
      disabled={disabled}
      mainAction={{ text: items[0].text, onClick: () => onItemClick(items[0].id), disabled }}
      className={testUtilStyles['token-editor-token-remove-actions']}
      data-testindex={index}
    />
  ) : (
    <InternalButtonDropdown
      variant="icon"
      ariaLabel={ariaLabel}
      items={items}
      onItemClick={({ detail }) => onItemClick(detail.id)}
      disabled={disabled}
      className={testUtilStyles['token-editor-token-remove-actions']}
      data-testindex={index}
    />
  );
}
