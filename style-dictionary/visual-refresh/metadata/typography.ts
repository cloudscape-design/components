// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces.js';

const metadata: StyleDictionary.MetadataIndex = {
  fontButtonLetterSpacing: {
    description: 'The default letter spacing for button text.',
  },
  fontChartDetailSize: {
    description: 'Used for secondary chart text, e.g. mixed chart axes and pie chart label descriptions.',
  },
  fontDisplayLabelWeight: {
    description: 'The default font weight for labels. For example, keys in key-value pairs, or form field labels.',
  },
  fontFamilyBase: {
    description: 'The default font family that will be applied globally to the product interface.',
    themeable: true,
    public: true,
  },
  fontFamilyDisplay: {
    description: 'The font family for display text. Defaults to the base font family.',
    themeable: true,
    public: true,
  },
  fontFamilyHeading: {
    description: 'The font family for headings and component headers. Defaults to the base font family.',
    themeable: true,
    public: true,
  },
  fontFamilyMonospace: {
    description: 'The monospace font family that will be applied globally to the product interface.',
    themeable: true,
    public: true,
  },
  fontHeaderH2DescriptionLineHeight: { sassName: '$font-header-h2-description-line-height' },
  fontHeaderH2DescriptionSize: { sassName: '$font-header-h2-description-size' },
  fontSizeBodyM: {
    description: 'The default font size for regular body text. For example, <p> tags in text content, or button text.',
    themeable: true,
    public: true,
  },
  fontSizeBodyS: {
    description: 'The default font size for small body text. For example, form field descriptions, or badge text.',
    themeable: true,
    public: true,
  },
  fontSizeDisplayL: {
    description: 'The default font size for large display text.',
    themeable: true,
    public: true,
  },
  fontSizeHeadingXl: {
    description: 'The default font size for h1s.',
    themeable: true,
    public: true,
  },
  fontSizeHeadingL: {
    description: 'The default font size for h2s.',
    themeable: true,
    public: true,
  },
  fontSizeHeadingM: {
    description: 'The default font size for h3s.',
    themeable: true,
    public: true,
  },
  fontSizeHeadingS: {
    description: 'The default font size for h4s.',
    themeable: true,
    public: true,
  },
  fontSizeHeadingXs: {
    description: 'The default font size for h5s.',
    themeable: true,
    public: true,
  },
  fontWeightNormal: {
    description: 'The default normal font weight.',
    themeable: true,
    public: true,
  },
  fontWeightBold: {
    description: 'The default bold font weight for body text. For example, <strong> and <b> tags in text content.',
    themeable: true,
    public: true,
  },
  fontWeightLighter: {
    description: 'The default lighter font weight.',
    themeable: true,
    public: true,
  },
  fontWeightHeavy: {
    description: 'The default heavy font weight.',
    themeable: true,
    public: true,
  },
  fontWeightButton: {
    description: 'The default font weight for button text.',
    themeable: true,
    public: true,
  },
  fontWeightAlertHeader: {
    description: 'The default font weight for alert header text.',
    themeable: true,
    public: true,
  },
  fontWeightFlashbarHeader: {
    description: 'The default font weight for flashbar header text.',
    themeable: true,
    public: true,
  },
  fontWeightHeadingXl: {
    description: 'The default font weight for h1s.',
    themeable: true,
    public: true,
  },
  fontWeightHeadingL: {
    description: 'The default font weight for h2s.',
    themeable: true,
    public: true,
  },
  fontWeightHeadingM: {
    description: 'The default font weight for h3s.',
    themeable: true,
    public: true,
  },
  fontWeightHeadingS: {
    description: 'The default font weight for h4s.',
    themeable: true,
    public: true,
  },
  fontWeightHeadingXs: {
    description: 'The default font weight for h5s.',
    themeable: true,
    public: true,
  },
  fontWeightDisplayL: {
    description: 'The default font weight for large display text.',
    themeable: true,
    public: true,
  },
  fontSizeTabs: {
    description: 'The default font size for tabs.',
    themeable: true,
    public: true,
  },
  fontWeightTabs: {
    description: 'The default font weight for tabs.',
    themeable: true,
    public: true,
  },
  fontWeightTabsDisabled: {
    description: 'The default font weight for disabled tabs.',
    themeable: true,
    public: true,
  },
  letterSpacingBodyS: {
    description: 'The default letter spacing for small body text.',
  },
  letterSpacingDisplayL: {
    description: 'The default letter spacing for large display text.',
    themeable: true,
    public: true,
  },
  letterSpacingHeadingXl: {
    description: 'The default letter spacing for h1s.',
    themeable: true,
    public: true,
  },
  letterSpacingHeadingL: {
    description: 'The default letter spacing for h2s.',
    themeable: true,
    public: true,
  },
  letterSpacingHeadingM: {
    description: 'The default letter spacing for h3s.',
    themeable: true,
    public: true,
  },
  letterSpacingHeadingS: {
    description: 'The default letter spacing for h4s.',
    themeable: true,
    public: true,
  },
  letterSpacingHeadingXs: {
    description: 'The default letter spacing for h5s.',
    themeable: true,
    public: true,
  },
  lineHeightBodyM: {
    description: 'The default line height for regular body text.',
    themeable: true,
    public: true,
  },
  lineHeightBodyS: {
    description: 'The default line height for small body text.',
    themeable: true,
    public: true,
  },
  lineHeightDisplayL: {
    description: 'The default line height for large display text.',
    themeable: true,
    public: true,
  },
  lineHeightHeadingXl: {
    description: 'The default line height for h1s.',
    themeable: true,
    public: true,
  },
  lineHeightHeadingL: {
    description: 'The default line height for h2s.',
    themeable: true,
    public: true,
  },
  lineHeightHeadingM: {
    description: 'The default line height for h3s.',
    themeable: true,
    public: true,
  },
  lineHeightHeadingS: {
    description: 'The default line height for h4s.',
    themeable: true,
    public: true,
  },
  lineHeightHeadingXs: {
    description: 'The default line height for h5s.',
    themeable: true,
    public: true,
  },
  lineHeightTabs: {
    description: 'The default line height for tabs.',
    themeable: true,
    public: true,
  },
  fontDecorationThicknessLink: {
    description: 'The text decoration thickness of links.',
    themeable: true,
    public: false,
  },
  fontDecorationThicknessLinkDisplayL: {
    description: 'The text decoration thickness of links at display-l size.',
    themeable: true,
    public: false,
  },
  fontDecorationStyleLink: {
    description: 'The text decoration style of links. For example: underline, dashed, dotted.',
    themeable: true,
    public: false,
  },
  fontWeightBreadcrumbCurrent: {
    description: 'The font weight of the current breadcrumb item (the page the user is currently viewing).',
    themeable: true,
    public: false,
  },
  fontSizeFormLabel: {
    description: 'The font size for form field labels.',
    themeable: true,
    public: false,
  },
  lineHeightFormLabel: {
    description: 'The line height for form field labels.',
    themeable: true,
    public: false,
  },
  fontWeightFormLabel: {
    description: 'The font weight for form field labels.',
    themeable: true,
    public: false,
  },
  fontSizeKeyValuePairsLabel: {
    description: 'The font size for key-value pairs labels.',
    themeable: true,
    public: false,
  },
  lineHeightKeyValuePairsLabel: {
    description: 'The line height for key-value pairs labels.',
    themeable: true,
    public: false,
  },
  fontWeightKeyValuePairsLabel: {
    description: 'The font weight for key-value pairs labels.',
    themeable: true,
    public: false,
  },
};

export default metadata;
