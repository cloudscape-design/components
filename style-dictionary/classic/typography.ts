// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/typography';
import merge from 'lodash/merge';

const tokens: StyleDictionary.TypographyDictionary = {
  lineHeightBodyM: '22px',
  fontBodySLetterSpacing: 'normal',
  fontButtonLetterSpacing: '0.25px',
  fontChartDetailSize: '{fontSizeBodyM}',
  fontDisplayLLetterSpacing: 'normal',
  lineHeightDisplayL: '56px',
  fontSizeDisplayL: '44px',
  fontDisplayLabelWeight: '400',
  fontExpandableHeadingSize: '{fontSizeBodyM}',
  fontFamilyBase: "'Noto Sans', 'Helvetica Neue', Roboto, Arial, sans-serif",
  fontHeaderH2DescriptionLineHeight: '{lineHeightBodyS}',
  fontHeaderH2DescriptionSize: '{fontSizeBodyS}',
  fontHeadingLLetterSpacing: 'normal',
  lineHeightHeading2: '22px',
  fontSizeHeading2: '18px',
  fontWeightHeading2: '{fontWeightHeavy}',
  fontHeadingMLetterSpacing: 'normal',
  lineHeightHeading3: '22px',
  fontSizeHeading3: '18px',
  fontWeightHeading3: '400',
  fontHeadingSLetterSpacing: 'normal',
  fontWeightHeading4: '{fontWeightHeavy}',
  fontHeadingXlLetterSpacing: 'normal',
  lineHeightHeading1: '36px',
  fontSizeHeading1: '28px',
  fontWeightHeading1: '400',
  lineHeightHeading5: '20px',
  fontSizeHeading5: '16px',
  fontWeightHeading5: '400',
  fontBoxValueLargeWeight: '300',
  fontLinkButtonLetterSpacing: 'normal',
  fontLinkButtonWeight: '400',
  fontPanelHeaderLineHeight: '{lineHeightHeading2}',
  fontPanelHeaderSize: '{fontSizeHeading2}',
  fontSmoothingWebkit: 'auto',
  fontSmoothingMozOsx: 'auto',
  fontTabsDisabledWeight: '400',
  fontTabsLineHeight: '{lineHeightBodyM}',
  fontTabsSize: '{fontSizeBodyM}',
  fontWeightHeavy: '700',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
