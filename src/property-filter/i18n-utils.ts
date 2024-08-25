// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PropertyFilterOperation } from '@cloudscape-design/collection-hooks';

import { useInternalI18n } from '../i18n/context';
import { ComparisonOperator, FormattedToken, I18nStrings, InternalToken } from './interfaces';

export interface InternalTokenGroup {
  operation: PropertyFilterOperation;
  tokens: readonly InternalToken[];
}

export interface FormattedTokenGroup {
  tokens: FormattedToken[];
  operation: string;
  operationLabel: string;
}

export type I18nStringsOperators = Pick<
  I18nStrings,
  | 'operatorLessText'
  | 'operatorLessOrEqualText'
  | 'operatorGreaterText'
  | 'operatorGreaterOrEqualText'
  | 'operatorContainsText'
  | 'operatorDoesNotContainText'
  | 'operatorEqualsText'
  | 'operatorDoesNotEqualText'
  | 'operatorStartsWithText'
  | 'operatorDoesNotStartWithText'
>;

// Unreleased i18n properties
export interface I18nStringsExt {
  groupEditAriaLabel?: (group: FormattedTokenGroup) => string;
  tokenEditorTokenActionsAriaLabel?: (token: FormattedToken) => string;
  tokenEditorTokenRemoveAriaLabel?: (token: FormattedToken) => string;
  tokenEditorTokenRemoveLabel?: string;
  tokenEditorTokenRemoveFromGroupLabel?: string;
  tokenEditorAddNewTokenLabel?: string;
  tokenEditorAddTokenActionsAriaLabel?: string;
  tokenEditorAddExistingTokenAriaLabel?: (token: FormattedToken) => string;
  tokenEditorAddExistingTokenLabel?: (token: FormattedToken) => string;
}

// Replacing i18n function with ones taking internal tokens as argument.
export type I18nStringsInternal = Omit<I18nStrings, 'formatToken' | 'removeTokenButtonAriaLabel'> &
  Omit<
    I18nStringsExt,
    | 'groupEditAriaLabel'
    | 'tokenEditorTokenActionsAriaLabel'
    | 'tokenEditorTokenRemoveAriaLabel'
    | 'tokenEditorAddExistingTokenAriaLabel'
    | 'tokenEditorAddExistingTokenLabel'
  > & {
    formatToken: (token: InternalToken) => {
      propertyLabel: string;
      operator: string;
      value: string;
      formattedText: string;
    };
    groupEditAriaLabel: (group: InternalTokenGroup) => string;
    removeTokenButtonAriaLabel: (token: InternalToken) => string;
    tokenEditorTokenActionsAriaLabel: (token: InternalToken) => string;
    tokenEditorTokenRemoveAriaLabel: (token: InternalToken) => string;
    tokenEditorAddExistingTokenAriaLabel: (token: InternalToken) => string;
    tokenEditorAddExistingTokenLabel: (token: InternalToken) => string;
  };

export function usePropertyFilterI18n(def: I18nStrings & I18nStringsExt): I18nStringsInternal {
  const i18n = useInternalI18n('property-filter');

  const allPropertiesLabel = i18n('i18nStrings.allPropertiesLabel', def?.allPropertiesLabel);
  const operationAndText = i18n('i18nStrings.operationAndText', def?.operationAndText);
  const operationOrText = i18n('i18nStrings.operationOrText', def?.operationOrText);
  const formatToken =
    i18n(
      'i18nStrings.formatToken',
      def.formatToken,
      format => token =>
        format({
          token__propertyLabel: token.propertyLabel,
          token__operator: getOperatorI18nString(token.operator),
          token__value: token.value,
        })
    ) ?? (token => `${token.propertyLabel} ${token.operator} ${token.value}`);

  function toFormatted(token: InternalToken): FormattedToken {
    const valueFormatter = token.property?.getValueFormatter(token.operator);
    const propertyLabel = token.property ? token.property.propertyLabel : allPropertiesLabel ?? '';
    const tokenValue = valueFormatter ? valueFormatter(token.value) : token.value;
    return { propertyKey: token.property?.propertyKey, propertyLabel, operator: token.operator, value: tokenValue };
  }

  function toI18n(
    token: InternalToken,
    { ariaLabel }: { ariaLabel: boolean }
  ): {
    token__propertyKey: string;
    token__propertyLabel: string;
    token__operator: string;
    token__value: string;
    token__formattedText: string;
  } {
    const formatted = toFormatted(token);
    return {
      token__propertyKey: formatted.propertyKey ?? '',
      token__propertyLabel: formatted.propertyLabel,
      token__operator: ariaLabel ? getOperatorI18nString(formatted.operator) : formatted.operator,
      token__value: formatted.value,
      token__formattedText: formatToken(formatted),
    };
  }

  return {
    ...def,
    allPropertiesLabel,
    operationAndText,
    operationOrText,
    applyActionText: i18n('i18nStrings.applyActionText', def?.applyActionText),
    cancelActionText: i18n('i18nStrings.cancelActionText', def?.cancelActionText),
    clearFiltersText: i18n('i18nStrings.clearFiltersText', def?.clearFiltersText),
    editTokenHeader: i18n('i18nStrings.editTokenHeader', def?.editTokenHeader),
    groupPropertiesText: i18n('i18nStrings.groupPropertiesText', def?.groupPropertiesText),
    groupValuesText: i18n('i18nStrings.groupValuesText', def?.groupValuesText),
    operatorContainsText: i18n('i18nStrings.operatorContainsText', def?.operatorContainsText),
    operatorDoesNotContainText: i18n('i18nStrings.operatorDoesNotContainText', def?.operatorDoesNotContainText),
    operatorDoesNotEqualText: i18n('i18nStrings.operatorDoesNotEqualText', def?.operatorDoesNotEqualText),
    operatorEqualsText: i18n('i18nStrings.operatorEqualsText', def?.operatorEqualsText),
    operatorGreaterOrEqualText: i18n('i18nStrings.operatorGreaterOrEqualText', def?.operatorGreaterOrEqualText),
    operatorGreaterText: i18n('i18nStrings.operatorGreaterText', def?.operatorGreaterText),
    operatorLessOrEqualText: i18n('i18nStrings.operatorLessOrEqualText', def?.operatorLessOrEqualText),
    operatorLessText: i18n('i18nStrings.operatorLessText', def?.operatorLessText),
    operatorStartsWithText: i18n('i18nStrings.operatorStartsWithText', def?.operatorStartsWithText),
    operatorDoesNotStartWithText: i18n('i18nStrings.operatorDoesNotStartWithText', def?.operatorDoesNotStartWithText),
    operatorText: i18n('i18nStrings.operatorText', def?.operatorText),
    operatorsText: i18n('i18nStrings.operatorsText', def?.operatorsText),
    propertyText: i18n('i18nStrings.propertyText', def?.propertyText),
    tokenLimitShowFewer: i18n('i18nStrings.tokenLimitShowFewer', def?.tokenLimitShowFewer),
    tokenLimitShowMore: i18n('i18nStrings.tokenLimitShowMore', def?.tokenLimitShowMore),
    valueText: i18n('i18nStrings.valueText', def?.valueText),
    tokenEditorTokenRemoveLabel: i18n('i18nStrings.tokenEditorTokenRemoveLabel', def?.tokenEditorTokenRemoveLabel),
    tokenEditorTokenRemoveFromGroupLabel: i18n(
      'i18nStrings.tokenEditorTokenRemoveFromGroupLabel',
      def?.tokenEditorTokenRemoveFromGroupLabel
    ),
    tokenEditorAddNewTokenLabel: i18n('i18nStrings.tokenEditorAddNewTokenLabel', def?.tokenEditorAddNewTokenLabel),
    tokenEditorAddTokenActionsAriaLabel: i18n(
      'i18nStrings.tokenEditorAddTokenActionsAriaLabel',
      def?.tokenEditorAddTokenActionsAriaLabel
    ),
    formatToken: token => {
      const formattedToken = toFormatted(token);
      return { ...formattedToken, formattedText: formatToken(toFormatted(token)) };
    },
    groupEditAriaLabel: group => {
      const tokens = group.tokens.map(token => toFormatted(token));
      const operation = group.operation;
      const operationLabel = (operation === 'and' ? operationAndText : operationOrText) ?? '';
      const formatter = i18n(
        'i18nStrings.groupEditAriaLabel',
        def.groupEditAriaLabel,
        format => () =>
          format({
            group__operationLabel: operationLabel,
            group__formattedTokens__length: tokens.length.toString(),
            group__formattedTokens0__formattedText: tokens[0] ? formatToken(tokens[0]) : '',
            group__formattedTokens1__formattedText: tokens[1] ? formatToken(tokens[0]) : '',
            group__formattedTokens2__formattedText: tokens[2] ? formatToken(tokens[0]) : '',
            group__formattedTokens3__formattedText: tokens[3] ? formatToken(tokens[0]) : '',
          })
      );
      return formatter?.({ operation, operationLabel, tokens }) ?? '';
    },
    removeTokenButtonAriaLabel: token => {
      const formatter = i18n(
        'i18nStrings.removeTokenButtonAriaLabel',
        def.removeTokenButtonAriaLabel,
        format => () => format(toI18n(token, { ariaLabel: true }))
      );
      return formatter?.(toFormatted(token)) ?? '';
    },
    tokenEditorTokenActionsAriaLabel: token => {
      const formatter = i18n(
        'i18nStrings.tokenEditorTokenActionsAriaLabel',
        def.tokenEditorTokenActionsAriaLabel,
        format => () => format(toI18n(token, { ariaLabel: true }))
      );
      return formatter?.(toFormatted(token)) ?? '';
    },
    tokenEditorTokenRemoveAriaLabel: token => {
      const formatter = i18n(
        'i18nStrings.tokenEditorTokenRemoveAriaLabel',
        def.tokenEditorTokenRemoveAriaLabel,
        format => () => format(toI18n(token, { ariaLabel: true }))
      );
      return formatter?.(toFormatted(token)) ?? '';
    },
    tokenEditorAddExistingTokenAriaLabel: token => {
      const formatter = i18n(
        'i18nStrings.tokenEditorAddExistingTokenAriaLabel',
        def.tokenEditorAddExistingTokenAriaLabel,
        format => () => format(toI18n(token, { ariaLabel: true }))
      );
      return formatter?.(toFormatted(token)) ?? '';
    },
    tokenEditorAddExistingTokenLabel: token => {
      const formatter = i18n(
        'i18nStrings.tokenEditorAddExistingTokenLabel',
        def.tokenEditorAddExistingTokenLabel,
        format => () => format(toI18n(token, { ariaLabel: false }))
      );
      return formatter?.(toFormatted(token)) ?? '';
    },
  };
}

export function operatorToDescription(operator: ComparisonOperator, i18nStrings: I18nStringsOperators) {
  switch (operator) {
    case '<':
      return i18nStrings.operatorLessText;
    case '<=':
      return i18nStrings.operatorLessOrEqualText;
    case '>':
      return i18nStrings.operatorGreaterText;
    case '>=':
      return i18nStrings.operatorGreaterOrEqualText;
    case ':':
      return i18nStrings.operatorContainsText;
    case '!:':
      return i18nStrings.operatorDoesNotContainText;
    case '=':
      return i18nStrings.operatorEqualsText;
    case '!=':
      return i18nStrings.operatorDoesNotEqualText;
    case '^':
      return i18nStrings.operatorStartsWithText;
    case '!^':
      return i18nStrings.operatorDoesNotStartWithText;
    // The line is ignored from coverage because it is not reachable.
    // The purpose of it is to prevent TS errors if ComparisonOperator type gets extended.
    /* istanbul ignore next */
    default:
      return '';
  }
}

function getOperatorI18nString(operator: ComparisonOperator): string {
  switch (operator) {
    case '=':
      return 'equals';
    case '!=':
      return 'not_equals';
    case '>':
      return 'greater_than';
    case '>=':
      return 'greater_than_equal';
    case '<':
      return 'less_than';
    case '<=':
      return 'less_than_equal';
    case ':':
      return 'contains';
    case '!:':
      return 'not_contains';
    case '^':
      return 'starts_with';
    case '!^':
      return 'not_starts_with';
    // The line is ignored from coverage because it is not reachable.
    // The purpose of it is to prevent TS errors if ComparisonOperator type gets extended.
    /* istanbul ignore next */
    default:
      return operator;
  }
}
