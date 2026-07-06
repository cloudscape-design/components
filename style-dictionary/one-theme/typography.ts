// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/typography.js';

const tokens: StyleDictionary.TypographyDictionary = {
  fontFamilyBase: "'Ember Modern Text UI', 'Amazon Ember', Roboto, Arial, sans-serif",

  // ── Headings ──────────────────────────────────────────────────────────────
  fontSizeHeadingXl: '24px',
  lineHeightHeadingXl: '30px',
  fontWeightHeadingXl: '500',

  fontSizeHeadingL: '20px',
  lineHeightHeadingL: '24px',
  fontWeightHeadingL: '500',

  fontSizeHeadingM: '18px',
  lineHeightHeadingM: '22px',
  fontWeightHeadingM: '500',

  fontSizeHeadingS: '16px',
  lineHeightHeadingS: '20px',
  fontWeightHeadingS: '500',

  fontSizeHeadingXs: '14px',
  lineHeightHeadingXs: '20px',
  fontWeightHeadingXs: '500',

  fontWeightDisplayL: '500',
  fontWeightDisplayXl: '400',

  // ── Interactive elements ──────────────────────────────────────────────────
  fontWeightButton: '500',
  fontWeightTabs: '500',
  fontSizeTabs: '14px',
  fontWayfindingLinkActiveWeight: '500',

  // ── Alerts / flashbars ────────────────────────────────────────────────────
  fontWeightAlertHeader: '500',
  fontWeightFlashbarHeader: '500',

  // ── Form labels ───────────────────────────────────────────────────────────
  fontSizeFormLabel: '14px',
  lineHeightFormLabel: '20px',
  fontWeightFormLabel: '500',
  fontDisplayLabelWeight: '500',
  fontWeightBold: '500',

  // ── Key-value pairs ───────────────────────────────────────────────────────
  fontSizeKeyValuePairsLabel: '14px',
  lineHeightKeyValuePairsLabel: '20px',
  fontWeightKeyValuePairsLabel: '500',

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  fontWeightBreadcrumbCurrent: '400',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
