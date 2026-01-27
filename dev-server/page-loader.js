// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { glob } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.resolve(rootDir, 'pages');

// Cache for page list to avoid repeated filesystem scans
let cachedPageList = null;

// Scans for all demo pages matching the pattern pages/**/*.page.tsx
// and returns a list of page IDs (e.g., "alert/simple", "app-layout/with-drawers")
export function getPageList() {
  if (cachedPageList !== null) {
    return cachedPageList;
  }

  const pageFiles = glob.sync('**/*.page.tsx', {
    cwd: pagesDir,
    ignore: ['app/**'], // Ignore the app directory itself
  });

  cachedPageList = pageFiles.map(file => file.replace(/\.page\.tsx$/, ''));
  return cachedPageList;
}

// Checks if a page exists by its page ID
export function pageExists(pageId) {
  const pageList = getPageList();
  return pageList.includes(pageId);
}

// Gets the file path for a page ID
export function getPagePath(pageId) {
  return path.resolve(pagesDir, `${pageId}.page.tsx`);
}

// Clears the cached page list (useful for development when pages are added/removed)
export function clearPageCache() {
  cachedPageList = null;
}

// Creates a tree structure from the page list for display in the index page
export function createPagesTree(pages) {
  const tree = { name: '.', items: [] };

  function putInTree(segments, node, item) {
    if (segments.length === 0) {
      node.href = item;
    } else {
      let match = node.items.find(child => child.name === segments[0]);
      if (!match) {
        match = { name: segments[0], items: [] };
        node.items.push(match);
      }
      putInTree(segments.slice(1), match, item);
      // Make directories display above files
      node.items.sort((a, b) => Math.min(b.items.length, 1) - Math.min(a.items.length, 1));
    }
  }

  for (const page of pages) {
    const segments = page.split('/');
    putInTree(segments, tree, page);
  }

  return tree;
}
