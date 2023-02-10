// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../spacing';
import merge from 'lodash/merge';
import { expandDensityDictionary } from '../../utils';
const tokens: StyleDictionary.SpacingDictionary = {
  spaceScaledXxs: '{spaceXxxs}',
  spaceScaledXs: '{spaceXxs}',
  spaceScaledL: '{spaceM}',
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(
  merge({}, parentTokens, tokens)
);

export { expandedTokens as tokens };
