// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { tokenStylesSuffix } from '../utils/environment.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { mode, tokens as visualRefreshTokens } from '../visual-refresh/motion.js';

export const tokens: StyleDictionary.MotionDictionary = {
  ...visualRefreshTokens,

  motionDurationRefreshOnlyAmbient: '0ms',
  motionDurationRefreshOnlyFast: '0ms',
  motionDurationRefreshOnlyMedium: '0ms',
  motionDurationRefreshOnlySlow: '0ms',

  motionEasingResponsive: 'ease-out',
  motionEasingSticky: 'ease-out',
  motionEasingExpressive: 'ease-out',

  motionDurationResponsive: '{motionDurationModerate}',
  motionDurationExpressive: '{motionDurationSlow}',
  motionDurationComplex: '{motionDurationExtraSlow}',

  motionKeyframesStatusIconError: 'awsui-none-' + tokenStylesSuffix,
  motionKeyframesScalePopup: 'awsui-none-' + tokenStylesSuffix,
};
export { mode };
