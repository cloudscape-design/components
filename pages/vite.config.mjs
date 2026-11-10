// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'node:path';

import themes from '../build-tools/utils/themes.js';
import workspace from '../build-tools/utils/workspace.js';
import createViteConfig from './vite.config.base.mjs';

export function createConfig({
  react18 = process.env.REACT_VERSION === '18',
  theme = process.env.THEME || 'default',
  outputPath = `pages/lib/static-${theme}`,
} = {}) {
  const themeDefinition = themes.find(t => t.name === theme);
  return createViteConfig({
    componentsPath: path.resolve(themeDefinition.outputPath),
    designTokensPath: path.resolve(
      workspace.targetPath,
      themeDefinition.designTokensDir,
      themeDefinition.designTokensOutput
    ),
    globalStylesPath: themeDefinition.globalStylesPath,
    outputPath,
    react18,
  });
}

export default () => createConfig();
