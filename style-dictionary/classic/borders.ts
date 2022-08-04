// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/borders';
import merge from 'lodash/merge';

const tokens: StyleDictionary.BordersDictionary = {
  borderActiveWidth: '2px',
  borderRadiusCalendarGridFocusRing: '2px',
  borderCodeEditorStatusDividerWidth: '0px',
  borderContainerStickyWidth: '1px',
  borderContainerTopWidth: '1px',
  borderControlFocusRingShadowSpread: '1px',
  borderControlInvalidFocusRingShadowSpread: '{borderControlFocusRingShadowSpread}',
  borderDividerSectionWidth: '1px',
  borderDropdownVirtualOffsetWidth: '0px',
  borderFieldWidth: '1px',
  borderInvalidWidth: '4px',
  borderItemWidth: '1px',
  borderLineChartLineJoin: 'miter',
  borderPanelHeaderWidth: '0px',
  borderPanelTopWidth: '0px',
  borderRadiusAlert: '{borderRadiusField}',
  borderRadiusBadge: '16px',
  borderRadiusButton: '2px',
  borderRadiusContainer: '0px',
  borderRadiusControlFocusRingCircle: '50%',
  borderRadiusControlFocusRingDefault: '{borderRadiusField}',
  borderRadiusField: '2px',
  borderRadiusFlashbar: '0px',
  borderRadiusItem: '0px',
  borderRadiusTabsFocusRing: '0px',
  borderTableStickyWidth: '0px',
  borderLinkFocusRingOutline: '5px auto Highlight',
  borderLinkFocusRingShadowSpread: '0px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
