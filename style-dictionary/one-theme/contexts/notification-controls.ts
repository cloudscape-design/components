// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

/**
 * Interactive controls inside flash messages and alerts follow the notification
 * text treatment. Values are references only: the referenced base tokens resolve
 * per mode and are pinned dark by the surface contexts (header, top navigation),
 * so no combined contexts are needed.
 */
const tokens: StyleDictionary.ColorsDictionary = {
  colorTextButtonNormalDefault: '{colorTextInteractiveInvertedDefault}',
  colorTextButtonNormalHover: '{colorTextInteractiveInvertedHover}',
  colorTextButtonNormalActive: '{colorTextInteractiveInvertedDefault}',
  colorBorderButtonNormalDefault: '{colorTextInteractiveInvertedDefault}',
  colorBorderButtonNormalHover: '{colorTextInteractiveInvertedHover}',
  colorBorderButtonNormalActive: '{colorTextInteractiveInvertedDefault}',
  colorBackgroundButtonNormalDefault: 'transparent',
  colorBackgroundButtonNormalHover: 'rgba(0, 0, 0, 0.05)',
  colorBackgroundButtonNormalActive: 'rgba(0, 0, 0, 0.1)',
  colorTextBodyDefault: '{colorTextNotificationDefault}',
  colorBorderDividerDefault: '{colorBorderDividerNotification}',
  colorBorderItemFocused: {
    light: '{colorTextInteractiveInvertedDefault}',
    dark: '{colorTextInteractiveInvertedHover}',
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
