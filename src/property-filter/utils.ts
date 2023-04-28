// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComparisonOperator, InternalFilteringOption, InternalFilteringProperty, Token } from './interfaces';

// Finds the longest property the filtering text starts from.
export function matchFilteringProperty(
  filteringProperties: readonly InternalFilteringProperty[],
  filteringText: string
): null | InternalFilteringProperty {
  let maxLength = 0;
  let matchedProperty: null | InternalFilteringProperty = null;

  for (const property of filteringProperties) {
    if (
      (property.propertyLabel.length >= maxLength && startsWith(filteringText, property.propertyLabel)) ||
      (property.propertyLabel.length > maxLength &&
        startsWith(filteringText.toLowerCase(), property.propertyLabel.toLowerCase()))
    ) {
      maxLength = property.propertyLabel.length;
      matchedProperty = property;
    }
  }

  return matchedProperty;
}

// Finds the longest operator the filtering text starts from.
export function matchOperator(
  allowedOperators: readonly ComparisonOperator[],
  filteringText: string
): null | ComparisonOperator {
  filteringText = filteringText.toLowerCase();

  let maxLength = 0;
  let matchedOperator: null | ComparisonOperator = null;

  for (const operator of allowedOperators) {
    if (operator.length > maxLength && startsWith(filteringText, operator.toLowerCase())) {
      maxLength = operator.length;
      matchedOperator = operator;
    }
  }

  return matchedOperator;
}

// Finds if the filtering text matches any operator prefix.
export function matchOperatorPrefix(
  allowedOperators: readonly ComparisonOperator[],
  filteringText: string
): null | string {
  if (filteringText.trim().length === 0) {
    return '';
  }
  for (const operator of allowedOperators) {
    if (startsWith(operator.toLowerCase(), filteringText.toLowerCase())) {
      return filteringText;
    }
  }
  return null;
}

export function matchTokenValue(token: Token, filteringOptions: readonly InternalFilteringOption[]): Token {
  const propertyOptions = filteringOptions.filter(option => option.propertyKey === token.propertyKey);
  const bestMatch = { ...token };
  for (const option of propertyOptions) {
    if ((option.label && option.label === token.value) || (!option.label && option.value === token.value)) {
      // exact match found: return it
      return { ...token, value: option.value };
    }
    if (token.value.toLowerCase() === (option.label ?? option.value ?? '').toLowerCase()) {
      // non-exact match: save and keep running in case exact match found later
      bestMatch.value = option.value;
    }
  }

  return bestMatch;
}

export function getPropertyByKey(filteringProperties: readonly InternalFilteringProperty[], key: string) {
  const propertyMap = filteringProperties.reduce<{ [K: string]: InternalFilteringProperty }>((acc, property) => {
    acc[property.propertyKey] = property;
    return acc;
  }, {});
  return propertyMap[key] as InternalFilteringProperty | undefined;
}

export function getFormattedToken(filteringProperties: readonly InternalFilteringProperty[], token: Token) {
  const property = token.propertyKey ? getPropertyByKey(filteringProperties, token.propertyKey) : undefined;
  const valueFormatter = property?.getValueFormatter(token.operator);
  const propertyLabel = property && property.propertyLabel;
  const tokenValue = valueFormatter ? valueFormatter(token.value) : token.value;
  const label = `${propertyLabel ?? ''} ${token.operator} ${tokenValue}`;
  return { property: propertyLabel, operator: token.operator, value: tokenValue, label };
}

export function trimStart(source: string): string {
  let spacesLength = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === ' ') {
      spacesLength++;
    } else {
      break;
    }
  }
  return source.slice(spacesLength);
}

export function trimFirstSpace(source: string): string {
  return source[0] === ' ' ? source.slice(1) : source;
}

function startsWith(source: string, target: string): boolean {
  return source.indexOf(target) === 0;
}
