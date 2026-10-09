// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';

/**
 * Token overrides for interactive content paced within Notifications such as
 * Buttons, Tables, etc.
 */
const tokens: StyleDictionary.ColorsDictionary = {
  colorTextBodyDefault: '{colorTextNotificationDefault}',
  colorTextLinkDefault: '{colorTextNotificationLinkDefault}',
  colorTextLinkHover: '{colorTextNotificationLinkHover}',
  colorTextLinkInvertedDefault: '{colorTextNotificationDefault}',
  colorTextLinkInvertedHover: '{colorTextNotificationLinkHover}',
  colorBorderDividerDefault: '{colorBorderDividerNotification}',
  colorTextButtonNormalDefault: '{colorTextInteractiveInvertedDefault}',
  colorTextButtonNormalHover: '{colorTextInteractiveInvertedHover}',
  colorTextButtonNormalActive: '{colorTextInteractiveInvertedDefault}',
  colorBorderButtonNormalDefault: '{colorTextInteractiveInvertedDefault}',
  colorBorderButtonNormalHover: '{colorTextInteractiveInvertedHover}',
  colorBorderButtonNormalActive: '{colorTextInteractiveInvertedDefault}',
  colorBackgroundButtonNormalDefault: 'transparent',
  colorBackgroundButtonNormalHover: 'rgba(0, 0, 0, 0.05)',
  colorBackgroundButtonNormalActive: 'rgba(0, 0, 0, 0.1)',
  colorBorderItemFocused: {
    light: '{colorTextInteractiveInvertedDefault}',
    dark: '{colorTextInteractiveInvertedHover}',
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
