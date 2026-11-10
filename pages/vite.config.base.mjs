// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MagicString from 'magic-string';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { searchForWorkspaceRoot } from 'vite';

const require = createRequire(import.meta.url);
const csso = require('csso');
const pagesDir = path.dirname(fileURLToPath(import.meta.url));

// Vite adds this nonce to the <style> elements it injects in development, see pages/app/index.html
const devCspNonce = 'cloudscape-dev-pages';

/**
 * Creates the Vite configuration for the dev pages.
 *
 * This file is shipped together with the pages (see build-tools/tasks/build-pages.js) and is used by other packages
 * to build the pages against their own versions of the components, keep the options backwards compatible.
 *
 * @param {object} options
 * @param {string} [options.outputPath] output directory, relative to the current working directory
 * @param {string} options.componentsPath components to use for `~components` imports
 * @param {string} options.designTokensPath design tokens to use for `~design-tokens` imports
 * @param {string} [options.globalStylesPath] replacement for the `@cloudscape-design/global-styles` package
 * @param {string} [options.globalStylesIndex] the global styles file to use for `@cloudscape-design/global-styles/index.css`
 * @param {Array<{ from: string | RegExp, to: string }>} [options.moduleReplacements] additional import replacements,
 *   matched against the import specifiers before the other replacements. Only the first matching replacement applies.
 * @param {boolean} [options.react18] use React 18 instead of React 16
 * @param {boolean} [options.contentHash] add content hashes to the names of the output files
 * @param {boolean} [options.shimMissingExports] import missing exports as `undefined` instead of failing the build
 * @param {string} [options.mode] Vite mode, defaults to the mode of the Vite command
 * @returns {import('vite').UserConfig}
 */
export default function createViteConfig({
  outputPath = 'pages/lib/static/',
  componentsPath,
  designTokensPath,
  globalStylesPath,
  globalStylesIndex = 'index',
  moduleReplacements = [],
  react18 = false,
  contentHash = true,
  shimMissingExports = false,
  mode,
} = {}) {
  return {
    mode,
    root: path.join(pagesDir, 'app'),
    // Pages are deployed under different paths, keep all asset references relative
    base: './',
    publicDir: false,
    logLevel: (mode ?? process.env.NODE_ENV) === 'production' ? 'warn' : 'info',
    resolve: {
      // The order matters, the first matching entry is applied
      alias: [
        ...moduleReplacements.map(({ from, to }) => ({ find: from, replacement: to })),
        { find: '~components', replacement: componentsPath },
        { find: '~design-tokens', replacement: designTokensPath },
        ...(globalStylesPath
          ? [
              {
                find: /^@cloudscape-design\/global-styles\/index\.css$/,
                replacement: `${globalStylesPath}/${globalStylesIndex}.css`,
              },
              { find: '@cloudscape-design/global-styles', replacement: globalStylesPath },
            ]
          : []),
        ...(react18
          ? [
              { find: '~mount', replacement: path.join(pagesDir, 'app/mount/react18.ts') },
              { find: 'react-dom/client', replacement: 'react-dom18/client' },
              { find: 'react-dom', replacement: 'react-dom18' },
              { find: 'react', replacement: 'react18' },
            ]
          : [{ find: '~mount', replacement: path.join(pagesDir, 'app/mount/react16.ts') }]),
      ],
    },
    oxc: {
      // Same as the "jsx" setting of pages/tsconfig.json, the pages import React explicitly
      jsx: { runtime: 'classic' },
    },
    plugins: [
      outDirFromWorkingDirectory(),
      scssModules(),
      aceFiles(),
      cspNonce(),
      loadChunksWithScripts(),
      minifyCss(),
    ],
    build: {
      outDir: path.resolve(outputPath),
      emptyOutDir: true,
      // Same as the TypeScript target of the pages and the components
      target: 'es2019',
      // CSS is minified by the minifyCss plugin
      cssMinify: false,
      // Inlined images are blocked by the content security policy of the pages
      assetsInlineLimit: 0,
      sourcemap: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 10_000,
      rolldownOptions: {
        shimMissingExports,
        onwarn(warning, defaultHandler) {
          // The "use client" directives of the components are irrelevant for the pages
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
            return;
          }
          defaultHandler(warning);
        },
        output: contentHash
          ? {}
          : {
              entryFileNames: 'assets/[name].js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: 'assets/[name][extname]',
            },
      },
    },
    server: {
      host: 'localhost',
      port: 8080,
      strictPort: true,
      fs: {
        allow: allowedPaths([
          searchForWorkspaceRoot(process.cwd()),
          pagesDir,
          componentsPath,
          designTokensPath,
          globalStylesPath,
        ]),
      },
    },
    preview: {
      host: 'localhost',
      port: 8080,
      strictPort: true,
    },
  };
}

function allowedPaths(paths) {
  const result = new Set();
  for (const entry of paths.filter(Boolean)) {
    result.add(path.resolve(entry));
    // Vite checks the real paths of the files
    try {
      result.add(fs.realpathSync(entry));
    } catch {
      // the path does not exist (yet)
    }
  }
  return [...result];
}

/**
 * Vite resolves relative output directories, e.g. from `vite build --outDir`, against its root (pages/app).
 * Resolve them against the working directory instead, the same as the `outputPath` option.
 */
function outDirFromWorkingDirectory() {
  return {
    name: 'cloudscape-pages:out-dir',
    config: config => (config.build?.outDir ? { build: { outDir: path.resolve(config.build.outDir) } } : undefined),
  };
}

/**
 * All SCSS files of the pages are CSS modules, while Vite only treats `*.module.scss` files as such.
 * The plugin adds a query matching that naming convention to the resolved SCSS files.
 */
function scssModules() {
  return {
    name: 'cloudscape-pages:scss-modules',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!source.endsWith('.scss') || source.endsWith('.module.scss')) {
        return null;
      }
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved || resolved.external || resolved.id.includes('?')) {
        return resolved;
      }
      return { ...resolved, id: `${resolved.id}?.module.scss` };
    },
  };
}

/**
 * The code editor pages load the Ace modes, themes and workers from `./ace/`.
 */
function aceFiles() {
  const aceDir = path.dirname(require.resolve('ace-builds/src-min-noconflict/ace'));
  const contentTypes = { '.js': 'text/javascript', '.css': 'text/css' };
  return {
    name: 'cloudscape-pages:ace',
    configureServer(server) {
      server.middlewares.use('/ace', (req, res, next) => {
        const filePath = path.join(aceDir, new URL(req.url, 'http://localhost').pathname);
        if (!filePath.startsWith(aceDir + path.sep) || !fs.statSync(filePath, { throwIfNoEntry: false })?.isFile()) {
          return next();
        }
        res.setHeader('Content-Type', contentTypes[path.extname(filePath)] ?? 'application/octet-stream');
        pipeline(fs.createReadStream(filePath), res, () => {});
      });
    },
    generateBundle() {
      for (const file of fs.readdirSync(aceDir, { recursive: true })) {
        const filePath = path.join(aceDir, file);
        if (fs.statSync(filePath).isFile()) {
          this.emitFile({
            type: 'asset',
            fileName: path.posix.join('ace', file.split(path.sep).join('/')),
            source: fs.readFileSync(filePath),
          });
        }
      }
    },
  };
}

/**
 * The content security policy of the pages does not allow inline styles. In development, Vite injects the imported
 * styles as <style> elements with this nonce, which pages/app/index.html adds to the policy.
 */
function cspNonce() {
  return {
    name: 'cloudscape-pages:csp-nonce',
    apply: 'serve',
    config: () => ({ html: { cspNonce: devCspNonce } }),
  };
}

/**
 * Dynamic imports, e.g. of the lazy loaded pages, do not delay the load event of the document, while the script elements
 * webpack used to load chunks do. Browser tests rely on that, e.g. WebDriver waits for the load event when navigating.
 * Load the chunks with module script elements first, which delay the load event. The import then reuses the module.
 */
function loadChunksWithScripts() {
  const loadChunk = '__cloudscapeLoadChunk';
  const loadChunkCode = `
function ${loadChunk}(url, base) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = new URL(url, base).href;
    script.onload = script.onerror = () => {
      script.remove();
      resolve();
    };
    document.head.appendChild(script);
  });
}
`;
  const dynamicImportRE = /\bimport\((["'`])(\.{1,2}\/[^"'`]+\.js)\1\)/g;
  return {
    name: 'cloudscape-pages:load-chunks-with-scripts',
    apply: 'build',
    enforce: 'post',
    renderChunk(code) {
      const matches = [...code.matchAll(dynamicImportRE)];
      if (matches.length === 0) {
        return null;
      }
      const s = new MagicString(code);
      for (const { 0: expression, 1: quote, 2: url, index } of matches) {
        s.prependLeft(index, `${loadChunk}(${quote}${url}${quote}, import.meta.url).then(() => `);
        s.appendRight(index + expression.length, ')');
      }
      s.append(loadChunkCode);
      return { code: s.toString(), map: s.generateMap({ hires: 'boundary' }) };
    },
  };
}

/**
 * Minifies the CSS with csso. Other minifiers (cssnano, Lightning CSS) restructure the CSS and can change the casing
 * of our CSS custom properties or drop declarations which only look redundant, see https://github.com/cssnano/cssnano/issues/675.
 */
function minifyCss() {
  return {
    name: 'cloudscape-pages:minify-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css')) {
          const css = typeof file.source === 'string' ? file.source : new TextDecoder().decode(file.source);
          file.source = csso.minify(css, { filename: file.fileName, restructure: false }).css;
        }
      }
    },
  };
}
