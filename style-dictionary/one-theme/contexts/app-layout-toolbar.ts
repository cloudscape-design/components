// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { neutralExtra } from '../color-palette.js';

const tokens = {
  colorBackgroundLayoutMain: { light: neutralExtra.nearWhite3, dark: neutralExtra.nearBlack },
};

const expandedTokens = expandColorDictionary(tokens);

export { expandedTokens as tokens };
