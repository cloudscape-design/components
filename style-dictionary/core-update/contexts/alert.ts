// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../../visual-refresh/contexts/alert.js';

// core-update alert context overrides; the full visual-refresh context (parentTokens) is the base.
const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundStatusInfo: { light: '#f6f6f9', dark: '#232b37' },
  colorBackgroundStatusWarning: { light: '#f6f6f9', dark: '#232b37' },
  colorBackgroundStatusError: { light: '#f6f6f9', dark: '#232b37' },
  colorBackgroundStatusSuccess: { light: '#f6f6f9', dark: '#232b37' },
  colorTextStatusInfo: { light: '#0033cc', dark: '#7598ff' },
  colorBorderStatusInfo: { light: '#0033cc', dark: '#7598ff' },
  colorTextStatusSuccess: { light: '#006b48', dark: '#00bd6b' },
  colorBorderStatusSuccess: { light: '#006b48', dark: '#00bd6b' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);

export { expandedTokens as tokens };
