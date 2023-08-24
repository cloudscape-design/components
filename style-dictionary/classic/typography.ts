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
  fontPanelHeaderLineHeight: '{lineHeightHeading2}',
  fontPanelHeaderSize: '{fontSizeHeading2}',
  fontSizeDisplayL: '44px',
  fontSizeHeading1: '28px',
  fontSizeHeading2: '18px',
  fontSizeHeading3: '18px',
  fontSizeHeading5: '16px',
  fontSmoothingMozOsx: 'auto',
  fontSmoothingWebkit: 'auto',
  fontTabsDisabledWeight: '400',
  fontTabsLineHeight: '{lineHeightBodyM}',
  fontTabsSize: '{fontSizeBodyM}',
  fontWeightHeading1: '400',
  fontWeightHeading2: '{fontWeightHeavy}',
  fontWeightHeading3: '400',
  fontWeightHeading4: '{fontWeightHeavy}',
  fontWeightHeading5: '400',
  fontWeightHeavy: '700',
  letterSpacingBodyS: 'normal',
  letterSpacingDisplayL: 'normal',
  letterSpacingHeading1: 'normal',
  letterSpacingHeading2: 'normal',
  letterSpacingHeading3: 'normal',
  letterSpacingHeading4: 'normal',
  lineHeightBodyM: '22px',
  lineHeightDisplayL: '56px',
  lineHeightHeading1: '36px',
  lineHeightHeading2: '22px',
  lineHeightHeading3: '22px',
  lineHeightHeading5: '20px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
