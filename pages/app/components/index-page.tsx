// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import pagesContext from '../pages-context';
import { Link } from 'react-router-dom';
import { PACKAGE_VERSION } from '~components/internal/environment';
import AwsUiLink from '~components/link';

interface TreeItem {
  name: string;
  href?: string;
  items: TreeItem[];
}

function createPagesTree(pages: string[]) {
  const tree: TreeItem = { name: '.', items: [] };
  function putInTree(segments: string[], node: TreeItem, item: string) {
    if (segments.length === 0) {
      node.href = item;
    } else {
      let match = node.items.filter(item => item.name === segments[0])[0];
      if (!match) {
        match = { name: segments[0], items: [] };
        node.items.push(match);
      }
      putInTree(segments.slice(1), match, item);
      // make directories to be displayed above files
      node.items.sort((a, b) => Math.min(b.items.length, 1) - Math.min(a.items.length, 1));
    }
  }
  for (const page of pages) {
    const segments = page.split('/');
    putInTree(segments, tree, page);
  }
  return tree;
}

function TreeItemView({ item }: { item: TreeItem }) {
  return (
    <li>
      {item.href ? (
        <Link to={item.href} component={AwsUiLink}>
          {item.name}
        </Link>
      ) : (
        <b style={{ fontSize: '1.6rem' }}>{item.name}</b>
      )}
      <ul style={{ marginBlock: 0, marginInline: 0 }}>
        {item.items.map(item => (
          <TreeItemView key={item.name} item={item} />
        ))}
      </ul>
    </li>
  );
}

export default function IndexPage() {
  const pages = pagesContext.keys().map(pagePath => pagePath.replace(/^\.\//, '').replace(/\.page\.tsx$/, ''));
  const tree = createPagesTree(pages);
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>Welcome!</h1>
      <p>Build info: {PACKAGE_VERSION}</p>
      <p>Select a page:</p>
      <ul>
        {tree.items.map(item => (
          <TreeItemView key={item.name} item={item} />
        ))}
      </ul>
    </div>
  );
}
