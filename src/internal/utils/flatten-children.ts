// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import flattenChildrenLegacy from '../vendor/react-keyed-flatten-children';
import { getReactMajorVersion } from './react-version';

export function flattenChildren(children: ReactNode, componentName?: string): ReactNode[] {
  const majorVersion = getReactMajorVersion();

  if (!Number.isNaN(majorVersion) && majorVersion < 19) {
    // React 16-18: Use react-keyed-flatten-children for backward compatibility
    return flattenChildrenLegacy(children, 0, [], componentName);
  }
  // React 19+: Uses Children.toArray() which doesn't flatten fragments.
  // This also supports bigint which is not available in earlier React versions.
  return React.Children.toArray(children);
}
