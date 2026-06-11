// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

// One Theme color overrides on top of the visual-refresh baseline.
// Tokens not listed here fall back to the visual-refresh value via ThemeBuilder.addTokens in ./index.ts.
const tokens: StyleDictionary.ColorsDictionary = {
  // ── Opaque ─────────────────────────────────────────────────────────────
  colorGreyOpaque70: { light: 'rgba(0, 0, 0, 0.7)', dark: 'rgba(0, 0, 0, 0.7)' },

  // ── Body text ─────────────────────────────────────────────────────────────
  colorTextBodyDefault: { light: '{colorNeutralGrey850}', dark: '{colorNeutralGrey350}' },
  colorTextBodySecondary: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey450}' },

  // ── Container / layout ────────────────────────────────────────────────────
  colorBackgroundLayoutMain: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundLayoutPanelContent: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey1000}' },

  colorBackgroundContainerHeader: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundContainerContent: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBorderDividerDefault: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey750}' },
  colorBorderDividerInteractiveDefault: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey600}' },
  colorBorderDividerSecondary: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey800}' },
  colorBorderLayout: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey750}' },
  colorGapGlobalDrawer: { light: '{colorNeutralGrey250}', dark: '#000000' },
  colorBackgroundModalOverlay: '{colorGreyOpaque70}',

  // ── Normal button ─────────────────────────────────────────────────────────
  colorBorderButtonNormalDefault: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey600}' },
  colorBorderButtonNormalHover: { light: '{colorNeutralGrey550}', dark: '{colorNeutralGrey500}' },
  colorBorderButtonNormalActive: { light: '{colorNeutralGrey400}', dark: '{colorNeutralGrey500}' },
  colorBorderButtonNormalDisabled: { light: '{colorNeutralGrey400}', dark: '{colorNeutralGrey700}' },
  colorBackgroundButtonNormalDefault: { light: '{colorNeutralGrey100}', dark: '{colorNeutralGrey850}' },
  colorBackgroundButtonNormalHover: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey800}' },
  colorBackgroundButtonNormalActive: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey850}' },
  colorBackgroundButtonNormalDisabled: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorTextButtonNormalDefault: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey350}' },
  colorTextButtonNormalHover: { light: '{colorNeutralGrey850}', dark: '{colorNeutralGrey250}' },
  colorTextButtonNormalActive: { light: '{colorNeutralGrey850}', dark: '{colorNeutralGrey350}' },
  colorTextButtonNormalDisabled: { light: '{colorNeutralGrey450}', dark: '{colorNeutralGrey600}' },

  // ── Tertiary button ─────────────────────────────────────────────────────────
  colorBackgroundButtonLinkDefault: { light: 'transparent', dark: 'transparent' },
  colorBackgroundButtonLinkHover: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey800}' },
  colorBackgroundButtonLinkActive: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey850}' },
  colorBackgroundButtonLinkDisabled: { light: 'transparent', dark: 'transparent' },
  colorTextButtonLinkDefault: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey350}' },
  colorTextButtonLinkHover: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey250}' },
  colorTextButtonLinkActive: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey300}' },
  colorTextButtonLinkDisabled: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey650}' },

  // ── Primary button ────────────────────────────────────────────────────────
  colorBackgroundButtonPrimaryDefault: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorBackgroundButtonPrimaryHover: { light: '{colorNeutralGrey700}', dark: '{colorNeutralGrey200}' },
  colorBackgroundButtonPrimaryActive: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorBackgroundButtonPrimaryDisabled: { light: '{colorNeutralGrey400}', dark: '{colorNeutralGrey700}' },
  colorTextButtonPrimaryDefault: { light: '{colorNeutralGrey100}', dark: '{colorNeutralGrey950}' },
  colorTextButtonPrimaryHover: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey950}' },
  colorTextButtonPrimaryActive: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey950}' },
  colorTextButtonPrimaryDisabled: { light: '{colorNeutralGrey100}', dark: '{colorNeutralGrey950}' },

  // ── Toggle button ─────────────────────────────────────────────────────────
  colorBackgroundToggleButtonNormalPressed: { light: '{colorWhite}', dark: '{colorNeutralGrey850}' },
  colorBorderToggleButtonNormalPressed: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorTextToggleButtonNormalPressed: { light: '{colorNeutralGrey900}', dark: '{colorWhite}' },

  // ── Input / form ──────────────────────────────────────────────────────────
  colorBackgroundInputDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundInputDisabled: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey800}' },
  colorBorderInputDefault: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey600}' },
  colorTextFormLabel: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey300}' },
  colorTextFormSecondary: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
  colorTextLabel: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
  colorTextKeyValuePairsValue: { light: '{colorNeutralGrey950}', dark: '{colorNeutralGrey350}' },

  // ── Controls ──────────────────────────────────────────────────────────────
  colorBackgroundControlChecked: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundControlDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBorderControlDefault: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey600}' },

  // ── Links ─────────────────────────────────────────────────────────────────
  colorTextLinkDefault: { light: '{colorNeutralGrey950}', dark: '{colorNeutralGrey350}' },
  colorTextLinkHover: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey200}' },
  colorTextLinkSecondaryDefault: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey450}' },
  colorTextLinkInfoDefault: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkInfoHover: { light: '{colorPrimary800}', dark: '{colorPrimary300}' },
  colorTextAccent: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorTextLinkDecorationDefault: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey600}' },

  // ── Selection / focus ─────────────────────────────────────────────────────
  colorBorderItemFocused: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBorderItemSelected: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundItemSelected: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorPrimary100}', dark: '#5c7fff20' },
  colorBackgroundLayoutToggleSelectedHover: { light: '{colorPrimary200}', dark: '#5c7fff40' },
  colorBackgroundLayoutToggleSelectedActive: { light: '{colorPrimary100}', dark: '{colorPrimary1000}' },
  colorTextLayoutToggleSelected: { light: '{colorPrimary600}', dark: '{colorPrimary300}' },

  // ── Segmented control ─────────────────────────────────────────────────────
  colorBackgroundSegmentActive: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },

  // ── Slider / progress ─────────────────────────────────────────────────────
  colorBackgroundSliderRangeDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundSliderHandleDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundProgressBarValueDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },

  // ── Notifications ─────────────────────────────────────────────────────────
  colorBackgroundNotificationGreen: { light: '{colorSuccess600}', dark: '{colorSuccess950}' },
  colorBackgroundNotificationBlue: { light: '{colorInfo600}', dark: '{colorInfo950}' },
  colorBackgroundNotificationRed: { light: '{colorError600}', dark: '{colorError950}' },
  colorBackgroundNotificationYellow: { light: '{colorWarning400}', dark: '{colorWarning950}' },
  colorTextNotificationDefault: { light: '{colorWhite}', dark: '{colorWhite}' },

  // ── Status text ───────────────────────────────────────────────────────────
  colorTextStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo300}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess200}' },
  colorTextStatusWarning: { light: '{colorWarning800}', dark: '{colorWarning300}' },
  colorTextStatusError: { light: '{colorError600}', dark: '{colorError400}' },
  colorTextStatusInactive: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey450}' },

  // ── Dropdown ─────────────────────────────────────────────────
  colorTextDropdownItemFilterMatch: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundDropdownItemFilterMatch: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundDropdownItemDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey800}' },
  colorBackgroundDropdownItemHover: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey900}' },

  // ── Status indicator backgrounds (alpha values — no palette token available) ──
  colorBackgroundStatusIndicatorInfo: { light: '{colorInfo50}', dark: '#5c7fff20' },
  colorBackgroundStatusIndicatorWarning: { light: '{colorWarning50}', dark: '#fbd33220' },
  colorBackgroundStatusIndicatorSuccess: { light: '{colorSuccess50}', dark: '#2bb53420' },
  colorBackgroundStatusIndicatorError: { light: '{colorError50}', dark: '#ff7a7a20' },
  colorBackgroundStatusIndicatorNeutral: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey800}' },

  // ── Table ─────────────────────────────────────────────────────────────────
  colorBackgroundCellShaded: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey900}' },
  colorBorderCellShaded: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey700}' },

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  colorTextBreadcrumbCurrent: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },

  // ── Tile ─────────────────────────────────────────────────────────────────
  colorBackgroundTilesDisabled: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey800}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
