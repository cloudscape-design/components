// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundContainerContent: { light: '#ffffff', dark: '#151515' },
  colorBorderDividerDefault: { light: '#c9c9c9', dark: '#494949' },
  colorTextTopNavigationTitle: { light: '#242424', dark: '#f5f5f5' },
  colorTextInteractiveDefault: { light: '#242424', dark: '#f5f5f5' },
  colorTextInteractiveHover: { light: '#295eff', dark: '#5c7fff' },
  colorTextInteractiveActive: { light: '#080808', dark: '#f9f9f9' },
  colorTextAccent: { light: '#080808', dark: '#f9f9f9' },
  colorTextDropdownItemDefault: { light: '#080808', dark: '#f9f9f9' },
  colorTextDropdownItemHighlighted: { light: '#080808', dark: '#f9f9f9' },
  colorTextGroupLabel: { light: '#494949', dark: '#c9c9c9' },
  colorBackgroundDropdownItemDefault: { light: '#ffffff', dark: '#242424' },
  colorBackgroundDropdownItemHover: { light: '#f5f5f5', dark: '#1a1a1a' },
  colorBorderDropdownContainer: { light: '#b7b7b7', dark: '#6b6b6b' },
  colorTextBodyDefault: { light: '#080808', dark: '#f9f9f9' },
  colorBackgroundInputDefault: { light: '#ffffff', dark: '#242424' },
  colorBorderInputDefault: { light: '#b7b7b7', dark: '#6b6b6b' },
  colorTextInputPlaceholder: { light: '#6b6b6b', dark: '#909090' },
  colorBorderDropdownItemDefault: { light: '#e1e1e1', dark: '#494949' },
  colorTextDropdownItemSecondary: { light: '#494949', dark: '#c9c9c9' },
  colorItemSelected: { light: '#080808', dark: '#f9f9f9' },
  colorBackgroundDropdownItemSelected: { light: '#f8f8f8', dark: '#080808' },
  colorBorderItemSelected: { light: '#080808', dark: '#f9f9f9' },
  colorTextButtonInlineIconDefault: { light: '#242424', dark: '#f9f9f9' },
  colorTextButtonInlineIconHover: { light: '#242424', dark: '#f9f9f9' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(merge({}, tokens));

export const mode: StyleDictionary.ModeIdentifier = 'color';
export { expandedTokens as tokens };
