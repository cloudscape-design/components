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
    'expandedItems' | 'renderItem' | 'getItemId' | 'getItemChildren' | 'renderItemToggleIcon' | 'i18nStrings'
  > {
  item: T;
  index: number;
  level: number;
  onItemToggle: (detail: TreeViewProps.ItemToggleDetail<T>) => void;
  highlightConnector?: (highlight: boolean) => void;
  allVisibleItemsIndeces: {
    [key: string]: number;
  };
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
  highlightConnector,
  allVisibleItemsIndeces,
}: InternalTreeItemProps<T>) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const i18n = useInternalI18n('tree-view');

  const { icon, content, secondaryContent, actions, announcementLabel } = renderItem(item, index);
  const id = getItemId(item, index);
  const children = getItemChildren(item, index) || [];
  const isExpandable = children.length > 0;
  const isExpanded = isExpandable && expandedItems.includes(id);
  const nextLevel = level + 1;

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
      if (isExpanded || (!isExpandable && level === 1)) {
        setIsHovered(true);
      } else {
        highlightConnector?.(true);
      }
    },
    onMouseLeave: () => {
      if (isExpanded || (!isExpandable && level === 1)) {
        setIsHovered(false);
      } else {
        highlightConnector?.(false);
      }
    },
  };

  //  Role `treeitem` isn't used in the initial release per discussion with A11Y team. It requires focus management to be implemented so they will be added as a follow up together.
  return (
    <li
      id={id}
      className={clsx(
        styles.treeitem,
        testUtilStyles.treeitem,
        isExpandable && [testUtilStyles.expandable],
        isExpanded && [testUtilStyles.expanded],
        isHovered && [styles.hovered]
      )}
      aria-expanded={isExpandable ? isExpanded : undefined}
      aria-level={level}
      data-testid={`awsui-treeitem-${id}`}
      data-keyboard-navigation-index={allVisibleItemsIndeces[id]}
    >
      <div className={styles['expand-toggle-wrapper']} {...highlightConnectorProps}>
        {/* {isExpandable && ( */}
        <div className={styles.toggle}>
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
            invisible={!isExpandable}
          />
        </div>
        {/* )} */}

        {/* <Connector level={level} position={position} isExpandable={isExpandable} isExpanded={isExpanded} /> */}
      </div>

      {/* <div className={styles['connector-wrapper']}>
        <Connector level={level} position={position} isExpandable={isExpandable} isExpanded={isExpanded} />
      </div> */}

      <div className={clsx(styles['vertical-connector-wrapper'], isExpandable && styles.expandable)}>
        <VerticalConnector level={level} isExpanded={isExpanded} isHighlighted={isHovered} />
      </div>

      <div className={styles['structured-item-wrapper']} {...highlightConnectorProps}>
        <InternalStructuredItem
          icon={icon}
          content={content}
          secondaryContent={secondaryContent}
          actions={actions}
          wrapActions={false}
        />
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
                highlightConnector={highlight => setIsHovered(highlight)}
                allVisibleItemsIndeces={allVisibleItemsIndeces}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default InternalTreeItem;
