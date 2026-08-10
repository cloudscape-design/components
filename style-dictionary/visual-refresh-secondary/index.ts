// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import { createColorMode, createDensityMode, createMotionMode } from '../utils/modes.js';
import { buildVisualRefresh } from '../visual-refresh/index.js';

const modes = [
  createColorMode('.awsui-dark-mode'),
  createDensityMode('.awsui-compact-mode'),
  createMotionMode('.awsui-motion-disabled'),
];

// Scoped with :not(.awsui-one-theme) so one-theme takes precedence when both classes are present.
const builder = new ThemeBuilder('visual-refresh', '.awsui-visual-refresh:not(.awsui-one-theme)', modes);
const theme = buildVisualRefresh(builder);

export default theme;
