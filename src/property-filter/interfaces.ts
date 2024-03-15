// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { DropdownStatusProps } from '../internal/components/dropdown-status';
import { AutosuggestProps } from '../autosuggest/interfaces';
import { ExpandToViewport } from '../internal/components/dropdown/interfaces';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import {
  PropertyFilterOperation,
  PropertyFilterOperator,
  PropertyFilterOperatorExtended,
  PropertyFilterOperatorForm,
  PropertyFilterOperatorFormat,
  PropertyFilterOperatorFormProps,
  PropertyFilterOption,
  PropertyFilterProperty,
  PropertyFilterToken,
} from '@cloudscape-design/collection-hooks';

export interface PropertyFilterProps extends BaseComponentProps, ExpandToViewport, FormFieldControlProps {
  /**
   * If set to `true`, the filtering input will be disabled.
   * Use it, for example, if you are fetching new items upon filtering change
   * in order to prevent the user from changing the filtering query.
   */
  disabled?: boolean;
  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: PropertyFilterProps.I18nStrings;
  /**
   * Accepts a human-readable, localized string that indicates the number of results. For example, "1 match" or "165 matches."
   * If the total number of results is unknown, also include an indication that there may be more results than
   * the number listed. For example, "25+ matches."
   *
   * The count text is only displayed when `query.tokens` isn't empty.
   */
  countText?: string;
  /**
   * An object representing the current query displayed in the property filter. Has two properties: `tokens` and `operation`.
   * `tokens` is an array of objects that will be displayed to the user beneath the filtering input.
   * Each token has the following properties:
   *
   * * value [string]: The string value of the token to be used as a filter.
   * * propertyKey [string]: The key of the corresponding property in filteringProperties.
   * * operator ['<' | '<=' | '>' | '>=' | ':' | '!:' | '=' | '!=' | '^' | '!^']: The operator which indicates how to filter the dataset using this token.
   *
   * `operation` has two valid values [and, or] and controls the join operation to be applied between tokens when filtering the items.
   */
  query: PropertyFilterProps.Query;
  /**
   * If hideOperations it set, the indicator of the operation (that is, `and` or `or`) and the selection of operations
   * (applied to the property and value token) are hidden from the user. Only use when you have a custom
   * filtering logic which combines tokens in different way than the default one. When used, ensure that
   * operations are communicated to the user in another way.
   */
  hideOperations?: boolean;
  /**
   * Fired when the `query` gets changed. Filter the dataset in response to this event using the values in the `detail` object.
   */
  onChange: NonCancelableEventHandler<PropertyFilterProps.Query>;
  /**
   * An array of properties by which the data set can be filtered. Each element has the following properties:
   *
   * * groupValuesLabel [string]: Localized string to display for the 'Values' group label for a specific property.
   * * key [string]: The identifier of this property.
   * * propertyLabel [string]: A human-readable string for the property.
   * * operators [Array]: A list of all operators supported by this property. If you omit the equals operator because your API does not support it, make sure to set `defaultOperator` to a supported operator from this list.
   * * group [string]: Optional identifier of a custom group that this filtering option is assigned to. Use to create additional groups below the default one. Make sure to also define labels for the group in the customGroupsText property. Notice that only one level of options nesting is supported.
   * * defaultOperator [ComparisonOperator]: Optional parameter that changes the default operator used with this filtering property. Use it only if your API does not support "equals" filtering terms with this property.
   */
  filteringProperties: ReadonlyArray<PropertyFilterProps.FilteringProperty>;
  /**
   * An array of possible values of the individual `filteringProperties`. Each element has the following properties:
   *
   * * `propertyKey` [string]: The key of the corresponding filtering property in the `filteringProperties` array.
   * * `value` [string]: The value that will be used as a suggestion when creating or modifying a filtering token.
   * * `label` [string]: Optional suggestion label to be matched instead of the value.
   *
   * Filtering options that require labels can only use `=` and `!=` operators. The token value must be labelled separately, for example:
   * ```
   * const filteringProperty = {
   *   key: 'state',
   *   propertyLabel: 'State',
   *   operators: ['=', '!='].map(operator => ({ operator, format: getStateLabel }))
   * }
   * const filteringOptions = [
   *   { propertyKey: 'state', value: 'STOPPED', label: getStateLabel('STOPPED') },
   *   { propertyKey: 'state', value: 'STOPPING', label: getStateLabel('STOPPING') },
   *   { propertyKey: 'state', value: 'RUNNING', label: getStateLabel('RUNNING') },
   * ]
   * ```
   */
  filteringOptions?: ReadonlyArray<PropertyFilterProps.FilteringOption>;
  /**
   * An array of objects that contain localized, human-readable strings for the labels of custom groups within the filtering dropdown. Use group property to associate the strings with your custom group of options. Define the following values for each group:
   *
   * * properties [string]: The group label in the filtering dropdown that contains the list of properties from this group. For example: Tags.
   * * values [string]: The group label in the filtering dropdown that contains the list of values from this group. For example: Tags values.
   * * group [string]: The identifier of a custom group.
   */
  customGroupsText?: PropertyFilterProps.GroupText[];
  /**
   * Set `disableFreeTextFiltering` only if you can’t filter the dataset using a filter that is applied to every column,
   * instead of a specific property. This would stop the user from creating such tokens.
   */
  disableFreeTextFiltering?: boolean;
  /**
   * Use this event to asynchronously load filteringOptions, component currently needs.  The detail object contains following properties:
   *
   * * `filteringProperty` - The property for which you need to fetch the options.
   * * `filteringOperator` - The operator for which you need to fetch the options.
   * * `filteringText` - The value that you need to use to fetch options.
   * * `firstPage` - Indicates that you should fetch the first page of options for a `filteringProperty` that match the `filteringText`.
   * * `samePage` - Indicates that you should fetch the same page that you have previously fetched (for example, when the user clicks on the recovery button).
   */
  onLoadItems?: NonCancelableEventHandler<PropertyFilterProps.LoadItemsDetail>;
  /**
   * If you have more than 500 `filteringOptions`, enable this flag to apply a performance optimization that makes
   * the filtering experience smoother. We don't recommend enabling the feature if you have less than 500 options,
   * because the improvements to performance are offset by a visible scrolling lag. When you set this flag to true,
   * it removes options that are not currently in view from the DOM.
   */
  virtualScroll?: boolean;
  /**
   * A slot located before the filtering input. Use it if for a Select component if your dataset supports property
   * filter queries only after an initial filter is applied.
   */
  customControl?: React.ReactNode;
  /**
   * A slot that replaces the standard "Clear filter" button.
   * When using this slot, make sure to still provide a mechanism to clear all filters.
   */
  customFilterActions?: React.ReactNode;
  /**
   * Set `asyncProperties` if you need to load `filteringProperties` asynchronousely. This would cause extra `onLoadMore`
   * events to fire calling for more properties.
   */
  asyncProperties?: boolean;
  /**
   * Specifies the maximum number of displayed tokens. If the property isn't set, all of the tokens are displayed.
   */
  tokenLimit?: number;
  /**
   * The label that will be passed down to the Autosuggest `ariaLabel` property.
   * See the [Autosuggest API](/components/autosuggest/?tabId=api) page for more details.
   */
  filteringAriaLabel?: string;
  /**
   * Placeholder for the filtering input.
   */
  filteringPlaceholder?: string;
  /**
   * Displayed when there are no options to display.
   * This is only shown when `statusType` is set to `finished` or not set at all.
   */
  filteringEmpty?: React.ReactNode;
  /**
   * Specifies the text to display when in the loading state.
   **/
  filteringLoadingText?: string;
  /**
   * Specifies the text to display at the bottom of the dropdown menu after pagination has reached the end.
   **/
  filteringFinishedText?: string;
  /**
   * Specifies the text to display when a data fetching error occurs. Make sure that you provide `recoveryText`.
   **/
  filteringErrorText?: string;
  /**
   * Specifies the text for the recovery button. The text is displayed next to the error text.
   * Use the `onLoadItems` event to perform a recovery action (for example, retrying the request).
   **/
  filteringRecoveryText?: string;
  /**
   * Specifies the current status of loading more options.
   * * `pending` - Indicates that no request in progress, but more options may be loaded.
   * * `loading` - Indicates that data fetching is in progress.
   * * `finished` - Indicates that pagination has finished and no more requests are expected.
   * * `error` - Indicates that an error occurred during fetch. You should use `recoveryText` to enable the user to recover.
   **/
  filteringStatusType?: DropdownStatusProps.StatusType;
}

export namespace PropertyFilterProps {
  export type Token = PropertyFilterToken;
  export type JoinOperation = PropertyFilterOperation;
  export type ComparisonOperator = PropertyFilterOperator;
  export type ExtendedOperator<TokenValue> = PropertyFilterOperatorExtended<TokenValue>;
  export type ExtendedOperatorFormProps<TokenValue> = PropertyFilterOperatorFormProps<TokenValue>;
  export type ExtendedOperatorForm<TokenValue> = PropertyFilterOperatorForm<TokenValue>;
  export type ExtendedOperatorFormat<TokenValue> = PropertyFilterOperatorFormat<TokenValue>;
  export type FilteringOption = PropertyFilterOption;
  export type FilteringProperty = PropertyFilterProperty;

  export interface Query {
    tokens: ReadonlyArray<PropertyFilterProps.Token>;
    operation: PropertyFilterProps.JoinOperation;
  }

  export interface LoadItemsDetail {
    filteringProperty?: FilteringProperty;
    filteringOperator?: ComparisonOperator;
    filteringText: string;
    firstPage: boolean;
    samePage: boolean;
  }

  export interface I18nStrings {
    /**
     * @deprecated Use `filteringAriaLabel` on the component instead.
     */
    filteringAriaLabel?: string;

    /**
     * @deprecated Use `filteringPlaceholder` on the component instead.
     */
    filteringPlaceholder?: string;

    dismissAriaLabel?: string;
    clearAriaLabel?: string;
    groupValuesText?: string;
    groupPropertiesText?: string;
    operatorsText?: string;

    operationAndText?: string;
    operationOrText?: string;

    operatorLessText?: string;
    operatorLessOrEqualText?: string;
    operatorGreaterText?: string;
    operatorGreaterOrEqualText?: string;
    operatorContainsText?: string;
    operatorDoesNotContainText?: string;
    operatorEqualsText?: string;
    operatorDoesNotEqualText?: string;
    operatorStartsWithText?: string;
    operatorDoesNotStartWithText?: string;

    editTokenHeader?: string;
    propertyText?: string;
    operatorText?: string;
    valueText?: string;
    cancelActionText?: string;
    applyActionText?: string;
    allPropertiesLabel?: string;

    tokenLimitShowMore?: string;
    tokenLimitShowFewer?: string;
    clearFiltersText?: string;
    tokenOperatorAriaLabel?: string;
    removeTokenButtonAriaLabel?: (token: PropertyFilterProps.Token) => string;
    enteredTextLabel?: AutosuggestProps.EnteredTextLabel;
  }

  export interface GroupText {
    properties: string;
    values: string;
    group: string;
  }

  export interface FilteringChangeDetail {
    filteringText: string;
    filteringProperty?: FilteringProperty;
  }

  export interface Ref {
    /**
     * Sets focus on the underlying input control.
     */
    focus(): void;
  }
}

// Re-exported namespace interfaces to use module-style imports internally

export type Token = PropertyFilterProps.Token;
export type JoinOperation = PropertyFilterProps.JoinOperation;
export type ComparisonOperator = PropertyFilterProps.ComparisonOperator;
export type ExtendedOperator<TokenValue> = PropertyFilterOperatorExtended<TokenValue>;
export type ExtendedOperatorFormProps<TokenValue> = PropertyFilterOperatorFormProps<TokenValue>;
export type ExtendedOperatorForm<TokenValue> = PropertyFilterOperatorForm<TokenValue>;
export type ExtendedOperatorFormat<TokenValue> = PropertyFilterOperatorFormat<TokenValue>;
export type FilteringOption = PropertyFilterProps.FilteringOption;
export type FilteringProperty = PropertyFilterProps.FilteringProperty;
export type Query = PropertyFilterProps.Query;
export type LoadItemsDetail = PropertyFilterProps.LoadItemsDetail;
export type I18nStrings = PropertyFilterProps.I18nStrings;
export type GroupText = PropertyFilterProps.GroupText;
export type FilteringChangeDetail = PropertyFilterProps.FilteringChangeDetail;
export type Ref = PropertyFilterProps.Ref;

// Utility types

export interface InternalFilteringProperty<TokenValue = any> {
  propertyKey: string;
  propertyLabel: string;
  groupValuesLabel: string;
  propertyGroup?: string;
  operators: readonly PropertyFilterOperator[];
  defaultOperator: PropertyFilterOperator;
  getValueFormatter: (operator?: PropertyFilterOperator) => null | ((value: any) => string);
  getValueFormRenderer: (operator?: PropertyFilterOperator) => null | PropertyFilterOperatorForm<TokenValue>;
  // Original property used in callbacks.
  externalProperty: PropertyFilterProperty;
}

export interface InternalFilteringOption {
  property: null | InternalFilteringProperty;
  value: string;
  label: string;
}

export interface InternalToken<TokenValue = any> {
  property: null | InternalFilteringProperty<TokenValue>;
  operator: PropertyFilterOperator;
  value: TokenValue;
}

export interface InternalQuery {
  operation: PropertyFilterOperation;
  tokens: readonly InternalToken[];
}

export type ParsedText =
  | { step: 'property'; property: InternalFilteringProperty; operator: ComparisonOperator; value: string }
  | { step: 'operator'; property: InternalFilteringProperty; operatorPrefix: string }
  | { step: 'free-text'; operator?: ComparisonOperator; value: string };
