// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/typography.js';

const tokens: StyleDictionary.TypographyDictionary = {
  // Font related themes
  fontSizeBodyM: '14px',
  fontSizeBodyS: '12px',
  lineHeightBodyM: '20px',

  fontSizeHeadingXl: '32px',
  fontSizeHeadingL: '24px',
  fontSizeHeadingM: '20px',
  fontSizeHeadingS: '18px',
  fontSizeHeadingXs: '16px',
  fontSizeDisplayL: '42px',

  lineHeightHeadingXl: '40px',
  lineHeightHeadingL: '30px',
  lineHeightHeadingM: '24px',
  lineHeightHeadingS: '22px',
  lineHeightHeadingXs: '20px',
  lineHeightDisplayL: '48px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
