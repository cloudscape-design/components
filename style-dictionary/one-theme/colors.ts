// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { neutralExtra, statusExtra } from './color-palette.js';

// Anything not listed here falls back to the visual-refresh value via ThemeBuilder.addTokens in ./index.ts.
// Palette references use the one-theme referenceTokens defined in ./color-palette.ts:
//   {colorNeutral*}  → neutral ramp (near-black #151515 at 50 → white #ffffff at 1000)
//   {colorPrimary*}  → indigo ramp  (#0033CC at 800 → #94AFFF at 300)
//   {colorSuccess*}  → green ramp   (from core palette)
//   {colorWarning*}  → yellow ramp  (from core palette)
// Values outside PaletteStep range use neutralExtra named constants.
const tokens: StyleDictionary.ColorsDictionary = {
  // ── Text ──────────────────────────────────────────────────────────────────
  colorTextBodyDefault: { light: '{colorNeutral50}', dark: '{colorNeutral800}' },
  colorTextBodySecondary: { light: '{colorNeutral600}', dark: '{colorNeutral700}' },

  // ── Container ─────────────────────────────────────────────────────────────
  colorBackgroundContainerHeader: { light: '{colorNeutral1000}', dark: '{colorNeutral50}' },
  colorBackgroundContainerContent: { light: '{colorNeutral1000}', dark: '{colorNeutral50}' },
  colorBorderDividerDefault: { light: '{colorNeutral800}', dark: '{colorNeutral300}' },
  colorBorderLayout: { light: '{colorNeutral800}', dark: '{colorNeutral300}' },

  // ── Normal button ─────────────────────────────────────────────────────────
  colorBorderButtonNormalDefault: { light: '{colorNeutral500}', dark: '{colorNeutral400}' },
  colorBorderButtonNormalHover: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },
  colorBorderButtonNormalActive: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },
  colorBackgroundButtonNormalDefault: { light: '{colorNeutral1000}', dark: '{colorNeutral150}' },
  colorBackgroundButtonNormalHover: { light: neutralExtra.nearWhite1, dark: '{colorNeutral300}' },
  colorBackgroundButtonNormalActive: { light: '{colorNeutral900}', dark: '{colorNeutral400}' },
  colorTextButtonNormalDefault: { light: '{colorNeutral400}', dark: '{colorNeutral850}' },
  colorTextButtonNormalHover: { light: '{colorNeutral400}', dark: '{colorNeutral850}' },
  colorTextButtonNormalActive: { light: '{colorNeutral400}', dark: '{colorNeutral850}' },

  // ── Primary button ────────────────────────────────────────────────────────
  colorBackgroundButtonPrimaryDefault: { light: '{colorNeutral200}', dark: '{colorNeutral850}' },
  colorBackgroundButtonPrimaryHover: { light: '{colorNeutral400}', dark: '{colorNeutral950}' },
  colorBackgroundButtonPrimaryActive: { light: '{colorNeutral200}', dark: '{colorNeutral850}' },
  colorTextButtonPrimaryDefault: { light: neutralExtra.nearWhite3, dark: '{colorNeutral50}' },
  colorTextButtonPrimaryHover: { light: neutralExtra.nearWhite3, dark: '{colorNeutral50}' },
  colorTextButtonPrimaryActive: { light: neutralExtra.nearWhite3, dark: '{colorNeutral50}' },

  // ── Link button ───────────────────────────────────────────────────────────
  colorBackgroundButtonLinkDefault: { light: neutralExtra.nearWhite1, dark: '{colorNeutral300}' },
  colorBackgroundButtonLinkHover: { light: '{colorNeutral900}', dark: '{colorNeutral500}' },
  colorBackgroundButtonLinkActive: { light: '{colorNeutral900}', dark: '{colorNeutral100}' },
  colorTextLinkButtonNormalDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },

  // ── Input ─────────────────────────────────────────────────────────────────
  colorBackgroundInputDefault: { light: '{colorNeutral1000}', dark: '{colorNeutral50}' },
  colorBackgroundInputDisabled: { light: '{colorNeutral900}', dark: '{colorNeutral200}' },
  colorBorderInputDefault: { light: '{colorNeutral750}', dark: '{colorNeutral600}' },

  // ── Toggle button ─────────────────────────────────────────────────────────
  colorBackgroundToggleButtonNormalPressed: { light: '{colorNeutral1000}', dark: '{colorNeutral150}' },
  colorBorderToggleButtonNormalPressed: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorTextToggleButtonNormalPressed: { light: '{colorNeutral100}', dark: '{colorNeutral1000}' },

  // ── Control ───────────────────────────────────────────────────────────────
  colorBackgroundControlChecked: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },

  // ── Labels ────────────────────────────────────────────────────────────────
  colorTextLabel: { light: '{colorNeutral600}', dark: '{colorNeutral650}' },
  colorTextKeyValuePairsValue: { light: '{colorNeutral600}', dark: '{colorNeutral850}' },
  colorTextFormLabel: { light: '{colorNeutral600}', dark: '{colorNeutral850}' },
  colorTextFormSecondary: { light: '{colorNeutral600}', dark: '{colorNeutral650}' },

  // ── Links ─────────────────────────────────────────────────────────────────
  colorTextLinkDefault: { light: '{colorNeutral50}', dark: '{colorNeutral800}' },
  colorTextLinkHover: { light: '{colorNeutral500}', dark: '{colorNeutral950}' },
  colorTextLinkSecondaryDefault: { light: '{colorNeutral600}', dark: '{colorNeutral700}' },
  colorTextLinkInfoDefault: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkInfoHover: { light: '{colorPrimary800}', dark: '{colorPrimary300}' },
  colorTextAccent: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorTextLinkDecorationDefault: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },

  // ── Focus / selection ─────────────────────────────────────────────────────
  colorBorderItemFocused: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBorderItemSelected: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundItemSelected: { light: neutralExtra.nearWhite1, dark: neutralExtra.nearBlack },

  // ── Layout toggle ─────────────────────────────────────────────────────────
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorNeutral200}', dark: neutralExtra.nearWhite2 },
  colorBackgroundLayoutToggleSelectedHover: { light: '{colorNeutral200}', dark: neutralExtra.nearWhite2 },
  colorBackgroundLayoutToggleSelectedActive: { light: '{colorNeutral200}', dark: neutralExtra.nearWhite2 },

  // ── Segment ───────────────────────────────────────────────────────────────
  colorBackgroundSegmentActive: { light: '{colorNeutral200}', dark: '{colorNeutral850}' },
  colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },

  // ── Slider ────────────────────────────────────────────────────────────────
  colorBackgroundSliderRangeDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundSliderHandleDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },

  // ── Progress bar ──────────────────────────────────────────────────────────
  colorBackgroundProgressBarValueDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },

  // ── Notifications ─────────────────────────────────────────────────────────
  colorBackgroundNotificationGreen: { light: '{colorSuccess600}', dark: '{colorSuccess600}' },
  colorBackgroundNotificationBlue: { light: '{colorPrimary800}', dark: '{colorPrimary800}' },
  colorTextNotificationDefault: { light: '{colorNeutral1000}', dark: '{colorNeutral1000}' },

  // ── Status text ───────────────────────────────────────────────────────────
  colorTextStatusInfo: { light: '{colorPrimary800}', dark: '{colorPrimary300}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: statusExtra.successDark },
  colorTextStatusWarning: { light: statusExtra.warningLight, dark: statusExtra.warningDark },

  // ── Dropdown filter match ─────────────────────────────────────────────────
  colorTextDropdownItemFilterMatch: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundDropdownItemFilterMatch: { light: '{colorNeutral950}', dark: neutralExtra.nearBlack },

  // ── Status indicator backgrounds (8-digit hex not supported; use rgba) ────
  colorBackgroundStatusIndicatorInfo: { light: 'rgba(92, 127, 255, 0.13)', dark: 'rgba(92, 127, 255, 0.13)' },
  colorBackgroundStatusIndicatorWarning: { light: 'rgba(251, 211, 50, 0.13)', dark: 'rgba(251, 211, 50, 0.13)' },
  colorBackgroundStatusIndicatorSuccess: { light: 'rgba(43, 181, 52, 0.13)', dark: 'rgba(43, 181, 52, 0.13)' },
  colorBackgroundStatusIndicatorError: { light: 'rgba(255, 122, 122, 0.06)', dark: 'rgba(255, 122, 122, 0.13)' },
  colorBackgroundStatusIndicatorNeutral: { light: 'rgba(255, 122, 122, 0.06)', dark: '{colorNeutral200}' },

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  colorTextBreadcrumbCurrent: { light: '{colorNeutral600}', dark: '{colorNeutral650}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
