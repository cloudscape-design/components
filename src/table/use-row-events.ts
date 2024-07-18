// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events/index';
import { findUpUntil } from '../internal/utils/dom';
import { TableProps } from './interfaces';

import styles from './styles.css.js';

export function useRowEvents<T>({ onRowClick, onRowContextMenu }: Pick<TableProps, 'onRowClick' | 'onRowContextMenu'>) {
  const onRowClickHandler = (rowIndex: number, item: T, event: React.MouseEvent) => {
    const tableCell = findUpUntil(event.target as HTMLElement, element => element.tagName.toLowerCase() === 'td');
    if (!tableCell || !tableCell.classList.contains(styles['selection-control'])) {
      const details: TableProps.OnRowClickDetail<T> = { rowIndex, item };
      fireNonCancelableEvent(onRowClick, details);
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

  return {
    onRowClickHandler: onRowClick && onRowClickHandler,
    onRowContextMenuHandler: onRowContextMenu && onRowContextMenuHandler,
  };
}
