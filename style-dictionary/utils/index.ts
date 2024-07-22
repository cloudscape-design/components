// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TokenCategory } from '@cloudscape-design/theming-build';

import { StyleDictionary } from './interfaces';

const expandColorEntry = (entry: StyleDictionary.ColorModeEntry): StyleDictionary.ExpandedColorModeEntry => {
  if (typeof entry === 'string') {
    return {
      light: entry,
      dark: entry,
    };
  }
  return entry;
};

const expandDensityEntry = (entry: StyleDictionary.DensityModeEntry): StyleDictionary.ExpandedDensityModeEntry => {
  if (typeof entry === 'string') {
    return {
      comfortable: entry,
      compact: entry,
    };
  }
  return entry;
};

const expandMotionEntry = (entry: StyleDictionary.MotionModeEntry): StyleDictionary.ExpandedMotionModeEntry => {
  if (typeof entry === 'string') {
    return {
      default: entry,
      disabled: entry,
    };
  }
  return entry;
};

export const expandColorDictionary = (
  dictionary: StyleDictionary.ModeScopeDictionary
): StyleDictionary.ExpandedColorScopeDictionary => {
  return Object.keys(dictionary).reduce((acc, _key) => {
    const key = _key as keyof StyleDictionary.ModeScopeDictionary;
    acc[key] = expandColorEntry(dictionary[key]!);
    return acc;
  }, {} as StyleDictionary.ExpandedColorScopeDictionary);
};

export const expandDensityDictionary = (
  dictionary: StyleDictionary.DensityScopeDictionary
): StyleDictionary.ExpandedDensityScopeDictionary => {
  return Object.keys(dictionary).reduce((acc, _key) => {
    const key = _key as keyof StyleDictionary.DensityScopeDictionary;
    acc[key] = expandDensityEntry(dictionary[key]!);
    return acc;
  }, {} as StyleDictionary.ExpandedDensityScopeDictionary);
};

export const expandMotionDictionary = (
  dictionary: StyleDictionary.MotionScopeDictionary
): StyleDictionary.ExpandedMotionScopeDictionary => {
  return Object.keys(dictionary).reduce((acc, _key) => {
    const key = _key as keyof StyleDictionary.MotionScopeDictionary;
    acc[key] = expandMotionEntry(dictionary[key]!);
    return acc;
  }, {} as StyleDictionary.ExpandedMotionScopeDictionary);
};

export const pickState = (tokenCategory: TokenCategory<string, Record<string, string>>, state: string) => {
  return Object.fromEntries(
    Object.entries(tokenCategory).map(([token, value]) => {
      return [token, typeof value === 'object' ? value[state] : value];
    })
  );
};
