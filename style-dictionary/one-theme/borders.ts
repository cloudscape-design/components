// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/borders.js';

const tokens: StyleDictionary.BordersDictionary = {
  // ── Border widths ─────────────────────────────────────────────────────────
  borderWidthButton: '1px',
  borderWidthToken: '1px',
  borderWidthAlert: '0px',
  borderItemWidth: '1px',
  borderWidthDropdown: '1px',
  borderWidthPopover: '1px',
  borderWidthAlertInlineStart: '2px',
  borderWidthItemSelected: '1px',
  borderWidthCardSelected: '1px',

  // ── Icon stroke widths ────────────────────────────────────────────────────
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
  borderRadiusInput: '2px',
  borderRadiusItem: '2px',
  borderRadiusPopover: '4px',
  borderRadiusSideNavigationItemCollapsed: '{borderRadiusItem}',
  borderRadiusStatusIndicator: '2px',
  borderRadiusTabsFocusRing: '4px',
  borderRadiusToken: '2px',
  borderRadiusTokenInline: '{borderRadiusToken}',
  borderRadiusTutorialPanelItem: '4px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
