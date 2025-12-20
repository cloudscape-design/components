// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

// Import page-loader directly (Node.js module, not through Vite)
import { createPagesTree, getPageList, pageExists } from './page-loader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    configFile: path.resolve(__dirname, 'vite.config.js'),
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from lib directory
  app.use('/lib', express.static(path.resolve(rootDir, 'lib')));

  // Handle all routes - use wildcard for Express 4.x
  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      // Read the HTML template
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

      // Apply Vite HTML transforms (handles HMR injection, etc.)
      template = await vite.transformIndexHtml(url, template);

      // Parse URL to get page ID and query parameters BEFORE loading modules
      // Handle both /page and /page/ formats
      let urlPath = url.split('?')[0];
      // Remove trailing slash (except for root)
      if (urlPath !== '/' && urlPath.endsWith('/')) {
        urlPath = urlPath.slice(0, -1);
      }
      const pageId = urlPath === '/' ? undefined : urlPath.slice(1);
      const urlParams = Object.fromEntries(new URL(url, `http://localhost:${port}`).searchParams);

      // Clear the visual refresh state BEFORE loading any component modules
      // This ensures the visual refresh flag is re-evaluated per request
      const { clearVisualRefreshState } = await vite.ssrLoadModule(
        '@cloudscape-design/component-toolkit/internal/testing'
      );
      clearVisualRefreshState();

      // Set the visual refresh flag based on URL params BEFORE loading entry-server
      const visualRefresh = urlParams.visualRefresh !== 'false';
      globalThis[Symbol.for('awsui-visual-refresh-flag')] = () => visualRefresh;

      // Set up other global flags
      const globalFlagsSymbol = Symbol.for('awsui-global-flags');
      if (!globalThis[globalFlagsSymbol]) {
        globalThis[globalFlagsSymbol] = {};
      }
      globalThis[globalFlagsSymbol].appLayoutWidget = urlParams.appLayoutWidget === 'true';
      globalThis[globalFlagsSymbol].appLayoutToolbar = urlParams.appLayoutToolbar === 'true';

      // Load the server entry module (path relative to Vite root which is dev-server/)
      const { render } = await vite.ssrLoadModule('/entry-server.tsx');

      // Collect CSS styles from built components
      let styles = '';
      try {
        const { collectStyles: getStyles } = await vite.ssrLoadModule('/collect-styles.mjs');
        styles = getStyles();
      } catch (e) {
        console.warn('Warning: Could not collect styles:', e.message);
      }

      // Get page utilities (using Node.js module directly, not through Vite)
      const pageList = getPageList();
      const pageTree = createPagesTree(pageList);
      const pageExistsResult = pageId ? pageExists(pageId) : true;

      // Render the app HTML
      const { html: appHtml, status } = await render({
        pageId,
        urlParams,
        pageTree,
        pageExists: pageExistsResult,
        pageList,
      });

      // Inject styles and rendered HTML into template
      // Build body classes based on URL params for SSR
      const bodyClasses = [];
      if (visualRefresh) {
        bodyClasses.push('awsui-visual-refresh');
      }
      if (urlParams.mode === 'dark') {
        bodyClasses.push('awsui-dark-mode');
      }
      if (urlParams.density === 'compact') {
        bodyClasses.push('awsui-compact-mode');
      }
      if (urlParams.motionDisabled === 'true') {
        bodyClasses.push('awsui-motion-disabled');
      }
      const bodyClass = bodyClasses.join(' ');

      const finalHtml = template
        .replace('<!--ssr-styles-->', styles ? `<style id="ssr-styles">${styles}</style>` : '')
        .replace('<!--ssr-body-class-->', bodyClass)
        .replace('<!--ssr-outlet-->', appHtml);

      // Send the response
      res.status(status).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e) {
      // Fix stack trace for Vite
      vite.ssrFixStacktrace(e);

      console.error('Render Error:', e.stack);

      // Return error page
      res.status(500).set({ 'Content-Type': 'text/html' }).end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Render Error</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; }
              pre { background: #f5f5f5; padding: 1rem; overflow: auto; }
              h1 { color: #d32f2f; }
            </style>
          </head>
          <body>
            <h1>Rendering Error</h1>
            <p>${e.message}</p>
            <pre>${e.stack}</pre>
          </body>
        </html>
      `);
    }
  });

  app.listen(port, () => {
    console.log(`Demo server running at http://localhost:${port}`);
  });
}

createServer();
