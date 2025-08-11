// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { TreeViewProps } from './interfaces.js';
import InternalTreeView from './internal.js';

export { TreeViewProps };

const TreeView = <T,>(props: TreeViewProps<T>) => {
  const baseComponentProps = useBaseComponent('TreeView');
  const baseProps = getBaseProps(props);
  const externalProps = getExternalProps(props);

  return <InternalTreeView {...baseProps} {...baseComponentProps} {...externalProps} {...props} />;
};

applyDisplayName(TreeView, 'TreeView');
export default TreeView;
