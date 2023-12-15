// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';

import { expandColorDictionary } from '../utils';

const tokens: StyleDictionary.ShadowsDictionary = {
  shadowContainer: {
    light: '0px 0px 1px 1px #e9ebed, 0px 1px 8px 2px rgba(0, 7, 22, 0.12)', // 1px grey-200 faux border
    dark: '0px 1px 8px 2px rgba(0, 7, 22, 0.6)',
  },
  shadowContainerStacked: {
    light:
      '-1px 1px 1px 0px #e9ebed, 1px 1px 1px 0px #e9ebed, 0px 9px 8px -7px rgb(0 7 22 / 12%), 8px 0px 8px -7px rgb(0 7 22 / 12%), -8px 0px 8px -7px rgb(0 7 22 / 12%)',
    dark: '0px 9px 8px -7px rgb(0 7 22 / 60%), 8px 0px 8px -7px rgb(0 7 22 / 60%), -8px 0px 8px -7px rgb(0 7 22 / 60%)',
  },
  shadowContainerActive: {
    light: '0px 1px 1px 1px #e9ebed, 0px 6px 36px #0007161a',
    dark: '0px 1px 1px 1px #192534, 0px 6px 36px #000716',
  },
  shadowDropdown: { light: '0px 4px 20px 1px rgba(0, 7, 22, 0.10)', dark: '0px 4px 20px 1px rgba(0, 7, 22, 1)' },
  shadowDropup: '{shadowDropdown}',
  shadowFlashCollapsed: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  shadowFlashSticky: {
    light: '0px 6px 36px rgba(0, 7, 22, 0.10)',
    dark: '0px 6px 36px rgba(0, 7, 22, 1)',
  },
  shadowModal: '{shadowDropdown}',
  shadowPanel: {
    light: '0px 1px 1px 1px #e9ebed, 0px 6px 36px rgba(0, 7, 22, 0.10)',
    dark: '0px 1px 1px 1px #192534, 0px 6px 36px rgba(0, 7, 22, 1)', // 1px grey-750 faux border
  },
  shadowPanelToggle: { light: '0px 6px 12px 1px rgba(0, 7, 22, 0.12)', dark: '0px 6px 12px 1px rgba(0, 7, 22, 1)' },
  shadowPopover: '{shadowDropdown}',
  shadowSplitBottom: {
    light: '0px -36px 36px -36px rgba(0, 7, 22, 0.10)',
    dark: '0px -36px 36px -36px rgba(0, 7, 22, 1)',
  },
  shadowSplitSide: {
    light: '-1px 0px 1px 0px #e9ebed, -36px 6px 36px -36px rgba(0, 7, 22, 0.10)',
    dark: '-1px 0px 1px 0px #192534, -36px 6px 36px -36px rgba(0, 7, 22, 1)',
  },
  shadowSticky: '{shadowDropdown}',
  shadowStickyEmbedded: {
    light: '0px 2px 0px 0px #e9ebed, 0px 16px 16px -12px rgba(0, 7, 22, 0.10)', // 2px grey-200 faux bottom border
    dark: '0px 2px 0px 0px #414d5c, 0px 16px 16px -12px rgba(0, 7, 22, 1)', // 2px grey-600 faux bottom border
  },
  shadowStickyColumnFirst: {
    light: '4px 0px 20px 1px rgba(0, 7, 22, 0.1)',
    dark: '0px 4px 20px 1px rgba(0, 7, 22, 1)',
  },
  shadowStickyColumnLast: {
    light: '-4px 0 20px 1px rgba(0, 28, 36, 0.1)',
    dark: '0px 4px 20px 1px rgba(0, 7, 22, 1)',
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
