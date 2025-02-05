// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary, pickState } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentColorTokens } from '../colors.js';
import { tokens as parentShadowsTokens } from '../shadows.js';

const background = '{colorGrey900}';

const colorTokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundLayoutMain: background,
  colorBackgroundButtonNormalDefault: background,
  colorBackgroundButtonNormalDisabled: background,
  colorBackgroundControlDefault: background,
  colorBackgroundInputDefault: background,
  colorBackgroundSegmentDefault: background,
  colorBackgroundSegmentDisabled: background,
  colorBackgroundTableHeader: background,
};

const shadowsTokens: StyleDictionary.ShadowsDictionary = {
  shadowFlashSticky: parentShadowsTokens.shadowFlashSticky,
  shadowPanel: parentShadowsTokens.shadowPanel,
  shadowPanelToggle: parentShadowsTokens.shadowPanelToggle,
};

const darkModeColorValues = pickState(parentColorTokens, 'dark');
const darkModeShadowsValues = pickState(parentShadowsTokens, 'dark');

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, darkModeShadowsValues, darkModeColorValues, shadowsTokens, colorTokens)
);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
