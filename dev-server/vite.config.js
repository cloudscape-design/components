// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Vite configuration for the demo development server
 *
 * React 18 Support:
 * When REACT_VERSION=18 is set, this config uses a custom plugin to rewrite
 * react/react-dom imports to react18/react-dom18 packages. The packages are
 * externalized so Node.js loads them directly (handling CommonJS properly).
 *
 * We use Vite 5.x because:
 * - Vite 5's legacy.proxySsrExternalModules option provides CommonJS interop
 * - This allows the react18 package (CommonJS-only) to work correctly in SSR
 * - Vite 6+ removed this option and has stricter ESM requirements
 */

import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

// eslint-disable-next-line no-undef
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
 * Plugin to skip CSS imports from lib/components since they're already
 * collected and injected during SSR via collect-styles.mjs.
 *
 * The styles.css.js files import .scoped.css - we strip that import
 * since the CSS is already in the SSR response.
 */
function skipLibComponentsCssPlugin() {
  return {
    name: 'skip-lib-components-css',
    enforce: 'pre',

    resolveId(source, importer) {
      // Skip .scoped.css files from lib/components - they're already in the SSR styles
      if (source.endsWith('.scoped.css') && importer && importer.includes('lib/components')) {
        return { id: `\0skip-css:${source}`, external: false };
      }
      if (source.endsWith('.scoped.css') && source.includes('lib/components')) {
        return { id: `\0skip-css:${source}`, external: false };
      }
      return null;
    },

    load(id) {
      // Return empty module for skipped CSS
      if (id.startsWith('\0skip-css:')) {
        return 'export default {}';
      }
      return null;
    },

    transform(code, id) {
      // For styles.css.js files in lib/components, remove the CSS import
      if (id.includes('lib/components') && id.endsWith('styles.css.js')) {
        return code.replace(/^\s*import\s+['"]\.\/styles\.scoped\.css['"];\s*$/m, '');
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
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
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

// Build resolve aliases (non-React)
const aliases = [
  // Map @cloudscape-design/components to built lib/components
  { find: '@cloudscape-design/components', replacement: path.resolve(rootDir, 'lib/components') },
  { find: '~components', replacement: path.resolve(rootDir, 'lib/components') },
  { find: '~design-tokens', replacement: path.resolve(rootDir, 'lib/design-tokens') },
  { find: '@cloudscape-design/design-tokens', replacement: path.resolve(rootDir, 'lib/design-tokens') },
];

export default defineConfig({
  root: path.resolve(__dirname),

  plugins: [
    skipLibComponentsCssPlugin(),
    pagesScssModulesPlugin(),
    react18Plugin(),
    react({
      // Configure JSX runtime for React 18 mode
      jsxImportSource: react18 ? 'react18' : 'react',
    }),
  ],

  resolve: {
    alias: aliases,
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx'],
  },

  // SSR configuration
  ssr: {
    // Target Node.js for SSR
    target: 'node',
    // Include these packages in the SSR bundle (don't externalize them)
    noExternal: [
      '@cloudscape-design/components',
      '@cloudscape-design/design-tokens',
      '@cloudscape-design/collection-hooks',
      '@cloudscape-design/component-toolkit',
      '@cloudscape-design/theming-runtime',
      '@cloudscape-design/global-styles',
    ],
    // Externalize Node.js modules
    external: ['glob', 'fs', 'path', 'node:fs', 'node:path', 'node:url'],
  },

  // Legacy options for better CommonJS interop in SSR
  legacy: {
    proxySsrExternalModules: true,
  },

  // Optimize dependencies for faster dev startup
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

  // CSS handling
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        // Add the design-tokens path for @use '~design-tokens'
        includePaths: [path.resolve(rootDir, 'lib')],
      },
    },
  },

  // Build configuration (for potential production builds)
  build: {
    outDir: path.resolve(rootDir, 'dist/ssr'),
    emptyOutDir: true,
  },

  // Server configuration
  server: {
    port: 3000,
    strictPort: false,
    fs: {
      // Allow serving files from the entire project
      allow: [rootDir],
    },
  },
});
