// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { neutralExtra } from '../color-palette.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundContainerContent: { light: '{colorNeutral1000}', dark: '{colorNeutral50}' },
  colorBorderDividerDefault: { light: '{colorNeutral800}', dark: '{colorNeutral500}' },
  colorTextTopNavigationTitle: { light: '{colorNeutral200}', dark: '{colorNeutral950}' },
  colorTextInteractiveDefault: { light: '{colorNeutral200}', dark: '{colorNeutral950}' },
  colorTextInteractiveHover: { light: '{colorPrimary600}', dark: '{colorPrimary500}' },
  colorTextInteractiveActive: { light: neutralExtra.nearBlack, dark: neutralExtra.nearWhite2 },
  colorTextAccent: { light: neutralExtra.nearBlack, dark: neutralExtra.nearWhite2 },
  colorTextDropdownItemDefault: { light: neutralExtra.nearBlack, dark: neutralExtra.nearWhite2 },
  colorTextDropdownItemHighlighted: { light: neutralExtra.nearBlack, dark: neutralExtra.nearWhite2 },
  colorTextGroupLabel: { light: '{colorNeutral500}', dark: '{colorNeutral800}' },
  colorBackgroundDropdownItemDefault: { light: '{colorNeutral1000}', dark: '{colorNeutral200}' },
  colorBackgroundDropdownItemHover: { light: '{colorNeutral950}', dark: '{colorNeutral100}' },
  colorBorderDropdownContainer: { light: '{colorNeutral750}', dark: '{colorNeutral600}' },
  colorTextBodyDefault: { light: neutralExtra.nearBlack, dark: neutralExtra.nearWhite2 },
  colorBackgroundInputDefault: { light: '{colorNeutral1000}', dark: '{colorNeutral200}' },
  colorBorderInputDefault: { light: '{colorNeutral750}', dark: '{colorNeutral600}' },
  colorTextInputPlaceholder: { light: '{colorNeutral600}', dark: '{colorNeutral650}' },
  colorBorderDropdownItemDefault: { light: '{colorNeutral850}', dark: '{colorNeutral500}' },
  colorTextDropdownItemSecondary: { light: '{colorNeutral500}', dark: '{colorNeutral800}' },
  colorItemSelected: { light: neutralExtra.nearBlack, dark: neutralExtra.nearWhite2 },
  colorBackgroundDropdownItemSelected: { light: neutralExtra.nearWhite1, dark: neutralExtra.nearBlack },
  colorBorderItemSelected: { light: neutralExtra.nearBlack, dark: neutralExtra.nearWhite2 },
  colorTextButtonInlineIconDefault: { light: '{colorNeutral200}', dark: neutralExtra.nearWhite2 },
  colorTextButtonInlineIconHover: { light: '{colorNeutral200}', dark: neutralExtra.nearWhite2 },
};

const expandedTokens = expandColorDictionary(tokens);

export { expandedTokens as tokens };
