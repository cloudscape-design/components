// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { TreeViewProps } from './interfaces.js';
import InternalTreeItem from './tree-item';

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

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root, testUtilStyles.root)}>
      {/* Role `tree` isn't used in the initial release per discussion with A11Y team. It requires focus management to be implemented so they will be added as a follow up together. */}
      <ul
        className={clsx(styles.tree, testUtilStyles.tree)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {items.map((item, index) => {
          return (
            <InternalTreeItem
              key={index}
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
            />
          );
        })}
      </ul>
    </div>
  );
};

export default InternalTreeView;
