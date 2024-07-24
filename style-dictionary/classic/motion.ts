// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { tokenStylesSuffix } from '../utils/environment';
import { StyleDictionary } from '../utils/interfaces';
import { mode, tokens as visualRefreshTokens } from '../visual-refresh/motion';

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
