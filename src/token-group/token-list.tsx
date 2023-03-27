// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useState } from 'react';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { TokenGroupProps } from './interfaces';
import styles from './styles.css.js';
import SelectToggle from './toggle';

interface TokenListItemAttributes {
  name: string;
  disabled?: boolean;
}

interface TokenListProps<Item> {
  variant: 'div' | 'ul';
  alignment: 'vertical' | 'horizontal';
  items: readonly Item[];
  limit?: number;
  renderItem: (item: Item, itemIndex: number) => React.ReactNode;
  getItemAttributes: (item: Item, itemIndex: number) => TokenListItemAttributes;
  i18nStrings?: TokenGroupProps.I18nStrings;
}

export function TokenList<Item>({
  variant: ListTag = 'div',
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
    <div>
      <ListTag id={controlId} className={clsx(styles['token-list'], styles[`token-list-${alignment}`])}>
        {slicedItems.map((item, itemIndex) => {
          const ItemTag = ListTag === 'div' ? 'div' : 'li';
          const { name, disabled } = getItemAttributes(item, itemIndex);
          return (
            <ItemTag
              key={itemIndex}
              role={ListTag === 'div' ? 'group' : undefined}
              aria-label={name}
              aria-disabled={disabled}
              aria-setsize={ListTag === 'ul' ? items.length : undefined}
              aria-posinset={ListTag === 'ul' ? itemIndex + 1 : undefined}
              className={styles[`token-list-child-${alignment}`]}
            >
              {renderItem(item, itemIndex)}
            </ItemTag>
          );
        })}
      </ListTag>

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
