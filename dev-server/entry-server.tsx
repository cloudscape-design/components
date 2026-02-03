// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// IMPORTANT: Global flags are set by server.mjs BEFORE this module is loaded.
// Do NOT set the visual refresh flag here - it must be set per-request.

// These imports are safe - they don't touch the component library
import type { TreeItem } from './index-page';
import { parseURLParams } from './url-params';

// Render options interface (accepts raw query params)
export interface RenderOptions {
  pageId?: string;
  urlParams: Record<string, string | undefined>;
  // Page utilities passed from server.mjs (to avoid importing Node.js modules)
  pageTree?: TreeItem;
  pageExists?: boolean;
  pageList?: string[];
}

// Render result interface
export interface RenderResult {
  html: string;
  status: number;
}

// Main render function
export async function render(options: RenderOptions): Promise<RenderResult> {
  const { pageId, urlParams: rawUrlParams, pageTree, pageExists, pageList } = options;

  // Parse URL parameters with defaults
  const urlParams = parseURLParams(rawUrlParams);

  // Global flags are already set by server.mjs before this module is loaded
  // Just clear the cached visual refresh state to ensure it's re-evaluated
  const { clearVisualRefreshState } = await import('@cloudscape-design/component-toolkit/internal/testing');
  clearVisualRefreshState();

  // Now dynamically import React and components (after flags are set)
  const React = await import('react');
  const ReactDOMServer = await import('react-dom/server');
  const { default: App } = await import('./app');
  const { default: IndexPage } = await import('./index-page');

  // 404 Not Found page component
  function NotFoundPage({ pageId, pageList = [] }: { pageId: string; pageList?: string[] }): React.ReactElement {
    return React.createElement(
      'div',
      { style: { maxWidth: 800, margin: '0 auto', padding: '20px' } },
      React.createElement('h1', { style: { color: '#d32f2f' } }, 'Page Not Found'),
      React.createElement('p', null, 'The page ', React.createElement('code', null, pageId), ' does not exist.'),
      React.createElement('p', null, React.createElement('a', { href: '/' }, '← Back to index')),
      React.createElement(
        'details',
        null,
        React.createElement('summary', null, `Available pages (${pageList.length})`),
        React.createElement(
          'ul',
          null,
          pageList
            .slice(0, 50)
            .map((page: string) =>
              React.createElement('li', { key: page }, React.createElement('a', { href: `/${page}` }, page))
            ),
          pageList.length > 50 && React.createElement('li', null, `... and ${pageList.length - 50} more`)
        )
      )
    );
  }

  // Handle index page
  if (!pageId) {
    // Embed the page tree as JSON for client-side hydration
    const pageTreeScript = pageTree
      ? `<script id="ssr-page-tree" type="application/json">${JSON.stringify(pageTree)}</script>`
      : '';
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(
        App,
        { pageId: undefined, urlParams, isServer: true },
        React.createElement(IndexPage, { pageTree })
      )
    );
    return { html: pageTreeScript + appHtml, status: 200 };
  }

  // Check if page exists
  if (pageExists === false) {
    const html = ReactDOMServer.renderToString(
      React.createElement(
        App,
        { pageId, urlParams, isServer: true },
        React.createElement(NotFoundPage, { pageId, pageList })
      )
    );
    return { html, status: 404 };
  }

  // Try to dynamically import and render the page
  try {
    // Dynamic import of the page module
    const pages = import.meta.glob('../pages/**/*.page.tsx');
    const pagePath = `../pages/${pageId}.page.tsx`;

    if (!pages[pagePath]) {
      throw new Error(`Page module not found: ${pagePath}`);
    }

    const pageModule = (await pages[pagePath]()) as { default: React.ComponentType };
    const PageComponent = pageModule.default;

    if (!PageComponent) {
      throw new Error(`Page module "${pageId}" does not have a default export`);
    }

    const html = ReactDOMServer.renderToString(
      React.createElement(App, { pageId, urlParams, isServer: true }, React.createElement(PageComponent))
    );
    return { html, status: 200 };
  } catch (error) {
    // If the page can't be rendered, return a placeholder for client-side rendering
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.warn(`⚠️  SSR Warning for page "${pageId}": Page will be rendered client-side only`);
    console.warn(`   Reason: ${errorMessage}`);
    if (errorStack) {
      console.warn(`   Stack: ${errorStack.split('\n').slice(1, 4).join('\n   ')}`);
    }

    const errorPlaceholder = React.createElement(
      'div',
      { 'data-ssr-error': 'true', 'data-page-id': pageId, 'data-error-message': errorMessage },
      React.createElement(
        'div',
        { style: { padding: '20px', textAlign: 'center' } },
        React.createElement('p', { style: { color: '#666' } }, `Loading ${pageId}...`),
        React.createElement(
          'p',
          { style: { fontSize: '12px', color: '#999' } },
          '(This page is rendered client-side only)'
        )
      )
    );

    const html = ReactDOMServer.renderToString(
      React.createElement(App, { pageId, urlParams, isServer: true }, errorPlaceholder)
    );
    return { html, status: 200 };
  }
}

// Re-export URL params utilities
export { parseURLParams, formatURLParams, defaultURLParams } from './url-params';
export type { URLParams } from './url-params';
