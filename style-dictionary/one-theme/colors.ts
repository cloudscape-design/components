// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/colors.js';

// One Theme color overrides; the full visual-refresh color set (parentTokens) is the base.
const tokens: StyleDictionary.ColorsDictionary = {
  // ── Opaque ─────────────────────────────────────────────────────────────
  colorGreyOpaque70: { light: 'rgba(0, 0, 0, 0.7)', dark: 'rgba(0, 0, 0, 0.7)' },

  // ── Body text ─────────────────────────────────────────────────────────────
  colorTextBodyDefault: { light: '{colorNeutral850}', dark: '{colorNeutral350}' },
  colorTextBodySecondary: { light: '{colorNeutral600}', dark: '{colorNeutral450}' },

  // ── Container / layout ────────────────────────────────────────────────────
  colorBackgroundLayoutMain: { light: '{colorNeutral50}', dark: '{colorNeutral1000}' },
  colorBackgroundLayoutAiDrawer: { light: '{colorNeutral50}', dark: '{colorNeutral1000}' },
  colorBackgroundLayoutPanelContent: { light: '{colorNeutral50}', dark: '{colorNeutral1000}' },

  colorBackgroundContainerHeader: { light: '{colorWhite}', dark: '{colorNeutral950}' },
  colorBackgroundContainerContent: { light: '{colorWhite}', dark: '{colorNeutral950}' },
  colorBorderDividerDefault: { light: '{colorNeutral300}', dark: '{colorNeutral750}' },
  colorBorderDividerInteractiveDefault: { light: '{colorNeutral300}', dark: '{colorNeutral750}' },
  colorBorderDividerSecondary: { light: '{colorNeutral250}', dark: '{colorNeutral800}' },
  colorBorderDividerTableGroup: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },
  colorBorderLayout: { light: '{colorNeutral300}', dark: '{colorNeutral750}' },
  colorGapGlobalDrawer: { light: '{colorNeutral250}', dark: '{colorBlack}' },
  colorBackgroundModalOverlay: '{colorGreyOpaque70}',

  // ── Normal button ─────────────────────────────────────────────────────────
  colorBorderButtonNormalDefault: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },
  colorBorderButtonNormalHover: { light: '{colorNeutral600}', dark: '{colorNeutral500}' },
  colorBorderButtonNormalActive: { light: '{colorNeutral400}', dark: '{colorNeutral500}' },
  colorBorderButtonNormalDisabled: { light: '{colorNeutral400}', dark: '{colorNeutral700}' },
  colorBackgroundButtonNormalDefault: { light: '{colorNeutral100}', dark: '{colorNeutral850}' },
  colorBackgroundButtonNormalHover: { light: '{colorNeutral150}', dark: '{colorNeutral800}' },
  colorBackgroundButtonNormalActive: { light: '{colorNeutral200}', dark: '{colorNeutral850}' },
  colorBackgroundButtonNormalDisabled: { light: '{colorWhite}', dark: '{colorNeutral950}' },
  colorTextButtonNormalDefault: { light: '{colorNeutral700}', dark: '{colorNeutral350}' },
  colorTextButtonNormalHover: { light: '{colorNeutral850}', dark: '{colorNeutral250}' },
  colorTextButtonNormalActive: { light: '{colorNeutral850}', dark: '{colorNeutral350}' },
  colorTextButtonNormalDisabled: { light: '{colorNeutral450}', dark: '{colorNeutral600}' },

  // Inline-link and icon buttons adopt the link hover color in one-theme.
  colorTextButtonInlineLinkHover: '{colorTextLinkHover}',
  colorTextButtonIconHover: '{colorTextLinkHover}',

  // ── Tertiary button ─────────────────────────────────────────────────────────
  colorBackgroundButtonLinkDefault: { light: 'transparent', dark: 'transparent' },
  colorBackgroundButtonLinkHover: { light: '{colorNeutral150}', dark: '{colorNeutral800}' },
  colorBackgroundButtonLinkActive: { light: '{colorNeutral250}', dark: '{colorNeutral850}' },
  colorBackgroundButtonLinkDisabled: { light: 'transparent', dark: 'transparent' },
  colorTextButtonLinkDefault: { light: '{colorNeutral700}', dark: '{colorNeutral350}' },
  colorTextButtonLinkHover: { light: '{colorNeutral700}', dark: '{colorNeutral250}' },
  colorTextButtonLinkActive: { light: '{colorNeutral700}', dark: '{colorNeutral300}' },
  colorTextButtonLinkDisabled: { light: '{colorNeutral500}', dark: '{colorNeutral650}' },

  // ── Primary button ────────────────────────────────────────────────────────
  colorBackgroundButtonPrimaryDefault: { light: '{colorNeutral800}', dark: '{colorNeutral300}' },
  colorBackgroundButtonPrimaryHover: { light: '{colorNeutral700}', dark: '{colorNeutral200}' },
  colorBackgroundButtonPrimaryActive: { light: '{colorNeutral800}', dark: '{colorNeutral300}' },
  colorBackgroundButtonPrimaryDisabled: { light: '{colorNeutral400}', dark: '{colorNeutral700}' },
  colorTextButtonPrimaryDefault: { light: '{colorNeutral100}', dark: '{colorNeutral950}' },
  colorTextButtonPrimaryHover: { light: '{colorNeutral50}', dark: '{colorNeutral950}' },
  colorTextButtonPrimaryActive: { light: '{colorNeutral50}', dark: '{colorNeutral950}' },
  colorTextButtonPrimaryDisabled: { light: '{colorNeutral100}', dark: '{colorNeutral950}' },

  // ── Toggle button ─────────────────────────────────────────────────────────
  colorBackgroundToggleButtonNormalPressed: { light: '{colorWhite}', dark: '{colorNeutral1000}' },
  colorBorderToggleButtonNormalPressed: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorTextToggleButtonNormalPressed: { light: '{colorNeutral900}', dark: '{colorWhite}' },

  // ── Toggle ─────────────────────────────────────────────────────────
  colorBackgroundToggleCheckedDisabled: {
    light: '{colorBackgroundControlDisabled}',
    dark: '{colorBackgroundControlDisabled}',
  },
  colorBackgroundToggleDefault: { light: '{colorNeutral650}', dark: '{colorNeutral500}' },

  // ── Input / form ──────────────────────────────────────────────────────────
  colorBackgroundInputDefault: { light: '{colorWhite}', dark: '{colorNeutral950}' },
  colorBackgroundInputDisabled: { light: '{colorNeutral250}', dark: '{colorNeutral800}' },
  colorBorderInputDefault: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },
  colorTextFormLabel: { light: '{colorNeutral850}', dark: '{colorNeutral350}' },
  colorTextFormSecondary: { light: '{colorNeutral600}', dark: '{colorNeutral500}' },
  colorTextLabel: { light: '{colorNeutral600}', dark: '{colorNeutral500}' },
  colorTextKeyValuePairsValue: { light: '{colorNeutral950}', dark: '{colorNeutral350}' },
  colorBorderInputFocused: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },

  // ── Controls ──────────────────────────────────────────────────────────────
  colorBackgroundControlChecked: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundControlDefault: { light: '{colorWhite}', dark: '{colorNeutral950}' },
  colorBackgroundControlDisabled: { light: '{colorNeutral300}', dark: '{colorNeutral650}' },
  colorBorderControlDefault: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },

  // ── Links ─────────────────────────────────────────────────────────────────
  colorTextLinkDefault: { light: '{colorNeutral850}', dark: '{colorNeutral350}' },
  colorTextLinkHover: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkSecondaryDefault: { light: '{colorNeutral850}', dark: '{colorNeutral350}' },
  colorTextLinkSecondaryHover: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkInfoDefault: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkInfoHover: { light: '{colorPrimary800}', dark: '{colorPrimary300}' },
  colorTextAccent: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkDecorationDefault: { light: '{colorNeutral650}', dark: '{colorNeutral600}' },

  // ── Selection / focus ─────────────────────────────────────────────────────
  colorBorderItemFocused: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBorderItemSelected: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBorderItemPlaceholder: '{colorTransparent}',
  colorBackgroundItemSelected: { light: '{colorNeutral150}', dark: '{colorNeutral1000}' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorPrimary500}', dark: '{colorPrimary500}' },
  colorBackgroundLayoutToggleSelectedHover: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorBackgroundLayoutToggleSelectedActive: { light: '{colorPrimary500}', dark: '{colorPrimary500}' },
  colorTextLayoutToggleSelected: { light: '{colorWhite}', dark: '{colorNeutral950}' },
  colorItemSelected: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },

  // ── Segmented control ─────────────────────────────────────────────────────
  colorBackgroundSegmentActive: { light: '{colorNeutral800}', dark: '{colorNeutral300}' },
  colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },
  colorTextSegmentActive: { light: '{colorNeutral200}', dark: '{colorNeutral950}' },
  colorTextSegmentDefault: { light: '{colorNeutral600}', dark: '{colorNeutral300}' },
  colorTextSegmentHover: '{colorTextButtonNormalHover}',

  // ── Slider / progress ─────────────────────────────────────────────────────
  colorBackgroundSliderRangeDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundSliderHandleDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundProgressBarValueDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },

  // ── Badge ─────────────────────────────────────────────────────────
  colorBackgroundBadgeGreen: { light: '{colorSuccess100}', dark: 'rgba(43, 181, 52, 0.2)' },
  colorBackgroundBadgeBlue: { light: '{colorInfo100}', dark: 'rgba(92, 127, 255, 0.2)' },
  colorBackgroundBadgeRed: { light: '{colorError100}', dark: 'rgba(255, 61, 61, 0.2)' },
  colorBackgroundBadgeYellow: { light: '{colorWarning100}', dark: 'rgba(251, 211, 50, 0.2)' },
  colorBackgroundBadgeGrey: { light: '{colorNeutral250}', dark: '{colorNeutral700}' },
  colorTextNotificationDefault: { light: '{colorNeutral100}', dark: '{colorNeutral100}' },

  colorTextBadgeGreen: { light: '{colorSuccess600}', dark: '{colorSuccess200}' },
  colorTextBadgeBlue: { light: '{colorInfo600}', dark: '{colorInfo300}' },
  colorTextBadgeRed: { light: '{colorError700}', dark: '{colorError400}' },
  colorTextBadgeGrey: { light: '{colorNeutral850}', dark: '{colorNeutral300}' },

  // ── Flashbar (one-theme: subtle alert-style backgrounds) ───────────────────
  colorBackgroundFlashbarSuccess: { light: '{colorSuccess100}', dark: '{colorSuccess950}' },
  colorBackgroundFlashbarError: { light: '{colorError100}', dark: '{colorError950}' },
  colorBackgroundFlashbarInfo: { light: '{colorInfo100}', dark: '{colorInfo950}' },
  colorBackgroundFlashbarWarning: { light: '{colorWarning100}', dark: '{colorWarning950}' },

  // ── Status text ───────────────────────────────────────────────────────────
  colorTextStatusInfo: { light: '{colorInfo600}', dark: '{colorInfo300}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess200}' },
  colorTextStatusWarning: { light: '{colorWarning800}', dark: '{colorWarning300}' },
  colorTextStatusError: { light: '{colorError600}', dark: '{colorError400}' },
  colorTextStatusInactive: { light: '{colorNeutral650}', dark: '{colorNeutral450}' },

  // ── Dropdown & Popover ─────────────────────────────────────────────────
  colorTextDropdownItemFilterMatch: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundDropdownItemFilterMatch: { light: '{colorNeutral200}', dark: '{colorNeutral1000}' },
  colorBackgroundDropdownItemDefault: { light: '{colorWhite}', dark: '{colorNeutral800}' },
  colorBackgroundDropdownItemHover: { light: '{colorNeutral200}', dark: '{colorNeutral900}' },
  colorBackgroundPopover: { light: '{colorWhite}', dark: '{colorNeutral800}' },
  colorBorderPopover: { light: '{colorNeutral400}', dark: '{colorNeutral600}' },

  // ── Status indicator backgrounds (alpha values — no palette token available) ──
  colorBackgroundStatusIndicatorInfo: { light: '{colorInfo50}', dark: '#5c7fff20' },
  colorBackgroundStatusIndicatorWarning: { light: '{colorWarning50}', dark: '#fbd33220' },
  colorBackgroundStatusIndicatorSuccess: { light: '{colorSuccess50}', dark: '#2bb53420' },
  colorBackgroundStatusIndicatorError: { light: '{colorError50}', dark: '#ff7a7a20' },
  colorBackgroundStatusIndicatorNeutral: { light: '{colorNeutral250}', dark: '{colorNeutral800}' },

  // ── Table ─────────────────────────────────────────────────────────────────
  colorBackgroundCellShaded: { light: '{colorNeutral150}', dark: '{colorNeutral900}' },
  colorBorderCellShaded: { light: '{colorNeutral300}', dark: '{colorNeutral700}' },

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  colorTextBreadcrumbCurrent: { light: '{colorNeutral950}', dark: '{colorNeutral250}' },

  // ── Tile ─────────────────────────────────────────────────────────────────
  colorBackgroundTilesDisabled: { light: '{colorNeutral250}', dark: '{colorNeutral800}' },

  // ── Side Nav ─────────────────────────────────────────────────────────────────
  colorTextSideNavigationItemActive: { light: '{colorPrimary600}', dark: '{colorPrimary300}' },
  colorTextSideNavigationItemActiveCollapsed: { light: '{colorNeutral100}', dark: '{colorNeutral1000}' },
  colorTextSideNavigationItemDefault: { light: '{colorTextBodyDefault}', dark: '{colorTextBodyDefault}' },
  colorBackgroundSideNavigationItemActive: { light: 'transparent', dark: 'transparent' },
  colorBackgroundSideNavigationItemActiveCollapsed: { light: '{colorPrimary500}', dark: '{colorPrimary500}' },

  // ── Dropzone ──────────────────────────────────────────────────────────────
  colorDropzoneBackgroundDefault: { light: '{colorWhite}', dark: '{colorNeutral850}' },
  colorDropzoneBackgroundHover: { light: '{colorPrimary50}', dark: '{colorPrimary1000}' },
  colorDropzoneTextDefault: { light: '{colorNeutral650}', dark: '{colorNeutral350}' },
  colorDropzoneTextHover: { light: '{colorNeutral650}', dark: '{colorNeutral350}' },
  colorDropzoneBorderDefault: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },
  colorDropzoneBorderHover: { light: '{colorPrimary900}', dark: '{colorPrimary300}' },

  // ── Code view ─────────────────────────────────────────────────────────────
  colorBackgroundCodeView: { light: '{colorNeutral200}', dark: '{colorNeutral700}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
