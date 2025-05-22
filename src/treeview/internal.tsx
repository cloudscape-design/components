// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TreeviewProps } from './interfaces';
import InternalTreeItem from './treeitem';
import { getItemPosition } from './utils';

import styles from './styles.css.js';

type InternalTreeviewProps = TreeviewProps & InternalBaseComponentProps;

const InternalTreeview = ({
  expandedItems = [],
  onItemToggle,
  items = [],
  renderItem,
  getItemId,
  getItemChildren,
  ariaLabel,
  ariaLabelledby,
  ariaDescription,
  ariaDescribedby,
  i18nStrings,
  __internalRootRef,
  ...rest
}: InternalTreeviewProps) => {
  const baseProps = getBaseProps(rest);

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      <ul
        className={styles.tree}
        role="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-description={ariaDescription}
        aria-describedby={ariaDescribedby}
      >
        {items.map((item, index) => {
          return (
            <InternalTreeItem
              key={index}
              item={item}
              level={0}
              index={index}
              expandedItems={expandedItems}
              i18nStrings={i18nStrings}
              position={getItemPosition(index, items.length)}
              onItemToggle={onItemToggle}
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
