// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComparisonOperator, FormattedToken, I18nStrings, InternalToken } from './interfaces';

export function getI18nToken(token: FormattedToken): {
  token__operator: string;
  token__propertyKey: string;
  token__propertyLabel: string;
  token__value: string;
} {
  return {
    token__propertyKey: token.propertyKey ?? '',
    token__propertyLabel: token.propertyLabel,
    token__operator: getOperatorI18nString(token.operator),
    token__value: token.value,
  };
}

export function getFormattedToken(token: InternalToken, i18nStrings: I18nStrings): FormattedToken {
  const valueFormatter = token.property?.getValueFormatter(token.operator);
  const propertyLabel = token.property ? token.property.propertyLabel : i18nStrings.allPropertiesLabel ?? '';
  const tokenValue = valueFormatter ? valueFormatter(token.value) : token.value;
  return { propertyKey: token.property?.propertyKey, propertyLabel, operator: token.operator, value: tokenValue };
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
