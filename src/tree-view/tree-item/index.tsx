// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../../i18n/context';
import { ExpandToggleButton } from '../../internal/components/expand-toggle-button';
import InternalStructuredItem from '../../internal/components/structured-item';
import { joinStrings } from '../../internal/utils/strings';
import { TreeViewProps } from '../interfaces';
import VerticalConnector from '../vertical-connector';
import FocusTarget from './focus-target';

import testUtilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

interface InternalTreeItemProps<T>
  extends Pick<
    TreeViewProps,
    | 'expandedItems'
    | 'renderItem'
    | 'getItemId'
    | 'getItemChildren'
    | 'renderItemToggleIcon'
    | 'i18nStrings'
    | 'connectorLines'
  > {
  item: T;
  index: number;
  level: number;
  onItemToggle: (detail: TreeViewProps.ItemToggleDetail<T>) => void;
  allVisibleItemsIndices: {
    [key: string]: number;
  };
}

const InternalTreeItem = <T,>({
  item,
  index,
  level,
  i18nStrings,
  expandedItems = [],
  connectorLines,
  renderItemToggleIcon,
  renderItem,
  getItemId,
  getItemChildren,
  onItemToggle,
  allVisibleItemsIndices,
}: InternalTreeItemProps<T>) => {
  const i18n = useInternalI18n('tree-view');

  const { icon, content, secondaryContent, actions, announcementLabel } = renderItem(item, index);
  const id = getItemId(item, index);
  const children = getItemChildren(item, index) || [];
  const isExpandable = children.length > 0;
  const isExpanded = isExpandable && expandedItems.includes(id);
  const nextLevel = level + 1;

  const showVerticalConnectorLines = connectorLines === 'vertical' && isExpanded;

  let customIcon: React.ReactNode | undefined = undefined;
  if (isExpandable && renderItemToggleIcon) {
    customIcon = renderItemToggleIcon({ expanded: isExpanded });
  }

  const itemLabelToAnnounce = announcementLabel
    ? announcementLabel
    : typeof content === 'string'
      ? (content as string)
      : '';

  return (
    <li
      role="treeitem"
      id={id}
      className={clsx(
        styles.treeitem,
        testUtilStyles.treeitem,
        level > 1 && styles.offset,
        isExpandable && [testUtilStyles.expandable],
        isExpanded && [testUtilStyles.expanded]
      )}
      aria-expanded={isExpandable ? isExpanded : undefined}
      aria-level={level}
      data-testid={`awsui-treeitem-${id}`}
      data-awsui-tree-item-index={allVisibleItemsIndices[id]}
    >
      <div className={styles['treeitem-content-wrapper']}>
        <div className={styles['expand-toggle-wrapper']}>
          <div className={styles.toggle}>
            {isExpandable ? (
              <ExpandToggleButton
                isExpanded={isExpanded}
                customIcon={customIcon}
                expandButtonLabel={joinStrings(
                  i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item)),
                  itemLabelToAnnounce
                )}
                collapseButtonLabel={joinStrings(
                  i18n('i18nStrings.collapseButtonLabel', i18nStrings?.collapseButtonLabel?.(item)),
                  itemLabelToAnnounce
                )}
                onExpandableItemToggle={() => onItemToggle({ id, item, expanded: !isExpanded })}
                className={styles['tree-item-focus-target']}
                disableFocusHighlight={true}
              />
            ) : (
              <FocusTarget ariaLabel={itemLabelToAnnounce} />
            )}
          </div>
        </div>

        {showVerticalConnectorLines && <VerticalConnector variant="grid" />}

        <div className={styles['structured-item-wrapper']}>
          <InternalStructuredItem
            icon={icon}
            content={content}
            secondaryContent={secondaryContent}
            actions={actions}
            wrapActions={false}
            className={styles['tree-item-structured-item']}
          />
        </div>
      </div>

      {isExpanded && children.length && (
        <ul role="group" className={styles['treeitem-group']}>
          {children.map((child, index) => {
            const itemId = getItemId(child, index);
            return (
              <InternalTreeItem<T>
                item={child}
                index={index}
                key={itemId}
                level={nextLevel}
                expandedItems={expandedItems}
                i18nStrings={i18nStrings}
                onItemToggle={onItemToggle}
                renderItem={renderItem}
                getItemId={getItemId}
                getItemChildren={getItemChildren}
                renderItemToggleIcon={renderItemToggleIcon}
                allVisibleItemsIndices={allVisibleItemsIndices}
                connectorLines={connectorLines}
              />
            );
          })}

          {showVerticalConnectorLines && <VerticalConnector variant="absolute" />}
        </ul>
      )}
    </li>
  );
};

export default InternalTreeItem;
