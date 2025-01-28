// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandDensityDictionary } from '../../utils';
import { StyleDictionary } from '../../utils/interfaces';

const typographyTokens: StyleDictionary.TypographyDictionary = {
  fontSizeBodyM: '1.4rem',
  fontSizeBodyS: '1.2rem',
  fontSizeDisplayL: '4.2rem',
  fontSizeHeadingXl: '2.4rem',
  fontSizeHeadingL: '2.0rem',
  fontSizeHeadingM: '1.8rem',
  fontSizeHeadingS: '1.6rem',
  fontSizeHeadingXs: '1.4rem',
  lineHeightBodyM: '2rem',
  lineHeightBodyS: '1.6rem',
  lineHeightDisplayL: '4.8rem',
  lineHeightHeadingXl: '3rem',
  lineHeightHeadingL: '2.4rem',
  lineHeightHeadingM: '2.2rem',
  lineHeightHeadingS: '2rem',
  lineHeightHeadingXs: '1.8rem',
};

const sizeTokens: StyleDictionary.SizesDictionary = {
  sizeCalendarGridWidth: '23.8rem',
  sizeControl: '1.6rem',
  sizeIconBig: '3.2rem',
  sizeIconLarge: '4.8rem',
  sizeIconMedium: '2rem',
  sizeIconNormal: '1.6rem',
};

const expandedSizeTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(sizeTokens);

const tokens = { ...typographyTokens, ...expandedSizeTokens };
export { tokens };
