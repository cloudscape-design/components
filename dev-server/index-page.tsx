// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

/**
 * Tree item interface for the page tree structure
 */
export interface TreeItem {
  name: string;
  href?: string;
  items: TreeItem[];
}

/**
 * Props for IndexPage component
 */
export interface IndexPageProps {
  pageTree?: TreeItem;
}

/**
 * Renders a tree item with its children
 */
function TreeItemView({ item }: { item: TreeItem }) {
  return (
    <li>
      {item.href ? <a href={`/${item.href}`}>{item.name}</a> : <b style={{ fontSize: '1.6rem' }}>{item.name}</b>}
      {item.items.length > 0 && (
        <ul style={{ marginBlock: 0, marginInline: 0 }}>
          {item.items.map(child => (
            <TreeItemView key={child.name} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Index page component that lists all available demo pages
 * Similar to pages/app/components/index-page.tsx but for SSR
 *
 * The pageTree prop is passed from the server to avoid importing
 * Node.js-only modules (page-loader.js) on the client side.
 */
export default function IndexPage({ pageTree }: IndexPageProps) {
  // If no pageTree is provided (client-side hydration), show a loading message
  // The server will always provide the pageTree
  if (!pageTree) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <h1>Cloudscape Demo Pages</h1>
        <p>Loading page list...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h1>Cloudscape Demo Pages</h1>
      <p>Select a page:</p>
      <ul>
        {pageTree.items.map(item => (
          <TreeItemView key={item.name} item={item} />
        ))}
      </ul>
    </div>
  );
}
