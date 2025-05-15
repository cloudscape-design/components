// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context';
import { ExpandToggleButton } from '../internal/components/expand-toggle-button';
import { fireNonCancelableEvent } from '../internal/events';
import Connector from './connector';
import { TreeviewProps } from './interfaces';
import { getItemPosition, transformTreeItemProps } from './utils';

import styles from './styles.css.js';

interface InternalTreeItemProps
  extends Pick<
    TreeviewProps,
    'expandedItems' | 'renderItem' | 'getItemId' | 'getItemChildren' | 'onItemToggle' | 'i18nStrings'
  > {
  item: any;
  index: number;
  level: number;
  position: 'start' | 'middle' | 'end';
}

const TreeItemLayout = ({
  icon,
  content,
  details,
  actions,
}: {
  icon?: React.ReactNode;
  content: React.ReactNode;
  details?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <div className={styles['treeitem-layout']}>
      <div className={styles['treeitem-first-line']}>
        <div className={styles['treeitem-icon']}>{icon}</div>
        <div className={styles['treeitem-content']}>{content}</div>
        <div className={styles['treeitem-actions']}>{actions}</div>
      </div>

      <div className={styles['treeitem-details']}>{details}</div>
    </div>
  );
};

const InternalTreeItem = ({
  item,
  index,
  level,
  position,
  i18nStrings,
  expandedItems = [],
  renderItem,
  getItemId,
  getItemChildren,
  onItemToggle,
}: InternalTreeItemProps) => {
  const i18n = useInternalI18n('treeview');
  const { id, isExpandable, isExpanded, children, icon, content, description, secondaryContent } =
    transformTreeItemProps({
      item,
      index,
      expandedItems,
      renderItem,
      getItemId,
      getItemChildren,
    });
  const nextLevel = level + 1;

  return (
    <li
      id={id}
      role="treeitem"
      className={clsx(styles['child-treeitem'], isExpandable && [styles.expandable], isExpanded && [styles.expanded])}
      aria-expanded={isExpandable ? isExpanded : undefined}
      data-testid={id}
    >
      <div className={styles['treeitem-toggle-area']}>
        {isExpandable && (
          <ExpandToggleButton
            isExpanded={isExpanded}
            onExpandableItemToggle={() => fireNonCancelableEvent(onItemToggle, { id, item, expanded: !isExpanded })}
            expandButtonLabel={i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item))}
            collapseButtonLabel={i18n('i18nStrings.collapseButtonLabel', i18nStrings?.collapseButtonLabel?.(item))}
          />
        )}

        <Connector level={level} position={position} isExpandable={!!isExpandable} />
      </div>

      <div className={styles['treeitem-group']}>
        <TreeItemLayout icon={icon} content={content} details={description} actions={secondaryContent} />

        {isExpanded && (
          <ul role="group" className={styles['parent-treeitem']}>
            {children.map((child, index) => {
              return (
                <InternalTreeItem
                  item={child}
                  index={index}
                  key={`${nextLevel}-${index}`}
                  level={nextLevel}
                  expandedItems={expandedItems}
                  position={getItemPosition(index, children.length)}
                  onItemToggle={onItemToggle}
                  renderItem={renderItem}
                  getItemId={getItemId}
                  getItemChildren={getItemChildren}
                />
              );
            })}
          </ul>
        )}
      </div>
    </li>
  );
};

export default InternalTreeItem;
