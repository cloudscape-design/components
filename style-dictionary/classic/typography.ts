// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/typography';
import merge from 'lodash/merge';

const tokens: StyleDictionary.TypographyDictionary = {
  fontBoxValueLargeWeight: '300',
  fontButtonLetterSpacing: '0.25px',
  fontChartDetailSize: '{fontSizeBodyM}',
  fontDisplayLabelWeight: '400',
  fontExpandableHeadingSize: '{fontSizeBodyM}',
  fontFamilyBase: "'Noto Sans', 'Helvetica Neue', Roboto, Arial, sans-serif",
  fontHeaderH2DescriptionLineHeight: '{lineHeightBodyS}',
  fontHeaderH2DescriptionSize: '{fontSizeBodyS}',
  fontLinkButtonLetterSpacing: 'normal',
  fontLinkButtonWeight: '400',
  fontPanelHeaderLineHeight: '{lineHeightHeadingL}',
  fontPanelHeaderSize: '{fontSizeHeadingL}',
  fontSizeDisplayL: '44px',
  fontSizeHeadingXl: '28px',
  fontSizeHeadingL: '18px',
  fontSizeHeadingM: '18px',
  fontSizeHeadingXs: '16px',
  fontSmoothingMozOsx: 'auto',
  fontSmoothingWebkit: 'auto',
  fontTabsDisabledWeight: '400',
  fontTabsLineHeight: '{lineHeightBodyM}',
  fontTabsSize: '{fontSizeBodyM}',
  fontWeightHeadingXl: '400',
  fontWeightHeadingL: '{fontWeightHeavy}',
  fontWeightHeadingM: '400',
  fontWeightHeadingS: '{fontWeightHeavy}',
  fontWeightHeadingXs: '400',
  fontWeightHeavy: '700',
  letterSpacingBodyS: 'normal',
  letterSpacingDisplayL: 'normal',
  letterSpacingHeadingXl: 'normal',
  letterSpacingHeadingL: 'normal',
  letterSpacingHeadingM: 'normal',
  letterSpacingHeadingS: 'normal',
  lineHeightBodyM: '22px',
  lineHeightDisplayL: '56px',
  lineHeightHeadingXl: '36px',
  lineHeightHeadingL: '22px',
  lineHeightHeadingM: '22px',
  lineHeightHeadingXs: '20px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
