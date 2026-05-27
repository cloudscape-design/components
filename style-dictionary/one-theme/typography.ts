// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces.js';

// Typography tokens are global (no color/density mode) so they are exported
// without a `mode` — the ThemeBuilder treats them as mode-independent overrides.
//
// Note: fontWeight values of '500' from the theme config are not supported by
// the token validator (allowed: 300|400|700|900|normal|bold|light|heavy).
// Those overrides are intentionally omitted and fall back to VR defaults.
export const tokens: StyleDictionary.TypographyDictionary = {
  // ── Font family ───────────────────────────────────────────────────────────
  fontFamilyBase: "'Ember Modern Text UI', 'Amazon Ember', Roboto, Arial, sans-serif",

  // ── Heading sizes & line heights ──────────────────────────────────────────
  fontSizeHeadingXl: '24px',
  lineHeightHeadingXl: '30px',

  fontSizeHeadingL: '20px',
  lineHeightHeadingL: '24px',

  fontSizeHeadingM: '18px',
  lineHeightHeadingM: '22px',

  fontSizeHeadingS: '16px',
  lineHeightHeadingS: '20px',

  fontSizeHeadingXs: '14px',
  lineHeightHeadingXs: '20px',

  // ── Component-specific typography ─────────────────────────────────────────
  fontSizeTabs: '14px',

  // ── Form labels ───────────────────────────────────────────────────────────
  fontSizeFormLabel: '14px',
  lineHeightFormLabel: '20px',

  // ── Key-value pairs label ─────────────────────────────────────────────────
  fontSizeKeyValuePairsLabel: '14px',
  lineHeightKeyValuePairsLabel: '20px',

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  fontWeightBreadcrumbCurrent: '400',
};
