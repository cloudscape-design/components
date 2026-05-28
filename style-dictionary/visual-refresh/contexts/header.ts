// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentShadowsTokens } from '../shadows.js';

const background = '{colorNeutral950}';

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary({
  colorBackgroundLayoutMain: background,
  colorBackgroundButtonNormalDefault: background,
  colorBackgroundButtonNormalDisabled: background,
  colorBackgroundControlDefault: background,
  colorBackgroundInputDefault: background,
  colorBackgroundSegmentDefault: background,
  colorBackgroundSegmentDisabled: background,
  colorBackgroundTableHeader: background,
  colorBackgroundSegmentWrapper: background,
  shadowFlashSticky: parentShadowsTokens.shadowFlashSticky,
  shadowPanel: parentShadowsTokens.shadowPanel,
  shadowPanelToggle: parentShadowsTokens.shadowPanelToggle,
});

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
