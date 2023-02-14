// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef, useState, useMemo, useImperativeHandle } from 'react';

import InternalSpaceBetween from '../space-between/internal';
import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { KeyCode } from '../internal/keycode';
import SelectToggle from '../token-group/toggle';
import { generateUniqueId } from '../internal/hooks/use-unique-id/index';
import { fireNonCancelableEvent } from '../internal/events';

import { PropertyFilterProps, ParsedText, Ref, FilteringProperty, ComparisonOperator, Token } from './interfaces';
import { TokenButton } from './token';
import {
  getQueryActions,
  parseText,
  getAutosuggestOptions,
  getAllowedOperators,
  getExtendedOperator,
} from './controller';
import { useLoadItems } from './use-load-items';
import styles from './styles.css.js';
import useBaseComponent from '../internal/hooks/use-base-component';
import PropertyFilterAutosuggest, { PropertyFilterAutosuggestProps } from './property-filter-autosuggest';
import { PropertyEditor } from './property-editor';
import { AutosuggestInputRef } from '../internal/components/autosuggest-input';
import { matchTokenValue } from './utils';

export { PropertyFilterProps };

const PropertyFilter = React.forwardRef(
  (
    {
      disabled,
      i18nStrings,
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
    const [tokensExpanded, setTokensExpanded] = useState(false);
    const toggleExpandedTokens = () => setTokensExpanded(!tokensExpanded);
    const hasHiddenOptions = tokenLimit !== undefined && tokens.length > tokenLimit;
    const slicedTokens = hasHiddenOptions && !tokensExpanded ? tokens.slice(0, tokenLimit) : tokens;
    const controlId = useMemo(() => generateUniqueId(), []);

    const operatorForm =
      parsedText.step === 'property' &&
      getExtendedOperator(filteringProperties, parsedText.property.key, parsedText.operator)?.form;

    return (
      <span {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        <div className={styles['search-field']}>
          {customControl && <div className={styles['custom-control']}>{customControl}</div>}
          <PropertyFilterAutosuggest
            ref={inputRef}
            virtualScroll={virtualScroll}
            enteredTextLabel={i18nStrings.enteredTextLabel}
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
            <InternalSpaceBetween size="xs" direction="horizontal" id={controlId}>
              {slicedTokens.map((token, index) => (
                <TokenButton
                  token={token}
                  first={index === 0}
                  operation={operation}
                  key={index}
                  removeToken={() => removeToken(index)}
                  setToken={(newToken: Token) => setToken(index, newToken)}
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
              ))}
              {hasHiddenOptions && (
                <div className={styles['toggle-collapsed']}>
                  <SelectToggle
                    controlId={controlId}
                    allHidden={tokenLimit === 0}
                    expanded={tokensExpanded}
                    numberOfHiddenOptions={tokens.length - slicedTokens.length}
                    i18nStrings={{
                      limitShowFewer: i18nStrings.tokenLimitShowFewer,
                      limitShowMore: i18nStrings.tokenLimitShowMore,
                    }}
                    onClick={toggleExpandedTokens}
                  />
                </div>
              )}
              <div className={styles.separator} />
              <InternalButton onClick={removeAllTokens} className={styles['remove-all']} disabled={disabled}>
                {i18nStrings.clearFiltersText}
              </InternalButton>
            </InternalSpaceBetween>
          </div>
        )}
      </span>
    );
  }
);

applyDisplayName(PropertyFilter, 'PropertyFilter');
export default PropertyFilter;
