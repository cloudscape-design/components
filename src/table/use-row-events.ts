// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events/index';
import { TableProps } from './interfaces';

import styles from './styles.css.js';

// Returns true when the click originated inside an element that should NOT trigger row-click-to-select.
// Excluded: the selection control column, any interactive element (button/a/input/select/textarea),
// and inline-editing-active cells.
function isInteractiveTarget(target: HTMLElement): boolean {
  // Clicks on or inside the selection control cell
  const selectionCell = findUpUntil(target, el => el.tagName.toLowerCase() === 'td');
  if (selectionCell && selectionCell.classList.contains(styles['selection-control'])) {
    return true;
  }

  // Clicks on any focusable / interactive HTML element that lives inside the row
  const interactiveEl = findUpUntil(
    target,
    el =>
      el.tagName.toLowerCase() === 'button' ||
      el.tagName.toLowerCase() === 'a' ||
      el.tagName.toLowerCase() === 'input' ||
      el.tagName.toLowerCase() === 'select' ||
      el.tagName.toLowerCase() === 'textarea'
  );
  if (interactiveEl) {
    return true;
  }

  // Cells that have inline editing active
  const editingCell = findUpUntil(
    target,
    el => el.tagName.toLowerCase() === 'td' && el.getAttribute('data-inline-editing-active') === 'true'
  );
  if (editingCell) {
    return true;
  }

  return false;
}

export interface UseRowEventsOptions<T> extends Pick<TableProps, 'onRowClick' | 'onRowContextMenu' | 'clickToSelect'> {
  selectionType?: TableProps.SelectionType;
  onToggleItem?: (item: T) => void;
}

export function useRowEvents<T>({
  onRowClick,
  onRowContextMenu,
  clickToSelect,
  selectionType,
  onToggleItem,
}: UseRowEventsOptions<T>) {
  const onRowClickHandler = (rowIndex: number, item: T, event: React.MouseEvent) => {
    const tableCell = findUpUntil(event.target as HTMLElement, element => element.tagName.toLowerCase() === 'td');
    if (!tableCell || !tableCell.classList.contains(styles['selection-control'])) {
      const details: TableProps.OnRowClickDetail<T> = { rowIndex, item };
      fireNonCancelableEvent(onRowClick, details);
    }

    // click-to-select: toggle selection when prop is enabled and selectionType is set
    if (clickToSelect && selectionType && onToggleItem) {
      if (!isInteractiveTarget(event.target as HTMLElement)) {
        onToggleItem(item);
      }
    }
  };

  const onRowContextMenuHandler = (rowIndex: number, item: T, event: React.MouseEvent) => {
    const details: TableProps.OnRowContextMenuDetail<T> = {
      rowIndex,
      item,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    fireCancelableEvent(onRowContextMenu, details, event);
  };

  // The row click handler is active when either onRowClick is set OR clickToSelect is enabled
  const hasRowClickHandler = !!(onRowClick || (clickToSelect && selectionType && onToggleItem));

  return {
    onRowClickHandler: hasRowClickHandler ? onRowClickHandler : undefined,
    onRowContextMenuHandler: onRowContextMenu && onRowContextMenuHandler,
  };
}
