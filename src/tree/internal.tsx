// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { NodeRendererProps, Tree } from 'react-arborist';
import clsx from 'clsx';

import Badge from '../badge';
import ButtonDropdown from '../button-dropdown';
import InternalIcon from '../icon/internal';
import { TreeProps } from './interfaces';

import styles from './styles.css.js';

const INDENT_STEP = 15;

function TreeNode({ node, style, dragHandle }: NodeRendererProps<TreeProps.TreeNode>) {
  const expanderIcon = node.isInternal ? (
    <InternalIcon
      className={clsx(styles.icon)}
      variant="subtle"
      name={node.isOpen ? 'treeview-collapse' : 'treeview-expand'}
    />
  ) : (
    <div style={{ visibility: 'hidden' }}>
      <InternalIcon className={clsx(styles.icon)} variant="subtle" name={node.data.iconName ?? 'file'} />
    </div>
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
          return (
            <div key={index} className={styles.indentLine}>
              <div />
            </div>
          );
        })}
      </div>
      <div className={clsx(styles.left)}>
        <div className={clsx(styles.expander)}>{expanderIcon}</div>
        <div className={clsx(styles.itemIcon)}>
          {node.data.iconSvg ?? (
            <InternalIcon className={clsx(styles.icon)} variant="subtle" name={node.data.iconName ?? 'file'} />
          )}
        </div>
        <div className={clsx(styles.label)}>{node.data.name}</div>
        <div className={clsx(styles.badges)}>{node.data.badges}</div>
        <div className={clsx(styles.annotations)}>ANNOTATIONS</div>
      </div>
      <div className={clsx(styles.right)}>
        <div className={clsx(styles.controls)}>
          <ButtonDropdown
            variant={'icon'}
            items={[
              { id: 'start', text: 'start' },
              { id: 'stop', text: 'stop' },
              { id: 'restart', text: 'restart' },
              { id: 'terminate', text: 'terminate' },
              { id: 'delete', text: 'delete' },
            ]}
          />
        </div>
      </div>
      <div className={styles.selectedMarker}></div>
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
          indent={INDENT_STEP}
          rowHeight={36}
          //paddingTop={30}
          // paddingBottom={10}
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
