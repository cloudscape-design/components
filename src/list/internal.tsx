// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import InternalDragHandle from '../internal/components/drag-handle';
import SortableArea from '../internal/components/sortable-area';
import InternalStructuredItem from '../internal/components/structured-item';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ListProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type InternalListProps<T = any> = InternalBaseComponentProps & ListProps<T>;

export default function InternalList<T = any>({
  items,
  renderItem,
  sortable = false,
  sortDisabled = false,
  tag: Tag = sortable ? 'ol' : 'ul',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  onSortingChange,
  i18nStrings,
  disablePaddings,
  __internalRootRef = null,
  ...rest
}: InternalListProps<T>) {
  const baseProps = getBaseProps(rest);

  let contents: ReactNode;
  if (sortable) {
    contents = (
      <SortableArea
        items={items}
        disableReorder={sortDisabled}
        itemDefinition={{
          id: item => renderItem(item).id,
          label: item => {
            const details = renderItem(item);
            return details.announcementLabel ?? (details.content as string);
          },
        }}
        onItemsChange={event => fireNonCancelableEvent(onSortingChange, { items: event.detail.items })}
        i18nStrings={i18nStrings}
        renderItem={({ ref, item, style, className, dragHandleProps, isDragGhost }) => {
          const structuredItemProps = renderItem(item);

          const itemClass = clsx(
            styles.item,
            testClasses.item,
            disablePaddings && styles['disable-paddings'],
            className
          );

          const content = (
            <div className={styles['sortable-item']}>
              <InternalDragHandle {...dragHandleProps} />
              <InternalStructuredItem disablePaddings={disablePaddings} {...structuredItemProps} />
            </div>
          );

          if (isDragGhost) {
            return <div className={itemClass}>{content}</div>;
          }

          return (
            <li ref={ref} className={itemClass} style={style}>
              {content}
            </li>
          );
        }}
      />
    );
  } else {
    contents = items?.map(item => {
      const { id, ...structuredItemProps } = renderItem(item);
      return (
        <li key={id} className={clsx(styles.item, testClasses.item)}>
          <InternalStructuredItem {...structuredItemProps} />
        </li>
      );
    });
  }

  return (
    <Tag
      ref={__internalRootRef}
      {...baseProps}
      className={clsx(baseProps.className, styles.root, testClasses.root)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      {contents}
    </Tag>
  );
}
