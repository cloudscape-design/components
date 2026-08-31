// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandDensityDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.SpacingDictionary = {
  spaceButtonFocusOutlineGutter: { comfortable: '4px', compact: '3px' },
  spaceTableCellVertical: { comfortable: '4px', compact: '2px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(merge({}, tokens));

export { expandedTokens as tokens };
