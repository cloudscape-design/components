// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { tokens as visualRefreshTokens, mode } from '../visual-refresh/motion';
import { tokenStylesSuffix } from '../utils/environment';

export const tokens: StyleDictionary.MotionDictionary = {
  ...visualRefreshTokens,

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
