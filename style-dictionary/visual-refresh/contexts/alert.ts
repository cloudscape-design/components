// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../colors';
import merge from 'lodash/merge';
import { expandColorDictionary } from '../../utils';

export const alertButtonTokens: StyleDictionary.ColorsDictionary = {
  colorTextButtonNormalDefault: {
    light: '{colorGrey600}',
    dark: '{colorGrey300}',
  },
  colorBorderButtonNormalDefault: '{colorTextButtonNormalDefault}',
  colorBackgroundButtonNormalDefault: 'transparent',
  colorTextButtonNormalHover: {
    light: '{colorGrey900}',
    dark: '{colorWhite}',
  },
  colorBorderButtonNormalHover: '{colorTextButtonNormalHover}',
  colorBackgroundButtonNormalHover: {
    light: 'rgba(0, 7, 22, 0.05)',
    dark: 'rgba(255, 255, 255, 0.1)',
  },
  colorTextButtonNormalActive: '{colorTextButtonNormalHover}',
  colorBorderButtonNormalActive: '{colorTextButtonNormalHover}',
  colorBackgroundButtonNormalActive: {
    light: 'rgba(0, 7, 22, 0.1)',
    dark: 'rgba(255, 255, 255, 0.15)',
  },
  colorTextLinkButtonNormalDefault: '{colorTextLinkDefault}',
  colorTextLinkButtonNormalHover: '{colorTextLinkHover}',
};

const tokens: StyleDictionary.ColorsDictionary = {
  ...alertButtonTokens,
  colorBorderItemFocused: {
    dark: '{colorGrey100}',
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, tokens)
);

export default expandedTokens;
