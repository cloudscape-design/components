// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { ConnectorLineType, TreeItemRow, TreeViewProps } from './interfaces';
import InternalTreeItemRow from './tree-item-row';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

type InternalTreeViewProps<T> = TreeViewProps<T> & InternalBaseComponentProps;

const InternalTreeView = <T,>({
  expandedItems: controlledExpandedItems,
  items,
  renderItem,
  getItemId,
  getItemChildren,
  onItemToggle,
  renderItemToggleIcon,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  i18nStrings,
  __internalRootRef,
  ...rest
}: InternalTreeViewProps<T>) => {
  const baseProps = getBaseProps(rest);

  const [expandedItems, setExpandedItems] = useControllable(controlledExpandedItems, onItemToggle, [], {
    componentName: 'TreeView',
    controlledProp: 'expandedItems',
    changeHandler: 'onItemToggle',
  });

  const onToggle = ({ id, item, expanded }: TreeViewProps.ItemToggleDetail<T>) => {
    if (expanded) {
      setExpandedItems([...(expandedItems || []), id]);
    } else {
      setExpandedItems((expandedItems || []).filter(expandedId => expandedId !== id));
    }
    fireNonCancelableEvent(onItemToggle, { id, item, expanded });
  };

  const isExpanded = (item: T, index: number) => !!expandedItems?.includes(getItemId(item, index));
  const rows = getTreeItemRows(items, getItemChildren, isExpanded);

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root, testUtilStyles.root)}>
      {/* Role `tree` isn't used in the initial release per discussion with A11Y team. It requires focus management to be implemented so they will be added as a follow up together. */}
      <ul
        className={clsx(styles.tree, testUtilStyles.tree)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {rows.map(({ item, index, level, connectorLines }) => {
          return (
            <InternalTreeItemRow
              key={index}
              item={item}
              index={index}
              level={level}
              connectorLines={connectorLines}
              expandedItems={expandedItems}
              i18nStrings={i18nStrings}
              onItemToggle={onToggle}
              renderItem={renderItem}
              getItemId={getItemId}
              getItemChildren={getItemChildren}
              renderItemToggleIcon={renderItemToggleIcon}
            />
          );
        })}
      </ul>
    </div>
  );
};

function getTreeItemRows<T>(
  treeItems: readonly T[],
  getItemChildren: (item: T, index: number) => undefined | readonly T[],
  isExpanded: (item: T, index: number) => boolean
): TreeItemRow<T>[] {
  let throughIndex = 0;
  const rows: TreeItemRow<T>[] = [];

  function traverse(
    parent: null | TreeItemRow<T>,
    item: T,
    level: number,
    isLast: boolean,
    connectorLines: ConnectorLineType[]
  ) {
    // Insert connector line piece for item's own toggle (or ghost toggle).
    connectorLines = [...connectorLines];
    const expanded = isExpanded(item, throughIndex);
    const children = getItemChildren(item, throughIndex) ?? [];
    if (children.length > 0 && expanded) {
      connectorLines.unshift('toggle-open');
    } else if (children.length > 0 && !expanded) {
      connectorLines.unshift('toggle-close');
    } else {
      // The top-level items have no parent, so using a different connector type.
      connectorLines.unshift(level === 1 ? 'empty' : 'toggle-ghost');
    }

    const row = { parent, item, index: throughIndex++, level, isLast, connectorLines };
    rows.push(row);

    if (expanded) {
      children.forEach((child, index) => {
        // Insert the parent connector line. Depending on the item's position it can
        // be the mid (also used for 1st item) or end connector.
        const isLast = index === children.length - 1;
        const nextConnectorLines: ConnectorLineType[] = [];
        if (!isLast) {
          nextConnectorLines.push('connect-mid');
        } else {
          nextConnectorLines.push('connect-end');
        }

        // Insert connector lines for ancestors (vertical lines that pass through, or empty for last items).
        let current: null | TreeItemRow<T> = row;
        while (current && current.level !== 1) {
          if (current.isLast) {
            nextConnectorLines.push('empty');
          } else {
            nextConnectorLines.push('pass-through');
          }
          current = current.parent;
        }

        // The connector lines are ordered from the current items to the farthest ancestor.
        nextConnectorLines.reverse();

        traverse(row, child, level + 1, isLast, nextConnectorLines);
      });
    }
  }
  treeItems.forEach((item, index) => traverse(null, item, 1, index === treeItems.length - 1, []));

  return rows;
}

export default InternalTreeView;
