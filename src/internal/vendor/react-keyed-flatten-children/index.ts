// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Vendored from react-keyed-flatten-children@3.2.0 (MIT License)
// Original source: https://github.com/grrowl/react-keyed-flatten-children

import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from 'react';

// React 19 renamed the element symbol to detect version mismatches and prevent subtle bugs from
// inlined JSX. We check both symbols to support React <19 (legacy) and >=19 (transitional).
// The name "transitional" indicates this will change again in future versions.
// Reference: https://github.com/facebook/react/pull/28813
const REACT_LEGACY_ELEMENT_TYPE: symbol = Symbol.for('react.element');
const REACT_ELEMENT_TYPE: symbol = Symbol.for('react.transitional.element');

const REACT_FRAGMENT_TYPE: symbol = Symbol.for('react.fragment');

// Simplified version of react-is typeOf that checks for fragment types only
// Reference: https://github.com/facebook/react/blob/main/packages/react-is/src/ReactIs.js#L40
function typeOfFragment(object: any): symbol | undefined {
  if (typeof object === 'object' && object !== null) {
    const $$typeof = object.$$typeof;
    if ($$typeof === REACT_ELEMENT_TYPE || $$typeof === REACT_LEGACY_ELEMENT_TYPE) {
      const type = object.type;
      if (type === REACT_FRAGMENT_TYPE) {
        return type;
      }
    }
  }
  return undefined;
}

function isFragment(object: any): boolean {
  return typeOfFragment(object) === REACT_FRAGMENT_TYPE;
}

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
