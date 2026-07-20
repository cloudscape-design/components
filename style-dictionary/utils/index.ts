// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReferenceTokens, TokenCategory } from '@cloudscape-design/theming-build';

import { StyleDictionary } from './interfaces.js';

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

export const expandReferenceTokens = (referenceTokens: ReferenceTokens) => {
  if (!referenceTokens.color) {
    return referenceTokens;
  }

  const expandedColor = Object.entries(referenceTokens.color).reduce(
    (acc: any, [colorType, palette]: [string, any]) => {
      if (!palette) {
        return acc;
      }

      acc[colorType] = Object.entries(palette).reduce((paletteAcc: any, [step, value]: [string, any]) => {
        paletteAcc[step] = expandColorEntry(value);
        return paletteAcc;
      }, {});

      return acc;
    },
    {}
  );

  return { ...referenceTokens, color: expandedColor };
};

/**
 * Converts a hex color primitive (e.g. '#fa6f00') into an `rgba()` string with the given alpha.
 * Lets semantic tokens derive translucent values straight from the color palette instead of
 * hardcoding the individual rgb channel numbers.
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map(char => char + char)
          .join('')
      : normalized;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const pickState = (tokenCategory: TokenCategory<string, Record<string, string>>, state: string) => {
  return Object.fromEntries(
    Object.entries(tokenCategory).map(([token, value]) => {
      return [token, typeof value === 'object' ? value[state] : value];
    })
  );
};
