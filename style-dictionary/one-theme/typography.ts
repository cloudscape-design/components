// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandDensityDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/typography.js';
import { fontFamilyTokenNames } from './font-family.js';

const tokens: StyleDictionary.DensityTypographyDictionary = {
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
  fontWeightTabs: '600',
  fontSizeTabs: '14px',
  fontWayfindingLinkActiveWeight: '600',
  fontWeightLinkSecondary: 'inherit',
  fontDecorationLineLinkSecondary: 'underline',

  // ── Alerts / flashbars ────────────────────────────────────────────────────
  fontWeightAlertHeader: '500',
  fontWeightFlashbarHeader: '500',

  // ── Form labels ───────────────────────────────────────────────────────────
  fontWeightFormLabel: '600',
  fontDisplayLabelWeight: '500',

  // ── Body text ─────────────────────────────────────────────────────────────
  fontSizeBodyM: { comfortable: '14px', compact: '13px' },
  fontWeightBold: '600',

  // ── Key-value pairs ───────────────────────────────────────────────────────
  fontWeightKeyValuePairsLabel: '400',

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  fontWeightBreadcrumbCurrent: '400',
};

// Font-family tokens never vary by density; they are supplied by the global
// font-family category, so strip them from the density set to keep the density
// mode from resolving them into { comfortable, compact } objects.
const densityTokens = merge({}, parentTokens, tokens);
for (const name of fontFamilyTokenNames) {
  delete densityTokens[name];
}

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(densityTokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
