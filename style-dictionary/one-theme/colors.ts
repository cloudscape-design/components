// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

// One Theme color overrides on top of the visual-refresh baseline.
// Tokens not listed here fall back to the visual-refresh value via ThemeBuilder.addTokens in ./index.ts.
const tokens: StyleDictionary.ColorsDictionary = {
  // ── Body text ─────────────────────────────────────────────────────────────
  colorTextBodyDefault: { light: '{colorNeutralGrey950}', dark: '{colorNeutralGrey350}' },
  colorTextBodySecondary: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey450}' },

  // ── Container / layout ────────────────────────────────────────────────────
  colorBackgroundContainerHeader: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundContainerContent: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBorderDividerDefault: { light: '{colorNeutralGrey350}', dark: '{colorNeutralGrey750}' },
  colorBorderLayout: { light: '{colorNeutralGrey350}', dark: '{colorNeutralGrey750}' },

  // ── Normal button ─────────────────────────────────────────────────────────
  colorBorderButtonNormalDefault: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey700}' },
  colorBorderButtonNormalHover: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey600}' },
  colorBorderButtonNormalActive: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey600}' },
  colorBackgroundButtonNormalDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey850}' },
  colorBackgroundButtonNormalHover: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey750}' },
  colorBackgroundButtonNormalActive: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey700}' },
  colorTextButtonNormalDefault: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey300}' },
  colorTextButtonNormalHover: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey300}' },
  colorTextButtonNormalActive: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey300}' },

  // ── Primary button ────────────────────────────────────────────────────────
  colorBackgroundButtonPrimaryDefault: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorBackgroundButtonPrimaryHover: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey200}' },
  colorBackgroundButtonPrimaryActive: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorTextButtonPrimaryDefault: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey950}' },
  colorTextButtonPrimaryHover: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey950}' },
  colorTextButtonPrimaryActive: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey950}' },

  // ── Link button ───────────────────────────────────────────────────────────
  colorBackgroundButtonLinkDefault: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey750}' },
  colorBackgroundButtonLinkHover: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey650}' },
  colorBackgroundButtonLinkActive: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey900}' },
  colorTextLinkButtonNormalDefault: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },

  // ── Toggle button ─────────────────────────────────────────────────────────
  colorBackgroundToggleButtonNormalPressed: { light: '{colorWhite}', dark: '{colorNeutralGrey850}' },
  colorBorderToggleButtonNormalPressed: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorTextToggleButtonNormalPressed: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },

  // ── Input / form ──────────────────────────────────────────────────────────
  colorBackgroundInputDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundInputDisabled: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey800}' },
  colorBorderInputDefault: { light: '{colorNeutralGrey400}', dark: '{colorNeutralGrey600}' },
  colorTextFormLabel: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey300}' },
  colorTextFormSecondary: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
  colorTextLabel: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
  colorTextKeyValuePairsValue: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey300}' },

  // ── Controls ──────────────────────────────────────────────────────────────
  colorBackgroundControlChecked: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },

  // ── Links ─────────────────────────────────────────────────────────────────
  colorTextLinkDefault: { light: '{colorNeutralGrey950}', dark: '{colorNeutralGrey350}' },
  colorTextLinkHover: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey200}' },
  colorTextLinkSecondaryDefault: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey450}' },
  colorTextLinkInfoDefault: { light: '{colorIndigo600}', dark: '{colorIndigo400}' },
  colorTextLinkInfoHover: { light: '{colorIndigo800}', dark: '{colorIndigo300}' },
  colorTextAccent: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorTextLinkDecorationDefault: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey600}' },

  // ── Selection / focus ─────────────────────────────────────────────────────
  colorBorderItemFocused: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBorderItemSelected: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundItemSelected: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey100}' },
  colorBackgroundLayoutToggleSelectedHover: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey100}' },
  colorBackgroundLayoutToggleSelectedActive: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey100}' },

  // ── Segmented control ─────────────────────────────────────────────────────
  colorBackgroundSegmentActive: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },

  // ── Slider / progress ─────────────────────────────────────────────────────
  colorBackgroundSliderRangeDefault: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundSliderHandleDefault: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundProgressBarValueDefault: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },

  // ── Notifications ─────────────────────────────────────────────────────────
  colorBackgroundNotificationGreen: { light: '{colorSuccess700}', dark: '{colorSuccess700}' },
  colorBackgroundNotificationBlue: { light: '{colorIndigo800}', dark: '{colorIndigo800}' },
  colorTextNotificationDefault: { light: '{colorWhite}', dark: '{colorWhite}' },

  // ── Status text ───────────────────────────────────────────────────────────
  colorTextStatusInfo: { light: '{colorIndigo800}', dark: '{colorIndigo300}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess200}' },
  colorTextStatusWarning: { light: '{colorWarning800}', dark: '{colorWarning300}' },

  // ── Dropdown filter match ─────────────────────────────────────────────────
  colorTextDropdownItemFilterMatch: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundDropdownItemFilterMatch: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey1000}' },

  // ── Status indicator backgrounds (alpha values — no palette token available) ──
  colorBackgroundStatusIndicatorInfo: { light: '#5c7fff20', dark: '#5c7fff20' },
  colorBackgroundStatusIndicatorWarning: { light: '#fbd33220', dark: '#fbd33220' },
  colorBackgroundStatusIndicatorSuccess: { light: '#2bb53420', dark: '#2bb53420' },
  colorBackgroundStatusIndicatorError: { light: '#ff7a7a10', dark: '#ff7a7a20' },
  colorBackgroundStatusIndicatorNeutral: { light: '#ff7a7a10', dark: '{colorNeutralGrey800}' },

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  colorTextBreadcrumbCurrent: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
