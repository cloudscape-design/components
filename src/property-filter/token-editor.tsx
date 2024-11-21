// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalButton from '../button/internal.js';
import { ButtonDropdownProps } from '../button-dropdown/interfaces.js';
import InternalButtonDropdown from '../button-dropdown/internal.js';
import InternalCheckbox from '../checkbox/internal.js';
import InternalFormField from '../form-field/internal.js';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces.js';
import { FormFieldContext } from '../internal/context/form-field-context.js';
import { NonCancelableEventHandler } from '../internal/events/index.js';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller.js';
import { useMobile } from '../internal/hooks/use-mobile/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import InternalSpaceBetween from '../space-between/internal.js';
import {
  GeneratedAnalyticsMetadataPropertyEditCancel,
  GeneratedAnalyticsMetadataPropertyEditConfirm,
} from './analytics-metadata/interfaces';
import { getAllowedOperators } from './controller.js';
import { I18nStringsInternal } from './i18n-utils.js';
import {
  ComparisonOperator,
  GroupText,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  InternalToken,
  LoadItemsDetail,
} from './interfaces.js';
import { OperatorInput, PropertyInput, ValueInput } from './token-editor-inputs.js';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export interface TokenEditorProps {
  isSecondary?: boolean;
  supportsGroups: boolean;
  asyncProperties?: boolean;
  asyncProps: DropdownStatusProps;
  customGroupsText: readonly GroupText[];
  freeTextFiltering: InternalFreeTextFiltering;
  filteringProperties: readonly InternalFilteringProperty[];
  filteringOptions: readonly InternalFilteringOption[];
  i18nStrings: I18nStringsInternal;
  onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
  onSubmit: (addToMyFilters: boolean) => void;
  onDismiss: () => void;
  tokensToCapture: InternalToken[];
  onTokenCapture: (token: InternalToken) => void;
  onTokenRelease: (token: InternalToken) => void;
  tempGroup: InternalToken[];
  onChangeTempGroup: (token: InternalToken[]) => void;
}

export function TokenEditor({
  isSecondary = false,
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
  tokensToCapture,
  onTokenCapture,
  onTokenRelease,
  tempGroup,
  onChangeTempGroup,
}: TokenEditorProps) {
  const [addToMyFilters, setAddToMyFilters] = useState(false);
  const [nextFocusIndex, setNextFocusIndex] = useState<null | number>(null);
  const tokenListRef = useListFocusController({
    nextFocusIndex,
    onFocusMoved: target => {
      target.focus();
      setNextFocusIndex(null);
    },
    listItemSelector: `.${styles['token-editor-field-property']}`,
    fallbackSelector: `.${styles['token-editor-add-token']}`,
  });

  const groups = tempGroup.map((temporaryToken, index) => {
    const setTemporaryToken = (newToken: InternalToken) => {
      const copy = [...tempGroup];
      copy[index] = newToken;
      if (newToken.property?.getTokenType(newToken.operator) === 'enum' && newToken.value === null) {
        newToken.value = [];
      }
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
      const currentOperatorTokenType = property?.getTokenType(operator);
      const newOperatorTokenType = property?.getTokenType(newOperator);
      const shouldClearValue = currentOperatorTokenType !== newOperatorTokenType;
      const value = shouldClearValue ? null : temporaryToken.value;
      setTemporaryToken({ ...temporaryToken, operator: newOperator, value });
    };

    const value = temporaryToken.value;
    const onChangeValue = (newValue: unknown) => {
      setTemporaryToken({ ...temporaryToken, value: newValue });
    };

    return { token: temporaryToken, property, onChangePropertyKey, operator, onChangeOperator, value, onChangeValue };
  });

  return (
    <div className={styles['token-editor']} ref={tokenListRef}>
      <TokenEditorFields
        isSecondary={isSecondary}
        supportsGroups={supportsGroups}
        tokens={groups.map(group => group.token)}
        onRemove={index => {
          const updated = tempGroup.filter((_, existingIndex) => existingIndex !== index);
          onChangeTempGroup(updated);
          setNextFocusIndex(index);
        }}
        onRemoveFromGroup={index => {
          const releasedToken = tempGroup[index];
          const updated = tempGroup.filter((_, existingIndex) => existingIndex !== index);
          onChangeTempGroup(updated);
          onTokenRelease(releasedToken);
          setNextFocusIndex(index);
        }}
        onSubmit={() => onSubmit(addToMyFilters)}
        renderProperty={index => (
          <PropertyInput
            readOnly={isSecondary}
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
            ariaLabel={i18nStrings.tokenEditorAddTokenActionsAriaLabel}
            items={tokensToCapture.map((token, index) => {
              return {
                id: index.toString(),
                text: i18nStrings.tokenEditorAddExistingTokenLabel?.(token) ?? '',
                ariaLabel: i18nStrings.tokenEditorAddExistingTokenAriaLabel?.(token) ?? '',
              };
            })}
            onItemClick={({ detail }) => {
              const index = parseInt(detail.id);
              if (!isNaN(index) && tokensToCapture[index]) {
                onChangeTempGroup([...tempGroup, { ...tokensToCapture[index] }]);
                setNextFocusIndex(groups.length);
                onTokenCapture(tokensToCapture[index]);
              }
            }}
            disabled={tokensToCapture.length === 0}
            showMainActionOnly={tokensToCapture.length === 0 || isSecondary}
            mainAction={{
              text: i18nStrings.tokenEditorAddNewTokenLabel ?? '',
              onClick: () => {
                const lastTokenInGroup = tempGroup[tempGroup.length - 1];
                const property = lastTokenInGroup ? lastTokenInGroup.property : null;
                const operator = property?.defaultOperator ?? ':';
                onChangeTempGroup([...tempGroup, { property, operator, value: null }]);
                setNextFocusIndex(groups.length);
              },
            }}
          />
        </div>
      )}

      <div className={styles['token-editor-actions']}>
        {isSecondary ? (
          <div>
            <InternalCheckbox checked={addToMyFilters} onChange={({ detail }) => setAddToMyFilters(detail.checked)}>
              Add to my filters
            </InternalCheckbox>
          </div>
        ) : (
          <div />
        )}
        <InternalSpaceBetween size="xxs" direction="horizontal">
          <div
            {...getAnalyticsMetadataAttribute({
              action: 'editCancel',
            } as Partial<GeneratedAnalyticsMetadataPropertyEditCancel>)}
          >
            <InternalButton
              formAction="none"
              variant="link"
              className={clsx(styles['token-editor-cancel'], testUtilStyles['token-editor-cancel'])}
              onClick={onDismiss}
            >
              {i18nStrings.cancelActionText}
            </InternalButton>
          </div>
          <div
            {...getAnalyticsMetadataAttribute({
              action: 'editConfirm',
            } as Partial<GeneratedAnalyticsMetadataPropertyEditConfirm>)}
          >
            <InternalButton
              className={clsx(styles['token-editor-submit'], testUtilStyles['token-editor-submit'])}
              formAction="none"
              onClick={() => onSubmit(addToMyFilters)}
            >
              {i18nStrings.applyActionText}
            </InternalButton>
          </div>
        </InternalSpaceBetween>
      </div>
    </div>
  );
}

interface TokenEditorLayout {
  isSecondary: boolean;
  tokens: InternalToken[];
  supportsGroups: boolean;
  onRemove: (index: number) => void;
  onRemoveFromGroup: (index: number) => void;
  onSubmit: () => void;
  renderProperty: (index: number) => React.ReactNode;
  renderOperator: (index: number) => React.ReactNode;
  renderValue: (index: number) => React.ReactNode;
  i18nStrings: I18nStringsInternal;
}

function TokenEditorFields({
  isSecondary,
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
  const isMobile = useMobile();
  const isNarrow = isMobile || !supportsGroups;

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
          aria-label={i18nStrings.formatToken(token).formattedText}
          className={clsx(styles['token-editor-grid-group'], supportsGroups && styles['token-editor-supports-groups'])}
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
                  ariaLabel={i18nStrings.tokenEditorTokenActionsAriaLabel?.(token) ?? ''}
                  mainActionAriaLabel={i18nStrings.tokenEditorTokenRemoveAriaLabel?.(token) ?? ''}
                  disabled={tokens.length === 1}
                  items={[
                    {
                      id: 'remove',
                      text: i18nStrings.tokenEditorTokenRemoveLabel ?? '',
                      disabled: token.standaloneIndex !== undefined,
                    },
                    { id: 'remove-from-group', text: i18nStrings.tokenEditorTokenRemoveFromGroupLabel ?? '' },
                  ].filter(item => !isSecondary || item.id !== 'remove-from-group')}
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
  mainActionAriaLabel,
  disabled,
  items,
  onItemClick,
  index,
}: {
  isNarrow: boolean;
  ariaLabel: string;
  mainActionAriaLabel: string;
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
      mainAction={{
        text: items[0].text,
        onClick: () => onItemClick(items[0].id),
        disabled,
        ariaLabel: mainActionAriaLabel,
      }}
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
