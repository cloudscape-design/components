// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandColorDictionary, pickState } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { tokens as parentTokens } from '../colors.js';
import { alertButtonTokens } from './alert.js';

// Token configuration that is shared between classic and visual refresh
export const sharedTokens: StyleDictionary.ColorsDictionary = {
  // Links in flash should be using color="inverted", which makes them underlined by default in flashbars
  // and changes their color to match the surrounding text.
  colorTextNotificationDefault: '{colorTextNotificationYellow}',
  colorTextLinkInvertedHover: '{colorTextNotificationYellow}',

  // Focus outline matches the text color to align with other flashbar types and to ensure color contrast.
  colorBorderItemFocused: '{colorTextNotificationYellow}',

  // Dismiss button
  colorTextInteractiveInvertedDefault: '{colorGrey650}',
  colorTextInteractiveInvertedHover: '{colorGrey950}',

  // Progress bars in flashbars should be using variant="flash" (which uses a white background by default).
  // For the warning state, it should use colorGrey950.
  colorBackgroundProgressBarContentInFlash: '{colorGrey950}',
  colorBackgroundProgressBarLayoutInFlash: '{colorGreyOpaque10}',

  // Expandable sections
  colorTextExpandableSectionDefault: '{colorTextNotificationYellow}',
  colorTextExpandableSectionHover: '{colorTextNotificationYellow}',
  // Bottom border of the header when expanded (default variant)
  colorBorderDividerDefault: '{colorTextNotificationYellow}',
  // Description
  colorTextHeadingSecondary: '{colorTextNotificationYellow}',
  // Content
  colorTextBodyDefault: '{colorTextNotificationYellow}',

  // Tutorial hotspot
  colorTextTutorialHotspotDefault: '{colorGrey600}',
  colorTextTutorialHotspotHover: '{colorGrey900}',
};

const tokens: StyleDictionary.ColorsDictionary = {
  ...sharedTokens,

  // For buttons we use the same tokens as alert. But because the warning flash messages
  // look the same in light and dark mode, we only pick the light mode colors.
  ...pickState(expandColorDictionary(alertButtonTokens), 'light'),
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(
  merge({}, parentTokens, tokens)
);

export { expandedTokens as tokens };
