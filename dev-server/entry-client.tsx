// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import App from './app';
import IndexPage, { TreeItem } from './index-page';
import { parseURLParams, URLParams } from './url-params';

/**
 * Handle legacy hash-based routes from the old dev server.
 * Redirects URLs like /#/page-id to /page-id for backwards compatibility.
 */
function handleHashRedirect(): boolean {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    // Extract the path from the hash (e.g., "#/button/simple" -> "/button/simple")
    const newPath = hash.slice(1); // Remove the leading "#"
    // Preserve any query parameters from the original URL
    const search = window.location.search;
    window.location.replace(newPath + search);
    return true; // Redirect in progress
  }
  return false;
}

// Global flags symbols (same as in pages/app/index.tsx and entry-server.tsx)
const awsuiVisualRefreshFlag = Symbol.for('awsui-visual-refresh-flag');
const awsuiGlobalFlagsSymbol = Symbol.for('awsui-global-flags');

interface GlobalFlags {
  appLayoutWidget?: boolean;
  appLayoutToolbar?: boolean;
}

interface ExtendedWindow extends Window {
  [awsuiVisualRefreshFlag]?: () => boolean;
  [awsuiGlobalFlagsSymbol]?: GlobalFlags;
}

declare const window: ExtendedWindow;

/**
 * Set up global flags before hydration
 * These flags must be set before any React rendering occurs
 */
function setupGlobalFlags(urlParams: URLParams): void {
  // Set visual refresh flag
  window[awsuiVisualRefreshFlag] = () => urlParams.visualRefresh;

  // Set global flags for app layout
  if (!window[awsuiGlobalFlagsSymbol]) {
    window[awsuiGlobalFlagsSymbol] = {};
  }
  window[awsuiGlobalFlagsSymbol].appLayoutWidget = urlParams.appLayoutWidget;
  window[awsuiGlobalFlagsSymbol].appLayoutToolbar = urlParams.appLayoutToolbar;

  // Apply direction to document
  document.documentElement.setAttribute('dir', urlParams.direction);
}

/**
 * Parse the current URL to get page ID and parameters
 */
function parseCurrentURL(): { pageId: string | undefined; urlParams: URLParams } {
  const url = new URL(window.location.href);

  // Get page ID from pathname (remove leading slash)
  let pathname = url.pathname;
  // Remove trailing slash (except for root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  const pageId = pathname === '/' ? undefined : pathname.slice(1);

  // Parse URL parameters
  const urlParams = parseURLParams(url.searchParams);

  return { pageId, urlParams };
}

/**
 * Get the page tree from the embedded script tag (for index page hydration)
 */
function getPageTreeFromScript(): TreeItem | undefined {
  const scriptElement = document.getElementById('ssr-page-tree');
  if (scriptElement) {
    try {
      return JSON.parse(scriptElement.textContent || '');
    } catch (e) {
      console.warn('Failed to parse page tree from script:', e);
    }
  }
  return undefined;
}

/**
 * Pre-load all page modules using Vite's glob import
 * This allows dynamic imports with nested paths (e.g., "app-layout-toolbar/with-content-layout")
 */
const pageModules = import.meta.glob('../pages/**/*.page.tsx');

/**
 * Load a page component dynamically
 */
async function loadPageComponent(pageId: string): Promise<React.ComponentType> {
  const pagePath = `../pages/${pageId}.page.tsx`;
  const loader = pageModules[pagePath];

  if (!loader) {
    throw new Error(`Page not found: ${pageId}`);
  }

  try {
    const pageModule = (await loader()) as { default: React.ComponentType };
    return pageModule.default;
  } catch (error) {
    console.error(`Failed to load page "${pageId}":`, error);
    throw error;
  }
}

/**
 * Error fallback component for pages that fail to load
 */
function PageLoadError({ pageId, error }: { pageId: string; error: Error }): React.ReactElement {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#d32f2f' }}>Failed to Load Page</h1>
      <p>
        Could not load page: <code>{pageId}</code>
      </p>
      <details>
        <summary>Error Details</summary>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {error.message}
          {'\n\n'}
          {error.stack}
        </pre>
      </details>
      <p>
        <a href="/">← Back to index</a>
      </p>
    </div>
  );
}

/**
 * Check if the page was rendered with an SSR error (client-side only fallback)
 */
function wasSSRError(): boolean {
  const errorMarker = document.querySelector('[data-ssr-error="true"]');
  return errorMarker !== null;
}

/**
 * Main hydration function
 * Detects React version and uses appropriate hydration method
 */
async function hydrate(): Promise<void> {
  // Handle legacy hash-based routes first
  if (handleHashRedirect()) {
    return; // Redirect in progress, don't hydrate
  }

  const { pageId, urlParams } = parseCurrentURL();

  // Set up global flags BEFORE any React rendering
  setupGlobalFlags(urlParams);

  // Get the app container
  const container = document.getElementById('app');
  if (!container) {
    console.error('Could not find #app container for hydration');
    return;
  }

  // Check if this page had an SSR error and needs client-side only rendering
  const hadSSRError = wasSSRError();
  if (hadSSRError && pageId) {
    console.log(`Page "${pageId}" was not SSR'd, rendering client-side only`);
  }

  // Load the page component if needed
  let PageComponent: React.ComponentType | null = null;
  let loadError: Error | null = null;

  if (pageId) {
    try {
      PageComponent = await loadPageComponent(pageId);
    } catch (error) {
      loadError = error instanceof Error ? error : new Error(String(error));
    }
  }

  // Create the app element
  const appElement = (
    <App pageId={pageId} urlParams={urlParams} isServer={false}>
      {loadError ? (
        <PageLoadError pageId={pageId!} error={loadError} />
      ) : PageComponent ? (
        <PageComponent />
      ) : (
        <IndexPage pageTree={getPageTreeFromScript()} />
      )}
    </App>
  );

  // Detect React version and hydrate accordingly
  const reactVersion = React.version;
  const isReact18 = reactVersion.startsWith('18');

  console.log(`Hydrating with React ${reactVersion}${hadSSRError ? ' (client-side only)' : ''}`);

  if (isReact18) {
    // React 18: Use hydrateRoot for SSR'd pages, createRoot for client-only pages
    // Use a variable to prevent Vite from statically analyzing this import
    // (react-dom/client doesn't exist in React 16)
    const reactDomClient = 'react-dom/client';
    // eslint-disable-next-line no-unsanitized/method
    const { hydrateRoot, createRoot } = (await import(/* @vite-ignore */ reactDomClient)) as any;
    if (hadSSRError) {
      // For pages that weren't SSR'd, use createRoot instead of hydrateRoot
      // to avoid hydration mismatch warnings
      createRoot(container).render(appElement);
    } else {
      hydrateRoot(container, appElement);
    }
  } else {
    // React 16/17: Use ReactDOM.hydrate for SSR'd pages, render for client-only
    const ReactDOM = (await import('react-dom')) as any;
    if (hadSSRError) {
      // For pages that weren't SSR'd, use render instead of hydrate
      ReactDOM.render(appElement, container);
    } else {
      ReactDOM.hydrate(appElement, container);
    }
  }
}

// Start hydration when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrate);
} else {
  hydrate();
}
