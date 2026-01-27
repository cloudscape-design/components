// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { viteStaticCopy } from 'vite-plugin-static-copy';
const process = globalThis.process;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

const react18 = process.env.REACT_VERSION === '18';

if (react18) {
  console.log('\n🔄 React 18 mode enabled - using react18/react-dom18 packages\n');
}

/**
 * Plugin to handle React 18 aliasing
 * - For SSR: resolve to react18/react-dom18 and mark as external
 * - For client: resolve to the actual file paths for bundling
 */
function react18Plugin() {
  // Pre-resolve the package entry points
  let react18Entry = null;
  let reactDom18Entry = null;

  if (react18) {
    try {
      react18Entry = require.resolve('react18');
      reactDom18Entry = require.resolve('react-dom18');
    } catch (e) {
      console.error('Failed to resolve react18/react-dom18 packages:', e.message);
    }
  }

  return {
    name: 'react18-resolver',
    enforce: 'pre',
    resolveId(source, importer, options) {
      if (!react18) {
        return null;
      }

      const isSSR = options?.ssr;

      // Handle react imports
      if (source === 'react') {
        if (isSSR) {
          return { id: 'react18', external: true };
        } else {
          return react18Entry;
        }
      }
      if (source.startsWith('react/')) {
        const subpath = source.slice('react/'.length);
        if (isSSR) {
          return { id: `react18/${subpath}`, external: true };
        } else {
          // Resolve the subpath relative to react18 package
          try {
            return require.resolve(`react18/${subpath}`);
          } catch {
            return null; // Let Vite handle it
          }
        }
      }

      // Handle react-dom imports
      if (source === 'react-dom') {
        if (isSSR) {
          return { id: 'react-dom18', external: true };
        } else {
          return reactDom18Entry;
        }
      }
      if (source.startsWith('react-dom/')) {
        const subpath = source.slice('react-dom/'.length);
        if (isSSR) {
          return { id: `react-dom18/${subpath}`, external: true };
        } else {
          // For react-dom/client, resolve to the actual react-dom18 package's client entry
          // require.resolve doesn't work with package subpath exports, so we resolve manually
          if (subpath === 'client') {
            const reactDom18Dir = path.dirname(reactDom18Entry);
            return path.join(reactDom18Dir, 'client.js');
          }
          try {
            return require.resolve(`react-dom18/${subpath}`);
          } catch {
            return null; // Let Vite handle it
          }
        }
      }

      // Handle already-rewritten imports (from JSX transform with jsxImportSource)
      if (source === 'react18') {
        if (isSSR) {
          return { id: source, external: true };
        } else {
          return react18Entry;
        }
      }
      if (source.startsWith('react18/')) {
        const subpath = source.slice('react18/'.length);
        if (isSSR) {
          return { id: source, external: true };
        } else {
          try {
            return require.resolve(`react18/${subpath}`);
          } catch {
            return null;
          }
        }
      }

      if (source === 'react-dom18') {
        if (isSSR) {
          return { id: source, external: true };
        } else {
          return reactDom18Entry;
        }
      }
      if (source.startsWith('react-dom18/')) {
        const subpath = source.slice('react-dom18/'.length);
        if (isSSR) {
          return { id: source, external: true };
        } else {
          // For react-dom18/client, resolve to the actual package's client entry
          if (subpath === 'client') {
            const reactDom18Dir = path.dirname(reactDom18Entry);
            return path.join(reactDom18Dir, 'client.js');
          }
          try {
            return require.resolve(`react-dom18/${subpath}`);
          } catch {
            return null;
          }
        }
      }

      return null;
    },
  };
}

/**
 * Plugin to treat all .scss files in pages/ as CSS modules
 * Vite only treats .module.scss as CSS modules by default.
 * This plugin creates virtual .module.scss files that load the real .scss content.
 */
function pagesScssModulesPlugin() {
  const virtualToReal = new Map();

  return {
    name: 'pages-scss-modules',
    enforce: 'pre',

    async resolveId(source, importer, options) {
      // Only handle .scss files that aren't already .module.scss
      if (!source.endsWith('.scss') || source.endsWith('.module.scss')) {
        return null;
      }

      // Only handle relative imports from within pages/
      if (!importer || !importer.includes('/pages/')) {
        return null;
      }

      if (!source.startsWith('./') && !source.startsWith('../')) {
        return null;
      }

      // Resolve the actual path
      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true,
      });
      if (!resolved) {
        return null;
      }

      // Create a virtual .module.scss path
      const virtualPath = resolved.id.replace(/\.scss$/, '.virtual.module.scss');
      virtualToReal.set(virtualPath, resolved.id);

      return virtualPath;
    },

    async load(id) {
      // Handle our virtual .module.scss files
      const realPath = virtualToReal.get(id);
      if (realPath) {
        const fs = await import('fs/promises');
        const content = await fs.readFile(realPath, 'utf-8');
        return content;
      }
      return null;
    },
  };
}

export default ({
  outputPath = 'pages/lib/static/',
  componentsPath,
  designTokensPath,
  globalStylesPath,
  globalStylesIndex = 'index',
  moduleReplacements = [],
  react18,
} = {}) => {
  const mode = process.env.NODE_ENV;

  return {
    root: path.resolve(__dirname),
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
      react18Plugin(),
      pagesScssModulesPlugin(),
    ],
    resolve: {
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '~design-tokens': designTokensPath,
        '~components': componentsPath,
        '~mount': react18
          ? path.resolve(__dirname, './app/mount/react18.ts')
          : path.resolve(__dirname, './app/mount/react16.ts'),
        ...(react18 && {
          react: 'react18',
          'react-dom': 'react-dom18',
          'react-dom/client': 'react-dom18/client',
        }),
        ...(globalStylesPath && {
          '@cloudscape-design/global-styles': globalStylesPath,
          '@cloudscape-design/global-styles/index.css': `${globalStylesPath}/${globalStylesIndex}.css`,
        }),
        ...Object.fromEntries(moduleReplacements.map(({ from, to }) => [from, to])),
      },
    },
    optimizeDeps: {
      include: react18
        ? ['react18', 'react-dom18', 'react-router-dom', 'prop-types', 'react-is', 'react-keyed-flatten-children']
        : ['react', 'react-dom', 'react-router-dom', 'prop-types', 'react-is', 'react-keyed-flatten-children'],
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
    build: {
      emptyOutDir: true,
      outDir: path.resolve(rootDir, outputPath),
      sourcemap: true,
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (id.includes(componentsPath) || id.includes(designTokensPath)) {
              if (!id.includes(path.resolve(componentsPath, 'i18n/messages'))) {
                return 'awsui';
              }
            }
            if (id.includes('node_modules') && !id.includes('ace-builds')) {
              return 'vendor';
            }
          },
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
};
