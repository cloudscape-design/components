// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';

const tokens: StyleDictionary.ShadowsDictionary = {
  shadowCard: 'none',
  shadowItemCard: '{shadowCard}',
  shadowContainer: {
    light: '0px 0px 1px 1px #ebebeb, 0px 1px 8px 2px rgba(0, 0, 0, 0.12)', // 1px grey-200 faux border
    dark: '0px 1px 8px 2px rgba(0, 0, 0, 0.6)',
  },
  shadowContainerActive: {
    light: '0px 1px 1px 1px #ebebeb, 0px 6px 36px #0606061a',
    dark: '0px 1px 1px 1px #222222, 0px 6px 36px #030303',
  },
  shadowDropdown: { light: '0px 4px 20px 1px rgba(0, 0, 0, 0.10)', dark: '0px 4px 20px 1px rgba(0, 0, 0, 1)' },
  shadowDropup: '{shadowDropdown}',
  shadowFlashCollapsed: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  shadowFlashSticky: {
    light: '0px 4px 8px rgba(0, 0, 0, 0.10)',
    dark: '0px 4px 8px rgba(0, 0, 0, 0.5)',
  },
  shadowModal: '{shadowDropdown}',
  shadowPanel: {
    light: '0px 0px 0px 1px #bebebe',
    dark: '0px 0px 0px 1px #4b4b4b',
  },
  shadowPanelToggle: { light: '0px 6px 12px 1px rgba(0, 0, 0, 0.12)', dark: '0px 6px 12px 1px rgba(0, 0, 0, 1)' },
  shadowPopover: '{shadowDropdown}',
  shadowSplitBottom: {
    light: '0px -36px 36px -36px rgba(0, 0, 0, 0.10)',
    dark: '0px -36px 36px -36px rgba(0, 0, 0, 1)',
  },
  shadowSplitSide: {
    light: '-1px 0px 1px 0px #ebebeb, -36px 6px 36px -36px rgba(0, 0, 0, 0.10)',
    dark: '-1px 0px 1px 0px #222222, -36px 6px 36px -36px rgba(0, 0, 0, 1)',
  },
  shadowSticky: { light: '0px 4px 8px 1px rgba(0, 0, 0, 0.10)', dark: '0px 4px 8px 1px rgba(0, 0, 0, 0.5)' },
  shadowStickyEmbedded: {
    light: '0px 2px 0px 0px #ebebeb, 0px 16px 16px -12px rgba(0, 0, 0, 0.10)', // 2px grey-200 faux bottom border
    dark: '0px 2px 0px 0px #4b4b4b, 0px 16px 16px -12px rgba(0, 0, 0, 1)', // 2px grey-600 faux bottom border
  },
  shadowStickyColumnFirst: {
    light: '4px 0px 8px 1px rgba(0, 0, 0, 0.1)',
    dark: '0px 4px 8px 1px rgba(0, 0, 0, 0.5)',
  },
  shadowStickyColumnLast: {
    light: '-4px 0 8px 1px rgba(0, 0, 0, 0.1)',
    dark: '0px 4px 8px 1px rgba(0, 0, 0, 0.5)',
  },
};

const expandedTokens: StyleDictionary.ExpandedColorScopeDictionary = expandColorDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'color';
