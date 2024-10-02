// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { PropertyFilterOperator } from '@cloudscape-design/collection-hooks';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { AutosuggestInputRef } from '../internal/components/autosuggest-input';
import TokenList from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id/index';
import { SomeRequired } from '../internal/types';
import { joinStrings } from '../internal/utils/strings';
import InternalSpaceBetween from '../space-between/internal';
import { SearchResults } from '../text-filter/search-results';
import { GeneratedAnalyticsMetadataPropertyFilterClearFilters } from './analytics-metadata/interfaces';
import { getAllowedOperators, getAutosuggestOptions, getQueryActions, parseText } from './controller';
import { usePropertyFilterI18n } from './i18n-utils';
import {
  ComparisonOperator,
  ExtendedOperator,
  FilteringProperty,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalFreeTextFiltering,
  InternalQuery,
  InternalToken,
  InternalTokenGroup,
  ParsedText,
  PropertyFilterProps,
  Ref,
  Token,
  TokenGroup,
} from './interfaces';
import { PropertyEditor } from './property-editor';
import PropertyFilterAutosuggest, { PropertyFilterAutosuggestProps } from './property-filter-autosuggest';
import { TokenButton } from './token';
import { useLoadItems } from './use-load-items';

import tokenListStyles from '../internal/components/token-list/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export type PropertyFilterInternalProps = SomeRequired<
  PropertyFilterProps,
  'filteringOptions' | 'customGroupsText' | 'enableTokenGroups' | 'disableFreeTextFiltering' | 'hideOperations'
> &
  InternalBaseComponentProps;

const PropertyFilterInternal = React.forwardRef(
  (
    {
      disabled,
      countText,
      query,
      hideOperations,
      onChange,
      filteringProperties,
      filteringOptions,
      customGroupsText,
      disableFreeTextFiltering,
      freeTextFiltering,
      onLoadItems,
      virtualScroll,
      customControl,
      customFilterActions,
      filteringPlaceholder,
      filteringAriaLabel,
      filteringEmpty,
      filteringLoadingText,
      filteringFinishedText,
      filteringErrorText,
      filteringRecoveryText,
      filteringConstraintText,
      filteringStatusType,
      asyncProperties,
      tokenLimit,
      expandToViewport,
      tokenLimitShowFewerAriaLabel,
      tokenLimitShowMoreAriaLabel,
      enableTokenGroups,
      __internalRootRef,
      ...rest
    }: PropertyFilterInternalProps,
    ref: React.Ref<Ref>
  ) => {
    const [nextFocusIndex, setNextFocusIndex] = useState<null | number>(null);
    const tokenListRef = useListFocusController({
      nextFocusIndex,
      onFocusMoved: (target, targetType) => {
        if (targetType === 'fallback') {
          inputRef.current?.focus({ preventDropdown: true });
        } else {
          target.focus();
        }
        setNextFocusIndex(null);
      },
      listItemSelector: `.${tokenListStyles['list-item']}`,
      showMoreSelector: `.${tokenListStyles.toggle}`,
      fallbackSelector: `.${styles.input}`,
    });

    const mergedRef = useMergeRefs(tokenListRef, __internalRootRef);
    const inputRef = useRef<AutosuggestInputRef>(null);
    const baseProps = getBaseProps(rest);

    const i18nStrings = usePropertyFilterI18n(rest.i18nStrings);

    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);
    const [filteringText, setFilteringText] = useState<string>('');

    const { internalProperties, internalOptions, internalQuery, internalFreeText } = (() => {
      const propertyByKey = filteringProperties.reduce((acc, property) => {
        const extendedOperators = (property?.operators ?? []).reduce(
          (acc, operator) => (typeof operator === 'object' ? acc.set(operator.operator, operator) : acc),
          new Map<PropertyFilterOperator, null | ExtendedOperator<any>>()
        );
        acc.set(property.key, {
          propertyKey: property.key,
          propertyLabel: property?.propertyLabel ?? '',
          groupValuesLabel: property?.groupValuesLabel ?? '',
          propertyGroup: property?.group,
          operators: (property?.operators ?? []).map(op => (typeof op === 'string' ? op : op.operator)),
          defaultOperator: property?.defaultOperator ?? '=',
          getValueFormatter: operator => (operator ? extendedOperators.get(operator)?.format ?? null : null),
          getValueFormRenderer: operator => (operator ? extendedOperators.get(operator)?.form ?? null : null),
          externalProperty: property,
        });
        return acc;
      }, new Map<string, InternalFilteringProperty>());
      const getProperty = (propertyKey: string): null | InternalFilteringProperty =>
        propertyByKey.get(propertyKey) ?? null;

      const internalOptions: readonly InternalFilteringOption[] = filteringOptions.map(option => ({
        property: getProperty(option.propertyKey),
        value: option.value,
        label: option.label ?? option.value ?? '',
      }));

      function transformToken(
        tokenOrGroup: Token | TokenGroup,
        standaloneIndex?: number
      ): InternalToken | InternalTokenGroup {
        return 'operation' in tokenOrGroup
          ? {
              operation: tokenOrGroup.operation,
              tokens: tokenOrGroup.tokens.map(token => transformToken(token)),
            }
          : {
              standaloneIndex,
              property: tokenOrGroup.propertyKey ? getProperty(tokenOrGroup.propertyKey) : null,
              operator: tokenOrGroup.operator,
              value: tokenOrGroup.value,
            };
      }

      const internalQuery: InternalQuery = {
        operation: query.operation,
        tokens: (enableTokenGroups && query.tokenGroups ? query.tokenGroups : query.tokens).map(transformToken),
      };

      const internalFreeText: InternalFreeTextFiltering = {
        disabled: disableFreeTextFiltering,
        operators: freeTextFiltering?.operators ?? [':', '!:'],
        defaultOperator: freeTextFiltering?.defaultOperator ?? ':',
      };

      return { internalProperties: [...propertyByKey.values()], internalOptions, internalQuery, internalFreeText };
    })();

    const { addToken, updateToken, updateOperation, removeToken, removeAllTokens } = getQueryActions({
      query: internalQuery,
      filteringOptions: internalOptions,
      onChange,
      enableTokenGroups,
    });

    const parsedText = parseText(filteringText, internalProperties, internalFreeText);
    const autosuggestOptions = getAutosuggestOptions(
      parsedText,
      internalProperties,
      internalOptions,
      customGroupsText,
      i18nStrings
    );

    const createToken = (currentText: string) => {
      const parsedText = parseText(currentText, internalProperties, internalFreeText);
      let newToken: InternalToken;
      switch (parsedText.step) {
        case 'property': {
          newToken = {
            property: parsedText.property,
            operator: parsedText.operator,
            value: parsedText.value,
          };
          break;
        }
        case 'free-text': {
          newToken = {
            property: null,
            operator: parsedText.operator || internalFreeText.defaultOperator,
            value: parsedText.value,
          };
          break;
        }
        case 'operator': {
          newToken = {
            property: null,
            operator: internalFreeText.defaultOperator,
            value: currentText,
          };
          break;
        }
      }
      if (internalFreeText.disabled && !newToken.property) {
        return;
      }
      addToken(newToken);
      setFilteringText('');
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
        loadMoreDetail.filteringProperty = parsedText.property.externalProperty;
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
      const { detail: option } = event;
      const value = option.value || '';
      if (!value) {
        return;
      }

      if (!('keepOpenOnSelect' in option)) {
        createToken(value);
        return;
      }

      // stop dropdown from closing
      event.preventDefault();

      const parsedText = parseText(value, internalProperties, internalFreeText);
      const loadMoreDetail = getLoadMoreDetail(parsedText, value);

      // Insert operator automatically if only one operator is defined for the given property.
      if (parsedText.step === 'operator') {
        const operators = getAllowedOperators(parsedText.property);
        if (value.trim() === parsedText.property.propertyLabel && operators.length === 1) {
          loadMoreDetail.filteringProperty = parsedText.property.externalProperty ?? undefined;
          loadMoreDetail.filteringOperator = operators[0];
          loadMoreDetail.filteringText = '';
          setFilteringText(parsedText.property.propertyLabel + ' ' + operators[0] + ' ');
        }
      }

      fireNonCancelableEvent(onLoadItems, { ...loadMoreDetail, firstPage: true, samePage: false });
    };

    const operatorForm =
      parsedText.step === 'property' && parsedText.property.getValueFormRenderer(parsedText.operator);

    const searchResultsId = useUniqueId('property-filter-search-results');
    const constraintTextId = useUniqueId('property-filter-constraint');
    const textboxAriaDescribedBy = filteringConstraintText
      ? joinStrings(rest.ariaDescribedby, constraintTextId)
      : rest.ariaDescribedby;

    const showResults = !!internalQuery.tokens?.length && !disabled && !!countText;

    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={mergedRef}>
        <div className={clsx(styles['search-field'], analyticsSelectors['search-field'])}>
          {customControl && <div className={styles['custom-control']}>{customControl}</div>}
          <PropertyFilterAutosuggest
            ref={inputRef}
            virtualScroll={virtualScroll}
            enteredTextLabel={i18nStrings.enteredTextLabel}
            ariaLabel={filteringAriaLabel ?? i18nStrings.filteringAriaLabel}
            placeholder={filteringPlaceholder ?? i18nStrings.filteringPlaceholder}
            ariaLabelledby={rest.ariaLabelledby}
            ariaDescribedby={textboxAriaDescribedBy}
            controlId={rest.controlId}
            value={filteringText}
            disabled={disabled}
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
            hideEnteredTextOption={internalFreeText.disabled && parsedText.step !== 'property'}
            clearAriaLabel={i18nStrings.clearAriaLabel}
            searchResultsId={showResults ? searchResultsId : undefined}
          />
          {showResults ? (
            <div className={styles.results}>
              <SearchResults id={searchResultsId}>{countText}</SearchResults>
            </div>
          ) : null}
        </div>
        {filteringConstraintText && (
          <div id={constraintTextId} className={styles.constraint}>
            {filteringConstraintText}
          </div>
        )}
        {internalQuery.tokens && internalQuery.tokens.length > 0 && (
          <div className={styles.tokens}>
            <InternalSpaceBetween size="xs" direction="horizontal">
              <TokenList
                alignment="inline"
                limit={tokenLimit}
                items={internalQuery.tokens}
                limitShowFewerAriaLabel={tokenLimitShowFewerAriaLabel}
                limitShowMoreAriaLabel={tokenLimitShowMoreAriaLabel}
                renderItem={(_, tokenIndex) => (
                  <TokenButton
                    query={internalQuery}
                    tokenIndex={tokenIndex}
                    onUpdateToken={(token, releasedTokens) => {
                      updateToken(tokenIndex, token, releasedTokens);
                    }}
                    onUpdateOperation={updateOperation}
                    onRemoveToken={() => {
                      removeToken(tokenIndex);
                      setNextFocusIndex(tokenIndex);
                    }}
                    filteringProperties={internalProperties}
                    filteringOptions={internalOptions}
                    asyncProps={asyncProps}
                    onLoadItems={onLoadItems}
                    i18nStrings={i18nStrings}
                    asyncProperties={asyncProperties}
                    hideOperations={hideOperations}
                    customGroupsText={customGroupsText}
                    freeTextFiltering={internalFreeText}
                    disabled={disabled}
                    expandToViewport={expandToViewport}
                    enableTokenGroups={enableTokenGroups}
                  />
                )}
                i18nStrings={{
                  limitShowFewer: i18nStrings.tokenLimitShowFewer,
                  limitShowMore: i18nStrings.tokenLimitShowMore,
                }}
                after={
                  customFilterActions ? (
                    <div className={styles['custom-filter-actions']}>{customFilterActions}</div>
                  ) : (
                    <span
                      {...getAnalyticsMetadataAttribute({
                        action: 'clearFilters',
                      } as Partial<GeneratedAnalyticsMetadataPropertyFilterClearFilters>)}
                    >
                      <InternalButton
                        formAction="none"
                        onClick={() => {
                          removeAllTokens();
                          inputRef.current?.focus({ preventDropdown: true });
                        }}
                        className={styles['remove-all']}
                        disabled={disabled}
                      >
                        {i18nStrings.clearFiltersText}
                      </InternalButton>
                    </span>
                  )
                }
              />
            </InternalSpaceBetween>
          </div>
        )}
      </div>
    );
  }
);

export default PropertyFilterInternal;
