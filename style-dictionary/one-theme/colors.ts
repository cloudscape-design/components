// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

// One Theme color overrides on top of the visual-refresh baseline.
// Tokens not listed here fall back to the visual-refresh value via ThemeBuilder.addTokens in ./index.ts.
const tokens: StyleDictionary.ColorsDictionary = {
  // ── Body text ─────────────────────────────────────────────────────────────
  colorTextBodyDefault: { light: '#151515', dark: '#c9c9c9' },
  colorTextBodySecondary: { light: '#6b6b6b', dark: '#a9a9a9' },

  // ── Container / layout ────────────────────────────────────────────────────
  colorBackgroundContainerHeader: { light: '#ffffff', dark: '#151515' },
  colorBackgroundContainerContent: { light: '#ffffff', dark: '#151515' },
  colorBorderDividerDefault: { light: '#c9c9c9', dark: '#2d2d2d' },
  colorBorderLayout: { light: '#c9c9c9', dark: '#2d2d2d' },

  // ── Normal button ─────────────────────────────────────────────────────────
  colorBorderButtonNormalDefault: { light: '#494949', dark: '#3b3b3b' },
  colorBorderButtonNormalHover: { light: '#494949', dark: '#6b6b6b' },
  colorBorderButtonNormalActive: { light: '#494949', dark: '#6b6b6b' },
  colorBackgroundButtonNormalDefault: { light: '#ffffff', dark: '#1e1e1e' },
  colorBackgroundButtonNormalHover: { light: '#f8f8f8', dark: '#2d2d2d' },
  colorBackgroundButtonNormalActive: { light: '#ededed', dark: '#3b3b3b' },
  colorTextButtonNormalDefault: { light: '#3b3b3b', dark: '#e1e1e1' },
  colorTextButtonNormalHover: { light: '#3b3b3b', dark: '#e1e1e1' },
  colorTextButtonNormalActive: { light: '#3b3b3b', dark: '#e1e1e1' },

  // ── Primary button ────────────────────────────────────────────────────────
  colorBackgroundButtonPrimaryDefault: { light: '#242424', dark: '#e1e1e1' },
  colorBackgroundButtonPrimaryHover: { light: '#3b3b3b', dark: '#f5f5f5' },
  colorBackgroundButtonPrimaryActive: { light: '#242424', dark: '#e1e1e1' },
  colorTextButtonPrimaryDefault: { light: '#fcfcfc', dark: '#151515' },
  colorTextButtonPrimaryHover: { light: '#fcfcfc', dark: '#151515' },
  colorTextButtonPrimaryActive: { light: '#fcfcfc', dark: '#151515' },

  // ── Link button ───────────────────────────────────────────────────────────
  colorBackgroundButtonLinkDefault: { light: '#f8f8f8', dark: '#2d2d2d' },
  colorBackgroundButtonLinkHover: { light: '#ededed', dark: '#494949' },
  colorBackgroundButtonLinkActive: { light: '#ededed', dark: '#1a1a1a' },
  colorTextLinkButtonNormalDefault: { light: '#295eff', dark: '#5c7fff' },

  // ── Toggle button ─────────────────────────────────────────────────────────
  colorBackgroundToggleButtonNormalPressed: { light: '#ffffff', dark: '#1e1e1e' },
  colorBorderToggleButtonNormalPressed: { light: '#295eff', dark: '#5c7fff' },
  colorTextToggleButtonNormalPressed: { light: '#1a1a1a', dark: '#ffffff' },

  // ── Input / form ──────────────────────────────────────────────────────────
  colorBackgroundInputDefault: { light: '#ffffff', dark: '#151515' },
  colorBackgroundInputDisabled: { light: '#ededed', dark: '#242424' },
  colorBorderInputDefault: { light: '#b7b7b7', dark: '#6b6b6b' },
  colorTextFormLabel: { light: '#6b6b6b', dark: '#e1e1e1' },
  colorTextFormSecondary: { light: '#6b6b6b', dark: '#909090' },
  colorTextLabel: { light: '#6b6b6b', dark: '#909090' },
  colorTextKeyValuePairsValue: { light: '#6b6b6b', dark: '#e1e1e1' },

  // ── Controls ──────────────────────────────────────────────────────────────
  colorBackgroundControlChecked: { light: '#295eff', dark: '#5c7fff' },

  // ── Links ─────────────────────────────────────────────────────────────────
  colorTextLinkDefault: { light: '#151515', dark: '#c9c9c9' },
  colorTextLinkHover: { light: '#494949', dark: '#f5f5f5' },
  colorTextLinkSecondaryDefault: { light: '#6b6b6b', dark: '#a9a9a9' },
  colorTextLinkInfoDefault: { light: '#295eff', dark: '#7598ff' },
  colorTextLinkInfoHover: { light: '#0033cc', dark: '#94afff' },
  colorTextAccent: { light: '#295eff', dark: '#5c7fff' },
  colorTextLinkDecorationDefault: { light: '#494949', dark: '#6b6b6b' },

  // ── Selection / focus ─────────────────────────────────────────────────────
  colorBorderItemFocused: { light: '#295eff', dark: '#5c7fff' },
  colorBorderItemSelected: { light: '#295eff', dark: '#5c7fff' },
  colorBackgroundItemSelected: { light: '#f8f8f8', dark: '#080808' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '#242424', dark: '#f9f9f9' },
  colorBackgroundLayoutToggleSelectedHover: { light: '#242424', dark: '#f9f9f9' },
  colorBackgroundLayoutToggleSelectedActive: { light: '#242424', dark: '#f9f9f9' },

  // ── Segmented control ─────────────────────────────────────────────────────
  colorBackgroundSegmentActive: { light: '#242424', dark: '#e1e1e1' },
  colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },

  // ── Slider / progress ─────────────────────────────────────────────────────
  colorBackgroundSliderRangeDefault: { light: '#295eff', dark: '#5c7fff' },
  colorBackgroundSliderHandleDefault: { light: '#295eff', dark: '#5c7fff' },
  colorBackgroundProgressBarValueDefault: { light: '#295eff', dark: '#5c7fff' },

  // ── Notifications ─────────────────────────────────────────────────────────
  colorBackgroundNotificationGreen: { light: '#006b48', dark: '#006b48' },
  colorBackgroundNotificationBlue: { light: '#0033cc', dark: '#0033cc' },
  colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },

  // ── Status text ───────────────────────────────────────────────────────────
  colorTextStatusInfo: { light: '#0033cc', dark: '#94afff' },
  colorTextStatusSuccess: { light: '#00802f', dark: '#aeffa8' },
  colorTextStatusWarning: { light: '#9e6900', dark: '#ffed4d' },

  // ── Dropdown filter match ─────────────────────────────────────────────────
  colorTextDropdownItemFilterMatch: { light: '#295eff', dark: '#5c7fff' },
  colorBackgroundDropdownItemFilterMatch: { light: '#f5f5f5', dark: '#080808' },

  // ── Status indicator backgrounds ──────────────────────────────────────────
  colorBackgroundStatusIndicatorInfo: { light: '#5c7fff20', dark: '#5c7fff20' },
  colorBackgroundStatusIndicatorWarning: { light: '#fbd33220', dark: '#fbd33220' },
  colorBackgroundStatusIndicatorSuccess: { light: '#2bb53420', dark: '#2bb53420' },
  colorBackgroundStatusIndicatorError: { light: '#ff7a7a10', dark: '#ff7a7a20' },
  colorBackgroundStatusIndicatorNeutral: { light: '#ff7a7a10', dark: '#242424' },

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  colorTextBreadcrumbCurrent: { light: '#6b6b6b', dark: '#909090' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
