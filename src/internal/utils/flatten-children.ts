// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { isValidElement, ReactNode } from 'react';
import { isPortal } from 'react-is';

import flattenChildrenLegacy from '../vendor/react-keyed-flatten-children';
import { getReactMajorVersion } from './react-version';

/**
 * Flattens React children into a single-level array.
 *
 * This utility handles version-specific differences in React's children handling:
 * - **React 16-18**: Flattens nested arrays AND fragments into a single array
 * - **React 19+**: Flattens nested arrays but preserves fragments as single elements
 *
 * @param children - React children to flatten (elements, arrays, fragments, etc.)
 * @param componentName - Component name used for warning messages. Required to enable fragment
 *                        detection warnings in React 16-18 when fragments are found.
 *
 * @returns A flat array of React nodes
 */
export function flattenChildren(children: ReactNode, componentName: string): ReactNode[] {
  const majorVersion = getReactMajorVersion();

  if (!Number.isNaN(majorVersion) && majorVersion < 19) {
    return flattenChildrenLegacy(children, 0, [], componentName);
  }
  return React.Children.toArray(children);
}

/**
 * Returns a key for a wrapper element rendered around a flattened child. Elements keep the key that
 * flattening assigned them, which always contains a "." (such as ".0" or ".$custom"). Portals keep
 * their own key, which flattening leaves as-is, so it gets a prefix. Strings, numbers, and unkeyed
 * portals are keyed by position. The prefixes keep the three kinds of keys from colliding.
 */
export function getFlattenedChildKey(child: ReactNode, index: number): string {
  if (isValidElement(child) && child.key !== null) {
    return String(child.key);
  }
  if (isPortal(child) && child.key !== null) {
    return `portal-${child.key}`;
  }
  return `primitive-${index}`;
}
