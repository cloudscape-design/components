// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';

import { expandColorDictionary } from '../utils';

const tokens: StyleDictionary.ColorsDictionary = {
  colorGreyOpaque25: 'rgba(255, 255, 255, 0.25)',
  colorGreyOpaque40: 'rgba(0, 0, 0, 0.4)',
  colorGreyOpaque50: 'rgba(0, 0, 0, 0.5)',
  colorGreyOpaque70: { light: 'rgba(35, 47, 62, 0.7)', dark: 'rgba(0, 7, 22, 0.7)' },
  colorGreyOpaque80: 'rgba(22, 25, 31, 0.8)',
  colorGreyOpaque90: 'rgba(242, 243, 243, 0.9)',
  colorGreyTransparent: { light: 'rgba(0, 7, 22, 0.12)', dark: 'rgba(0, 7, 22, 1)' },
  colorGreyTransparentHeavy: { light: 'rgba(0, 7, 22, 0.12)', dark: 'rgba(0, 7, 22, 1)' },
  colorGreyTransparentLight: { light: 'rgba(0, 7, 22, 0.12)', dark: 'rgba(0, 7, 22, 1)' },
  colorBackgroundBadgeIcon: { light: '{colorRed600}', dark: '{colorRed500}' },
  colorBackgroundButtonLinkActive: { light: '{colorBlue200}', dark: '{colorGrey650}' },
  colorBackgroundButtonLinkHover: { light: '{colorBlue100}', dark: '{colorGrey750}' },
  colorBackgroundButtonNormalActive: { light: '{colorBlue200}', dark: '{colorGrey650}' },
  colorBackgroundButtonNormalDefault: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorBackgroundButtonNormalDisabled: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorBackgroundButtonNormalHover: { light: '{colorBlue100}', dark: '{colorGrey750}' },
  colorBackgroundButtonPrimaryActive: { light: '{colorBlue800}', dark: '{colorBlue500}' },
  colorBackgroundButtonPrimaryDefault: '{colorBorderButtonNormalDefault}',
  colorBackgroundButtonPrimaryDisabled: { light: '{colorGrey200}', dark: '{colorGrey650}' },
  colorBackgroundButtonPrimaryHover: '{colorBorderButtonNormalHover}',
  colorBackgroundCalendarToday: { light: '{colorGrey150}', dark: '{colorGrey650}' },
  colorBackgroundCellShaded: { light: '{colorGrey125}', dark: '{colorGrey700}' },
  colorBackgroundCodeEditorGutterActiveLineDefault: { light: '{colorGrey550}', dark: '{colorGrey500}' },
  colorBackgroundCodeEditorGutterActiveLineError: '{colorTextStatusError}',
  colorBackgroundCodeEditorGutterDefault: { light: '{colorGrey150}', dark: '{colorGrey750}' },
  colorBackgroundCodeEditorLoading: { light: '{colorGrey100}', dark: '{colorGrey750}' },
  colorBackgroundCodeEditorPaneItemHover: { light: '{colorGrey200}', dark: '{colorGrey650}' },
  colorBackgroundCodeEditorStatusBar: { light: '{colorGrey150}', dark: '{colorGrey750}' },
  colorBackgroundContainerContent: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorBackgroundContainerHeader: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorBackgroundControlChecked: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBackgroundControlDefault: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorBackgroundControlDisabled: { light: '{colorGrey300}', dark: '{colorGrey650}' },
  colorBackgroundDropdownItemDefault: { light: '{colorWhite}', dark: '{colorGrey750}' },
  colorBackgroundDropdownItemDimmed: 'transparent',
  colorBackgroundDropdownItemFilterMatch: { light: '{colorBlue100}', dark: '{colorGrey650}' },
  colorBackgroundDropdownItemHover: { light: '{colorGrey150}', dark: '{colorGrey650}' },
  colorBackgroundDropdownItemSelected: '{colorBackgroundItemSelected}',
  colorBackgroundHomeHeader: '{colorGrey900}',
  colorBackgroundInputDefault: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorBackgroundInputDisabled: { light: '{colorGrey200}', dark: '{colorGrey750}' },
  colorBackgroundItemSelected: { light: '{colorBlue100}', dark: '{colorGrey750}' },
  colorBackgroundLayoutMain: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorBackgroundLayoutMobilePanel: '{colorGrey900}',
  colorBackgroundLayoutPanelContent: '{colorBackgroundContainerContent}',
  colorBackgroundLayoutPanelHover: { light: '{colorGrey200}', dark: '{colorGrey650}' },
  colorBackgroundLayoutToggleActive: '{colorGrey650}',
  colorBackgroundLayoutToggleDefault: '{colorGrey750}',
  colorBackgroundLayoutToggleHover: '{colorGrey650}',
  colorBackgroundLayoutToggleSelectedActive: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBackgroundLayoutToggleSelectedHover: { light: '{colorBlue700}', dark: '{colorBlue400}' },
  colorBackgroundModalOverlay: '{colorGreyOpaque70}',
  colorBackgroundNotificationBlue: '{colorBlue600}',
  colorBackgroundNotificationGreen: '{colorGreen600}',
  colorBackgroundNotificationGrey: { light: '{colorGrey600}', dark: '{colorGrey550}' },
  colorBackgroundNotificationRed: '{colorRed600}',
  colorBackgroundNotificationYellow: '{colorYellow600}',
  colorBackgroundNotificationStackBar: '{colorGrey700}',
  colorBackgroundNotificationStackBarActive: '{colorGrey700}',
  colorBackgroundNotificationStackBarHover: '{colorGrey600}',
  colorBackgroundPopover: { light: '{colorWhite}', dark: '{colorGrey750}' },
  colorBackgroundProgressBarContentDefault: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBackgroundProgressBarContentInFlash: '{colorWhite}',
  colorBackgroundProgressBarLayoutDefault: { light: '{colorGrey200}', dark: '{colorGrey650}' },
  colorBackgroundProgressBarLayoutInFlash: '{colorGreyOpaque25}',
  colorBackgroundSegmentActive: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBackgroundSegmentDefault: '{colorBackgroundButtonNormalDefault}',
  colorBackgroundSegmentDisabled: '{colorBackgroundButtonNormalDisabled}',
  colorBackgroundSegmentHover: '{colorBackgroundSegmentDefault}',
  colorBackgroundStatusError: { light: '{colorRed100}', dark: '{colorRed900}' },
  colorBackgroundStatusInfo: { light: '{colorBlue100}', dark: '{colorBlue900}' },
  colorBackgroundStatusSuccess: { light: '{colorGreen100}', dark: '{colorGreen900}' },
  colorBackgroundStatusWarning: { light: '{colorYellow100}', dark: '{colorYellow900}' },
  colorBackgroundTableHeader: '{colorBackgroundContainerHeader}',
  colorBackgroundTilesDisabled: { light: '{colorGrey200}', dark: '{colorGrey750}' },
  colorBackgroundToggleCheckedDisabled: { light: '{colorBlue300}', dark: '{colorBlue800}' },
  colorBackgroundToggleDefault: { light: '{colorGrey600}', dark: '{colorGrey500}' },
  colorBorderButtonNormalActive: { light: '{colorBlue800}', dark: '{colorBlue400}' },
  colorBorderButtonNormalDefault: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBorderButtonNormalDisabled: { light: '{colorGrey400}', dark: '{colorGrey550}' },
  colorBorderButtonNormalHover: { light: '{colorBlue800}', dark: '{colorBlue400}' },
  colorBorderButtonPrimaryDisabled: '{colorBackgroundButtonPrimaryDisabled}',
  colorBorderCalendarGrid: 'transparent',
  colorBorderCalendarGridSelectedFocusRing: { light: '{colorGrey100}', dark: '{colorGrey800}' },
  colorBorderCodeEditorAceActiveLineLightTheme: '{colorGrey300}',
  colorBorderCodeEditorAceActiveLineDarkTheme: '{colorGrey550}',
  colorBorderCodeEditorDefault: { light: '{colorGrey300}', dark: '{colorGrey550}' },
  colorBorderCodeEditorPaneItemHover: '{colorBorderDropdownItemHover}',
  colorBorderContainerDivider: 'transparent',
  colorBorderContainerTop: 'transparent',
  colorBorderControlChecked: '{colorBackgroundControlChecked}',
  colorBorderControlDefault: '{colorGrey500}',
  colorBorderControlDisabled: '{colorBackgroundControlDisabled}',
  colorBorderDividerActive: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorBorderDividerDefault: { light: '{colorGrey200}', dark: '{colorGrey600}' },
  colorBorderDividerPanelBottom: { light: '{colorBorderDividerDefault}', dark: '{colorGreyTransparent}' },
  colorBorderDividerPanelSide: '{colorBorderDividerDefault}',
  colorBorderDropdownContainer: { light: '{colorGrey400}', dark: '{colorGrey550}' },
  colorBorderDropdownGroup: '{colorBorderDropdownItemDefault}',
  colorBorderDropdownItemDefault: '{colorBorderDividerDefault}',
  colorBorderDropdownItemHover: { light: '{colorGrey500}', dark: '{colorGrey550}' },
  colorBorderDropdownItemDimmedHover: '{colorGrey500}',
  colorBorderDropdownItemSelected: '{colorBorderItemSelected}',
  colorBorderDropdownItemTop: 'transparent',
  colorBorderEditableCellHover: '{colorBorderDropdownItemHover}',
  colorBorderInputDefault: { light: '{colorGrey500}', dark: '{colorGrey550}' },
  colorBorderInputDisabled: '{colorBackgroundInputDisabled}',
  colorBorderItemFocused: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBorderInputFocused: { light: '{colorBlue900}', dark: '{colorBlue400}' },
  colorBorderItemPlaceholder: '{colorBorderItemSelected}',
  colorBorderItemSelected: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBorderLayout: { light: '{colorGrey300}', dark: '{colorGrey650}' },
  colorBorderNotificationStackBar: '{colorGrey700}',
  colorBorderPopover: { light: '{colorGrey400}', dark: '{colorGrey550}' },
  colorBorderSegmentActive: '{colorBorderSegmentDefault}',
  colorBorderSegmentDefault: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorBorderSegmentDisabled: '{colorBorderSegmentDefault}',
  colorBorderSegmentHover: '{colorBorderSegmentDefault}',
  colorBorderStatusError: { light: '{colorRed600}', dark: '{colorRed500}' },
  colorBorderStatusInfo: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBorderStatusSuccess: { light: '{colorGreen600}', dark: '{colorGreen500}' },
  colorBorderStatusWarning: { light: '{colorYellow800}', dark: '{colorYellow700}' },
  colorBorderDividerInteractiveDefault: { light: '{colorGrey500}', dark: '{colorGrey300}' },
  colorBorderTabsDivider: { light: '{colorGrey200}', dark: '{colorGrey600}' },
  colorBorderTabsShadow: '{colorGreyTransparent}',
  colorBorderTabsUnderline: '{colorTextAccent}',
  colorBorderTilesDisabled: '{colorBackgroundTilesDisabled}',
  colorBorderTutorial: { light: '{colorGrey300}', dark: '{colorGrey600}' },
  colorForegroundControlDefault: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorForegroundControlDisabled: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorShadowDefault: '{colorGreyTransparentHeavy}',
  colorShadowMedium: '{colorGreyTransparent}',
  colorShadowSide: '{colorGreyTransparentLight}',
  colorStrokeChartLine: '{colorGrey500}',
  colorStrokeCodeEditorResizeHandler: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorStrokeCodeEditorGutterActiveLineDefault: { light: '{colorGrey300}', dark: '{colorGrey750}' },
  colorStrokeCodeEditorGutterActiveLineHover: { light: '{colorGrey100}', dark: '{colorGrey900}' },
  colorTextAccent: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorTextBodyDefault: { light: '{colorGrey900}', dark: '{colorGrey300}' },
  colorTextBodySecondary: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorTextBreadcrumbCurrent: { light: '{colorGrey550}', dark: '{colorGrey500}' },
  colorTextBreadcrumbIcon: { light: '{colorGrey500}', dark: '{colorTextInteractiveDisabled}' },
  colorTextButtonInlineIconDefault: '{colorTextLinkDefault}',
  colorTextButtonInlineIconDisabled: '{colorTextInteractiveDisabled}',
  colorTextButtonInlineIconHover: '{colorTextLinkHover}',
  colorTextButtonNormalActive: { light: '{colorBlue800}', dark: '{colorBlue400}' },
  colorTextButtonNormalDefault: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorTextButtonNormalHover: { light: '{colorBlue800}', dark: '{colorBlue400}' },
  colorTextLinkButtonNormalDefault: '{colorTextButtonNormalDefault}',
  colorTextLinkButtonNormalHover: '{colorTextButtonNormalHover}',
  colorTextLinkButtonNormalActive: '{colorTextButtonNormalActive}',
  colorTextButtonPrimaryActive: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextButtonPrimaryDefault: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextButtonPrimaryHover: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextCalendarDayHover: '{colorTextDropdownItemDefault}',
  colorTextCalendarDaySelected: '{colorTextAccent}',
  colorTextCalendarMonth: { light: '{colorGrey550}', dark: '{colorGrey450}' },
  colorTextCodeEditorGutterActiveLine: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextCodeEditorGutterDefault: { light: '{colorGrey900}', dark: '{colorGrey300}' },
  colorTextCodeEditorStatusBarDisabled: { light: '{colorGrey500}', dark: '{colorGrey550}' },
  colorTextCodeEditorTabButtonError: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextColumnHeader: { light: '{colorGrey600}', dark: '{colorGrey400}' },
  colorTextColumnSortingIcon: '{colorTextColumnHeader}',
  colorTextControlDisabled: '{colorTextInteractiveDisabled}',
  colorTextCounter: { light: '{colorGrey550}', dark: '{colorGrey450}' },
  colorTextDisabled: { light: '{colorGrey400}', dark: '{colorGrey550}' },
  colorTextDropdownFooter: '{colorTextFormSecondary}',
  colorTextDropdownGroupLabel: '{colorTextGroupLabel}',
  colorTextDropdownHeader: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorTextDropdownItemDefault: '{colorTextFormDefault}',
  colorTextDropdownItemDimmed: '{colorTextInteractiveDisabled}',
  colorTextDropdownItemDisabled: '{colorTextInteractiveDisabled}',
  colorTextDropdownItemFilterMatch: { light: '{colorBlue600}', dark: '{colorBlue400}' },
  colorTextDropdownItemHighlighted: { light: '{colorGrey900}', dark: '{colorGrey200}' },
  colorTextDropdownItemSecondary: '{colorTextFormSecondary}',
  colorTextDropdownItemSecondaryHover: { light: '{colorGrey550}', dark: '{colorGrey300}' },
  colorTextEmpty: { light: '{colorGrey550}', dark: '{colorGrey300}' },
  colorTextExpandableSectionDefault: '{colorTextInteractiveActive}',
  colorTextExpandableSectionHover: '{colorTextAccent}',
  colorTextExpandableSectionNavigationIconDefault: '{colorTextInteractiveDefault}',
  colorTextFormDefault: { light: '{colorGrey900}', dark: '{colorGrey300}' },
  colorTextFormLabel: '{colorTextFormDefault}',
  colorTextFormSecondary: { light: '{colorGrey550}', dark: '{colorGrey450}' },
  colorTextGroupLabel: { light: '{colorGrey600}', dark: '{colorGrey450}' },
  colorTextHeadingDefault: { light: '{colorGrey900}', dark: '{colorGrey200}' },
  colorTextHeadingSecondary: { light: '{colorGrey600}', dark: '{colorGrey450}' },
  colorTextHomeHeaderDefault: '{colorWhite}',
  colorTextHomeHeaderSecondary: '{colorGrey300}',
  colorTextIconCaret: { light: '{colorGrey500}', dark: '{colorGrey450}' },
  colorTextIconSubtle: { light: '{colorGrey550}', dark: '{colorGrey400}' },
  colorTextInputDisabled: { light: '{colorGrey400}', dark: '{colorGrey550}' },
  colorTextInputPlaceholder: { light: '{colorGrey550}', dark: '{colorGrey500}' },
  colorTextInputPlaceholderDisabled: '{colorTextInputDisabled}',
  colorTextInteractiveActive: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorTextInteractiveDefault: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorTextInteractiveDisabled: { light: '{colorGrey400}', dark: '{colorGrey550}' },
  colorTextInteractiveHover: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorTextInteractiveInvertedDefault: '{colorGrey300}',
  colorTextInteractiveInvertedHover: '{colorGrey100}',
  colorTextInverted: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextLabel: '{colorTextFormLabel}',
  colorTextLayoutToggle: '{colorWhite}',
  colorTextLayoutToggleActive: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorTextLayoutToggleHover: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorTextLayoutToggleSelected: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextLinkDefault: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorTextLinkHover: { light: '{colorBlue800}', dark: '{colorBlue400}' },
  colorTextLinkInvertedHover: '{colorWhite}',
  colorTextLinkButtonUnderline: 'transparent',
  colorTextLinkButtonUnderlineHover: 'transparent',
  colorTextNotificationDefault: '{colorGrey100}',
  colorTextNotificationStackBar: '{colorWhite}',
  colorTextNotificationYellow: '{colorGrey900}',
  colorTextPaginationPageNumberActiveDisabled: '{colorTextInteractiveDisabled}',
  colorTextPaginationPageNumberDefault: { light: '{colorTextInteractiveDefault}', dark: '{colorGrey400}' },
  colorTextSegmentActive: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextSegmentDefault: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorTextSegmentHover: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorTextSmall: { light: '{colorGrey550}', dark: '{colorGrey450}' },
  colorTextStatusError: { light: '{colorRed600}', dark: '{colorRed500}' },
  colorTextStatusInactive: { light: '{colorGrey550}', dark: '{colorGrey450}' },
  colorTextStatusInfo: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorTextStatusSuccess: { light: '{colorGreen600}', dark: '{colorGreen500}' },
  colorTextStatusWarning: { light: '{colorYellow800}', dark: '{colorYellow700}' },
  colorTextTopNavigationTitle: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorBoardPlaceholderActive: { light: '{colorGrey200}', dark: '{colorGrey550}' },
  colorBoardPlaceholderHover: { light: '{colorBlue200}', dark: '{colorBlue600}' },
  colorDragPlaceholderActive: { light: '{colorGrey200}', dark: '{colorGrey550}' },
  colorDragPlaceholderHover: { light: '{colorBlue200}', dark: '{colorBlue600}' },
  colorDropzoneBackgroundActive: { light: '{colorGrey200}', dark: '{colorGrey500}' },
  colorDropzoneBackgroundHover: { light: '{colorBlue200}', dark: '{colorBlue600}' },
  colorDropzoneTextActive: { light: '{colorGrey550}', dark: '{colorGrey800}' },
  colorDropzoneTextHover: { light: '{colorBlue800}', dark: '{colorWhite}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
