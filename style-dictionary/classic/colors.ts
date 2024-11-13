// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge';

import { expandColorDictionary } from '../utils';
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/colors';

const tokens: StyleDictionary.ColorsDictionary = {
  colorGreyOpaque70: 'rgba(255, 255, 255, 0.7)',
  colorGreyTransparent: { light: 'rgba(0, 28, 36, 0.3)', dark: 'rgba(0, 0, 0, 0.3)' },
  colorGreyTransparentHeavy: { light: 'rgba(0, 28, 36, 0.5)', dark: 'rgba(0, 0, 0, 0.5)' },
  colorGreyTransparentLight: { light: 'rgba(0, 28, 36, 0.15)', dark: 'rgba(0, 0, 0, 0.3)' },
  colorBackgroundButtonLinkActive: { light: '{colorGrey200}', dark: '{colorGrey900}' },
  colorBackgroundButtonLinkHover: { light: '{colorGrey100}' },
  colorBackgroundButtonNormalActive: { light: '{colorGrey200}', dark: '{colorGrey900}' },
  colorBackgroundButtonNormalDefault: { dark: '{colorGrey700}' },
  colorBackgroundButtonNormalDisabled: { dark: '{colorGrey700}' },
  colorBackgroundButtonNormalHover: { light: '{colorGrey100}' },
  colorBackgroundToggleButtonNormalPressed: { light: '{colorGrey200}', dark: '{colorGrey900}' },
  colorBackgroundButtonPrimaryActive: { light: '{colorBlue900}', dark: '{colorBlue400}' },
  colorBackgroundButtonPrimaryDefault: { light: '{colorBlue600}', dark: '{colorBlue400}' },
  colorBackgroundButtonPrimaryDisabled: { light: '{colorWhite}', dark: '{colorGrey700}' },
  colorBackgroundButtonPrimaryHover: { light: '{colorBlue700}', dark: '{colorBlue500}' },
  colorBackgroundCalendarCurrentDate: { dark: '{colorGrey900}' },
  colorBackgroundCellShaded: { light: '{colorGrey150}', dark: '{colorGrey900}' },
  colorBackgroundCodeEditorLoading: '{colorBackgroundCodeEditorStatusBar}',
  colorBackgroundContainerContent: { dark: '{colorGrey700}' },
  colorBackgroundContainerHeader: { light: '{colorGrey100}', dark: '{colorGrey750}' },
  colorBackgroundDropdownItemDefault: { dark: '{colorGrey700}' },
  colorBackgroundDropdownItemFilterMatch: { dark: '{colorBlue900}' },
  colorBackgroundHomeHeader: { light: '{colorBlack}', dark: '{colorBlack}' },
  colorBackgroundInputDisabled: { dark: '{colorGrey650}' },
  colorBackgroundItemSelected: { dark: '{colorBlue900}' },
  colorBackgroundLayoutMain: { light: '{colorGrey150}', dark: '{colorGrey900}' },
  colorBackgroundLayoutMobilePanel: '{colorBackgroundLayoutPanelContent}',
  colorBackgroundLayoutToggleActive: '{colorGrey700}',
  colorBackgroundLayoutToggleDefault: 'transparent',
  colorBackgroundLayoutToggleHover: '{colorGrey600}',
  colorBackgroundLayoutToggleSelectedDefault: { light: '{colorBlue600}', dark: '{colorBlue400}' },
  colorBackgroundModalOverlay: { light: '{colorGreyOpaque90}', dark: '{colorGreyOpaque80}' },
  colorBackgroundNotificationStackBar: '{colorGrey700}',
  colorBackgroundNotificationStackBarActive: '{colorGrey700}',
  colorBackgroundNotificationStackBarHover: '{colorGrey600}',
  colorBackgroundProgressBarContentInFlash: { light: '{colorGreyOpaque70}', dark: '{colorGrey100}' },
  colorBackgroundSegmentHover: '{colorBackgroundButtonNormalDefault}',
  colorBackgroundTilesDisabled: { dark: '{colorGrey700}' },
  colorBackgroundToggleCheckedDisabled: { dark: '{colorBlue700}' },
  colorBorderButtonNormalActive: '{colorBorderButtonNormalDefault}',
  colorBorderButtonNormalDefault: { light: '{colorGrey600}', dark: '{colorGrey500}' },
  colorBorderToggleButtonNormalPressed: { light: '{colorGrey600}', dark: '{colorGrey500}' },
  colorBorderButtonNormalDisabled: { light: '{colorGrey300}', dark: '{colorGrey650}' },
  colorTextButtonNormalDisabled: { light: '{colorGrey500}', dark: '{colorGrey500}' },
  colorBorderButtonNormalHover: { light: '{colorGrey900}', dark: '{colorGrey400}' },
  colorBorderButtonPrimaryDisabled: { light: '{colorGrey300}', dark: '{colorGrey650}' },
  colorTextButtonPrimaryDisabled: { light: '{colorGrey500}', dark: '{colorGrey500}' },
  colorBorderCalendarGrid: { light: '{colorBorderDropdownItemDefault}', dark: '{colorBorderDividerDefault}' },
  colorBorderCalendarGridSelectedFocusRing: '{colorBorderItemFocused}',
  colorBorderCodeEditorPaneItemHover: { light: '{colorGrey550}', dark: '{colorGrey500}' },
  colorBorderContainerDivider: '{colorBorderDividerDefault}',
  colorBorderContainerTop: { light: '{colorGrey200}', dark: '{colorGrey700}' },
  colorBorderControlDefault: { light: '{colorGrey550}' },
  colorBorderDividerActive: '{colorGrey550}',
  colorBorderDividerDefault: { light: '{colorGrey200}', dark: '{colorGrey650}' },
  colorBorderDividerInteractiveDefault: '{colorGrey550}',
  colorBorderDividerPanelBottom: '{colorShadowSide}',
  colorBorderDividerPanelSide: 'transparent',
  colorBorderDividerSecondary: { light: '{colorGrey200}', dark: '{colorGrey650}' },
  colorBorderDropdownContainer: 'transparent',
  colorBorderDropdownItemHover: { dark: '{colorGrey500}' },
  colorBorderDropdownItemDimmedHover: `{colorBorderDropdownItemHover}`,
  colorBorderDropdownItemSelected: '{colorBorderDropdownItemDefault}',
  colorBorderDropdownItemTop: '{colorBorderDropdownItemDefault}',
  colorBorderInputDefault: { light: '{colorGrey550}', dark: '{colorGrey500}' },
  colorBorderInputFocused: '{colorBorderItemFocused}',
  colorBorderItemFocused: { light: '{colorBlue600}' },
  colorBorderItemPlaceholder: '{colorTransparent}',
  colorBorderLayout: { light: '{colorGrey300}', dark: '{colorGrey650}' },
  colorBorderNotificationStackBar: '{colorGrey700}',
  colorBorderPanelHeader: '{colorBorderDividerDefault}',
  colorBorderPopover: { light: '{colorGrey300}', dark: '{colorGrey600}' },
  colorBorderSegmentActive: '{colorBorderSegmentHover}',
  colorBorderSegmentDefault: { light: '{colorGrey550}', dark: '{colorGrey500}' },
  colorBorderSegmentDisabled: '{colorBorderButtonNormalDisabled}',
  colorBorderSegmentHover: { light: '{colorGrey900}', dark: '{colorWhite}' },
  colorBorderDropdownItemFocused: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorBorderStatusError: { dark: '{colorRed600}' },
  colorBorderStatusSuccess: { dark: '{colorGreen600}' },
  colorBorderTabsDivider: { light: '{colorGrey400}', dark: '{colorGrey650}' },
  colorBorderTabsShadow: { light: '{colorBorderDividerDefault}' },
  colorBorderTabsUnderline: '{colorTextInteractiveHover}',
  colorBorderTilesDisabled: { light: '{colorTransparent}', dark: '{colorGrey650}' },
  colorBorderTutorial: { light: '{colorGrey400}', dark: '{colorGrey500}' },
  colorForegroundControlDefault: { dark: '{colorWhite}' },
  colorForegroundControlDisabled: { dark: '{colorGrey550}' },
  colorForegroundControlReadOnly: { light: '{colorGrey550}', dark: '{colorGrey450}' },
  colorStrokeCodeEditorResizeHandler: '{colorGrey550}',
  colorStrokeCodeEditorGutterActiveLineDefault: { dark: '{colorGrey650}' },
  colorTextAccent: { light: '{colorBlue600}', dark: '{colorBlue400}' },
  colorTextBodyDefault: { light: '{colorGrey900}', dark: '{colorGrey300}' },
  colorTextBodySecondary: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorTextBreadcrumbCurrent: { dark: '{colorGrey300}' },
  colorTextBreadcrumbIcon: { light: '{colorGrey550}' },
  colorTextButtonInlineIconDefault: '{colorTextInteractiveDefault}',
  colorTextButtonInlineIconHover: '{colorTextInteractiveHover}',
  colorTextButtonNormalActive: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorTextToggleButtonNormalPressed: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorTextButtonNormalDefault: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorTextButtonNormalHover: { light: '{colorGrey900}', dark: '{colorGrey100}' },
  colorTextLinkButtonNormalDefault: '{colorTextButtonNormalDefault}',
  colorTextLinkButtonNormalHover: '{colorTextButtonNormalHover}',
  colorTextLinkButtonNormalActive: '{colorTextButtonNormalActive}',
  colorTextCalendarDateHover: '{colorTextDropdownItemHighlighted}',
  colorTextCalendarDateSelected: '{colorTextDropdownItemHighlighted}',
  colorTextCalendarMonth: '{colorTextBodySecondary}',
  colorTextColumnHeader: { dark: '{colorGrey450}' },
  colorTextColumnSortingIcon: { light: '{colorGrey550}', dark: '{colorGrey450}' },
  colorTextDisabledInlineEdit: { dark: '{colorGrey450}' },
  colorTextGroupLabel: '{colorTextLabel}',
  colorTextExpandableSectionDefault: '{colorTextInteractiveDefault}',
  colorTextExpandableSectionHover: '{colorTextInteractiveHover}',
  colorTextExpandableSectionNavigationIconDefault: '{colorTextIconCaret}',
  colorTextHeadingDefault: { light: '{colorGrey900}', dark: '{colorGrey200}' },
  colorTextHeadingSecondary: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorTextHomeHeaderDefault: { light: '{colorWhite}', dark: '{colorGrey200}' },
  colorTextHomeHeaderSecondary: '{colorGrey300}',
  colorTextFormDefault: { light: '{colorGrey900}', dark: '{colorGrey300}' },
  colorTextInputDisabled: { light: '{colorGrey500}' },
  colorTextInputPlaceholder: { light: '{colorGrey550}', dark: '{colorGrey500}' },
  colorTextInputPlaceholderDisabled: '{colorTextInputPlaceholder}',
  colorTextLabel: { light: '{colorGrey600}', dark: '{colorGrey450}' },
  colorTextLayoutToggle: { light: '{colorGrey600}', dark: '{colorGrey300}' },
  colorTextLayoutToggleActive: { light: '{colorWhite}', dark: '{colorGrey800}' },
  colorTextLayoutToggleHover: { light: '{colorBlue600}', dark: '{colorBlue500}' },
  colorTextLayoutToggleSelected: { light: '{colorWhite}', dark: '{colorGrey900}' },
  colorTextLinkDefault: { dark: '{colorBlue400}' },
  colorTextLinkHover: { light: '{colorBlue700}', dark: '{colorBlue300}' },
  colorTextLinkInvertedHover: '{colorTextNotificationDefault}',
  colorTextLinkButtonUnderline: 'currentColor',
  colorTextLinkButtonUnderlineHover: 'currentColor',
  colorTextPaginationPageNumberActiveDisabled: '{colorTextBodySecondary}',
  colorTextPaginationPageNumberDefault: { dark: '{colorTextInteractiveDefault}' },
  colorTextSegmentActive: { dark: '{colorGrey800}' },
  colorTextSegmentDefault: '{colorTextButtonNormalDefault}',
  colorTextStatusInfo: { dark: '{colorBlue400}' },
  colorBoardPlaceholderActive: { light: '{colorGrey300}', dark: '{colorGrey550}' },
  colorBoardPlaceholderHover: { light: '{colorBlue300}', dark: '{colorBlue600}' },
  colorDragPlaceholderActive: { light: '{colorGrey300}', dark: '{colorGrey550}' },
  colorDragPlaceholderHover: { light: '{colorBlue300}', dark: '{colorBlue600}' },
  colorBackgroundDropdownItemHover: { light: '{colorGrey150}', dark: '{colorGrey650}' },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = merge(
  {},
  parentTokens,
  expandColorDictionary(tokens)
);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
