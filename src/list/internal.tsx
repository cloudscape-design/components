// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useRef, useState } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import CheckboxIcon from '../internal/components/checkbox-icon';
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
import handleKey from '../internal/utils/handle-key';
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

// Purely presentational selection control. Selection state is conveyed to
// assistive technology via `aria-selected` on the enclosing `option`, so this
// SVG is marked `aria-hidden`.
function SelectionControl({
  selectionType,
  selected,
  disabled,
}: {
  selectionType: ListProps.SelectionType;
  selected: boolean;
  disabled: boolean;
}) {
  return (
    <span className={clsx(styles['selection-control'], testClasses['selection-control'])} aria-hidden="true">
      {selectionType === 'multi' ? (
        <CheckboxIcon checked={selected} disabled={disabled} />
      ) : (
        <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true" className={styles['radio-icon']}>
          <circle
            className={clsx(styles['radio-border'], disabled && styles['radio-disabled'])}
            strokeWidth={6.25}
            cx={50}
            cy={50}
            r={46}
          />
          {selected && (
            <circle
              className={clsx(styles['radio-fill'], disabled && styles['radio-disabled'])}
              cx={50}
              cy={50}
              r={25}
            />
          )}
        </svg>
      )}
    </span>
  );
}

export default function InternalList<T = any>({
  items,
  renderItem,
  sortable = false,
  sortDisabled = false,
  selectionType,
  selectedItems = [],
  isItemDisabled,
  onSelectionChange,
  tagOverride: Tag = sortable ? 'ol' : 'ul',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  onSortingChange,
  i18nStrings,
  disablePaddings,
  disableItemPaddings,
  __internalRootRef,
  ...rest
}: InternalListProps<T>) {
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('list');

  // Selection is only active for non-sortable lists.
  const selectable = !!selectionType && !sortable;

  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const selectedIds = new Set(selectedItems.map(item => renderItem(item).id));
  const firstSelectedIndex = items?.findIndex(item => selectedIds.has(renderItem(item).id)) ?? -1;
  const [focusedIndex, setFocusedIndex] = useState(firstSelectedIndex > 0 ? firstSelectedIndex : 0);

  const moveFocus = (nextIndex: number) => {
    if (!items || items.length === 0) {
      return;
    }
    const clamped = Math.max(0, Math.min(nextIndex, items.length - 1));
    setFocusedIndex(clamped);
    itemRefs.current[clamped]?.focus();
  };

  const toggleSelection = (item: T) => {
    if (!onSelectionChange) {
      return;
    }
    const id = renderItem(item).id;
    let nextSelected: Array<T>;
    if (selectionType === 'multi') {
      nextSelected = selectedIds.has(id)
        ? selectedItems.filter(selectedItem => renderItem(selectedItem).id !== id)
        : [...selectedItems, item];
    } else {
      // Single selection: re-clicking the selected item keeps it selected.
      if (selectedIds.has(id)) {
        return;
      }
      nextSelected = [item];
    }
    fireNonCancelableEvent(onSelectionChange, { selectedItems: nextSelected });
  };

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
  } else if (selectable) {
    contents = items?.map((item, index) => {
      const { id, ...structuredItemProps } = renderItem(item);
      const selected = selectedIds.has(id);
      const disabled = isItemDisabled?.(item) ?? false;

      const onToggle = () => {
        setFocusedIndex(index);
        if (!disabled) {
          toggleSelection(item);
        }
      };

      return (
        <li
          key={id}
          ref={element => {
            itemRefs.current[index] = element;
          }}
          data-testid={id}
          role="option"
          aria-selected={selected}
          aria-disabled={disabled || undefined}
          tabIndex={index === focusedIndex ? 0 : -1}
          className={clsx(
            styles.item,
            testClasses.item,
            styles['selectable-item'],
            selected && styles.selected,
            selected && testClasses.selected,
            disabled && styles['item-disabled'],
            disablePaddings && styles['disable-paddings'],
            disableItemPaddings && styles['disable-item-paddings']
          )}
          onClick={onToggle}
          onKeyDown={event =>
            handleKey(event as any, {
              onBlockEnd: () => {
                event.preventDefault();
                moveFocus(index + 1);
              },
              onBlockStart: () => {
                event.preventDefault();
                moveFocus(index - 1);
              },
              onHome: () => {
                event.preventDefault();
                moveFocus(0);
              },
              onEnd: () => {
                event.preventDefault();
                moveFocus(items.length - 1);
              },
              onActivate: () => {
                event.preventDefault();
                onToggle();
              },
            })
          }
        >
          <SelectionControl selectionType={selectionType!} selected={selected} disabled={disabled} />
          <InternalStructuredItem
            {...extractValidStructuredItemProps(structuredItemProps)}
            disablePaddings={disableItemPaddings}
          />
        </li>
      );
    });
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
      role={selectable ? 'listbox' : undefined}
      aria-multiselectable={selectable && selectionType === 'multi' ? true : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
    >
      {contents}
    </Tag>
  );
}
