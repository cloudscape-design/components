// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

// import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TreeviewProps } from './interfaces';
import TreeItem from './treeitem';
import { getItemPosition } from './utils';

import styles from './styles.css.js';

type InternalTreeviewProps = TreeviewProps & InternalBaseComponentProps;

const InternalTreeview = ({
  items = [],
  expandedItems = [],
  //   ariaLabel,
  onExpandableItemToggle,
  __internalRootRef,
  ...rest
}: InternalTreeviewProps) => {
  const baseProps = getBaseProps(rest);

  return (
    <div ref={__internalRootRef} className={styles.root} {...baseProps}>
      <ul role="tree" className={styles.tree}>
        {/* <ul role="tree" aria-label={ariaLabel}> */}
        {items.map((item, index) => (
          <TreeItem
            {...item}
            key={index}
            level={0}
            position={getItemPosition(index, items.length)}
            expandedItems={expandedItems}
            isExpanded={expandedItems.includes(item.id)}
            onExpandableItemToggle={onExpandableItemToggle}
          />
        ))}
      </ul>
    </div>
  );
};

export default InternalTreeview;
