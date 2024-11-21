// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { NodeRendererProps, Tree } from 'react-arborist';
import clsx from 'clsx';

import InternalIcon from '../icon/internal';
import { TreeProps } from './interfaces';

import styles from './styles.css.js';

const INDENT_STEP = 24;

function TreeNode({ node, style, dragHandle }: NodeRendererProps<TreeProps.TreeNode>) {
  const Icon = node.isInternal ? (
    <InternalIcon
      className={clsx(styles.icon)}
      variant="subtle"
      name={node.isOpen ? 'treeview-collapse' : 'treeview-expand'}
    />
  ) : (
    <InternalIcon className={clsx(styles.icon)} variant="subtle" name={node.data.iconName ?? 'file'} />
  );
  const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);
  return (
    <div
      ref={dragHandle}
      style={style}
      className={clsx(styles.node, node.state, node.isSelected && styles.selected, node.isFocused && styles.focused)}
      onClick={() => node.isInternal && node.toggle()}
    >
      <div className={styles.indentLines}>
        {new Array(indentSize / INDENT_STEP).fill(0).map((_, index) => {
          return <div key={index}></div>;
        })}
      </div>
      <div className={styles.selectedMarker} />
      <div style={{ position: 'relative' }}>
        {Icon}
        <div className={styles.text}>{node.data.name}</div>
      </div>
    </div>
  );
}

const InternalTree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ className, ariaLabel, ariaLabelledby, items }, ref) => {
    return (
      <div className={clsx(className)} aria-label={ariaLabel} aria-labelledby={ariaLabelledby} ref={ref}>
        <Tree
          className={styles.tree}
          initialData={items}
          openByDefault={true}
          //width={600}
          //height={1000}
          indent={24}
          rowHeight={36}
          //paddingTop={30}
          //paddingBottom={10}
          //padding={25 /* sets both */}
          disableEdit={true}
        >
          {TreeNode}
        </Tree>
      </div>
    );
  }
);

export default InternalTree;
