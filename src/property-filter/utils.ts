// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PropertyFilterProps } from './interfaces';

// Finds the longest property the filtering text starts from.
export function matchFilteringProperty(
  filteringProperties: readonly PropertyFilterProps.FilteringProperty[],
  filteringText: string
): null | PropertyFilterProps.FilteringProperty {
  filteringText = filteringText.toLowerCase();

  let maxLength = 0;
  let matchedProperty: null | PropertyFilterProps.FilteringProperty = null;

  for (const property of filteringProperties) {
    if (property.propertyLabel.length > maxLength && startsWith(filteringText, property.propertyLabel.toLowerCase())) {
      maxLength = property.propertyLabel.length;
      matchedProperty = property;
    }
  }

  return matchedProperty;
}

// Finds the longest operator the filtering text starts from.
export function matchOperator(
  allowedOperators: readonly PropertyFilterProps.LabelledOperator[],
  filteringText: string
): null | PropertyFilterProps.LabelledOperator {
  filteringText = filteringText.toLowerCase();

  let maxLength = 0;
  let matchedOperator: null | PropertyFilterProps.LabelledOperator = null;

  for (const operator of allowedOperators) {
    if (operator.label.length > maxLength && startsWith(filteringText, operator.label.toLowerCase())) {
      maxLength = operator.label.length;
      matchedOperator = operator;
    }
  }

  return matchedOperator;
}

// Finds if the filtering text matches any operator prefix.
export function matchOperatorPrefix(
  allowedOperators: readonly PropertyFilterProps.LabelledOperator[],
  filteringText: string
): null | string {
  if (filteringText.trim().length === 0) {
    return '';
  }
  for (const operator of allowedOperators) {
    if (startsWith(operator.label.toLowerCase(), filteringText.toLowerCase())) {
      return filteringText;
    }
  }
  return null;
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
