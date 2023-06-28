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
  spaceCodeEditorStatusFocusOutlineGutter: '3px',
  spaceContainerContentTop: '{spaceScaledM}',
  spaceContainerHeaderVertical: '{spaceScaledS}',
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
  spaceLayoutContentBottom: '{spaceScaledL}',
  spaceModalContentBottom: '{spaceScaledL}',
  spacePanelNavLeft: '{spaceXxl}',
  spacePanelSideLeft: '{spaceScaledXxl}',
  spacePanelSideRight: '{spaceScaledXxl}',
  spacePanelSplitTop: '0px',
  spaceSegmentedControlFocusOutlineGutter: '3px',
  spaceTableHeaderFocusOutlineGutter: { compact: '0px' },
  spaceTabsContentTop: '{spaceScaledM}',
  spaceTableHorizontal: '0px',
  spaceTableHeaderHorizontal: '{spaceContainerHorizontal}',
  spaceTableContentBottom: '0px',
  spaceTableContentTop: '0px',
  spaceTableEmbeddedContentBottom: '{spaceTableContentBottom}',
  spaceTableEmbeddedHeaderTop: '{spaceContainerHeaderVertical}',
  spaceTabsFocusOutlineGutter: '0px',
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = merge(
  {},
  parentTokens,
  expandDensityDictionary(tokens)
);
export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
