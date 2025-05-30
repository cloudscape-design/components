// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { TreeviewProps } from './interfaces';
import InternalTreeview from './internal';

export { TreeviewProps };

const Treeview = <T,>({ items, showConnectorLine = true, ...rest }: TreeviewProps<T>) => {
  const baseProps = getBaseProps(rest);
  //   TODO: analytics metadata?
  const baseComponentProps = useBaseComponent('Treeview', {
    props: {},
    metadata: {
      itemsCount: items?.length,
    },
  });
  const externalProps = getExternalProps(rest);

  return (
    <InternalTreeview
      {...baseProps}
      {...baseComponentProps}
      {...externalProps}
      //   ref={ref}
      items={items}
      showConnectorLine={showConnectorLine}
      {...rest}
    />
  );
};

applyDisplayName(Treeview, 'Treeview');
export default Treeview;
