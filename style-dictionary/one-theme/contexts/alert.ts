// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { statusExtra } from '../color-palette.js';

const tokens: StyleDictionary.ColorsDictionary = {
  // 8-digit hex not supported by the validator; use rgba equivalents
  colorBackgroundStatusInfo: { light: 'rgba(92, 127, 255, 0.13)', dark: '#161a2d' },
  colorBackgroundStatusWarning: { light: 'rgba(251, 211, 50, 0.13)', dark: 'rgba(251, 211, 50, 0.06)' },
  colorBackgroundStatusError: { light: 'rgba(255, 122, 122, 0.06)', dark: 'rgba(255, 122, 122, 0.06)' },
  colorBackgroundStatusSuccess: { light: 'rgba(122, 229, 0, 0.13)', dark: 'rgba(43, 181, 52, 0.06)' },
  colorTextStatusInfo: { light: '{colorPrimary800}', dark: '{colorPrimary400}' },
  colorBorderStatusInfo: { light: '{colorPrimary800}', dark: '{colorPrimary400}' },
  colorTextStatusSuccess: { light: '{colorSuccess600}', dark: statusExtra.successDark },
  colorBorderStatusSuccess: { light: '{colorSuccess600}', dark: statusExtra.successDark },
  colorBackgroundButtonNormalDefault: { light: 'transparent', dark: 'transparent' },
};

const expandedTokens = expandColorDictionary(tokens);

export { expandedTokens as tokens };
