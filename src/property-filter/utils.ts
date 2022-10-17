// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FilteringProperty } from './interfaces';

// Finds the longest property the filtering text starts from.
export function matchFilteringProperty(
  filteringProperties: readonly FilteringProperty[],
  filteringText: string
): null | FilteringProperty {
  filteringText = filteringText.toLowerCase();

  let maxLength = 0;
  let matchedProperty: null | FilteringProperty = null;

  for (const property of filteringProperties) {
    if (property.propertyLabel.length > maxLength && startsWith(filteringText, property.propertyLabel.toLowerCase())) {
      maxLength = property.propertyLabel.length;
      matchedProperty = property;
    }
  }

  return matchedProperty;
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

export function trimFirst(text: string): string {
  let trimIndex = 0;
  for (let i = 0; i < text.length; i++) {
    if (i === trimIndex && text[i] === ' ') {
      trimIndex++;
    }
  }
  return text.slice(trimIndex);
}

export function some<T>(array: T[], predicate: (item: T) => boolean): null | T {
  for (const item of array) {
    if (predicate(item)) {
      return item;
    }
  }
  return null;
}

export function isEntering(source: string, target: string): boolean {
  for (let i = 0; i < target.length; i++) {
    if (source[i] !== target[i]) {
      return false;
    }
  }
  return true;
}

export function isMatching(source: string, target: string): boolean {
  source = source + ' ';
  for (let i = 0; i < source.length; i++) {
    if (source[i] !== target[i]) {
      return false;
    }
  }
  return true;
}
