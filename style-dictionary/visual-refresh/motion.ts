// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../utils/interfaces';
import { expandMotionDictionary } from '../utils';

import path from 'path';
import { fileHashSync } from '../utils/hash';

const keyframeHash = fileHashSync(path.join(__dirname, '../../../src'), [
  path.join(__dirname, '../../../src/internal/styles/keyframes.scss'),
]);

const tokens: StyleDictionary.MotionDictionary = {
  motionDurationExtraFast: { default: '45ms', disabled: '0ms' },
  motionDurationExtraSlow: { default: '270ms', disabled: '0ms' },
  motionDurationFast: { default: '90ms', disabled: '0ms' },
  motionDurationModerate: { default: '135ms', disabled: '0ms' },
  motionDurationRefreshOnlyAmbient: { default: '2000ms', disabled: '0ms' },
  motionDurationRefreshOnlyFast: { default: '115ms', disabled: '0ms' },
  motionDurationRefreshOnlyMedium: { default: '165ms', disabled: '0ms' },
  motionDurationRefreshOnlySlow: { default: '250ms', disabled: '0ms' },
  motionDurationRotate180: '{motionDurationModerate}',
  motionDurationRotate90: '{motionDurationModerate}',
  motionDurationShowPaced: '{motionDurationSlow}',
  motionDurationShowQuick: '{motionDurationModerate}',
  motionDurationSlow: { default: '180ms', disabled: '0ms' },
  motionDurationTransitionQuick: '{motionDurationFast}',
  motionDurationTransitionShowPaced: '{motionDurationSlow}',
  motionDurationTransitionShowQuick: '{motionDurationFast}',

  motionEasingEaseOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  motionEasingRefreshOnlyA: 'cubic-bezier(0, 0, 0, 1)',
  motionEasingRefreshOnlyB: 'cubic-bezier(1, 0, 0.83, 1)',
  motionEasingRefreshOnlyC: 'cubic-bezier(0.84, 0, 0.16, 1)',
  motionEasingRefreshOnlyD: 'cubic-bezier(0.33, 0, 0.67, 1)',
  motionEasingRotate180: '{motionEasingEaseOutQuart}',
  motionEasingRotate90: '{motionEasingEaseOutQuart}',
  motionEasingShowPaced: 'ease-out',
  motionEasingShowQuick: 'ease-out',
  motionEasingTransitionQuick: 'linear',
  motionEasingTransitionShowPaced: 'ease-out',
  motionEasingTransitionShowQuick: 'linear',

  motionEasingResponsive: '{motionEasingRefreshOnlyA}',
  motionEasingSticky: '{motionEasingRefreshOnlyB}',
  motionEasingExpressive: '{motionEasingRefreshOnlyC}',

  motionDurationResponsive: '{motionDurationRefreshOnlyFast}',
  motionDurationExpressive: '{motionDurationRefreshOnlyMedium}',
  motionDurationComplex: '{motionDurationRefreshOnlySlow}',

  motionKeyframesFadeIn: 'awsui_fade-in_' + keyframeHash,
  motionKeyframesFadeOut: 'awsui_fade-out_' + keyframeHash,
  motionKeyframesStatusIconError: 'awsui_status-icon-error_' + keyframeHash,
  motionKeyframesScalePopup: 'awsui_scale-popup_' + keyframeHash,
};

const expandedTokens: StyleDictionary.ExpandedMotionScopeDictionary = expandMotionDictionary(tokens);

export { expandedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'motion';
