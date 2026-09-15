// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/borders.js';

// core-update border overrides; the full visual-refresh set (parentTokens) is the base.
const tokens: StyleDictionary.BordersDictionary = {
  borderWidthButton: '1px',
  borderWidthToken: '1px',
  borderWidthAlert: '0px',
  borderItemWidth: '1px',
  borderWidthAlertInlineStart: '2px',
  borderWidthItemSelected: '1px',
  borderWidthCardSelected: '1px',

  borderRadiusAlert: '2px',
  borderRadiusBadge: '16px',
  borderRadiusButton: '8px',
  borderRadiusContainer: '12px',
  borderRadiusDropdown: '8px',
  borderRadiusDropzone: '8px',
  borderRadiusFlashbar: '4px',
  borderRadiusItem: '8px',
  borderRadiusInput: '8px',
  borderRadiusPopover: '8px',
  borderRadiusTabsFocusRing: '10px',
  borderRadiusToken: '8px',
  borderRadiusTutorialPanelItem: '4px',

  borderWidthIconSmall: '1.5px',
  borderWidthIconNormal: '1.5px',
  borderWidthIconMedium: '1.75px',
  borderWidthIconBig: '2px',
  borderWidthIconLarge: '2.5px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
