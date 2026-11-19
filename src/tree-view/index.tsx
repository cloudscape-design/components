// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { TreeViewProps } from './interfaces';
import InternalTreeView from './internal';

export { TreeViewProps };

const TreeView = <T,>({ connectorLines = 'none', ...props }: TreeViewProps<T>) => {
  const baseComponentProps = useBaseComponent('TreeView', {
    props: { connectorLines },
  });
  const baseProps = getBaseProps(props);
  const externalProps = getExternalProps(props);

  return (
    <InternalTreeView
      {...baseProps}
      {...baseComponentProps}
      {...externalProps}
      {...props}
      connectorLines={connectorLines}
    />
  );
};

applyDisplayName(TreeView, 'TreeView');
export default TreeView;
