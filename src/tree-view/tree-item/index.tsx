// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../../i18n/context';
import { ExpandToggleButton } from '../../internal/components/expand-toggle-button';
import InternalStructuredItem from '../../internal/components/structured-item';
import Connector from '../connector';
import { TreeViewProps } from '../interfaces';
import { getItemPosition, transformTreeItemProps } from './utils';

import styles from '../styles.css.js';
import testUtilStyles from '../test-classes/styles.css.js';

interface InternalTreeItemProps<T>
  extends Pick<
    TreeViewProps,
    'expandedItems' | 'renderItem' | 'getItemId' | 'getItemChildren' | 'showConnectorLine' | 'i18nStrings'
  > {
  item: T;
  index: number;
  level: number;
  position: 'start' | 'middle' | 'end';
  onItemToggle: (detail: TreeViewProps.ItemToggleDetail<T>) => void;
}

const InternalTreeItem = <T,>({
  item,
  index,
  level,
  position,
  i18nStrings,
  expandedItems = [],
  showConnectorLine,
  renderItem,
  getItemId,
  getItemChildren,
  onItemToggle,
}: InternalTreeItemProps<T>) => {
  const i18n = useInternalI18n('tree-view');
  const { id, isExpandable, isExpanded, children, icon, content, secondaryContent, actions } = transformTreeItemProps({
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
      className={clsx(
        styles.treeitem,
        testUtilStyles.treeitem,
        isExpandable && [styles.expandable],
        isExpandable && [testUtilStyles.expandable],
        isExpanded && [styles.expanded],
        isExpanded && [testUtilStyles.expanded],
        styles[`level-${0}`]
      )}
      aria-expanded={isExpandable ? isExpanded : undefined}
      aria-level={level > 0 ? level : undefined}
      data-testid={`treeitem-${id}`}
    >
      <div className={styles['connector-toggle-wrapper']}>
        {isExpandable && (
          <div className={styles.toggle}>
            <ExpandToggleButton
              isExpanded={isExpanded}
              onExpandableItemToggle={() => onItemToggle({ id, item, expanded: !isExpanded })}
              expandButtonLabel={i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item))}
              collapseButtonLabel={i18n('i18nStrings.collapseButtonLabel', i18nStrings?.collapseButtonLabel?.(item))}
            />
          </div>
        )}

        {showConnectorLine && (
          <Connector level={level} position={position} isExpandable={isExpandable} isExpanded={isExpanded} />
        )}
      </div>

      <div className={styles['structured-item-wrapper']}>
        <InternalStructuredItem icon={icon} content={content} secondaryContent={secondaryContent} actions={actions} />
      </div>

      {isExpanded && children.length && (
        <ul role="group" className={styles['treeitem-group']}>
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
                showConnectorLine={showConnectorLine}
                i18nStrings={i18nStrings}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default InternalTreeItem;
