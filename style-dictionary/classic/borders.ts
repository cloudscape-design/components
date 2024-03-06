// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/borders';
import merge from 'lodash/merge';

const tokens: StyleDictionary.BordersDictionary = {
  borderActiveWidth: '2px',
  borderCodeEditorStatusDividerWidth: '0px',
  borderContainerStickyWidth: '1px',
  borderContainerWidth: '0px',
  borderContainerTopWidth: '1px',
  borderControlFocusRingShadowSpread: '1px',
  borderControlInvalidFocusRingShadowSpread: '{borderControlFocusRingShadowSpread}',
  borderDividerSectionWidth: '1px',
  borderDropdownVirtualOffsetWidth: '0px',
  borderFieldWidth: '1px',
  borderInvalidWidth: '4px',
  borderItemWidth: '1px',
  borderLineChartLineJoin: 'miter',
  borderPanelHeaderWidth: '1px',
  borderPanelTopWidth: '0px',
  borderRadiusAlert: '{borderRadiusInput}',
  borderRadiusBadge: '16px',
  borderRadiusButton: '2px',
  borderRadiusCalendarDayFocusRing: '2px',
  borderRadiusCodeEditor: '{borderRadiusItem}',
  borderRadiusContainer: '0px',
  borderRadiusControlCircularFocusRing: '50%',
  borderRadiusControlDefaultFocusRing: '{borderRadiusInput}',
  borderRadiusDropzone: '0px',
  borderRadiusFlashbar: '0px',
  borderRadiusItem: '0px',
  borderRadiusInput: '2px',
  borderRadiusTabsFocusRing: '0px',
  borderTableStickyWidth: '0px',
  borderLinkFocusRingOutline: '5px auto Highlight',
  borderLinkFocusRingShadowSpread: '0px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
