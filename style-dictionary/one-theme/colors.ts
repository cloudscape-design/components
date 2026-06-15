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
  colorTextBodyDefault: { light: '{colorNeutralGrey850}', dark: '{colorNeutralGrey350}' },
  colorTextBodySecondary: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey450}' },

  // ── Container / layout ────────────────────────────────────────────────────
  colorBackgroundLayoutMain: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundLayoutPanelContent: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey1000}' },

  colorBackgroundContainerHeader: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundContainerContent: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBorderDividerDefault: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey750}' },
  colorBorderDividerInteractiveDefault: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey750}' },
  colorBorderDividerSecondary: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey800}' },
  colorBorderLayout: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey750}' },
  colorGapGlobalDrawer: { light: '{colorNeutralGrey250}', dark: '{colorBlack}' },
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

  // ── Toggle ─────────────────────────────────────────────────────────
  colorBackgroundToggleCheckedDisabled: {
    light: '{colorBackgroundControlDisabled}',
    dark: '{colorBackgroundControlDisabled}',
  },
  colorBackgroundToggleDefault: { light: '{colorNeutral650}', dark: '{colorNeutral500}' },

  // ── Input / form ──────────────────────────────────────────────────────────
  colorBackgroundInputDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundInputDisabled: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey800}' },
  colorBorderInputDefault: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey600}' },
  colorTextFormLabel: { light: '{colorNeutralGrey850}', dark: '{colorNeutralGrey350}' },
  colorTextFormSecondary: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
  colorTextLabel: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
  colorTextKeyValuePairsValue: { light: '{colorNeutralGrey950}', dark: '{colorNeutralGrey350}' },
  colorBorderInputFocused: { light: '{colorIndigo600}', dark: '{colorIndigo400}' },

  // ── Controls ──────────────────────────────────────────────────────────────
  colorBackgroundControlChecked: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundControlDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundControlDisabled: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey650}' },
  colorBorderControlDefault: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey600}' },

  // ── Links ─────────────────────────────────────────────────────────────────
  colorTextLinkDefault: { light: '{colorNeutralGrey850}', dark: '{colorNeutralGrey350}' },
  colorTextLinkHover: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey200}' },
  colorTextLinkSecondaryDefault: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey450}' },
  colorTextLinkInfoDefault: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkInfoHover: { light: '{colorPrimary800}', dark: '{colorPrimary300}' },
  colorTextAccent: { light: '{colorPrimary600}', dark: '{colorPrimary400}' },
  colorTextLinkDecorationDefault: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey600}' },

  // ── Selection / focus ─────────────────────────────────────────────────────
  colorBorderItemFocused: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBorderItemSelected: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundItemSelected: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorPrimary100}', dark: '#5c7fff20' },
  colorBackgroundLayoutToggleSelectedHover: { light: '{colorPrimary200}', dark: '#5c7fff40' },
  colorBackgroundLayoutToggleSelectedActive: { light: '{colorPrimary100}', dark: '{colorPrimary1000}' },
  colorTextLayoutToggleSelected: { light: '{colorPrimary600}', dark: '{colorPrimary300}' },
  colorItemSelected: { light: '{colorIndigo600}', dark: '{colorIndigo400}' },

  // ── Segmented control ─────────────────────────────────────────────────────
  colorBackgroundSegmentActive: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },
  colorTextSegmentActive: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey950}' },
  colorTextSegmentDefault: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey300}' },
  colorTextSegmentHover: '{colorTextButtonNormalHover}',

  // ── Slider / progress ─────────────────────────────────────────────────────
  colorBackgroundSliderRangeDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundSliderHandleDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorBackgroundProgressBarValueDefault: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },

  // ── Notifications ─────────────────────────────────────────────────────────
  colorBackgroundNotificationGreen: { light: '{colorSuccess600}', dark: '{colorSuccess800}' },
  colorBackgroundNotificationBlue: { light: '{colorInfo600}', dark: '{colorInfo900}' },
  colorBackgroundNotificationRed: { light: '{colorError600}', dark: '{colorError800}' },
  colorBackgroundNotificationYellow: { light: '{colorWarning400}', dark: '{colorWarning900}' },
  colorTextNotificationDefault: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey250}' },

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
  colorTextBreadcrumbCurrent: { light: '{colorNeutralGrey950}', dark: '{colorNeutralGrey250}' },

  // ── Tile ─────────────────────────────────────────────────────────────────
  colorBackgroundTilesDisabled: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey800}' },

  // ── Dropzone ──────────────────────────────────────────────────────────────
  colorDropzoneBackgroundDefault: { light: '{colorWhite}', dark: '{colorNeutral850}' },
  colorDropzoneBackgroundHover: { light: '{colorPrimary50}', dark: '{colorPrimary1000}' },
  colorDropzoneTextDefault: { light: '{colorNeutral650}', dark: '{colorNeutral350}' },
  colorDropzoneTextHover: { light: '{colorNeutral650}', dark: '{colorNeutral350}' },
  colorDropzoneBorderDefault: { light: '{colorNeutral500}', dark: '{colorNeutral600}' },
  colorDropzoneBorderHover: { light: '{colorPrimary900}', dark: '{colorPrimary300}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
