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
  highlightConnector?: (highlight: boolean) => void;
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
  highlightConnector,
  allVisibleItemsIndices,
}: InternalTreeItemProps<T>) => {
  const [isHovered, setIsHovered] = React.useState(false);
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

  const highlightConnectorProps = {
    onMouseEnter: () => {
      if (isExpanded) {
        setIsHovered(true);
      } else {
        highlightConnector?.(true);
      }
    },
    onMouseLeave: () => {
      if (isExpanded) {
        setIsHovered(false);
      } else {
        highlightConnector?.(false);
      }
    },
  };

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
        <div className={styles['expand-toggle-wrapper']} {...highlightConnectorProps}>
          <div className={styles.toggle}>
            <ExpandToggleButton
              isExpanded={isExpanded}
              customIcon={customIcon}
              expandButtonLabel={
                isExpandable
                  ? joinStrings(
                      i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item)),
                      itemLabelToAnnounce
                    )
                  : itemLabelToAnnounce
              }
              collapseButtonLabel={
                isExpandable
                  ? joinStrings(
                      i18n('i18nStrings.collapseButtonLabel', i18nStrings?.collapseButtonLabel?.(item)),
                      itemLabelToAnnounce
                    )
                  : itemLabelToAnnounce
              }
              onExpandableItemToggle={() => onItemToggle({ id, item, expanded: !isExpanded })}
              invisible={!isExpandable}
              dataAttribute={{ 'data-awsui-tree-view-toggle-button': true }}
            />
          </div>
        </div>

        {showVerticalConnectorLines && <VerticalConnector variant="grid" isHighlighted={isHovered} />}

        <div className={styles['structured-item-wrapper']} {...highlightConnectorProps}>
          <InternalStructuredItem
            icon={icon}
            content={content}
            secondaryContent={secondaryContent}
            actions={actions}
            wrapActions={false}
          />
        </div>
      </div>

      {isExpanded && children.length && (
        <ul role="group" className={styles['treeitem-group']}>
          {children.map((child, index) => {
            return (
              <InternalTreeItem<T>
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
                highlightConnector={highlight => setIsHovered(highlight)}
                allVisibleItemsIndices={allVisibleItemsIndices}
                connectorLines={connectorLines}
              />
            );
          })}

          {showVerticalConnectorLines && <VerticalConnector variant="absolute" isHighlighted={isHovered} />}
        </ul>
      )}
    </li>
  );
};

export default InternalTreeItem;
