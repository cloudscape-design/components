// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export type ColorPaletteTokenName =
  | 'colorAmazonOrange'
  | 'colorAwsSquidInk'
  | 'colorBlack'
  | 'colorBlue100'
  | 'colorBlue200'
  | 'colorBlue300'
  | 'colorBlue400'
  | 'colorBlue500'
  | 'colorBlue600'
  | 'colorBlue700'
  | 'colorBlue800'
  | 'colorBlue900'
  | 'colorBlueOpaque'
  | 'colorGreen100'
  | 'colorGreen500'
  | 'colorGreen600'
  | 'colorGreen700'
  | 'colorGreen900'
  | 'colorGrey100'
  | 'colorGrey125'
  | 'colorGrey150'
  | 'colorGrey200'
  | 'colorGrey300'
  | 'colorGrey350'
  | 'colorGrey400'
  | 'colorGrey450'
  | 'colorGrey500'
  | 'colorGrey550'
  | 'colorGrey600'
  | 'colorGrey650'
  | 'colorGrey700'
  | 'colorGrey750'
  | 'colorGrey800'
  | 'colorGrey850'
  | 'colorGrey900'
  | 'colorGrey950'
  | 'colorOrange100'
  | 'colorOrange500'
  | 'colorOrange600'
  | 'colorOrange700'
  | 'colorPurple400'
  | 'colorPurple600'
  | 'colorRed100'
  | 'colorRed500'
  | 'colorRed600'
  | 'colorRed700'
  | 'colorRed900'
  | 'colorYellow100'
  | 'colorYellow600'
  | 'colorYellow700'
  | 'colorYellow800'
  | 'colorYellow900'
  | 'colorTransparent'
  | 'colorWhite';
export type ColorChartsTokenName =
  | 'colorChartsRed300'
  | 'colorChartsRed400'
  | 'colorChartsRed500'
  | 'colorChartsRed600'
  | 'colorChartsRed700'
  | 'colorChartsRed800'
  | 'colorChartsRed900'
  | 'colorChartsRed1000'
  | 'colorChartsRed1100'
  | 'colorChartsRed1200'
  | 'colorChartsOrange300'
  | 'colorChartsOrange400'
  | 'colorChartsOrange500'
  | 'colorChartsOrange600'
  | 'colorChartsOrange700'
  | 'colorChartsOrange800'
  | 'colorChartsOrange900'
  | 'colorChartsOrange1000'
  | 'colorChartsOrange1100'
  | 'colorChartsOrange1200'
  | 'colorChartsYellow300'
  | 'colorChartsYellow400'
  | 'colorChartsYellow500'
  | 'colorChartsYellow600'
  | 'colorChartsYellow700'
  | 'colorChartsYellow800'
  | 'colorChartsYellow900'
  | 'colorChartsYellow1000'
  | 'colorChartsYellow1100'
  | 'colorChartsYellow1200'
  | 'colorChartsGreen300'
  | 'colorChartsGreen400'
  | 'colorChartsGreen500'
  | 'colorChartsGreen600'
  | 'colorChartsGreen700'
  | 'colorChartsGreen800'
  | 'colorChartsGreen900'
  | 'colorChartsGreen1000'
  | 'colorChartsGreen1100'
  | 'colorChartsGreen1200'
  | 'colorChartsTeal300'
  | 'colorChartsTeal400'
  | 'colorChartsTeal500'
  | 'colorChartsTeal600'
  | 'colorChartsTeal700'
  | 'colorChartsTeal800'
  | 'colorChartsTeal900'
  | 'colorChartsTeal1000'
  | 'colorChartsTeal1100'
  | 'colorChartsTeal1200'
  | 'colorChartsBlue1300'
  | 'colorChartsBlue1400'
  | 'colorChartsBlue1500'
  | 'colorChartsBlue1600'
  | 'colorChartsBlue1700'
  | 'colorChartsBlue1800'
  | 'colorChartsBlue1900'
  | 'colorChartsBlue11000'
  | 'colorChartsBlue11100'
  | 'colorChartsBlue11200'
  | 'colorChartsBlue2300'
  | 'colorChartsBlue2400'
  | 'colorChartsBlue2500'
  | 'colorChartsBlue2600'
  | 'colorChartsBlue2700'
  | 'colorChartsBlue2800'
  | 'colorChartsBlue2900'
  | 'colorChartsBlue21000'
  | 'colorChartsBlue21100'
  | 'colorChartsBlue21200'
  | 'colorChartsPurple300'
  | 'colorChartsPurple400'
  | 'colorChartsPurple500'
  | 'colorChartsPurple600'
  | 'colorChartsPurple700'
  | 'colorChartsPurple800'
  | 'colorChartsPurple900'
  | 'colorChartsPurple1000'
  | 'colorChartsPurple1100'
  | 'colorChartsPurple1200'
  | 'colorChartsPink300'
  | 'colorChartsPink400'
  | 'colorChartsPink500'
  | 'colorChartsPink600'
  | 'colorChartsPink700'
  | 'colorChartsPink800'
  | 'colorChartsPink900'
  | 'colorChartsPink1000'
  | 'colorChartsPink1100'
  | 'colorChartsPink1200'
  | 'colorChartsStatusCritical'
  | 'colorChartsStatusHigh'
  | 'colorChartsStatusMedium'
  | 'colorChartsStatusLow'
  | 'colorChartsStatusPositive'
  | 'colorChartsStatusInfo'
  | 'colorChartsStatusNeutral'
  | 'colorChartsThresholdNegative'
  | 'colorChartsThresholdPositive'
  | 'colorChartsThresholdInfo'
  | 'colorChartsThresholdNeutral'
  | 'colorChartsLineGrid'
  | 'colorChartsLineTick'
  | 'colorChartsLineAxis'
  | 'colorChartsPaletteCategorical1'
  | 'colorChartsPaletteCategorical2'
  | 'colorChartsPaletteCategorical3'
  | 'colorChartsPaletteCategorical4'
  | 'colorChartsPaletteCategorical5'
  | 'colorChartsPaletteCategorical6'
  | 'colorChartsPaletteCategorical7'
  | 'colorChartsPaletteCategorical8'
  | 'colorChartsPaletteCategorical9'
  | 'colorChartsPaletteCategorical10'
  | 'colorChartsPaletteCategorical11'
  | 'colorChartsPaletteCategorical12'
  | 'colorChartsPaletteCategorical13'
  | 'colorChartsPaletteCategorical14'
  | 'colorChartsPaletteCategorical15'
  | 'colorChartsPaletteCategorical16'
  | 'colorChartsPaletteCategorical17'
  | 'colorChartsPaletteCategorical18'
  | 'colorChartsPaletteCategorical19'
  | 'colorChartsPaletteCategorical20'
  | 'colorChartsPaletteCategorical21'
  | 'colorChartsPaletteCategorical22'
  | 'colorChartsPaletteCategorical23'
  | 'colorChartsPaletteCategorical24'
  | 'colorChartsPaletteCategorical25'
  | 'colorChartsPaletteCategorical26'
  | 'colorChartsPaletteCategorical27'
  | 'colorChartsPaletteCategorical28'
  | 'colorChartsPaletteCategorical29'
  | 'colorChartsPaletteCategorical30'
  | 'colorChartsPaletteCategorical31'
  | 'colorChartsPaletteCategorical32'
  | 'colorChartsPaletteCategorical33'
  | 'colorChartsPaletteCategorical34'
  | 'colorChartsPaletteCategorical35'
  | 'colorChartsPaletteCategorical36'
  | 'colorChartsPaletteCategorical37'
  | 'colorChartsPaletteCategorical38'
  | 'colorChartsPaletteCategorical39'
  | 'colorChartsPaletteCategorical40'
  | 'colorChartsPaletteCategorical41'
  | 'colorChartsPaletteCategorical42'
  | 'colorChartsPaletteCategorical43'
  | 'colorChartsPaletteCategorical44'
  | 'colorChartsPaletteCategorical45'
  | 'colorChartsPaletteCategorical46'
  | 'colorChartsPaletteCategorical47'
  | 'colorChartsPaletteCategorical48'
  | 'colorChartsPaletteCategorical49'
  | 'colorChartsPaletteCategorical50';
export type ColorSeverityTokenName =
  | 'colorSeverityDarkRed'
  | 'colorSeverityRed'
  | 'colorSeverityOrange'
  | 'colorSeverityYellow'
  | 'colorSeverityGrey'
  | 'colorBackgroundNotificationSeverityCritical'
  | 'colorBackgroundNotificationSeverityHigh'
  | 'colorBackgroundNotificationSeverityMedium'
  | 'colorBackgroundNotificationSeverityLow'
  | 'colorBackgroundNotificationSeverityNeutral'
  | 'colorTextNotificationSeverityCritical'
  | 'colorTextNotificationSeverityHigh'
  | 'colorTextNotificationSeverityMedium'
  | 'colorTextNotificationSeverityLow'
  | 'colorTextNotificationSeverityNeutral';
export type ColorsTokenName =
  | 'colorGreyOpaque10'
  | 'colorGreyOpaque25'
  | 'colorGreyOpaque40'
  | 'colorGreyOpaque50'
  | 'colorGreyOpaque70'
  | 'colorGreyOpaque80'
  | 'colorGreyOpaque90'
  | 'colorGreyTransparent'
  | 'colorGreyTransparentHeavy'
  | 'colorGreyTransparentLight'
  | 'colorBackgroundBadgeIcon'
  | 'colorBackgroundButtonLinkActive'
  | 'colorBackgroundButtonLinkHover'
  | 'colorBackgroundButtonNormalActive'
  | 'colorBackgroundButtonNormalDefault'
  | 'colorBackgroundButtonNormalDisabled'
  | 'colorBackgroundButtonNormalHover'
  | 'colorBackgroundToggleButtonNormalPressed'
  | 'colorBackgroundButtonPrimaryActive'
  | 'colorBackgroundButtonPrimaryDefault'
  | 'colorBackgroundButtonPrimaryDisabled'
  | 'colorBackgroundButtonPrimaryHover'
  | 'colorBackgroundDirectionButtonActive'
  | 'colorBackgroundDirectionButtonDefault'
  | 'colorBackgroundDirectionButtonDisabled'
  | 'colorBackgroundDirectionButtonHover'
  | 'colorBackgroundCalendarCurrentDate'
  | 'colorBackgroundCellShaded'
  | 'colorBackgroundCodeEditorGutterActiveLineDefault'
  | 'colorBackgroundCodeEditorGutterActiveLineError'
  | 'colorBackgroundCodeEditorGutterDefault'
  | 'colorBackgroundCodeEditorLoading'
  | 'colorBackgroundCodeEditorPaneItemHover'
  | 'colorBackgroundCodeEditorStatusBar'
  | 'colorBackgroundContainerContent'
  | 'colorBackgroundContainerHeader'
  | 'colorBackgroundControlChecked'
  | 'colorBackgroundControlDefault'
  | 'colorBackgroundControlDisabled'
  | 'colorBackgroundDropdownItemDefault'
  | 'colorBackgroundDropdownItemDimmed'
  | 'colorBackgroundDropdownItemFilterMatch'
  | 'colorBackgroundDropdownItemHover'
  | 'colorBackgroundDropdownItemSelected'
  | 'colorBackgroundHomeHeader'
  | 'colorBackgroundInputDefault'
  | 'colorBackgroundInputDisabled'
  | 'colorBackgroundItemSelected'
  | 'colorBackgroundLayoutMain'
  | 'colorBackgroundLayoutMobilePanel'
  | 'colorBackgroundLayoutPanelContent'
  | 'colorBackgroundLayoutPanelHover'
  | 'colorBackgroundLayoutToggleActive'
  | 'colorBackgroundLayoutToggleDefault'
  | 'colorBackgroundLayoutToggleHover'
  | 'colorBackgroundLayoutToggleSelectedDefault'
  | 'colorBackgroundLayoutToggleSelectedHover'
  | 'colorBackgroundLayoutToggleSelectedActive'
  | 'colorBackgroundModalOverlay'
  | 'colorBackgroundNotificationBlue'
  | 'colorBackgroundNotificationGreen'
  | 'colorBackgroundNotificationGrey'
  | 'colorBackgroundNotificationRed'
  | 'colorBackgroundNotificationYellow'
  | 'colorBackgroundNotificationStackBar'
  | 'colorBackgroundNotificationStackBarActive'
  | 'colorBackgroundNotificationStackBarHover'
  | 'colorBackgroundPopover'
  | 'colorBackgroundProgressBarContentDefault'
  | 'colorBackgroundProgressBarContentInFlash'
  | 'colorBackgroundProgressBarLayoutDefault'
  | 'colorBackgroundProgressBarLayoutInFlash'
  | 'colorBackgroundSegmentActive'
  | 'colorBackgroundSegmentDefault'
  | 'colorBackgroundSegmentDisabled'
  | 'colorBackgroundSegmentHover'
  | 'colorBackgroundSliderHandleDefault'
  | 'colorBackgroundSliderHandleActive'
  | 'colorBackgroundSliderTrack'
  | 'colorBackgroundSliderHandleRing'
  | 'colorBackgroundSliderErrorPressed'
  | 'colorBackgroundSliderWarningPressed'
  | 'colorBackgroundStatusError'
  | 'colorBackgroundStatusInfo'
  | 'colorBackgroundStatusSuccess'
  | 'colorBackgroundStatusWarning'
  | 'colorBackgroundTableHeader'
  | 'colorBackgroundTilesDisabled'
  | 'colorBackgroundToggleCheckedDisabled'
  | 'colorBackgroundToggleDefault'
  | 'colorBackgroundAvatarGenAi'
  | 'colorBackgroundAvatarDefault'
  | 'colorTextAvatar'
  | 'colorBackgroundLoadingBarGenAi'
  | 'colorBackgroundChatBubbleOutgoing'
  | 'colorBackgroundChatBubbleIncoming'
  | 'colorTextChatBubbleOutgoing'
  | 'colorTextChatBubbleIncoming'
  | 'colorBorderButtonNormalActive'
  | 'colorBorderButtonNormalDefault'
  | 'colorBorderToggleButtonNormalPressed'
  | 'colorBorderButtonNormalDisabled'
  | 'colorTextButtonNormalDisabled'
  | 'colorBorderButtonNormalHover'
  | 'colorBorderButtonPrimaryDisabled'
  | 'colorTextButtonPrimaryDisabled'
  | 'colorBorderCalendarGrid'
  | 'colorBorderCalendarGridSelectedFocusRing'
  | 'colorBorderCodeEditorAceActiveLineLightTheme'
  | 'colorBorderCodeEditorAceActiveLineDarkTheme'
  | 'colorBorderCodeEditorDefault'
  | 'colorBorderCodeEditorPaneItemHover'
  | 'colorBorderContainerDivider'
  | 'colorBorderContainerTop'
  | 'colorBorderControlChecked'
  | 'colorBorderControlDefault'
  | 'colorBorderControlDisabled'
  | 'colorBorderDividerActive'
  | 'colorBorderDividerDefault'
  | 'colorBorderDividerSecondary'
  | 'colorBorderDividerPanelBottom'
  | 'colorBorderDividerPanelSide'
  | 'colorBorderDropdownContainer'
  | 'colorBorderDropdownGroup'
  | 'colorBorderDropdownItemDefault'
  | 'colorBorderDropdownItemDimmedHover'
  | 'colorBorderDropdownItemHover'
  | 'colorBorderDropdownItemSelected'
  | 'colorBorderDropdownItemTop'
  | 'colorBorderEditableCellHover'
  | 'colorBorderInputDefault'
  | 'colorBorderInputDisabled'
  | 'colorBorderInputFocused'
  | 'colorBorderItemFocused'
  | 'colorBorderDropdownItemFocused'
  | 'colorBorderItemPlaceholder'
  | 'colorBorderItemSelected'
  | 'colorBorderLayout'
  | 'colorBorderNotificationStackBar'
  | 'colorBorderPanelHeader'
  | 'colorBorderPopover'
  | 'colorBorderSegmentActive'
  | 'colorBorderSegmentDefault'
  | 'colorBorderSegmentDisabled'
  | 'colorBorderSegmentHover'
  | 'colorBorderStatusError'
  | 'colorBorderStatusInfo'
  | 'colorBorderStatusSuccess'
  | 'colorBorderStatusWarning'
  | 'colorBorderDividerInteractiveDefault'
  | 'colorBorderTabsDivider'
  | 'colorBorderTabsShadow'
  | 'colorBorderTabsUnderline'
  | 'colorBorderTilesDisabled'
  | 'colorBorderTutorial'
  | 'colorForegroundControlDefault'
  | 'colorForegroundControlDisabled'
  | 'colorForegroundControlReadOnly'
  | 'colorShadowDefault'
  | 'colorShadowMedium'
  | 'colorShadowSide'
  | 'colorStrokeChartLine'
  | 'colorStrokeCodeEditorResizeHandler'
  | 'colorStrokeCodeEditorGutterActiveLineDefault'
  | 'colorStrokeCodeEditorGutterActiveLineHover'
  | 'colorTextAccent'
  | 'colorTextBodyDefault'
  | 'colorTextBodySecondary'
  | 'colorTextBreadcrumbCurrent'
  | 'colorTextBreadcrumbIcon'
  | 'colorTextButtonInlineIconDefault'
  | 'colorTextButtonInlineIconDisabled'
  | 'colorTextButtonInlineIconHover'
  | 'colorTextButtonNormalActive'
  | 'colorTextToggleButtonNormalPressed'
  | 'colorTextButtonNormalDefault'
  | 'colorTextButtonNormalHover'
  | 'colorTextLinkButtonNormalDefault'
  | 'colorTextLinkButtonNormalHover'
  | 'colorTextLinkButtonNormalActive'
  | 'colorTextButtonPrimaryActive'
  | 'colorTextButtonPrimaryDefault'
  | 'colorTextButtonPrimaryHover'
  | 'colorTextDirectionButtonDefault'
  | 'colorTextDirectionButtonDisabled'
  | 'colorTextCalendarDateHover'
  | 'colorTextCalendarDateSelected'
  | 'colorTextCalendarMonth'
  | 'colorTextCodeEditorGutterActiveLine'
  | 'colorTextCodeEditorGutterDefault'
  | 'colorTextCodeEditorStatusBarDisabled'
  | 'colorTextCodeEditorTabButtonError'
  | 'colorTextColumnHeader'
  | 'colorTextColumnSortingIcon'
  | 'colorTextControlDisabled'
  | 'colorTextCounter'
  | 'colorTextDisabled'
  | 'colorTextDisabledInlineEdit'
  | 'colorTextDropdownFooter'
  | 'colorTextDropdownGroupLabel'
  | 'colorTextDropdownItemDefault'
  | 'colorTextDropdownItemDimmed'
  | 'colorTextDropdownItemDisabled'
  | 'colorTextDropdownItemFilterMatch'
  | 'colorTextDropdownItemHighlighted'
  | 'colorTextDropdownItemSecondary'
  | 'colorTextDropdownItemSecondaryHover'
  | 'colorTextEmpty'
  | 'colorTextExpandableSectionDefault'
  | 'colorTextExpandableSectionHover'
  | 'colorTextExpandableSectionNavigationIconDefault'
  | 'colorTextFormDefault'
  | 'colorTextFormLabel'
  | 'colorTextFormSecondary'
  | 'colorTextGroupLabel'
  | 'colorTextHeadingDefault'
  | 'colorTextHeadingSecondary'
  | 'colorTextHomeHeaderDefault'
  | 'colorTextHomeHeaderSecondary'
  | 'colorTextIconCaret'
  | 'colorTextIconSubtle'
  | 'colorTextInputDisabled'
  | 'colorTextInputPlaceholder'
  | 'colorTextInputPlaceholderDisabled'
  | 'colorTextInteractiveActive'
  | 'colorTextInteractiveDefault'
  | 'colorTextInteractiveDisabled'
  | 'colorTextInteractiveHover'
  | 'colorTextToggleButtonIconPressed'
  | 'colorTextInteractiveInvertedDefault'
  | 'colorTextInteractiveInvertedHover'
  | 'colorTextInverted'
  | 'colorTextLabel'
  | 'colorTextLabelGenAi'
  | 'colorTextLayoutToggle'
  | 'colorTextLayoutToggleActive'
  | 'colorTextLayoutToggleHover'
  | 'colorTextLayoutToggleSelected'
  | 'colorTextLinkButtonUnderline'
  | 'colorTextLinkButtonUnderlineHover'
  | 'colorTextLinkDefault'
  | 'colorTextLinkHover'
  | 'colorTextLinkInvertedHover'
  | 'colorTextNotificationDefault'
  | 'colorTextNotificationStackBar'
  | 'colorTextNotificationYellow'
  | 'colorTextPaginationPageNumberActiveDisabled'
  | 'colorTextPaginationPageNumberDefault'
  | 'colorTextSegmentActive'
  | 'colorTextSegmentDefault'
  | 'colorTextSegmentHover'
  | 'colorTextSmall'
  | 'colorTextStatusError'
  | 'colorTextStatusInactive'
  | 'colorTextStatusInfo'
  | 'colorTextStatusSuccess'
  | 'colorTextStatusWarning'
  | 'colorTextTopNavigationTitle'
  | 'colorBoardPlaceholderActive'
  | 'colorBoardPlaceholderHover'
  | 'colorDragPlaceholderActive'
  | 'colorDragPlaceholderHover'
  | 'colorDropzoneBackgroundDefault'
  | 'colorDropzoneBackgroundHover'
  | 'colorDropzoneTextDefault'
  | 'colorDropzoneTextHover'
  | 'colorDropzoneBorderDefault'
  | 'colorDropzoneBorderHover';
export type TypographyTokenName =
  | 'fontBoxValueLargeWeight'
  | 'fontButtonLetterSpacing'
  | 'fontChartDetailSize'
  | 'fontDisplayLabelWeight'
  | 'fontExpandableHeadingSize'
  | 'fontFamilyBase'
  | 'fontFamilyMonospace'
  | 'fontHeaderH2DescriptionLineHeight'
  | 'fontHeaderH2DescriptionSize'
  | 'fontLinkButtonLetterSpacing'
  | 'fontLinkButtonWeight'
  | 'fontPanelHeaderLineHeight'
  | 'fontPanelHeaderSize'
  | 'fontSizeBodyM'
  | 'fontSizeBodyS'
  | 'fontSizeDisplayL'
  | 'fontSizeHeadingXl'
  | 'fontSizeHeadingL'
  | 'fontSizeHeadingM'
  | 'fontSizeHeadingS'
  | 'fontSizeHeadingXs'
  | 'fontSmoothingMozOsx'
  | 'fontSmoothingWebkit'
  | 'fontTabsDisabledWeight'
  | 'fontTabsLineHeight'
  | 'fontTabsSize'
  | 'fontWayfindingLinkActiveWeight'
  | 'fontWeightButton'
  | 'fontWeightHeadingXl'
  | 'fontWeightHeadingL'
  | 'fontWeightHeadingM'
  | 'fontWeightHeadingS'
  | 'fontWeightHeadingXs'
  | 'fontWeightHeavy'
  | 'letterSpacingBodyS'
  | 'letterSpacingDisplayL'
  | 'letterSpacingHeadingXl'
  | 'letterSpacingHeadingL'
  | 'letterSpacingHeadingM'
  | 'letterSpacingHeadingS'
  | 'lineHeightBodyM'
  | 'lineHeightBodyS'
  | 'lineHeightDisplayL'
  | 'lineHeightHeadingXl'
  | 'lineHeightHeadingL'
  | 'lineHeightHeadingM'
  | 'lineHeightHeadingS'
  | 'lineHeightHeadingXs';
export type BordersTokenName =
  | 'borderActiveWidth'
  | 'borderCodeEditorStatusDividerWidth'
  | 'borderContainerStickyWidth'
  | 'borderContainerTopWidth'
  | 'borderControlFocusRingShadowSpread'
  | 'borderControlInvalidFocusRingShadowSpread'
  | 'borderDividerListWidth'
  | 'borderDividerSectionWidth'
  | 'borderDropdownVirtualOffsetWidth'
  | 'borderInvalidWidth'
  | 'borderItemWidth'
  | 'borderLineChartDashArray'
  | 'borderLineChartLineJoin'
  | 'borderLineChartWidth'
  | 'borderPanelHeaderWidth'
  | 'borderPanelTopWidth'
  | 'borderRadiusAlert'
  | 'borderRadiusBadge'
  | 'borderRadiusButton'
  | 'borderRadiusCalendarDayFocusRing'
  | 'borderRadiusCodeEditor'
  | 'borderRadiusContainer'
  | 'borderRadiusControlCircularFocusRing'
  | 'borderRadiusControlDefaultFocusRing'
  | 'borderRadiusDropdown'
  | 'borderRadiusDropzone'
  | 'borderRadiusFlashbar'
  | 'borderRadiusInput'
  | 'borderRadiusItem'
  | 'borderRadiusPopover'
  | 'borderRadiusTabsFocusRing'
  | 'borderRadiusTiles'
  | 'borderRadiusToken'
  | 'borderRadiusChatBubble'
  | 'borderRadiusTutorialPanelItem'
  | 'borderTableStickyWidth'
  | 'borderLinkFocusRingOutline'
  | 'borderLinkFocusRingShadowSpread'
  | 'borderWidthAlert'
  | 'borderWidthButton'
  | 'borderWidthDropdown'
  | 'borderWidthField'
  | 'borderWidthPopover'
  | 'borderWidthToken';
export type MotionTokenName =
  | 'motionDurationExtraFast'
  | 'motionDurationExtraSlow'
  | 'motionDurationFast'
  | 'motionDurationModerate'
  | 'motionDurationRefreshOnlyAmbient'
  | 'motionDurationRefreshOnlyFast'
  | 'motionDurationRefreshOnlyMedium'
  | 'motionDurationRefreshOnlySlow'
  | 'motionDurationRotate180'
  | 'motionDurationRotate90'
  | 'motionDurationShowPaced'
  | 'motionDurationShowQuick'
  | 'motionDurationSlow'
  | 'motionDurationTransitionQuick'
  | 'motionDurationTransitionShowPaced'
  | 'motionDurationTransitionShowQuick'
  | 'motionDurationAvatarGenAiGradient'
  | 'motionDurationAvatarLoadingDots'
  | 'motionEasingEaseOutQuart'
  | 'motionEasingRefreshOnlyA'
  | 'motionEasingRefreshOnlyB'
  | 'motionEasingRefreshOnlyC'
  | 'motionEasingRefreshOnlyD'
  | 'motionEasingAvatarGenAiGradient'
  | 'motionEasingRotate180'
  | 'motionEasingRotate90'
  | 'motionEasingShowPaced'
  | 'motionEasingShowQuick'
  | 'motionEasingTransitionQuick'
  | 'motionEasingTransitionShowPaced'
  | 'motionEasingTransitionShowQuick'
  | 'motionEasingResponsive'
  | 'motionEasingSticky'
  | 'motionEasingExpressive'
  | 'motionDurationResponsive'
  | 'motionDurationExpressive'
  | 'motionDurationComplex'
  | 'motionKeyframesFadeIn'
  | 'motionKeyframesFadeOut'
  | 'motionKeyframesStatusIconError'
  | 'motionKeyframesScalePopup';
export type SizesTokenName =
  | 'sizeCalendarGridWidth'
  | 'sizeControl'
  | 'sizeIconBig'
  | 'sizeIconLarge'
  | 'sizeIconMedium'
  | 'sizeIconNormal'
  | 'sizeTableSelectionHorizontal'
  | 'sizeVerticalInput'
  | 'sizeVerticalPanelIconOffset';
export type SpacingTokenName =
  | 'spaceAlertActionLeft'
  | 'spaceAlertHorizontal'
  | 'spaceAlertMessageRight'
  | 'spaceAlertVertical'
  | 'spaceButtonFocusOutlineGutter'
  | 'spaceButtonHorizontal'
  | 'spaceButtonIconFocusOutlineGutterVertical'
  | 'spaceButtonIconOnlyHorizontal'
  | 'spaceButtonInlineIconFocusOutlineGutter'
  | 'spaceButtonModalDismissVertical'
  | 'spaceCalendarGridFocusOutlineGutter'
  | 'spaceCalendarGridSelectedFocusOutlineGutter'
  | 'spaceCalendarGridGutter'
  | 'spaceCardHorizontal'
  | 'spaceCardVertical'
  | 'spaceCodeEditorStatusFocusOutlineGutter'
  | 'spaceContainerContentTop'
  | 'spaceContainerHeaderTop'
  | 'spaceContainerHeaderBottom'
  | 'spaceContainerHorizontal'
  | 'spaceContentHeaderPaddingBottom'
  | 'spaceDarkHeaderOverlapDistance'
  | 'spaceExpandableSectionIconOffsetTop'
  | 'spaceFieldHorizontal'
  | 'spaceFieldIconOffset'
  | 'spaceFilteringTokenDismissButtonFocusOutlineGutter'
  | 'spaceFilteringTokenOperationSelectFocusOutlineGutter'
  | 'spaceFlashbarActionLeft'
  | 'spaceFlashbarDismissRight'
  | 'spaceFlashbarHorizontal'
  | 'spaceFlashbarVertical'
  | 'spaceGridGutter'
  | 'spaceKeyValueGap'
  | 'spaceLayoutContentBottom'
  | 'spaceLayoutContentHorizontal'
  | 'spaceLayoutToggleDiameter'
  | 'spaceLayoutTogglePadding'
  | 'spaceModalContentBottom'
  | 'spaceModalHorizontal'
  | 'spaceOptionIconBigTop'
  | 'spacePanelContentBottom'
  | 'spacePanelContentTop'
  | 'spacePanelDividerMarginHorizontal'
  | 'spacePanelHeaderVertical'
  | 'spacePanelNavLeft'
  | 'spacePanelSideLeft'
  | 'spacePanelSideRight'
  | 'spacePanelSplitTop'
  | 'spacePanelSplitBottom'
  | 'spaceSegmentedControlFocusOutlineGutter'
  | 'spaceTableHeaderFocusOutlineGutter'
  | 'spaceTabsContentTop'
  | 'spaceTabsFocusOutlineGutter'
  | 'spaceTableContentBottom'
  | 'spaceTableEmbeddedHeaderTop'
  | 'spaceTableFooterHorizontal'
  | 'spaceTableHeaderHorizontal'
  | 'spaceTableHeaderToolsBottom'
  | 'spaceTableHeaderToolsFullPageBottom'
  | 'spaceTableHorizontal'
  | 'spaceTileGutter'
  | 'spaceL'
  | 'spaceM'
  | 'spaceNone'
  | 'spaceS'
  | 'spaceScaled2xL'
  | 'spaceScaled2xM'
  | 'spaceScaled2xNone'
  | 'spaceScaled2xS'
  | 'spaceScaled2xXl'
  | 'spaceScaled2xXs'
  | 'spaceScaled2xXxl'
  | 'spaceScaled2xXxs'
  | 'spaceScaled2xXxxl'
  | 'spaceScaled2xXxxs'
  | 'spaceScaledL'
  | 'spaceScaledM'
  | 'spaceScaledNone'
  | 'spaceScaledS'
  | 'spaceScaledXl'
  | 'spaceScaledXs'
  | 'spaceScaledXxl'
  | 'spaceScaledXxs'
  | 'spaceScaledXxxl'
  | 'spaceScaledXxxs'
  | 'spaceStaticS'
  | 'spaceStaticM'
  | 'spaceStaticL'
  | 'spaceStaticXl'
  | 'spaceStaticXs'
  | 'spaceStaticXxl'
  | 'spaceStaticXxs'
  | 'spaceStaticXxxl'
  | 'spaceStaticXxxs'
  | 'spaceXl'
  | 'spaceXs'
  | 'spaceXxl'
  | 'spaceXxs'
  | 'spaceXxxl'
  | 'spaceXxxs';
export type ShadowsTokenName =
  | 'shadowContainer'
  | 'shadowContainerStacked'
  | 'shadowContainerActive'
  | 'shadowDropdown'
  | 'shadowDropup'
  | 'shadowFlashCollapsed'
  | 'shadowFlashSticky'
  | 'shadowModal'
  | 'shadowPanel'
  | 'shadowPanelToggle'
  | 'shadowPopover'
  | 'shadowSplitBottom'
  | 'shadowSplitSide'
  | 'shadowSticky'
  | 'shadowStickyEmbedded'
  | 'shadowStickyColumnFirst'
  | 'shadowStickyColumnLast';

export type GlobalScopeTokenName = ColorPaletteTokenName | TypographyTokenName | BordersTokenName;
export type ColorScopeTokenName = ColorChartsTokenName | ColorsTokenName | ShadowsTokenName | ColorSeverityTokenName;
export type MotionScopeTokenName = MotionTokenName;
export type DensityScopeTokenName = SizesTokenName | SpacingTokenName;

export type TokenName = GlobalScopeTokenName | ColorScopeTokenName | MotionScopeTokenName | DensityScopeTokenName;
