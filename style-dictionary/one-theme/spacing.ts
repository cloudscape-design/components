// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandDensityDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/spacing.js';

const tokens: StyleDictionary.SpacingDictionary = {
  spaceAlertVertical: '6px',
  spaceFlashbarVertical: '6px',
  spaceButtonHorizontal: '12px',
  spaceTabsVertical: '2px',
  spaceTokenVertical: '1px',
  spaceFieldVertical: { comfortable: '4px', compact: '2px' },
  spaceStatusIndicatorPaddingHorizontal: '2px',

  // spaceContainerHeaderTop: { comfortable: '12px', compact: '10px' },
  spaceContainerContentVertical: { comfortable: '20px', compact: '12px' },
  // spaceContainerHorizontal: { comfortable: '{spaceL}', compact: '{spaceM}' },

  spaceScaledL: { comfortable: '{spaceL}', compact: '{spaceS}' },

  spaceTableCellVertical: { comfortable: '8px', compact: '4px' },

  spaceExpandToggleFocusOutlineGutter: { comfortable: '4px', compact: '1px' },
  spaceTableHeaderFocusOutlineGutter: '0px',
  spaceButtonInlineLinkFocusOutlineGutter: { comfortable: '4px', compact: '1px' },
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = merge(
  {},
  parentTokens,
  expandDensityDictionary(tokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
