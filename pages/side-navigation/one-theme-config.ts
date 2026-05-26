// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// ============================================================================
// Theme for One Theme
// ============================================================================

/* eslint-disable @typescript-eslint/no-unused-vars */
export function generateThemeConfigOneTheme() {
  // New grey primitive color palette
  const grey50 = '#fcfcfc';
  const grey100 = '#f9f9f9';
  const grey150 = '#f8f8f8';
  const grey200 = '#f5f5f5';
  const grey250 = '#ededed';
  const grey300 = '#e1e1e1';
  const grey350 = '#c9c9c9';
  const grey400 = '#b7b7b7';
  const grey450 = '#a9a9a9';
  const grey500 = '#909090';
  const grey600 = '#6B6B6B';
  const grey650 = '#494949';
  const grey700 = '#3B3B3B';
  const grey750 = '#2D2D2D';
  const grey800 = '#242424';
  const grey850 = '#1E1E1E';
  const grey900 = '#1A1A1A';
  const grey950 = '#151515';
  const grey1000 = '#080808';

  // Indigo primitive color palette
  const indigo50 = '#F5F7FF';
  const indigo100 = '#DBE4FF';
  const indigo200 = '#C2D1FF';
  const indigo300 = '#94AFFF';
  const indigo400 = '#7598FF';
  const indigo500 = '#5C7FFF';
  const indigo600 = '#295EFF';
  const indigo700 = '#003EFA';
  const indigo800 = '#0033CC';
  const indigo900 = '#001A99';
  const indigo950 = '#001475';
  const indigo1000 = '#000833';

  // Lime primitive color palette
  const lime50 = '#F7FFEB';
  const lime100 = '#EBFFCC';
  const lime200 = '#D1FF8A';
  const lime300 = '#ACFF2E';
  const lime400 = '#7AE500';
  const lime500 = '#31B800';
  const lime600 = '#008A00';
  const lime700 = '#007000';
  const lime800 = '#005700';
  const lime900 = '#003D00';
  const lime950 = '#002E00';
  const lime1000 = '#001400';

  // Yellow primitive color palette
  const yellow50 = '#FFFEF0';
  const yellow100 = '#FFFBBD';
  const yellow200 = '#FEF571';
  const yellow300 = '#FFED4D';
  const yellow400 = '#FFE347';
  const yellow500 = '#FBD332';
  const yellow600 = '#F2B100';
  const yellow700 = '#DB9200';
  const yellow800 = '#9E6900';
  const yellow900 = '#855900';
  const yellow950 = '#573A00';
  const yellow1000 = '#191100';

  // Primary accent colors
  const colorAccentPrimary = { light: indigo400, dark: indigo500 };
  const colorSelectedAccent = { light: indigo600, dark: indigo400 };
  //const colorSelectedAccent = { light: grey800, dark: grey50 };
  const colorSelectedAccentSubtleHover = { light: grey250, dark: grey900 };

  // Secondary accent colors (darker/more saturated variant)
  const colorSelectedAccentSecondary = { light: grey800, dark: grey100 };

  // Neutral colors
  const colorNeutralDefault = { light: grey800, dark: grey200 };
  const colorNeutralInverse = { light: grey900, dark: '#ffffff' };
  //const colorNeutralBackground = { light: '#F6F6F9', dark: '#333843' };

  // Toned down text color
  const colorTextBodyDefault = { light: grey950, dark: grey350 };
  const colorTextBodySecondary = { light: grey700, dark: grey400 };

  // Status colors
  const colorSuccess = { light: '#006B48', dark: '#006B48' };

  return {
    tokens: {
      fontFamilyBase: "'Ember Modern', 'Amazon Ember', Roboto, Arial, sans-serif",
      colorTextBodyDefault: colorTextBodyDefault,
      colorTextBodySecondary: colorTextBodySecondary,
      colorBackgroundLayoutMain: { light: grey50, dark: grey1000 },

      // ========================================================================
      // NAVIGATION BAR (Sid and top)
      // ========================================================================
      colorBackgroundNavigationBarPrimary: { light: '#ffffff', dark: grey1000 },
      colorBackgroundNavigationBarSecondary: { light: '#ffffff', dark: grey1000 },
      colorBorderNavigationBarPrimary: { light: grey350, dark: 'transparent' },
      colorBorderNavigationBarSecondary: { light: grey350, dark: grey750 },

      // ========================================================================
      // CONTAINER
      // ========================================================================
      colorBackgroundContainerHeader: { light: '#ffffff', dark: grey950 },
      colorBackgroundContainerContent: { light: '#ffffff', dark: grey950 },
      colorBorderDividerDefault: { light: grey350, dark: grey750 },
      colorBorderLayout: { light: grey350, dark: grey750 },

      // ========================================================================
      // BUTTONS - Normal
      // ========================================================================
      colorBorderButtonNormalDefault: { light: grey650, dark: grey700 },
      colorBorderButtonNormalHover: { light: grey650, dark: grey600 },
      colorBorderButtonNormalActive: { light: grey650, dark: grey600 },

      colorBackgroundButtonNormalDefault: { light: '#FFFFFF', dark: grey850 },
      colorBackgroundButtonNormalHover: { light: grey150, dark: grey750 },
      colorBackgroundButtonNormalActive: { light: grey250, dark: grey700 },

      colorTextButtonNormalDefault: { light: grey700, dark: grey300 },
      colorTextButtonNormalHover: { light: grey700, dark: grey300 },
      colorTextButtonNormalActive: { light: grey700, dark: grey300 },

      // ========================================================================
      // BUTTONS - Primary
      // ========================================================================
      //colorBackgroundButtonPrimaryDefault: colorAccentPrimary,
      colorBackgroundButtonPrimaryDefault: { light: grey800, dark: grey300 },
      colorBackgroundButtonPrimaryHover: { light: grey700, dark: grey200 },
      colorBackgroundButtonPrimaryActive: { light: grey800, dark: grey300 },
      colorTextButtonPrimaryDefault: { light: grey50, dark: grey950 },
      colorTextButtonPrimaryHover: { light: grey50, dark: grey950 },
      colorTextButtonPrimaryActive: { light: grey50, dark: grey950 },

      // ========================================================================
      // BUTTONS - Link
      // ========================================================================
      colorBackgroundButtonLinkDefault: { light: grey150, dark: grey750 }, // Added
      colorBackgroundButtonLinkHover: { light: grey250, dark: grey650 }, // Added
      colorBackgroundButtonLinkActive: colorSelectedAccentSubtleHover,
      colorTextLinkButtonNormalDefault: colorSelectedAccent,

      // ========================================================================
      // INPUT
      // ========================================================================
      colorBackgroundInputDefault: { light: '#ffffff', dark: grey950 },
      colorBackgroundInputDisabled: { light: grey250, dark: grey800 },
      colorBorderInputDefault: { light: grey400, dark: grey600 },

      // ========================================================================
      // BUTTONS - Toggle
      // ========================================================================
      colorBackgroundToggleButtonNormalPressed: { light: '#FFFFFF', dark: grey850 },
      colorBorderToggleButtonNormalPressed: colorSelectedAccent,
      colorTextToggleButtonNormalPressed: colorNeutralInverse,

      // ========================================================================
      // CONTROLS - Checkboxes, Radio, Toggle
      // ========================================================================
      colorBackgroundControlChecked: colorSelectedAccent,
      //colorBackgroundToggleCheckedDisabled: colorSelectedAccentDisabled,

      // ========================================================================
      // KVP & FORM FIELD
      // ========================================================================
      colorTextLabel: { light: grey600, dark: grey500 },
      fontSizeKeyValuePairsLabel: '14px',
      lineHeightKeyValuePairsLabel: '20px',
      fontWeightKeyValuePairsLabel: '500',
      colorTextKeyValuePairsValue: { light: grey600, dark: grey300 },

      colorTextFormLabel: { light: grey600, dark: grey300 },
      colorTextFormSecondary: { light: grey600, dark: grey500 },
      fontSizeFormLabel: '14px',
      lineHeightFormLabel: '20px',
      fontWeightFormLabel: '500',

      // ========================================================================
      // LINKS & TEXT
      // ========================================================================
      colorTextLinkDefault: colorTextBodyDefault,
      colorTextLinkHover: { light: grey650, dark: grey250 },
      colorTextLinkSecondaryDefault: colorTextBodySecondary,
      colorTextLinkInfoDefault: { light: indigo600, dark: indigo400 },
      colorTextLinkInfoHover: { light: indigo800, dark: indigo300 },
      colorTextAccent: colorSelectedAccent,
      colorTextLinkDecorationDefault: { light: grey650, dark: grey600 },
      //fontLinkDecorationThickness: '0.5px',

      // ========================================================================
      // SELECTION & FOCUS
      // ========================================================================
      colorBorderItemFocused: colorSelectedAccent,
      colorBorderItemSelected: colorSelectedAccent,
      colorBackgroundItemSelected: { light: indigo100, dark: indigo1000 },
      colorBackgroundLayoutToggleSelectedDefault: colorSelectedAccentSecondary,
      colorBackgroundLayoutToggleSelectedHover: colorSelectedAccentSecondary,
      colorBackgroundLayoutToggleSelectedActive: colorSelectedAccentSecondary,

      // ========================================================================
      // SEGMENTS & TABS
      // ========================================================================
      colorBackgroundSegmentActive: { light: grey800, dark: grey300 },
      colorBackgroundSegmentDefault: { light: 'transparent', dark: 'transparent' },

      // ========================================================================
      // SLIDER
      // ========================================================================
      colorBackgroundSliderRangeDefault: colorSelectedAccent,
      colorBackgroundSliderHandleDefault: colorSelectedAccent,

      // ========================================================================
      // PROGRESS BAR
      // ========================================================================
      colorBackgroundProgressBarValueDefault: colorSelectedAccent,

      // ========================================================================
      // NOTIFICATIONS
      // ========================================================================
      colorBackgroundNotificationGreen: colorSuccess,
      colorBackgroundNotificationBlue: { light: indigo800, dark: indigo800 },
      colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },

      // ========================================================================
      // STATUS
      // ========================================================================
      colorTextStatusInfo: { light: indigo800, dark: indigo300 },
      colorTextStatusSuccess: { light: lime600, dark: lime200 },
      colorTextStatusWarning: { light: yellow800, dark: yellow300 },
      colorTextDropdownItemFilterMatch: colorSelectedAccent,
      colorBackgroundDropdownItemFilterMatch: { light: grey200, dark: grey1000 },

      // ========================================================================
      // STATUS INDICATOR
      // ========================================================================
      spaceStatusIndicatorPaddingInline: '4px',
      borderRadiusStatusIndicator: '2px',
      colorBackgroundStatusIndicatorInfo: { light: '#5c7fff20', dark: '#5c7fff20' },
      colorBackgroundStatusIndicatorWarning: { light: '#FBD33220', dark: '#FBD33220' },
      colorBackgroundStatusIndicatorSuccess: { light: '#7ae50020', dark: '#7ae50020' },
      colorBackgroundStatusIndicatorError: { light: '#ff7a7a10', dark: '#ff7a7a20' },
      colorBackgroundStatusIndicatorNeutral: { light: '#ff7a7a10', dark: grey800 },

      // ========================================================================
      // TYPOGRAPHY - Headings
      // ========================================================================
      colorTextBreadcrumbCurrent: { light: grey600, dark: grey500 },
      fontWeightBreadcrumbCurrent: '400',

      // H1
      fontSizeHeadingXl: '24px',
      lineHeightHeadingXl: '30px',
      fontWeightHeadingXl: '500',

      // H2
      fontSizeHeadingL: '20px',
      lineHeightHeadingL: '24px',
      fontWeightHeadingL: '500',

      // H3
      fontSizeHeadingM: '18px',
      lineHeightHeadingM: '22px',
      fontWeightHeadingM: '500',

      // H4
      fontSizeHeadingS: '16px',
      lineHeightHeadingS: '20px',
      fontWeightHeadingS: '500',

      // H5
      fontSizeHeadingXs: '14px',
      lineHeightHeadingXs: '20px',
      fontWeightHeadingXs: '500',

      // ========================================================================
      // TYPOGRAPHY - Other
      // ========================================================================
      fontWeightButton: '500',
      fontWeightTabs: '500',
      fontWeightAlertHeader: '500',
      fontWeightFlashbarHeader: '500',
      fontSizeTabs: '14px',

      // ========================================================================
      // SPACE
      // ========================================================================
      spaceAlertVertical: '8px',
      spaceButtonHorizontal: '12px',
      spaceTabsVertical: '2px',
      spaceTokenVertical: '2px',
      spaceFieldVertical: { comfortable: '4px', compact: '2px' },
      sizeVerticalInput: { comfortable: '30px', compact: '26px' },

      // ========================================================================
      // BORDERS - Width
      // ========================================================================
      borderWidthButton: '1px',
      borderWidthToken: '1px',
      borderWidthAlert: '0px',
      borderItemWidth: '1px',
      borderWidthAlertInlineStart: '2px',
      borderWidthItemSelected: '1px',
      borderWidthCardSelected: '1px',

      // ========================================================================
      // BORDERS - Radius
      // ========================================================================
      borderRadiusAlert: '2px',
      borderRadiusBadge: '16px',
      borderRadiusButton: '2px',
      borderRadiusContainer: '4px',
      borderRadiusDropdown: '2px',
      borderRadiusDropzone: '4px',
      borderRadiusFlashbar: '2px',
      borderRadiusItem: '4px',
      borderRadiusInput: '2px',
      borderRadiusPopover: '4px',
      borderRadiusTabsFocusRing: '4px',
      borderRadiusToken: '2px',
      borderRadiusTutorialPanelItem: '4px',

      // ========================================================================
      // ICONS - Stroke Width
      // ========================================================================
      borderWidthIconSmall: '1.5px',
      borderWidthIconNormal: '1.5px',
      borderWidthIconMedium: '1.75px',
      borderWidthIconBig: '2px',
      borderWidthIconLarge: '2.5px',
    },

    referenceTokens: {
      color: {
        primary: {
          50: '#F5F7FF',
          100: '#DBE4FF',
          200: '#C2D1FF',
          300: '#94AFFF',
          400: '#7598FF',
          500: '#5C7FFF',
          600: '#295EFF',
          700: '#003EFA',
          800: '#0033CC',
          900: '#001A99',
          950: '#001475',
          1000: '#000833',
        },
        neutral: {
          seed: '#242424',
        },
      },
    },

    contexts: {
      'app-layout-toolbar': {
        tokens: {
          colorBackgroundLayoutMain: { light: grey50, dark: grey1000 },
          //colorBackgroundLayoutMain: { light: 'red', dark: 'pink' },
        },
      },
      'top-navigation': {
        tokens: {
          colorBackgroundContainerContent: { light: '#ffffff', dark: grey950 },
          colorBorderDividerDefault: { light: grey350, dark: grey650 },
          colorTextTopNavigationTitle: colorNeutralDefault,
          colorTextInteractiveDefault: colorNeutralDefault,
          colorTextInteractiveHover: colorSelectedAccent,
          colorTextInteractiveActive: { light: grey1000, dark: grey100 },
          colorTextAccent: { light: grey1000, dark: grey100 },
          colorTextDropdownItemDefault: { light: grey1000, dark: grey100 },
          colorTextDropdownItemHighlighted: { light: grey1000, dark: grey100 },
          colorTextDropdown: { light: grey1000, dark: grey100 },
          colorTextGroupLabel: { light: grey650, dark: grey350 },
          colorBackgroundDropdownItemDefault: { light: '#FFFFFF', dark: grey800 },
          colorBackgroundDropdownItemHover: { light: grey200, dark: grey900 },
          colorBorderDropdownContainer: { light: grey400, dark: grey600 },
          colorTextBodyDefault: { light: grey1000, dark: grey100 },
          colorBackgroundInputDefault: { light: '#ffffff', dark: grey800 },
          colorBorderInputDefault: { light: grey400, dark: grey600 },
          colorTextInputDefault: { light: grey1000, dark: grey100 },
          colorTextInputPlaceholder: { light: grey600, dark: grey500 },
          colorBorderDropdownItemDefault: { light: grey300, dark: grey650 },
          colorTextDropdownItemSecondary: { light: grey650, dark: grey350 },
          colorItemSelected: colorSelectedAccent,
          colorBackgroundDropdownItemSelected: { light: grey150, dark: grey1000 },
          colorBorderItemSelected: { light: grey1000, dark: grey100 },
          colorTextButtonInlineIconDefault: { light: grey800, dark: grey100 },
          colorTextButtonInlineIconHover: { light: grey800, dark: grey100 },
        },
      },
      header: {
        tokens: {
          // ========================================================================
          // BUTTONS - Normal
          // ========================================================================
          colorBorderButtonNormalDefault: grey200,
          colorBorderButtonNormalHover: grey100,
          colorBorderButtonNormalActive: grey100,
          colorBackgroundButtonNormalHover: grey800,
          colorBackgroundButtonNormalActive: grey900,
          colorTextButtonNormalDefault: grey200,
          colorTextButtonNormalHover: grey100,
          colorTextButtonNormalActive: grey100,
          // ========================================================================
          // BUTTONS - Primary
          // ========================================================================
          colorBackgroundButtonPrimaryDefault: grey100,
          colorBackgroundButtonPrimaryHover: '#FFFFFF',
          colorBackgroundButtonPrimaryActive: grey100,
          colorTextButtonPrimaryDefault: grey900,
          colorTextButtonPrimaryHover: grey900,
          colorTextButtonPrimaryActive: grey900,
          colorTextLinkDefault: grey350,
        },
      },
      flashbar: {
        tokens: {
          // Custom flashbar colors
          colorBackgroundNotificationGreen: colorSuccess,
          colorBackgroundNotificationBlue: { light: indigo800, dark: indigo800 },
          colorTextNotificationDefault: { light: '#ffffff', dark: '#ffffff' },
        },
      },
      alert: {
        tokens: {
          colorBackgroundStatusInfo: { light: '#5c7fff20', dark: '#161A2D' },
          colorBackgroundStatusWarning: { light: '#FBD33220', dark: '#FBD33210' },
          colorBackgroundStatusError: { light: '#ff7a7a10', dark: '#ff7a7a10' },
          colorBackgroundStatusSuccess: { light: '#7ae50020', dark: '#7ae50010' },

          colorTextStatusInfo: { light: indigo800, dark: indigo400 },
          colorBorderStatusInfo: { light: indigo800, dark: indigo400 },
          //colorTextStatusSuccess: { light: '#008559', dark: '#00BD6B' }
          colorTextStatusSuccess: { light: lime600, dark: lime200 },
          colorBorderStatusSuccess: { light: lime600, dark: lime200 },
          colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
        },
      },
    },
  };
}

// ============================================================================
// Default theme config (uses One Theme)
// ============================================================================

export const themeCoreConfig = generateThemeConfigOneTheme();
