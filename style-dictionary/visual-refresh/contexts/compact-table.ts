// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../spacing';
import merge from 'lodash/merge';
import { expandDensityDictionary } from '../../utils';
const tokens: StyleDictionary.SpacingDictionary = {
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

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(
  merge({}, parentTokens, tokens)
);

export { expandedTokens as tokens };
