// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ExpandToggleButton } from '../internal/components/expand-toggle-button';
import { fireNonCancelableEvent } from '../internal/events';
import { NonCancelableEventHandler } from '../internal/events';
import { TreeviewProps } from './interfaces';
import { getItemPosition } from './utils';

import styles from './styles.css.js';

type TreeItemProps = TreeviewProps.TreeItem & {
  isExpanded: boolean;
  isExpandable?: boolean;
  onExpandableItemToggle: NonCancelableEventHandler<TreeviewProps.ExpandableItemToggleDetail>;
  expandedItems: ReadonlyArray<string>;
  level: number;
  position: 'start' | 'middle' | 'end';
  details?: React.ReactNode;
  actions?: React.ReactNode;
};

const TreeItemLayout = ({
  content,
  details,
  actions,
}: {
  content: React.ReactNode;
  details?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <div className={styles['treeitem-layout']}>
      <div className={styles['treeitem-first-line']}>
        <div className={styles['treeitem-content']}>{content}</div>
        <div className={styles['treeitem-actions']}>{actions}</div>
      </div>

      <div className={styles['treeitem-details']}>{details}</div>
    </div>
  );
};

const GuideLine = ({
  level,
  position,
  isExpandable,
}: {
  level: number;
  position: 'start' | 'middle' | 'end';
  isExpandable: boolean;
}) => {
  if (level === 0) {
    return (
      <div
        className={clsx(styles['treeitem-guideline-vertical-root'], {
          [styles['treeitem-guideline-vertical-root-end']]: position === 'end',
          [styles['treeitem-guideline-vertical-expandable']]: isExpandable,
        })}
      ></div>
    );
  }

  return (
    <>
      <div className={clsx(styles['treeitem-guideline-horizontal'], { [styles.expandable]: isExpandable })}></div>

      {level > 1 && (position === 'start' || position === 'end') && (
        <div className={clsx(styles['treeitem-guideline-vertical-end'])}></div>
      )}

      {level > 1 && position === 'middle' && <div className={clsx(styles['treeitem-guideline-vertical-middle'])}></div>}
    </>
  );
};

const TreeItem = ({
  id,
  content,
  details,
  actions,
  isExpanded,
  isExpandable,
  onExpandableItemToggle,
  items = [],
  expandedItems = [],
  level,
  position,
}: TreeItemProps) => {
  const isExpandableItemExpanded = isExpandable && isExpanded;
  const nextLevel = level + 1;

  return (
    <li
      id={id}
      role="treeitem"
      className={clsx(styles['child-treeitem'], styles[`child-treeitem-level-${level}`], {
        [styles.expandable]: isExpandable,
        [styles.expanded]: isExpanded,
      })}
      aria-expanded={position === 'end' ? undefined : isExpandableItemExpanded}
      data-testid={id}
    >
      <div className={styles['treeitem-guideline']}>
        {isExpandable && (
          <ExpandToggleButton
            isExpanded={isExpanded}
            onExpandableItemToggle={() => fireNonCancelableEvent(onExpandableItemToggle, { id, expanded: !isExpanded })}
            //   expandButtonLabel={expandButtonLabel}
            //   collapseButtonLabel={collapseButtonLabel}
          />
        )}

        <GuideLine level={level} position={position} isExpandable={!!isExpandable} />
      </div>

      <div className={styles['treeitem-group']}>
        <TreeItemLayout content={content} details={details} actions={actions} />

        {isExpandableItemExpanded && (
          <ul role="group" className={styles['parent-treeitem']}>
            {items.map((item, index) => (
              <TreeItem
                key={index}
                {...item}
                level={nextLevel}
                position={getItemPosition(index, items.length)}
                isExpanded={expandedItems.includes(item.id)}
                onExpandableItemToggle={onExpandableItemToggle}
                expandedItems={expandedItems}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default TreeItem;
