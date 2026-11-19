// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/typography.js';

// Font-family tokens do not vary by density, so they are registered as their own
// global (modeless) category. That keeps them out of the density mode, so they
// resolve to plain strings instead of { comfortable, compact } objects, which the
// public token schema rejects for font-family-* tokens. typography.ts imports
// this list to strip the same tokens from the density category.
export const fontFamilyTokenNames: Array<keyof StyleDictionary.TypographyDictionary> = [
  'fontFamilyBase',
  'fontFamilyDisplay',
  'fontFamilyHeading',
  'fontFamilyMonospace',
];

const overrides: StyleDictionary.TypographyDictionary = {
  fontFamilyBase: "'Ember Modern Text UI', 'Amazon Ember', Roboto, Arial, sans-serif",
  fontFamilyMonospace:
    "'Ember Modern Mono', Monaco, Menlo, Consolas, 'Courier Prime', Courier, 'Courier New', monospace",
};

const parentFontFamily: StyleDictionary.TypographyDictionary = {};
for (const name of fontFamilyTokenNames) {
  if (name in parentTokens) {
    parentFontFamily[name] = parentTokens[name];
  }
}

export const tokens: StyleDictionary.TypographyDictionary = merge({}, parentFontFamily, overrides);
