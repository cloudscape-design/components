// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './styles.css.js';
import { SelectToggle } from './select-toggle';
import { I18nStrings, ItemAttributes } from './interfaces';
import { useUniqueId } from '../../hooks/use-unique-id';

interface TokenListProps<Item> {
  alignment: 'vertical' | 'horizontal';
  items: readonly Item[];
  limit?: number;
  renderItem: (item: Item, itemIndex: number) => React.ReactNode;
  getItemAttributes: (item: Item, itemIndex: number) => ItemAttributes;
  i18nStrings?: I18nStrings;
}

export function TokenList<Item>({
  alignment = 'vertical',
  items,
  limit,
  renderItem,
  getItemAttributes,
  i18nStrings,
}: TokenListProps<Item>) {
  const controlId = useUniqueId();

  const [expanded, setExpanded] = useState(false);
  const hasItems = items.length > 0;
  const hasHiddenItems = hasItems && limit !== undefined && items.length > limit;
  const slicedItems = hasHiddenItems && !expanded ? items.slice(0, limit) : items;

  return (
    <div className={styles.root}>
      <ul id={controlId} className={clsx(styles.list, styles[`list-${alignment}`])}>
        {slicedItems.map((item, itemIndex) => {
          const { ariaLabel, disabled } = getItemAttributes(item, itemIndex);
          return (
            <li
              key={itemIndex}
              aria-label={ariaLabel}
              aria-disabled={disabled}
              aria-setsize={limit !== undefined ? items.length : undefined}
              aria-posinset={limit !== undefined ? itemIndex + 1 : undefined}
              className={clsx(styles.child, styles[`child-${alignment}`])}
            >
              {renderItem(item, itemIndex)}
            </li>
          );
        })}
      </ul>

      {hasHiddenItems && (
        <SelectToggle
          controlId={controlId}
          allHidden={limit === 0}
          expanded={expanded}
          numberOfHiddenOptions={items.length - slicedItems.length}
          i18nStrings={i18nStrings}
          onClick={() => setExpanded(!expanded)}
        />
      )}
    </div>
  );
}
