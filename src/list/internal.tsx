// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import InternalDragHandle from '../internal/components/drag-handle';
import SortableArea from '../internal/components/sortable-area';
import {
  formatDndItemCommitted,
  formatDndItemReordered,
  formatDndStarted,
} from '../internal/components/sortable-area/use-live-announcements';
import InternalStructuredItem, { StructuredItemProps } from '../internal/components/structured-item';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ListProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type InternalListProps<T = any> = InternalBaseComponentProps & ListProps<T>;

const extractValidStructuredItemProps = ({ content, secondaryContent, icon, actions }: StructuredItemProps) => ({
  content,
  secondaryContent,
  icon,
  actions,
});

export default function InternalList<T = any>({
  items,
  renderItem,
  sortable = false,
  sortDisabled = false,
  tagOverride: Tag = sortable ? 'ol' : 'ul',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  onSortingChange,
  i18nStrings,
  disablePaddings,
  disableItemPaddings,
  __internalRootRef = null,
  ...rest
}: InternalListProps<T>) {
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('list');

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
        i18nStrings={{
          liveAnnouncementDndStarted: i18n(
            'liveAnnouncementDndStarted',
            i18nStrings?.liveAnnouncementDndStarted,
            formatDndStarted
          ),
          liveAnnouncementDndItemReordered: i18n(
            'liveAnnouncementDndItemReordered',
            i18nStrings?.liveAnnouncementDndItemReordered,
            formatDndItemReordered
          ),
          liveAnnouncementDndItemCommitted: i18n(
            'liveAnnouncementDndItemCommitted',
            i18nStrings?.liveAnnouncementDndItemCommitted,
            formatDndItemCommitted
          ),
          liveAnnouncementDndDiscarded: i18n('liveAnnouncementDndDiscarded', i18nStrings?.liveAnnouncementDndDiscarded),
          dragHandleAriaLabel: i18n('dragHandleAriaLabel', i18nStrings?.dragHandleAriaLabel),
          dragHandleAriaDescription: i18n('dragHandleAriaDescription', i18nStrings?.dragHandleAriaDescription),
        }}
        renderItem={({ ref, item, id, style, className, dragHandleProps, isDragGhost }) => {
          const structuredItemProps = extractValidStructuredItemProps(renderItem(item));

          const itemClass = clsx(
            styles.item,
            testClasses.item,
            disableItemPaddings && styles['disable-item-paddings'],
            styles['sortable-item'],
            className
          );

          const content = (
            <>
              <InternalDragHandle {...dragHandleProps} />
              <InternalStructuredItem {...structuredItemProps} disablePaddings={disableItemPaddings} />
            </>
          );

          if (isDragGhost) {
            return <div className={itemClass}>{content}</div>;
          }

          return (
            <li ref={ref} className={itemClass} style={style} data-testid={id}>
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
