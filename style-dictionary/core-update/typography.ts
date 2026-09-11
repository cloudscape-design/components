// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/typography.js';

// core-update typography overrides; the full visual-refresh set (parentTokens) is the base.
const tokens: StyleDictionary.TypographyDictionary = {
  fontFamilyBase: "'Noto Sans', 'Helvetica Neue', Roboto, Arial, sans-serif",

  fontSizeHeadingXl: '24px',
  lineHeightHeadingXl: '30px',
  fontWeightHeadingXl: '600',

  fontSizeHeadingL: '20px',
  lineHeightHeadingL: '24px',
  fontWeightHeadingL: '600',

  fontSizeHeadingM: '18px',
  lineHeightHeadingM: '22px',
  fontWeightHeadingM: '600',

  fontSizeHeadingS: '16px',
  lineHeightHeadingS: '20px',
  fontWeightHeadingS: '600',

  fontSizeHeadingXs: '14px',
  lineHeightHeadingXs: '20px',
  fontWeightHeadingXs: '600',

  fontWeightButton: '600',
  fontWeightTabs: '600',
  fontSizeTabs: '16px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
