// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context';
import { ExpandToggleButton } from '../internal/components/expand-toggle-button';
// import Connector from './connector';
import { TreeviewProps } from './interfaces';
import TreeItemLayout from './treeitem-layout';
import { getItemPosition, transformTreeItemProps } from './utils';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

interface InternalTreeItemProps<T>
  extends Pick<TreeviewProps, 'expandedItems' | 'renderItem' | 'getItemId' | 'getItemChildren' | 'i18nStrings'> {
  item: T;
  index: number;
  level: number;
  position: 'start' | 'middle' | 'end';
  withGrid?: boolean;
  onItemToggle: (detail: TreeviewProps.ItemToggleDetail<T>) => void;
}

const InternalTreeItem = <T,>({
  item,
  index,
  level,
  position,
  i18nStrings,
  expandedItems = [],
  withGrid,
  renderItem,
  getItemId,
  getItemChildren,
  onItemToggle,
}: InternalTreeItemProps<T>) => {
  const i18n = useInternalI18n('treeview');
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
        withGrid && styles['with-grid']
      )}
      aria-expanded={isExpandable ? isExpanded : undefined}
      aria-level={level}
      data-testid={`treeitem-${id}`}
    >
      {/* <div className={styles['treeitem-toggle-area']}>
        {isExpandable && (
          <ExpandToggleButton
            isExpanded={isExpanded}
            onExpandableItemToggle={() => fireNonCancelableEvent(onItemToggle, { id, item, expanded: !isExpanded })}
            expandButtonLabel={i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item))}
            collapseButtonLabel={i18n('i18nStrings.collapseButtonLabel', i18nStrings?.collapseButtonLabel?.(item))}
          />
        )}

        <Connector level={level} position={position} isExpandable={!!isExpandable} />
      </div> */}

      {!withGrid && (
        <div className={styles['treeitem-connector-group']} style={{ alignItems: 'baseline' }}>
          {/* Try out horizontally constructured connector lines */}
          <div className={styles['connector-area2']}>
            <div
              style={{
                inlineSize: `calc((${level} * 32px) + ${level > 0 && !isExpandable ? '20' : '0'}px)`,
                marginBlock: 'auto',
              }}
            >
              {level > 0 && (
                <div
                  className={clsx(styles.horizontal, isExpandable && styles.expandable)}
                  style={{ left: `calc(${level - 1} * 32px + 8px)` }}
                />
              )}

              {level === 0 && (
                <div
                  className={clsx(styles.level0, styles[`position-${position}`], isExpandable && styles.expandable)}
                />
              )}

              {level > 0 &&
                Array.from(Array(level + 1).keys()).map(l => {
                  if (l === 0) {
                    return <div key={`${level} - ${l}`} className={clsx(styles.vertical)} />;
                  }

                  if (l === level && !isExpanded) {
                    return <div key={`${level} - ${l}`} />;
                  }

                  return (
                    <div
                      key={`${level} - ${l}`}
                      className={clsx(
                        styles.vertical,
                        styles[`level${l}`],
                        styles[`position-${position}`],
                        isExpanded && l === level && styles.expanded
                      )}
                      style={{ left: `calc(${l} * 32px + 8px)` }}
                    />
                  );
                })}
            </div>

            <div style={level === 0 || isExpandable ? { inlineSize: '20px' } : {}}>
              {isExpandable && (
                <ExpandToggleButton
                  isExpanded={isExpanded}
                  onExpandableItemToggle={() => onItemToggle({ id, item, expanded: !isExpanded })}
                  expandButtonLabel={i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item))}
                  collapseButtonLabel={i18n(
                    'i18nStrings.collapseButtonLabel',
                    i18nStrings?.collapseButtonLabel?.(item)
                  )}
                />
              )}
            </div>

            <TreeItemLayout icon={icon} content={content} secondaryContent={secondaryContent} actions={actions} />
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
                  />
                );
              })}
            </ul>
          )}
        </div>
      )}

      {withGrid && (
        <>
          {/* Try out constructing connector lines with display grid */}
          {isExpandable && (
            <>
              <div className={styles.toggle}>
                <ExpandToggleButton
                  isExpanded={isExpanded}
                  onExpandableItemToggle={() => onItemToggle({ id, item, expanded: !isExpanded })}
                  expandButtonLabel={i18n('i18nStrings.expandButtonLabel', i18nStrings?.expandButtonLabel?.(item))}
                  collapseButtonLabel={i18n(
                    'i18nStrings.collapseButtonLabel',
                    i18nStrings?.collapseButtonLabel?.(item)
                  )}
                />
              </div>

              <div className={styles['vertical-rule']} />
            </>
          )}

          {level > 0 && <div className={styles['horizontal-rule']} />}

          {/* {icon && <div className={styles.icon}>{icon}</div>} */}

          <TreeItemLayout icon={icon} content={content} secondaryContent={secondaryContent} actions={actions} />

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
                    withGrid={true}
                  />
                );
              })}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

export default InternalTreeItem;
