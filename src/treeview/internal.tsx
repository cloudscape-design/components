// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TreeviewProps } from './interfaces';
import InternalTreeItem from './treeitem';
import { getItemPosition } from './utils';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

type InternalTreeviewProps<T> = TreeviewProps<T> & InternalBaseComponentProps;

const InternalTreeview = <T,>({
  expandedItems,
  items = [],
  renderItem,
  getItemId,
  getItemChildren,
  onItemToggle,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  i18nStrings,
  __internalRootRef,
  ...rest
}: InternalTreeviewProps<T>) => {
  const baseProps = getBaseProps(rest);
  const isExpandStateControlled = !!expandedItems;
  const [internalExpandedItems, setInternalExpandedItems] = useState(expandedItems || []);

  if (isExpandStateControlled && !onItemToggle) {
    warnOnce(
      'Tree view',
      '`expandedItems` is provided without `onItemToggle`. Make sure to provide `onItemToggle` with `expandedItems` to control expand/collapse state of items.'
    );
  }

  const onToggle = ({ id, item, expanded }: TreeviewProps.ItemToggleDetail<T>) => {
    if (!isExpandStateControlled) {
      if (expanded) {
        setInternalExpandedItems([...internalExpandedItems, id]);
      } else {
        setInternalExpandedItems(internalExpandedItems.filter(expandedId => expandedId !== id));
      }
    }

    if (onItemToggle) {
      fireNonCancelableEvent(onItemToggle, { id, item, expanded });
    }
  };

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root, testUtilStyles.root)}>
      <ul
        className={styles.tree}
        role="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {items.map((item, index) => {
          return (
            <InternalTreeItem
              key={index}
              item={item}
              level={0}
              index={index}
              expandedItems={
                expandedItems === undefined || expandedItems === null ? internalExpandedItems : expandedItems
              }
              i18nStrings={i18nStrings}
              position={getItemPosition(index, items.length)}
              onItemToggle={onToggle}
              renderItem={renderItem}
              getItemId={getItemId}
              getItemChildren={getItemChildren}
              // withGrid={true}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default InternalTreeview;
