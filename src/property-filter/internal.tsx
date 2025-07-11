// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { PropertyFilterOperator } from '@cloudscape-design/collection-hooks';
import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { AutosuggestInputRef } from '../internal/components/autosuggest-input';
import TokenList from '../internal/components/token-list';
import { useTableComponentsContext } from '../internal/context/table-component-context';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller';
import { SomeRequired } from '../internal/types';
import { joinStrings } from '../internal/utils/strings';
import { InternalLiveRegionRef } from '../live-region/internal';
import InternalSpaceBetween from '../space-between/internal';
import { SearchResults } from '../text-filter/search-results';
import useDebounceSearchResultCallback from '../text-filter/use-debounce-search-result-callback';
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
import { PropertyEditorContentCustom, PropertyEditorContentEnum, PropertyEditorFooter } from './property-editor';
import PropertyFilterAutosuggest, { PropertyFilterAutosuggestProps } from './property-filter-autosuggest';
import { TokenButton } from './token';
import { useLoadItems } from './use-load-items';
import { tokenGroupToTokens } from './utils';

import tokenListStyles from '../internal/components/token-list/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

type PropertyFilterInternalProps = SomeRequired<
  PropertyFilterProps,
  | 'filteringOptions'
  | 'customGroupsText'
  | 'enableTokenGroups'
  | 'disableFreeTextFiltering'
  | 'hideOperations'
  | 'readOnlyOperations'
> &
  InternalBaseComponentProps;

const PropertyFilterInternal = React.forwardRef(
  (
    {
      disabled,
      countText,
      query,
      hideOperations,
      readOnlyOperations,
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
      loading = false,
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
    const searchResultsRef = useRef<InternalLiveRegionRef>(null);
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
          getTokenType: operator => (operator ? (extendedOperators.get(operator)?.tokenType ?? 'value') : 'value'),
          getValueFormatter: operator => (operator ? (extendedOperators.get(operator)?.format ?? null) : null),
          getValueFormRenderer: operator => (operator ? (extendedOperators.get(operator)?.form ?? null) : null),
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

    const countValue = useMemo(() => {
      if (!countText || typeof countText !== 'string') {
        return undefined;
      }

      const m = countText.match(/\d+/);
      return m ? parseInt(m[0]) : undefined;
    }, [countText]);

    const tableComponentContext = useTableComponentsContext();

    useEffect(() => {
      if (tableComponentContext?.filterRef?.current) {
        const groupedTokens = tokenGroupToTokens<InternalToken>(internalQuery.tokens);
        const filteredBy = groupedTokens
          .map(token => token.property?.propertyKey)
          .filter((propertyKey): propertyKey is string => typeof propertyKey === 'string');

        tableComponentContext.filterRef.current.filterCount = countValue;
        tableComponentContext.filterRef.current.filteredBy = filteredBy;
        tableComponentContext.filterRef.current.filtered = groupedTokens.length > 0;

        return () => {
          delete tableComponentContext.filterRef.current?.filterCount;
          delete tableComponentContext.filterRef.current?.filteredBy;
          delete tableComponentContext.filterRef.current?.filtered;
        };
      }
    }, [tableComponentContext?.filterRef, countValue, internalQuery.tokens]);

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

    useDebounceSearchResultCallback({
      searchQuery: query,
      countText,
      loading,
      announceCallback: () => {
        searchResultsRef.current?.reannounce();
      },
    });

    const propertyStep = parsedText.step === 'property' ? parsedText : null;
    const customValueKey = propertyStep ? propertyStep.property.propertyKey + ':' + propertyStep.operator : '';
    const [customFormValueRecord, setCustomFormValueRecord] = useState<Record<string, any>>({});
    const customFormValue = customValueKey in customFormValueRecord ? customFormValueRecord[customValueKey] : null;
    const setCustomFormValue = (value: null | any) => setCustomFormValueRecord({ [customValueKey]: value });
    const operatorForm = propertyStep && propertyStep.property.getValueFormRenderer(propertyStep.operator);
    const isEnumValue = propertyStep?.property.getTokenType(propertyStep.operator) === 'enum';

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
          <div className={styles['input-wrapper']}>
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
                operatorForm || isEnumValue
                  ? {
                      content: operatorForm ? (
                        <PropertyEditorContentCustom
                          key={customValueKey}
                          property={propertyStep.property}
                          operator={propertyStep.operator}
                          filter={propertyStep.value}
                          operatorForm={operatorForm}
                          value={customFormValue}
                          onChange={setCustomFormValue}
                        />
                      ) : (
                        <PropertyEditorContentEnum
                          key={customValueKey}
                          property={propertyStep.property}
                          filter={propertyStep.value}
                          value={customFormValue}
                          onChange={setCustomFormValue}
                          asyncProps={asyncProps}
                          filteringOptions={internalOptions}
                          onLoadItems={inputLoadItemsHandlers.onLoadItems}
                        />
                      ),
                      footer: (
                        <PropertyEditorFooter
                          key={customValueKey}
                          property={propertyStep.property}
                          operator={propertyStep.operator}
                          value={customFormValue}
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
                      ),
                    }
                  : undefined
              }
              onCloseDropdown={() => setCustomFormValueRecord({})}
              hideEnteredTextOption={internalFreeText.disabled && parsedText.step !== 'property'}
              clearAriaLabel={i18nStrings.clearAriaLabel}
              searchResultsId={showResults ? searchResultsId : undefined}
            />
            {showResults ? (
              <div className={styles.results}>
                <SearchResults id={searchResultsId} renderLiveRegion={!loading} ref={searchResultsRef}>
                  {countText}
                </SearchResults>
              </div>
            ) : null}
          </div>
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
                    readOnlyOperations={readOnlyOperations}
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
