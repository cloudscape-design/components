// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandMotionDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/motion.js';

const tokens: StyleDictionary.MotionDictionary = {
  motionDurationFast: { default: '110ms', disabled: '0ms' },
  motionDurationModerate: { default: '150ms', disabled: '0ms' },
  motionDurationSlow: { default: '200ms', disabled: '0ms' },

  motionDurationShowQuick: { default: '135ms', disabled: '0ms' },
  motionDurationShowPaced: { default: '300ms', disabled: '0ms' },
  motionEasingShowPaced: 'cubic-bezier(0, 0, 0.2, 1)',
  motionEasingShowQuick: 'cubic-bezier(0.4, 0, 1, 1)',
};

const mergedTokens = merge({}, parentTokens, expandMotionDictionary(tokens));

export { mergedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'motion';
