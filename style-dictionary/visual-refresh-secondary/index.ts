// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import { createColorMode, createDensityMode, createMotionMode } from '../utils/modes';
import { buildVisualRefresh } from '../visual-refresh';

const modes = [
  createColorMode('.awsui-dark-mode'),
  createDensityMode('.awsui-compact-mode'),
  createMotionMode('.awsui-motion-disabled'),
];

const builder = new ThemeBuilder('visual-refresh', '.awsui-visual-refresh', modes);
const theme = buildVisualRefresh(builder);

export default theme;
