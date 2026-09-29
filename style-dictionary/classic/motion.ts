// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StyleDictionary } from '../utils/interfaces.js';
import { getStableKeyframe } from '../utils/token-versions.js';
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

  motionKeyframesStatusIconError: getStableKeyframe('awsui-none'),
  motionKeyframesScalePopup: getStableKeyframe('awsui-none'),
};
export { mode };
