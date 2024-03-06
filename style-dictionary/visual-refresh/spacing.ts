// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';

import { expandDensityDictionary } from '../utils';

const tokens: StyleDictionary.SpacingDictionary = {
  spaceAlertActionLeft: '{spaceS}',
  spaceAlertHorizontal: '{spaceFlashbarHorizontal}',
  spaceAlertMessageRight: '{spaceXxs}',
  spaceAlertVertical: '{spaceScaledXs}',
  spaceButtonFocusOutlineGutter: '4px',
  spaceButtonHorizontal: '{spaceScaledL}',
  spaceButtonIconFocusOutlineGutterVertical: '0px',
  spaceButtonIconOnlyHorizontal: { comfortable: '6px', compact: '{spaceXxs}' },
  spaceButtonInlineIconFocusOutlineGutter: '0px',
  spaceButtonModalDismissVertical: '{spaceScaledXxxs}',
  spaceCalendarGridFocusOutlineGutter: '-5px',
  spaceCalendarGridSelectedFocusOutlineGutter: '{spaceCalendarGridFocusOutlineGutter}',
  spaceCalendarGridGutter: '6px',
  spaceCardHorizontal: '{spaceContainerHorizontal}',
  spaceCardVertical: '{spaceScaledM}',
  spaceCodeEditorStatusFocusOutlineGutter: '-7px',
  spaceContainerContentTop: '{spaceXxs}',
  spaceContainerHeaderTop: '{spaceS}',
  spaceContainerHeaderBottom: '{spaceScaledXs}',
  spaceContainerHorizontal: '{spaceL}',
  spaceContentHeaderPaddingBottom: '{spaceScaledM}',
  spaceDarkHeaderOverlapDistance: { comfortable: '36px', compact: '32px' },
  spaceExpandableSectionIconOffsetTop: '{spaceScaled2xXxs}',
  spaceFieldHorizontal: '{spaceS}',
  spaceFieldIconOffset: '36px',
  spaceFilteringTokenDismissButtonFocusOutlineGutter: '-5px',
  spaceFilteringTokenOperationSelectFocusOutlineGutter: '-5px',
  spaceFlashbarActionLeft: '{spaceS}',
  spaceFlashbarDismissRight: '0px',
  spaceFlashbarHorizontal: '{spaceM}',
  spaceGridGutter: { comfortable: '{spaceL}', compact: '{spaceM}' },
  spaceKeyValueGap: '0px',
  spaceLayoutContentBottom: '{spaceScaled2xXxxl}',
  spaceLayoutContentHorizontal: '{spaceScaled2xXl}',
  spaceLayoutToggleDiameter: '32px',
  spaceLayoutTogglePadding: '{spaceStaticS}',
  spaceModalContentBottom: '{spaceScaled2xM}',
  spaceModalHorizontal: '{spaceContainerHorizontal}',
  spaceOptionIconBigTop: '0px',
  spacePanelContentBottom: '{spaceScaledXxxl}',
  spacePanelContentTop: '{spaceScaledL}',
  spacePanelDividerMarginHorizontal: '{spaceXs}',
  spacePanelHeaderVertical: '{spaceScaledL}',
  spacePanelNavLeft: '28px',
  spacePanelSideLeft: '28px',
  spacePanelSideRight: '{spaceScaledXl}',
  spacePanelSplitTop: '0px',
  spacePanelSplitBottom: '{spaceScaledL}',
  spaceSegmentedControlFocusOutlineGutter: '4px',
  spaceTabsContentTop: '{spaceScaledS}',
  spaceTabsFocusOutlineGutter: '-8px',
  spaceTableContentBottom: '{spaceXxs}',
  spaceTableEmbeddedHeaderTop: '0px',
  spaceTableFooterHorizontal: '{spaceTableHeaderHorizontal}',
  spaceTableHeaderFocusOutlineGutter: { comfortable: '0px', compact: '-1px' },
  spaceTableHeaderHorizontal: '0px',
  spaceTableHeaderToolsBottom: '0px',
  spaceTableHeaderToolsFullPageBottom: '4px',
  spaceTableHorizontal: '{spaceContainerHorizontal}',

  spaceScaled2xNone: '{spaceNone}',
  spaceScaled2xXxxs: { comfortable: '{spaceXxxs}', compact: '{spaceNone}' },
  spaceScaled2xXxs: { comfortable: '{spaceXxs}', compact: '{spaceNone}' },
  spaceScaled2xXs: { comfortable: '{spaceXs}', compact: '{spaceNone}' },
  spaceScaled2xS: { comfortable: '{spaceS}', compact: '{spaceXxs}' },
  spaceScaled2xM: { comfortable: '{spaceM}', compact: '{spaceXs}' },
  spaceScaled2xL: { comfortable: '{spaceL}', compact: '{spaceS}' },
  spaceScaled2xXl: { comfortable: '{spaceXl}', compact: '{spaceM}' },
  spaceScaled2xXxl: { comfortable: '{spaceXxl}', compact: '{spaceL}' },
  spaceScaled2xXxxl: { comfortable: '{spaceXxxl}', compact: '{spaceXl}' },

  spaceScaledNone: '{spaceNone}',
  spaceScaledXxxs: { comfortable: '{spaceXxxs}', compact: '{spaceNone}' },
  spaceScaledXxs: { comfortable: '{spaceXxs}', compact: '{spaceXxxs}' },
  spaceScaledXs: { comfortable: '{spaceXs}', compact: '{spaceXxs}' },
  spaceScaledS: { comfortable: '{spaceS}', compact: '{spaceXs}' },
  spaceScaledM: { comfortable: '{spaceM}', compact: '{spaceS}' },
  spaceScaledL: { comfortable: '{spaceL}', compact: '{spaceM}' },
  spaceScaledXl: { comfortable: '{spaceXl}', compact: '{spaceL}' },
  spaceScaledXxl: { comfortable: '{spaceXxl}', compact: '{spaceXl}' },
  spaceScaledXxxl: { comfortable: '{spaceXxxl}', compact: '{spaceXxl}' },

  spaceStaticXxxs: '{spaceXxxs}',
  spaceStaticXxs: '{spaceXxs}',
  spaceStaticXs: '{spaceXs}',
  spaceStaticS: '{spaceS}',
  spaceStaticM: '{spaceM}',
  spaceStaticL: '{spaceL}',
  spaceStaticXl: '{spaceXl}',
  spaceStaticXxl: '{spaceXxl}',
  spaceStaticXxxl: '{spaceXxxl}',

  spaceNone: '0px',
  spaceXxxs: '2px',
  spaceXxs: '4px',
  spaceXs: '8px',
  spaceS: '12px',
  spaceM: '16px',
  spaceL: '20px',
  spaceXl: '24px',
  spaceXxl: '32px',
  spaceXxxl: '40px',
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'density';
