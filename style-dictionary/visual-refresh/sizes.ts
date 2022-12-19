// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';

import { expandDensityDictionary } from '../utils';

const tokens: StyleDictionary.SizesDictionary = {
  sizeCalendarGridWidth: '238px',
  sizeControl: '16px',
  sizeIconBig: '32px',
  sizeIconLarge: '48px',
  sizeIconMedium: '20px',
  sizeIconNormal: '16px',
  sizeTableSelectionHorizontal: { comfortable: '43px', compact: '41px' },
  sizeVerticalInput: { comfortable: '34px', compact: '30px' },
  sizeVerticalPanelIconOffset: { comfortable: '15px', compact: '13px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
