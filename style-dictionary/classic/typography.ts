// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/typography';
import merge from 'lodash/merge';

const tokens: StyleDictionary.TypographyDictionary = {
  fontBodyMLineHeight: '22px',
  fontBodySLetterSpacing: 'normal',
  fontButtonLetterSpacing: '0.25px',
  fontChartDetailSize: '{fontBodyMSize}',
  fontDisplayLLetterSpacing: 'normal',
  fontDisplayLLineHeight: '56px',
  fontDisplayLSize: '44px',
  fontDisplayLabelWeight: '400',
  fontExpandableHeadingSize: '{fontBodyMSize}',
  fontFamilyBase: "'Noto Sans', 'Helvetica Neue', Roboto, Arial, sans-serif",
  fontHeaderH2DescriptionLineHeight: '{fontBodySLineHeight}',
  fontHeaderH2DescriptionSize: '{fontBodySSize}',
  fontHeadingLLetterSpacing: 'normal',
  fontHeadingLLineHeight: '22px',
  fontHeadingLSize: '18px',
  fontHeadingLWeight: '{fontWeightHeavy}',
  fontHeadingMLetterSpacing: 'normal',
  fontHeadingMLineHeight: '22px',
  fontHeadingMSize: '18px',
  fontHeadingMWeight: '400',
  fontHeadingSLetterSpacing: 'normal',
  fontHeadingSWeight: '{fontWeightHeavy}',
  fontHeadingXlLetterSpacing: 'normal',
  fontHeadingXlLineHeight: '36px',
  fontHeadingXlSize: '28px',
  fontHeadingXlWeight: '400',
  fontHeadingXsLineHeight: '20px',
  fontHeadingXsSize: '16px',
  fontHeadingXsWeight: '400',
  fontBoxValueLargeWeight: '300',
  fontLinkButtonLetterSpacing: 'normal',
  fontLinkButtonWeight: '400',
  fontLinkPrimaryDecoration: 'none',
  fontLinkPrimaryLetterSpacing: '0.005em',
  fontLinkPrimaryWeight: '700',
  fontPanelHeaderLineHeight: '{fontHeadingLLineHeight}',
  fontPanelHeaderSize: '{fontHeadingLSize}',
  fontSmoothingWebkit: 'auto',
  fontSmoothingMozOsx: 'auto',
  fontTabsDisabledWeight: '400',
  fontTabsLineHeight: '{fontBodyMLineHeight}',
  fontTabsSize: '{fontBodyMSize}',
  fontWeightHeavy: '700',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
