// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Vendored from react-keyed-flatten-children@3.2.0 (MIT License)
// Original source: https://github.com/grrowl/react-keyed-flatten-children

import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { isFragment } from 'react-is';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

/* Returns React children into an array, flattening fragments. */

function isFragmentWithChildren(node: unknown): node is ReactElement<{ children: ReactNode }> {
  return isFragment(node);
}

export default function flattenChildren(
  children: ReactNode,
  depth = 0,
  keys: (string | number)[] = [],
  componentName?: string
): ReactNode[] {
  return Children.toArray(children).reduce((acc: ReactNode[], node, nodeIndex) => {
    if (isFragmentWithChildren(node)) {
      if (componentName) {
        warnOnce(
          componentName,
          'Flattening fragments is deprecated and does not work in React 19+. If you need fragments to be flattened, use arrays instead.'
        );
      }
      acc.push(...flattenChildren(node.props.children, depth + 1, keys.concat(node.key || nodeIndex), componentName));
    } else if (isValidElement(node)) {
      acc.push(
        cloneElement(node, {
          key: keys.concat(String(node.key)).join('.'),
        })
      );
    } else if (typeof node === 'string' || typeof node === 'number') {
      acc.push(node);
    }
    return acc;
  }, []);
}
