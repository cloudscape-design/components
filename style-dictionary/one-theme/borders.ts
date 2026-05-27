// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces.js';

// Border tokens are global (no color/density mode) so they are exported
// without a `mode` — the ThemeBuilder treats them as mode-independent overrides.
export const tokens: StyleDictionary.BordersDictionary = {
  // ── Border widths ─────────────────────────────────────────────────────────
  borderWidthButton: '1px',
  borderWidthToken: '1px',
  borderWidthAlert: '0px',
  borderWidthAlertBlockEnd: '0px',
  borderWidthAlertBlockStart: '0px',
  borderWidthAlertInlineEnd: '0px',
  borderWidthAlertInlineStart: '2px',
  borderWidthItemSelected: '1px',
  borderWidthCardSelected: '1px',
  borderItemWidth: '1px',

  // ── Icon stroke widths ────────────────────────────────────────────────────
  borderWidthIconXSmall: '1.5px',
  borderWidthIconSmall: '1.5px',
  borderWidthIconNormal: '1.5px',
  borderWidthIconMedium: '1.75px',
  borderWidthIconBig: '2px',
  borderWidthIconLarge: '2.5px',

  // ── Border radii ──────────────────────────────────────────────────────────
  borderRadiusAlert: '2px',
  borderRadiusBadge: '16px',
  borderRadiusButton: '2px',
  borderRadiusContainer: '4px',
  borderRadiusDropdown: '2px',
  borderRadiusDropzone: '4px',
  borderRadiusFlashbar: '2px',
  borderRadiusItem: '2px',
  borderRadiusInput: '2px',
  borderRadiusPopover: '4px',
  borderRadiusTabsFocusRing: '4px',
  borderRadiusToken: '2px',
  borderRadiusTutorialPanelItem: '4px',
  borderRadiusStatusIndicator: '2px',
};
