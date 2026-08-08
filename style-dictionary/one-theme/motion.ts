// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import merge from 'lodash/merge.js';

import { expandMotionDictionary } from '../utils/index.js';
import { StyleDictionary } from '../utils/interfaces.js';
import { tokens as parentTokens } from '../visual-refresh/motion.js';

const tokens: StyleDictionary.MotionDictionary = {
  motionDurationExpandableContentEnter: { default: '300ms', disabled: '0ms' },
  motionEasingExpandableContentEnter: 'cubic-bezier(0, 0, 0.2, 1)',

  motionDurationSideNavigationContentEnterFade: { default: '150ms', disabled: '0ms' },
  motionDurationSideNavigationContentExit: { default: '200ms', disabled: '0ms' },
  motionDurationSideNavigationContentExitFade: '{motionDurationFast}',
  motionEasingSideNavigationContentExit: 'cubic-bezier(0.4, 0, 1, 1)',
};

const mergedTokens = merge({}, parentTokens, expandMotionDictionary(tokens));

export { mergedTokens as tokens };
export const mode: StyleDictionary.ModeIdentifier = 'motion';
