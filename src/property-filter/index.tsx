// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef, useState, useImperativeHandle } from 'react';

import InternalSpaceBetween from '../space-between/internal';
import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { KeyCode } from '../internal/keycode';
import { fireNonCancelableEvent } from '../internal/events';

import { PropertyFilterOperator } from '@cloudscape-design/collection-hooks';
import { PropertyFilterProps, ParsedText, Ref, FilteringProperty, ComparisonOperator, Token } from './interfaces';
import { TokenButton } from './token';
import {
  getQueryActions,
  parseText,
  getAutosuggestOptions,
  getAllowedOperators,
  getExtendedOperator,
  getFormattedToken,
} from './controller';
import { useLoadItems } from './use-load-items';
import styles from './styles.css.js';
import useBaseComponent from '../internal/hooks/use-base-component';
import PropertyFilterAutosuggest, { PropertyFilterAutosuggestProps } from './property-filter-autosuggest';
import { PropertyEditor } from './property-editor';
import { AutosuggestInputRef } from '../internal/components/autosuggest-input';
import { matchTokenValue } from './utils';
import { useInternalI18n } from '../internal/i18n/context';
import { TokenList } from '../internal/components/token-list/token-list';

export { PropertyFilterProps };

const OPERATOR_I18N_MAPPING: Record<PropertyFilterOperator, string> = {
  '=': 'equals',
  '!=': 'not_equals',
  '>': 'greater_than',
  '>=': 'greater_than_equal',
  '<': 'less_than',
  '<=': 'less_than_equal',
  ':': 'contains',
  '!:': 'not_contains',
};

const PropertyFilter = React.forwardRef(
  (
    {
      disabled,
      countText,
      query,
      hideOperations,
      onChange,
      filteringProperties,
      filteringOptions = [],
      customGroupsText = [],
      disableFreeTextFiltering = false,
      onLoadItems,
      virtualScroll,
      customControl,
      filteringEmpty,
      filteringLoadingText,
      filteringFinishedText,
      filteringErrorText,
      filteringRecoveryText,
      filteringStatusType,
      asyncProperties,
      tokenLimit,
      expandToViewport,
      ...rest
    }: PropertyFilterProps,
    ref: React.Ref<Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('PropertyFilter');

    const inputRef = useRef<AutosuggestInputRef>(null);
    const baseProps = getBaseProps(rest);

    const i18n = useInternalI18n('property-filter');
    const i18nStrings = {
      ...rest.i18nStrings,
      allPropertiesLabel: i18n('i18nStrings.allPropertiesLabel', rest.i18nStrings.allPropertiesLabel),
      applyActionText: i18n('i18nStrings.applyActionText', rest.i18nStrings.applyActionText),
      cancelActionText: i18n('i18nStrings.cancelActionText', rest.i18nStrings.cancelActionText),
      clearFiltersText: i18n('i18nStrings.clearFiltersText', rest.i18nStrings.clearFiltersText),
      editTokenHeader: i18n('i18nStrings.editTokenHeader', rest.i18nStrings.editTokenHeader),
      enteredTextLabel: i18n('i18nStrings.enteredTextLabel', rest.i18nStrings.enteredTextLabel),
      groupPropertiesText: i18n('i18nStrings.groupPropertiesText', rest.i18nStrings.groupPropertiesText),
      groupValuesText: i18n('i18nStrings.groupValuesText', rest.i18nStrings.groupValuesText),
      operationAndText: i18n('i18nStrings.operationAndText', rest.i18nStrings.operationAndText),
      operationOrText: i18n('i18nStrings.operationOrText', rest.i18nStrings.operationOrText),
      operatorContainsText: i18n('i18nStrings.operatorContainsText', rest.i18nStrings.operatorContainsText),
      operatorDoesNotContainText: i18n(
        'i18nStrings.operatorDoesNotContainText',
        rest.i18nStrings.operatorDoesNotContainText
      ),
      operatorDoesNotEqualText: i18n('i18nStrings.operatorDoesNotEqualText', rest.i18nStrings.operatorDoesNotEqualText),
      operatorEqualsText: i18n('i18nStrings.operatorEqualsText', rest.i18nStrings.operatorEqualsText),
      operatorGreaterOrEqualText: i18n(
        'i18nStrings.operatorGreaterOrEqualText',
        rest.i18nStrings.operatorGreaterOrEqualText
      ),
      operatorGreaterText: i18n('i18nStrings.operatorGreaterText', rest.i18nStrings.operatorGreaterText),
      operatorLessOrEqualText: i18n('i18nStrings.operatorLessOrEqualText', rest.i18nStrings.operatorLessOrEqualText),
      operatorLessText: i18n('i18nStrings.operatorLessText', rest.i18nStrings.operatorLessText),
      operatorText: i18n('i18nStrings.operatorText', rest.i18nStrings.operatorText),
      operatorsText: i18n('i18nStrings.operatorsText', rest.i18nStrings.operatorsText),
      propertyText: i18n('i18nStrings.propertyText', rest.i18nStrings.propertyText),
      tokenLimitShowFewer: i18n('i18nStrings.tokenLimitShowFewer', rest.i18nStrings.tokenLimitShowFewer),
      tokenLimitShowMore: i18n('i18nStrings.tokenLimitShowMore', rest.i18nStrings.tokenLimitShowMore),
      valueText: i18n('i18nStrings.valueText', rest.i18nStrings.valueText),
      removeTokenButtonAriaLabel: i18n(
        'i18nStrings.removeTokenButtonAriaLabel',
        rest.i18nStrings.removeTokenButtonAriaLabel,
        format => token =>
          format({
            token__operator: OPERATOR_I18N_MAPPING[token.operator],
            token__propertyKey: token.propertyKey ?? '',
            token__value: token.value,
          })
      ),
    };

    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);
    const { tokens, operation } = query;
    const showResults = tokens?.length && !disabled;
    const { addToken, removeToken, setToken, setOperation, removeAllTokens } = getQueryActions(
      query,
      onChange,
      inputRef
    );
    const [filteringText, setFilteringText] = useState<string>('');
    const parsedText = parseText(filteringText, filteringProperties, disableFreeTextFiltering);
    const autosuggestOptions = getAutosuggestOptions(
      parsedText,
      filteringOptions,
      filteringProperties,
      customGroupsText,
      i18nStrings
    );

    const createToken = (currentText: string) => {
      const parsedText = parseText(currentText, filteringProperties, disableFreeTextFiltering);
      let newToken: Token;
      switch (parsedText.step) {
        case 'property': {
          newToken = matchTokenValue(
            {
              propertyKey: parsedText.property.key,
              operator: parsedText.operator,
              value: parsedText.value,
            },
            filteringOptions
          );
          break;
        }
        case 'free-text': {
          newToken = {
            operator: parsedText.operator || ':',
            value: parsedText.value,
          };
          break;
        }
        case 'operator': {
          newToken = {
            operator: ':',
            value: currentText,
          };
          break;
        }
      }
      if (disableFreeTextFiltering && !('propertyKey' in newToken)) {
        return;
      }
      addToken(newToken);
      setFilteringText('');
    };
    const ignoreKeyDown = useRef<boolean>(false);
    const handleKeyDown: PropertyFilterAutosuggestProps['onKeyDown'] = event => {
      if (filteringText && !ignoreKeyDown.current && event.detail.keyCode === KeyCode.enter) {
        createToken(filteringText);
      }
    };
    const getLoadMoreDetail = (parsedText: ParsedText, filteringText: string) => {
      const loadMoreDetail: {
        filteringProperty: FilteringProperty | undefined;
        filteringText: string;
        filteringOperator: ComparisonOperator | undefined;
      } = {
        filteringProperty: undefined,
        filteringText,
        filteringOperator: undefined,
      };
      if (parsedText.step === 'property') {
        loadMoreDetail.filteringProperty = parsedText.property;
        loadMoreDetail.filteringText = parsedText.value;
        loadMoreDetail.filteringOperator = parsedText.operator;
      }
      return loadMoreDetail;
    };
    const loadMoreDetail = getLoadMoreDetail(parsedText, filteringText);
    const inputLoadItemsHandlers = useLoadItems(
      onLoadItems,
      loadMoreDetail.filteringText,
      loadMoreDetail.filteringProperty,
      loadMoreDetail.filteringText,
      loadMoreDetail.filteringOperator
    );
    const asyncProps = {
      empty: filteringEmpty,
      loadingText: filteringLoadingText,
      finishedText: filteringFinishedText,
      errorText: filteringErrorText,
      recoveryText: filteringRecoveryText,
      statusType: filteringStatusType,
    };
    const asyncAutosuggestProps =
      !!filteringText.length || asyncProperties
        ? {
            ...inputLoadItemsHandlers,
            ...asyncProps,
          }
        : {};
    const handleSelected: PropertyFilterAutosuggestProps['onOptionClick'] = event => {
      // The ignoreKeyDown flag makes sure `createToken` routine runs only once. Autosuggest's `onKeyDown` fires,
      // when an item is selected from the list using "enter" key.
      ignoreKeyDown.current = true;
      setTimeout(() => {
        ignoreKeyDown.current = false;
      }, 0);
      const { detail: option } = event;
      const value = option.value || '';

      if (!('keepOpenOnSelect' in option)) {
        createToken(value);
        return;
      }

      // stop dropdown from closing
      event.preventDefault();

      const parsedText = parseText(value, filteringProperties, disableFreeTextFiltering);
      const loadMoreDetail = getLoadMoreDetail(parsedText, value);

      // Insert operator automatically if only one operator is defined for the given property.
      if (parsedText.step === 'operator') {
        const operators = getAllowedOperators(parsedText.property);
        if (value.trim() === parsedText.property.propertyLabel && operators.length === 1) {
          loadMoreDetail.filteringProperty = parsedText.property;
          loadMoreDetail.filteringOperator = operators[0];
          loadMoreDetail.filteringText = '';
          setFilteringText(parsedText.property.propertyLabel + ' ' + operators[0] + ' ');
        }
      }

      fireNonCancelableEvent(onLoadItems, { ...loadMoreDetail, firstPage: true, samePage: false });
    };

    const operatorForm =
      parsedText.step === 'property' &&
      getExtendedOperator(filteringProperties, parsedText.property.key, parsedText.operator)?.form;

    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        <div className={styles['search-field']}>
          {customControl && <div className={styles['custom-control']}>{customControl}</div>}
          <PropertyFilterAutosuggest
            ref={inputRef}
            virtualScroll={virtualScroll}
            enteredTextLabel={i18nStrings.enteredTextLabel ?? (value => value)}
            ariaLabel={i18nStrings.filteringAriaLabel}
            placeholder={i18nStrings.filteringPlaceholder}
            value={filteringText}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            {...autosuggestOptions}
            onChange={event => setFilteringText(event.detail.value)}
            empty={filteringEmpty}
            {...asyncAutosuggestProps}
            expandToViewport={expandToViewport}
            onOptionClick={handleSelected}
            customForm={
              operatorForm && (
                <PropertyEditor
                  property={parsedText.property}
                  operator={parsedText.operator}
                  filter={parsedText.value}
                  operatorForm={operatorForm}
                  i18nStrings={i18nStrings}
                  onCancel={() => {
                    setFilteringText('');
                    inputRef.current?.close();
                    inputRef.current?.focus({ preventDropdown: true });
                  }}
                  onSubmit={token => {
                    addToken(token);
                    setFilteringText('');
                    inputRef.current?.focus({ preventDropdown: true });
                    inputRef.current?.close();
                  }}
                />
              )
            }
            hideEnteredTextOption={disableFreeTextFiltering && parsedText.step !== 'property'}
            clearAriaLabel={i18nStrings.clearAriaLabel}
          />
          <span
            aria-live="polite"
            aria-atomic="true"
            className={clsx(styles.results, showResults && styles['results-visible'])}
          >
            {showResults ? countText : ''}
          </span>
        </div>
        {tokens && tokens.length > 0 && (
          <div className={styles.tokens}>
            <InternalSpaceBetween size="xs" direction="horizontal">
              <TokenList
                variant="ul"
                alignment="horizontal"
                limit={tokenLimit}
                items={tokens}
                getItemAttributes={token => {
                  const formattedToken = getFormattedToken(filteringProperties, token);
                  const ariaLabel = (formattedToken.property ?? '') + formattedToken.operator + formattedToken.value;
                  return { ariaLabel, disabled };
                }}
                renderItem={(token, tokenIndex) => (
                  <TokenButton
                    token={token}
                    first={tokenIndex === 0}
                    operation={operation}
                    removeToken={() => removeToken(tokenIndex)}
                    setToken={(newToken: Token) => setToken(tokenIndex, newToken)}
                    setOperation={setOperation}
                    filteringOptions={filteringOptions}
                    filteringProperties={filteringProperties}
                    asyncProps={asyncProps}
                    onLoadItems={onLoadItems}
                    i18nStrings={i18nStrings}
                    asyncProperties={asyncProperties}
                    hideOperations={hideOperations}
                    customGroupsText={customGroupsText}
                    disableFreeTextFiltering={disableFreeTextFiltering}
                    disabled={disabled}
                    expandToViewport={expandToViewport}
                  />
                )}
                i18nStrings={{
                  limitShowFewer: i18nStrings.tokenLimitShowFewer,
                  limitShowMore: i18nStrings.tokenLimitShowMore,
                }}
              />

              <div className={styles.separator} />

              <InternalButton onClick={removeAllTokens} className={styles['remove-all']} disabled={disabled}>
                {i18nStrings.clearFiltersText}
              </InternalButton>
            </InternalSpaceBetween>
          </div>
        )}
      </div>
    );
  }
);

applyDisplayName(PropertyFilter, 'PropertyFilter');
export default PropertyFilter;
