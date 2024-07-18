// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../spacing';
import merge from 'lodash/merge';
import { expandDensityDictionary, expandColorDictionary } from '../../utils';

const colorTokens: StyleDictionary.ColorsDictionary = {
  colorBorderPanelHeader: 'transparent',
};
const shadowTokens: StyleDictionary.ShadowsDictionary = {
  shadowSplitSide: {
    light: 'none',
    dark: 'none',
  },
};

const spacingTokens: StyleDictionary.SpacingDictionary = {
  spaceLayoutToggleDiameter: '34px',
  spacePanelContentTop: '0px',
  spacePanelHeaderVertical: '{spaceStaticM}',
  spacePanelSplitTop: '{spacePanelContentTop}',
};
const sizeTokens: StyleDictionary.SizesDictionary = {
  sizeVerticalPanelIconOffset: '10px',
};

export const expandedColorTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, colorTokens, shadowTokens)
);

const expandedSizeTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(
  merge({}, parentTokens, { ...spacingTokens, ...sizeTokens })
);

const expandedTokens = {
  ...expandedColorTokens,
  ...expandedSizeTokens,
};

export { expandedTokens as tokens };
