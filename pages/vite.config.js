// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import themes from '../build-tools/utils/themes';
import workspace from '../build-tools/utils/workspace';
import baseConfig from './vite.config.base';
const process = globalThis.process;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// https://vite.dev/config/
export default defineConfig(() => {
  const react18 = process.env.REACT_VERSION === '18';
  const theme = process.env.THEME || 'default';
  const themeDefinition = themes.find(t => t.name === theme);
  return baseConfig({
    componentsPath: path.resolve(rootDir, 'lib/components').toString(),
    designTokensPath: path.resolve(
      workspace.targetPath,
      themeDefinition.designTokensDir,
      themeDefinition.designTokensOutput
    ),
    globalStylesPath: themeDefinition.globalStylesPath,
    outputPath: `pages/lib/static-${theme}`,
    react18,
  });
});
