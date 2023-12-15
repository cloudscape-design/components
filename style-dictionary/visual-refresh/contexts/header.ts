// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentColorTokens } from '../colors';
import { tokens as parentShadowsTokens } from '../shadows';
import merge from 'lodash/merge';
import { expandColorDictionary, pickState } from '../../utils';

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
