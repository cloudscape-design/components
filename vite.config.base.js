// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { createHTMLSecretsInjectionPlugin, createPagesScssModulesPlugin } from './vite.plugins';

const process = globalThis.process;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname);
const require = createRequire(import.meta.url);

/**
 * Builds a map of module path aliases for Vite's resolve configuration.
 *
 * Creates aliases for:
 * - Design tokens (~design-tokens)
 * - Components (~components)
 * - Mount utilities (~mount) - switches between React 16/18 implementations
 * - React packages (react, react-dom) when using React 18 mode
 * - Global styles (@cloudscape-design/global-styles) if provided
 * - Any custom module replacements
 *
 * @param {string} componentsPath - Path to the components directory
 * @param {string} designTokensPath - Path to the design tokens directory
 * @param {string} [globalStylesPath] - Optional path to global styles
 * @param {string} [globalStylesIndex] - Index file name for global styles CSS
 * @param {Array<{from: string, to: string}>} [moduleReplacements] - Custom module path replacements
 * @param {boolean} [react18] - Whether to use React 18 aliases
 * @returns {Object} An object mapping alias names to their resolved paths
 */
function buildResolveAliases({
  componentsPath,
  designTokensPath,
  globalStylesPath,
  globalStylesIndex,
  moduleReplacements,
  react18,
}) {
  const aliases = {
    '~design-tokens': designTokensPath,
    '~components': componentsPath,
    '~mount': react18
      ? path.resolve(__dirname, 'pages/app/mount/react18.ts')
      : path.resolve(__dirname, 'pages/app/mount/react16.ts'),
  };

  if (react18) {
    aliases.react = 'react18';
    aliases['react-dom'] = 'react-dom18';
    aliases['react-dom/client'] = 'react-dom18/client';
  }

  if (globalStylesPath) {
    aliases['@cloudscape-design/global-styles'] = globalStylesPath;
    aliases['@cloudscape-design/global-styles/index.css'] = `${globalStylesPath}/${globalStylesIndex}.css`;
  }

  for (const { from, to } of moduleReplacements) {
    aliases[from] = to;
  }

  return aliases;
}

/**
 * Creates a function that determines how Vite should split chunks during bundling.
 *
 * This function implements a custom chunking strategy that:
 * - Groups all component files and design token files into an 'awsui' chunk
 * - Excludes i18n messages from the awsui chunk to avoid unnecessary re-bundling
 * - Places all node_modules dependencies into a 'vendor' chunk
 * - Excludes ace-builds from vendor chunk to prevent conflicts
 *
 * @param {string} componentsPath - Path to the components directory
 * @param {string} designTokensPath - Path to the design tokens directory
 * @returns {Function} A function that takes a module ID and returns the chunk name or undefined
 */
function createManualChunks(componentsPath, designTokensPath) {
  return id => {
    if (id.includes(componentsPath) || id.includes(designTokensPath)) {
      if (!id.includes(path.resolve(componentsPath, 'i18n/messages'))) {
        return 'awsui';
      }
    }
    if (id.includes('node_modules') && !id.includes('ace-builds')) {
      return 'vendor';
    }
  };
}

/**
 * Creates a Vite configuration object for building the pages application.
 *
 * This factory function generates a complete Vite config with:
 * - React plugin (supports both React 16 and 18)
 * - Path aliases for components, design tokens, and other modules
 * - SCSS module processing with camelCase locals
 * - Optimized chunking strategy (awsui, vendor bundles)
 * - Static asset copying for ace-builds
 *
 * @param {string} [outputPath='pages/lib/static/'] - Output directory for build artifacts
 * @param {string} componentsPath - Path to the components source directory
 * @param {string} designTokensPath - Path to the design tokens directory
 * @param {string} [globalStylesPath] - Optional path to global styles package
 * @param {string} [globalStylesIndex='index'] - Index file name for global styles CSS
 * @param {Array<{from: string, to: string}>} [moduleReplacements=[]] - Custom module path replacements
 * @param {boolean} [react18=false] - Enable React 18 mode with react18/react-dom18 packages
 * @returns {import('vite').UserConfig} A Vite configuration object
 *
 * @example
 * // Basic usage with required paths
 * createViteConfig({
 *   componentsPath: 'lib/components',
 *   designTokensPath: 'lib/design-tokens',
 * });
 *
 * @example
 * // With React 18 and global styles
 * createViteConfig({
 *   componentsPath: 'lib/components',
 *   designTokensPath: 'lib/design-tokens',
 *   globalStylesPath: 'node_modules/@cloudscape-design/global-styles/dist',
 *   react18: true,
 * });
 */
export function createViteConfig({
  outputPath = 'pages/lib/static/',
  componentsPath,
  designTokensPath,
  globalStylesPath,
  globalStylesIndex = 'index',
  moduleReplacements = [],
  react18 = false,
}) {
  if (react18) {
    console.log('\n🔄 React 18 mode enabled - using react18/react-dom18 packages\n');
  }

  const mode = process.env.NODE_ENV;

  const resolveAliases = buildResolveAliases({
    componentsPath,
    designTokensPath,
    globalStylesPath,
    globalStylesIndex,
    moduleReplacements,
    react18,
  });

  const optimizeDepsIncludeReactSpecifics = react18
    ? ['react18', 'react-dom18', 'react-router-dom', 'prop-types', 'react-is', 'react-keyed-flatten-children']
    : ['react', 'react-dom', 'react-router-dom', 'prop-types', 'react-is', 'react-keyed-flatten-children'];

  const optimizeDepsInclude = [
    ...optimizeDepsIncludeReactSpecifics,
    'lodash/range',
    'd3-shape',
    'date-fns',
    'weekstart',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
    'mnth',
    '@cloudscape-design/collection-hooks',
    '@cloudscape-design/component-toolkit',
    'lodash/flatten',
    'react-transition-group',
    'intl-messageformat',
  ];

  return {
    root: path.resolve(__dirname, 'pages/app'),
    base: './',
    mode,
    plugins: [
      react({
        jsxImportSource: react18 ? 'react18' : 'react',
      }),
      viteStaticCopy({
        targets: [
          {
            src: path.dirname(require.resolve('ace-builds/src-min-noconflict/ace')) + '/*',
            dest: path.resolve(outputPath, 'ace'),
          },
        ],
      }),
      createPagesScssModulesPlugin(),
      createHTMLSecretsInjectionPlugin({
        data: {
          MODE: mode,
        },
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx'],
      alias: resolveAliases,
    },
    optimizeDeps: {
      include: optimizeDepsInclude,
      // Don't try to pre-bundle local lib/components - it has TypeScript type exports
      // that esbuild can't handle, and we want HMR for development anyway
      exclude: ['@cloudscape-design/components', '~components'],
      // Don't scan pages for dependencies - they import from local lib
      entries: [],
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          includePaths: [path.resolve(rootDir, 'lib')],
        },
      },
    },

    define: {
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
      'process.env.REACT_VERSION': react18 ? '18' : '16',
    },
    build: {
      emptyOutDir: true,
      outDir: path.resolve(rootDir, outputPath),
      sourcemap: true,
      cssMinify: 'lightningcss',
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks: createManualChunks(componentsPath, designTokensPath),
        },
      },
    },
    server: {
      open: true,
      fs: {
        // Allow serving files from the entire project
        allow: [rootDir],
      },
    },
  };
}

export default createViteConfig;
