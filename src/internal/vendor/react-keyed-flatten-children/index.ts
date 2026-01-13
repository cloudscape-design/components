// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Vendored from react-keyed-flatten-children@3.2.0 (MIT License)
// Original source: https://github.com/grrowl/react-keyed-flatten-children

import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { isFragment } from 'react-is';

/* Returns React children into an array, flattening fragments. */

function isFragmentWithChildren(node: unknown): node is ReactElement<{ children: ReactNode }> {
  return isFragment(node);
}

export default function flattenChildren(children: ReactNode, depth = 0, keys: (string | number)[] = []): ReactNode[] {
  return Children.toArray(children).reduce((acc: ReactNode[], node, nodeIndex) => {
    if (isFragmentWithChildren(node)) {
      acc.push(...flattenChildren(node.props.children, depth + 1, keys.concat(node.key || nodeIndex)));
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
