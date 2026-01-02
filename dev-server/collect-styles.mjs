// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { glob } from 'glob';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.resolve(rootDir, 'lib/components');

let cachedStyles = null;

/**
 * Gets the global styles CSS from @cloudscape-design/global-styles
 */
function getGlobalStyles() {
  try {
    // Find the global-styles package in node_modules
    const globalStylesPath = path.resolve(rootDir, 'node_modules/@cloudscape-design/global-styles/index.css');
    return fs.readFileSync(globalStylesPath, 'utf-8');
  } catch (e) {
    console.warn('Warning: Could not read global styles:', e.message);
    return '';
  }
}

/**
 * Collects all scoped CSS files from the built component library
 * and combines them into a single CSS string for SSR injection.
 * Also includes global styles from @cloudscape-design/global-styles.
 */
export function collectStyles() {
  // Return cached styles if available (for performance)
  if (cachedStyles !== null) {
    return cachedStyles;
  }

  // Start with global styles
  const globalStyles = getGlobalStyles();

  const cssFiles = glob.sync('**/*.scoped.css', {
    cwd: componentsDir,
    absolute: true,
  });

  const componentStyles = cssFiles
    .map(file => {
      try {
        return fs.readFileSync(file, 'utf-8');
      } catch (e) {
        console.warn(`Warning: Could not read CSS file ${file}:`, e.message);
        return '';
      }
    })
    .filter(Boolean)
    .join('\n');

  // Combine global styles first, then component styles
  cachedStyles = globalStyles + '\n' + componentStyles;
  return cachedStyles;
}

/**
 * Clears the cached styles (useful for development when styles change)
 */
export function clearStyleCache() {
  cachedStyles = null;
}
