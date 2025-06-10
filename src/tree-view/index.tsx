// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { TreeViewProps } from './interfaces';
import InternalTreeView from './internal';

export { TreeViewProps };

const TreeView = <T,>({ items, showConnectorLine, ...rest }: TreeViewProps<T>) => {
  const baseProps = getBaseProps(rest);
  const baseComponentProps = useBaseComponent('TreeView', {
    props: {},
    metadata: {
      itemsCount: items?.length,
      showConnectorLine,
    },
  });
  const externalProps = getExternalProps(rest);

  return (
    <InternalTreeView
      {...baseProps}
      {...baseComponentProps}
      {...externalProps}
      items={items}
      showConnectorLine={showConnectorLine}
      {...rest}
    />
  );
};

applyDisplayName(TreeView, 'TreeView');
export default TreeView;
