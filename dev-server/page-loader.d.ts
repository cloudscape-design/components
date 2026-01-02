// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Tree item interface for the page tree structure
 */
export interface TreeItem {
  name: string;
  href?: string;
  items: TreeItem[];
}

/**
 * Scans for all demo pages matching the pattern pages/*.page.tsx
 * and returns a list of page IDs (e.g., "alert/simple", "app-layout/with-drawers")
 */
export function getPageList(): string[];

/**
 * Checks if a page exists by its page ID
 */
export function pageExists(pageId: string): boolean;

/**
 * Gets the file path for a page ID
 */
export function getPagePath(pageId: string): string;

/**
 * Clears the cached page list (useful for development when pages are added/removed)
 */
export function clearPageCache(): void;

/**
 * Creates a tree structure from the page list for display in the index page
 */
export function createPagesTree(pages: string[]): TreeItem;
