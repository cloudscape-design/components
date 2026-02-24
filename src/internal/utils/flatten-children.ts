// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

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
