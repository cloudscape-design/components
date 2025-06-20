// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../../i18n/context';
import { ExpandToggleButton } from '../../internal/components/expand-toggle-button';
import InternalStructuredItem from '../../internal/components/structured-item';
import { TreeViewProps } from '../interfaces';
import { transformTreeItemProps } from './utils';

import styles from '../styles.css.js';
import testUtilStyles from '../test-classes/styles.css.js';

interface InternalTreeItemProps<T>
  extends Pick<
    TreeViewProps,
    'expandedItems' | 'renderItem' | 'getItemId' | 'getItemChildren' | 'renderItemToggleIcon' | 'i18nStrings'
  > {
  item: T;
  index: number;
  level: number;
  onItemToggle: (detail: TreeViewProps.ItemToggleDetail<T>) => void;
}

const InternalTreeItem = <T,>({
  item,
  index,
  level,
  i18nStrings,
  expandedItems = [],
  renderItemToggleIcon,
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
  let customIcon = null;

  if (renderItemToggleIcon) {
    customIcon = renderItemToggleIcon(isExpanded);
  }

  return (
    <li
      id={id}
      className={clsx(
        styles.treeitem,
        testUtilStyles.treeitem,
        isExpandable && [testUtilStyles.expandable],
        isExpanded && [testUtilStyles.expanded]
      )}
      aria-expanded={isExpandable ? isExpanded : undefined}
      aria-level={level > 0 ? level : undefined}
      data-testid={`treeitem-${id}`}
    >
      <div className={styles['expand-toggle-wrapper']}>
        {isExpandable && (
          <div className={styles.toggle}>
            <ExpandToggleButton
              isExpanded={isExpanded}
              customIcon={customIcon}
              hasLargeFocusOffset={true}
              expandButtonLabel={i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item))}
              collapseButtonLabel={i18n('i18nStrings.collapseButtonLabel', i18nStrings?.collapseButtonLabel?.(item))}
              onExpandableItemToggle={() => onItemToggle({ id, item, expanded: !isExpanded })}
            />
          </div>
        )}
      </div>

      <div className={styles['structured-item-wrapper']}>
        <InternalStructuredItem icon={icon} content={content} secondaryContent={secondaryContent} actions={actions} />
      </div>

      {isExpanded && children.length && (
        <ul className={styles['treeitem-group']}>
          {children.map((child, index) => {
            return (
              <InternalTreeItem
                item={child}
                index={index}
                key={`${nextLevel}-${index}`}
                level={nextLevel}
                expandedItems={expandedItems}
                i18nStrings={i18nStrings}
                onItemToggle={onItemToggle}
                renderItem={renderItem}
                getItemId={getItemId}
                getItemChildren={getItemChildren}
                renderItemToggleIcon={renderItemToggleIcon}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default InternalTreeItem;
