// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandDensityDictionary } from '../../utils';
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../spacing';

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
