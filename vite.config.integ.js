// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, mergeConfig } from 'vite';

import themes from './build-tools/utils/themes';
import workspace from './build-tools/utils/workspace';
import baseConfig from './vite.config.base';

const process = globalThis.process;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname);

export default defineConfig(() => {
  const react18 = process.env.REACT_VERSION === '18';
  const theme = process.env.THEME || 'default';
  const themeDefinition = themes.find(t => t.name === theme);

  if (!themeDefinition) {
    throw new Error(`Theme "${theme}" not found. Available themes: ${themes.map(t => t.name).join(', ')}`);
  }

  const base = baseConfig({
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

  // Merge with integration-specific configuration
  // Disable HMR and client features for integration testing
  return mergeConfig(base, {
    server: {
      hmr: false,
      open: false,
      port: 8080,
      host: 'localhost',
    },
    // Preview server configuration (used when serving pre-built files in CI)
    preview: {
      port: 8080,
      host: 'localhost',
      open: false,
    },
    // Disable optimizations that might interfere with testing
    build: {
      minify: false,
    },
  });
});
