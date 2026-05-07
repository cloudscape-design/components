// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandDensityDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../spacing.js';

const spacingTokens: StyleDictionary.SpacingDictionary = {
  spaceScaledXxxs: '{spaceNone}',
  spaceScaledXxs: '{spaceXxxs}',
  spaceScaledXs: '{spaceXxs}',
  spaceScaledS: '{spaceXs}',
  spaceScaledM: '{spaceS}',
  spaceScaledL: '{spaceM}',
  spaceScaledXl: '{spaceL}',
  spaceScaledXxl: '{spaceXl}',
  spaceScaledXxxl: '{spaceXxl}',
};

const sizeTokens: StyleDictionary.SizesDictionary = {
  sizeVerticalInput: '28px',
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(
  merge({}, parentTokens, { ...spacingTokens, ...sizeTokens })
);

export { expandedTokens as tokens };
