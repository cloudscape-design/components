// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as parentTokens } from '../visual-refresh/borders';
import merge from 'lodash/merge';

const tokens: StyleDictionary.BordersDictionary = {
  borderAlertRadius: '{borderFieldRadius}',
  borderActiveRadius: '0px',
  borderActiveWidth: '2px',
  borderBadgeRadius: '16px',
  borderButtonRadius: '2px',
  borderCalendarGridFocusRingRadius: '2px',
  borderCodeEditorStatusDividerWidth: '0px',
  borderContainerRadius: '0px',
  borderContainerStickyWidth: '1px',
  borderContainerTopWidth: '1px',
  borderControlFocusRingRadiusCircle: '50%',
  borderControlFocusRingRadiusDefault: '{borderFieldRadius}',
  borderControlFocusRingShadowSpread: '1px',
  borderControlInvalidFocusRingShadowSpread: '{borderControlFocusRingShadowSpread}',
  borderDividerSectionWidth: '1px',
  borderDropdownVirtualOffsetWidth: '0px',
  borderFieldRadius: '2px',
  borderFieldWidth: '1px',
  borderFlashbarRadius: '0px',
  borderInvalidWidth: '4px',
  borderItemRadius: '0px',
  borderItemWidth: '1px',
  borderLineChartLineJoin: 'miter',
  borderPanelHeaderWidth: '0px',
  borderPanelTopWidth: '0px',
  borderTableStickyWidth: '0px',
  borderLinkFocusRingOutline: '5px auto Highlight',
  borderLinkFocusRingShadowSpread: '0px',
};

const expandedTokens: StyleDictionary.ExpandedGlobalScopeDictionary = merge({}, parentTokens, tokens);

export { expandedTokens as tokens };
