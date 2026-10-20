// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalStructuredItem, { StructuredItemProps } from '../internal/components/structured-item';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ListProps } from './interfaces';
import ListRoot from './list-root';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

export const extractValidStructuredItemProps = ({ content, secondaryContent, icon, actions }: StructuredItemProps) => ({
  content,
  secondaryContent,
  icon,
  actions,
});

export type PlainListProps<T = any> = InternalBaseComponentProps &
  Omit<ListProps<T>, 'sortable' | 'sortDisabled' | 'onSortingChange' | 'i18nStrings'>;

type PlainListItemsProps<T> = Pick<
  PlainListProps<T>,
  'items' | 'renderItem' | 'disablePaddings' | 'disableItemPaddings'
>;

export function PlainListItems<T>({ items, renderItem, disablePaddings, disableItemPaddings }: PlainListItemsProps<T>) {
  return (
    <>
      {items?.map(item => {
        const { id, ...structuredItemProps } = renderItem(item);
        return (
          <li
            key={id}
            data-testid={id}
            className={clsx(
              styles.item,
              testClasses.item,
              disablePaddings && styles['disable-paddings'],
              disableItemPaddings && styles['disable-item-paddings']
            )}
          >
            <InternalStructuredItem
              {...extractValidStructuredItemProps(structuredItemProps)}
              disablePaddings={disableItemPaddings}
            />
          </li>
        );
      })}
    </>
  );
}

/**
 * A list without reordering support. Internal usages that never set `sortable` should import this
 * instead of `./internal`, which reaches @dnd-kit unconditionally.
 */
export default function InternalPlainList<T = any>({
  items,
  renderItem,
  disablePaddings,
  disableItemPaddings,
  ...rest
}: PlainListProps<T>) {
  return (
    <ListRoot {...rest}>
      <PlainListItems
        items={items}
        renderItem={renderItem}
        disablePaddings={disablePaddings}
        disableItemPaddings={disableItemPaddings}
      />
    </ListRoot>
  );
}
