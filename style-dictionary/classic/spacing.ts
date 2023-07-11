// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/spacing';
import merge from 'lodash/merge';
import { expandDensityDictionary } from '../utils';

const tokens: StyleDictionary.SpacingDictionary = {
  spaceAlertActionLeft: '{spaceL}',
  spaceAlertHorizontal: '{spaceL}',
  spaceAlertMessageRight: '0px',
  spaceAlertVertical: '{spaceScaledS}',
  spaceButtonFocusOutlineGutter: '3px',
  spaceButtonIconFocusOutlineGutterVertical: '{spaceButtonFocusOutlineGutter}',
  spaceButtonIconOnlyHorizontal: '{spaceM}',
  spaceButtonInlineIconFocusOutlineGutter: '{spaceButtonFocusOutlineGutter}',
  spaceButtonModalDismissVertical: '{spaceScaledXxs}',
  spaceCalendarGridFocusOutlineGutter: '0px',
  spaceCalendarGridSelectedFocusOutlineGutter: '2px',
  spaceCardVertical: '{spaceScaledL}',
  spaceCodeEditorStatusFocusOutlineGutter: '3px',
  spaceContainerContentTop: '{spaceScaledM}',
  spaceContainerHeaderTop: '{spaceScaledS}',
  spaceContainerHeaderBottom: '{spaceScaledS}',
  spaceContainerHorizontal: '{spaceL}',
  spaceContentHeaderPaddingBottom: '{spaceScaledM}',
  spaceDarkHeaderOverlapDistance: '0px',
  spaceExpandableSectionIconOffsetTop: '{spaceScaledXs}',
  spaceFieldHorizontal: '{spaceXs}',
  spaceFieldIconOffset: '32px',
  spaceFilteringTokenDismissButtonFocusOutlineGutter: '0px',
  spaceFilteringTokenOperationSelectFocusOutlineGutter: '0px',
  spaceFlashbarActionLeft: '{spaceM}',
  spaceFlashbarDismissRight: '{spaceXxs}',
  spaceFlashbarHorizontal: '{spaceS}',
  spaceKeyValueGap: '{spaceScaledXxxs}',
  spaceLayoutContentBottom: '{spaceScaledL}',
  spaceModalContentBottom: '{spaceScaledL}',
  spaceOptionIconBigTop: '{spaceXxxs}',
  spacePanelNavLeft: '{spaceXxl}',
  spacePanelSideLeft: '{spaceScaledXxl}',
  spacePanelSideRight: '{spaceScaledXxl}',
  spacePanelSplitTop: '0px',
  spaceSegmentedControlFocusOutlineGutter: '3px',
  spaceTabsContentTop: '{spaceScaledM}',
  spaceTabsFocusOutlineGutter: '0px',
  spaceTableContentBottom: '0px',
  spaceTableEmbeddedHeaderTop: '{spaceContainerHeaderTop}',
  spaceTableHeaderFocusOutlineGutter: { compact: '0px' },
  spaceTableHeaderHorizontal: '{spaceContainerHorizontal}',
  spaceTableHeaderToolsBottom: '{spaceScaledXxs}',
  spaceTableHorizontal: '0px',
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = merge(
  {},
  parentTokens,
  expandDensityDictionary(tokens)
);
export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
