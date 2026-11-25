// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { TreeViewProps } from './interfaces';
import { KeyboardNavigationProvider } from './keyboard-navigation';
import InternalTreeItem from './tree-item';
import { getAllVisibleItemsIndices } from './utils';

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
  connectorLines,
  ariaRole,
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
  const treeViewRefObject = useRef(null);

  // When `ariaRole` is "list", the tree view renders nested lists instead of a tree widget.
  // The `list` and `listitem` roles are set explicitly, even though `ul` and `li` already imply them,
  // because Safari (WebKit/VoiceOver) removes list semantics from lists styled with `list-style: none`,
  // which the tree view uses. Without the explicit roles, VoiceOver would not announce the lists or their items.
  const isTree = ariaRole !== 'list';

  const allVisibleItemsIndices = getAllVisibleItemsIndices({ items, expandedItems, getItemId, getItemChildren });

  const onToggle = ({ id, item, expanded }: TreeViewProps.ItemToggleDetail<T>) => {
    if (expanded) {
      setExpandedItems([...(expandedItems || []), id]);
    } else {
      setExpandedItems((expandedItems || []).filter(expandedId => expandedId !== id));
    }
    fireNonCancelableEvent(onItemToggle, { id, item, expanded });
  };

  const list = (
    <ul
      role={isTree ? 'tree' : 'list'}
      ref={treeViewRefObject}
      className={clsx(styles.tree, testUtilStyles.tree)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      {items.map((item, index) => {
        const itemId = getItemId(item, index);
        return (
          <InternalTreeItem<T>
            key={itemId}
            item={item}
            level={1}
            index={index}
            expandedItems={expandedItems}
            i18nStrings={i18nStrings}
            onItemToggle={onToggle}
            renderItem={renderItem}
            getItemId={getItemId}
            getItemChildren={getItemChildren}
            renderItemToggleIcon={renderItemToggleIcon}
            allVisibleItemsIndices={allVisibleItemsIndices}
            connectorLines={connectorLines}
            ariaRole={ariaRole}
          />
        );
      })}
    </ul>
  );

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root, testUtilStyles.root)}>
      {isTree ? (
        <KeyboardNavigationProvider getTreeView={() => treeViewRefObject.current}>{list}</KeyboardNavigationProvider>
      ) : (
        list
      )}
    </div>
  );
};

export default InternalTreeView;
