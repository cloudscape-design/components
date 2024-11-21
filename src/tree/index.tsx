// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { TreeProps } from './interfaces';
import InternalTree from './internal';

export { TreeProps };

export default function Tree(props: TreeProps) {
  const { __internalRootRef } = useBaseComponent('Tree');
  const baseProps = getBaseProps(props);

  return <InternalTree {...props} {...baseProps} ref={__internalRootRef} />;
}
