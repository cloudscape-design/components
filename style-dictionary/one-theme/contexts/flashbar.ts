// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expandColorDictionary } from '../../utils/index.js';
import { StyleDictionary } from '../../utils/interfaces.js';
import { statusExtra } from '../color-palette.js';

const tokens: StyleDictionary.ColorsDictionary = {
  colorBackgroundNotificationGreen: { light: statusExtra.successNotification, dark: statusExtra.successNotification },
  colorBackgroundNotificationBlue: { light: '{colorPrimary800}', dark: '{colorPrimary800}' },
  colorTextNotificationDefault: { light: '{colorNeutral1000}', dark: '{colorNeutral1000}' },
};

const expandedTokens = expandColorDictionary(tokens);

export { expandedTokens as tokens };
