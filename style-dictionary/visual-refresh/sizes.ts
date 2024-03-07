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
  sizeTableSelectionHorizontal: '40px',
  sizeVerticalInput: { comfortable: '32px', compact: '28px' },
  sizeVerticalPanelIconOffset: { comfortable: '11px', compact: '11px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
