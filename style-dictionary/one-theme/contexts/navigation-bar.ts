// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';
import omit from 'lodash/omit.js';

import { expandColorDictionary, pickState } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../colors.js';

// Navigation bar context applies inverted (dark) colors to child components
// rendered inside the `primary-accent` variant. This mirrors the approach used
// by the `top-navigation` context so that child components such as Button,
// Link, ButtonDropdown, etc. automatically adapt without consumer theming.
const tokens = {
  colorBackgroundContainerContent: '{colorNeutral850}',
  colorBackgroundDropdownItemDefault: '{colorNeutral850}',
  colorTextLinkDefault: '{colorNeutral100}',
};

const darkModeValues = pickState(parentTokens, 'dark');

// Preserve the navigation bar's own background/border tokens so that global
// theme overrides are not clobbered by the dark-mode context values.
// Removing them from the context ensures the global theming CSS var wins.
const filteredDarkModeValues = omit(darkModeValues, [
  'colorBackgroundNavigationBarPrimary',
  'colorBackgroundNavigationBarSecondary',
  'colorBorderNavigationBarPrimary',
  'colorBorderNavigationBarSecondary',
]);

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, filteredDarkModeValues, tokens)
);

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
