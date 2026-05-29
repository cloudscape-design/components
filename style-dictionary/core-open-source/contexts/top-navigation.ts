// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundContainerContent: { light: '#ffffff', dark: '#161d26' },
  colorBorderDividerDefault: { light: '#c6c6cd', dark: '#424650' },
  colorTextTopNavigationTitle: { light: '#1b232d', dark: '#f3f3f7' },
  colorTextInteractiveDefault: { light: '#1b232d', dark: '#f3f3f7' },
  colorTextInteractiveHover: { light: '#1b232d', dark: '#f9f9fb' },
  colorTextInteractiveActive: { light: '#06080a', dark: '#f6f6f9' },
  colorTextAccent: { light: '#06080a', dark: '#f6f6f9' },
  colorTextDropdownItemDefault: { light: '#06080a', dark: '#f6f6f9' },
  colorTextDropdownItemHighlighted: { light: '#06080a', dark: '#f6f6f9' },
  colorTextDropdown: { light: '#06080a', dark: '#f6f6f9' },
  colorTextGroupLabel: { light: '#424650', dark: '#c6c6cd' },
  colorBackgroundDropdownItemDefault: { light: '#ffffff', dark: '#1b232d' },
  colorBackgroundDropdownItemHover: { light: '#f3f3f7', dark: '#131920' },
  colorBorderDropdownContainer: { light: '#b4b4bb', dark: '#656871' },
  colorTextBodyDefault: { light: '#06080a', dark: '#f6f6f9' },
  colorBackgroundInputDefault: { light: '#ffffff', dark: '#1b232d' },
  colorBorderInputDefault: { light: '#b4b4bb', dark: '#656871' },
  colorTextInputDefault: { light: '#06080a', dark: '#f6f6f9' },
  colorTextInputPlaceholder: { light: '#656871', dark: '#8c8c94' },
  colorBorderDropdownItemDefault: { light: '#e8e8e8', dark: '#424650' },
  colorTextDropdownItemSecondary: { light: '#424650', dark: '#c6c6cd' },
  colorItemSelected: { light: '#06080a', dark: '#f6f6f9' },
  colorBackgroundDropdownItemSelected: { light: '#f6f6f9', dark: '#06080a' },
  colorBorderItemSelected: { light: '#06080a', dark: '#f6f6f9' },
  colorTextButtonInlineIconDefault: { light: '#1b232d', dark: '#f9f9fb' },
  colorTextButtonInlineIconHover: { light: '#1b232d', dark: '#f9f9fb' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
