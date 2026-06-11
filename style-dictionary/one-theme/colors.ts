// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/colors.js';

// One Theme color overrides. The full visual-refresh color set is merged in as the
// base (parentTokens) and the entries below override it. This keeps One Theme a
// standalone theme (no runtime buildVisualRefresh layering) — same pattern as classic.
const tokens: StyleDictionary.ColorsDictionary = {
  // ── Body text ─────────────────────────────────────────────────────────────
  colorTextBodyDefault: { light: '{colorNeutralGrey950}', dark: '{colorNeutralGrey350}' },
  colorTextBodySecondary: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey450}' },

  // ── Container / layout ────────────────────────────────────────────────────
  colorBackgroundLayoutMain: { light: '{colorNeutralGrey50}', dark: '{colorNeutralGrey950}' },
  colorBackgroundContainerHeader: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBackgroundContainerContent: { light: '{colorWhite}', dark: '{colorNeutralGrey950}' },
  colorBorderDividerDefault: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey750}' },
  colorBorderDividerInteractiveDefault: { light: '{colorNeutralGrey500}', dark: '{colorNeutralGrey600}' },
  colorBorderDividerSecondary: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey800}' },
  colorBorderLayout: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey750}' },
  colorGapGlobalDrawer: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey1000}' },

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
  colorBorderToggleButtonNormalPressed: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
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
  colorTextLinkInfoDefault: { light: '{colorIndigo600}', dark: '{colorIndigo400}' },
  colorTextLinkInfoHover: { light: '{colorIndigo800}', dark: '{colorIndigo300}' },
  colorTextAccent: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorTextLinkDecorationDefault: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey600}' },

  // ── Selection / focus ─────────────────────────────────────────────────────
  colorBorderItemFocused: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBorderItemSelected: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundItemSelected: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorIndigo100}', dark: '#5c7fff20' },
  colorBackgroundLayoutToggleSelectedHover: { light: '{colorIndigo200}', dark: '#5c7fff40' },
  colorBackgroundLayoutToggleSelectedActive: { light: '{colorIndigo100}', dark: '{colorIndigo1000}' },
  colorTextLayoutToggleSelected: { light: '{colorIndigo600}', dark: '{colorIndigo300}' },

  // ── Segmented control ─────────────────────────────────────────────────────
  colorBackgroundSegmentActive: { light: '{colorNeutralGrey800}', dark: '{colorNeutralGrey300}' },
  colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },

  // ── Slider / progress ─────────────────────────────────────────────────────
  colorBackgroundSliderRangeDefault: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundSliderHandleDefault: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundProgressBarValueDefault: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },

  // ── Notifications ─────────────────────────────────────────────────────────
  colorBackgroundNotificationGreen: { light: '{colorSuccess600}', dark: '{colorSuccess950}' },
  colorBackgroundNotificationBlue: { light: '{colorInfo600}', dark: '{colorInfo950}' },
  colorBackgroundNotificationRed: { light: '{colorError600}', dark: '{colorError950}' },
  colorBackgroundNotificationYellow: { light: '{colorWarning400}', dark: '{colorWarning950}' },
  colorTextNotificationDefault: { light: '{colorWhite}', dark: '{colorWhite}' },

  // ── Status text ───────────────────────────────────────────────────────────
  colorTextStatusInfo: { light: '{colorIndigo600}', dark: '{colorIndigo300}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: '{colorSuccess200}' },
  colorTextStatusWarning: { light: '{colorWarning800}', dark: '{colorWarning300}' },
  colorTextStatusError: { light: '{colorError600}', dark: '{colorError300}' },
  colorTextStatusInactive: { light: '{colorNeutralGrey650}', dark: '{colorNeutralGrey450}' },

  // ── Dropdown ─────────────────────────────────────────────────
  colorTextDropdownItemFilterMatch: { light: '{colorIndigo600}', dark: '{colorIndigo500}' },
  colorBackgroundDropdownItemFilterMatch: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey1000}' },
  colorBackgroundDropdownItemDefault: { light: '{colorWhite}', dark: '{colorNeutralGrey800}' },
  colorBackgroundDropdownItemHover: { light: '{colorNeutralGrey200}', dark: '{colorNeutralGrey900}' },

  // ── Status indicator backgrounds (alpha values — no palette token available) ──
  colorBackgroundStatusIndicatorInfo: { light: '{colorIndigo50}', dark: '#5c7fff20' },
  colorBackgroundStatusIndicatorWarning: { light: '{colorWarning50}', dark: '#fbd33220' },
  colorBackgroundStatusIndicatorSuccess: { light: '{colorSuccess50}', dark: '#2bb53420' },
  colorBackgroundStatusIndicatorError: { light: '{colorError50}', dark: '#ff7a7a20' },
  colorBackgroundStatusIndicatorNeutral: { light: '{colorNeutralGrey250}', dark: '{colorNeutralGrey800}' },

  // ── Table ─────────────────────────────────────────────────────────────────
  colorBackgroundCellShaded: { light: '{colorNeutralGrey150}', dark: '{colorNeutralGrey900}' },
  colorBorderCellShaded: { light: '{colorNeutralGrey300}', dark: '{colorNeutralGrey700}' },

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  colorTextBreadcrumbCurrent: { light: '{colorNeutralGrey600}', dark: '{colorNeutralGrey500}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
