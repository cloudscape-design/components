// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../icon/internal';
import { TableProps } from '../interfaces';
import { TableTdElement, TableTdElementProps } from './td-element';
import { InlineEditor } from './inline-editor';
import LiveRegion from '../../internal/components/live-region/index.js';
import { useInternalI18n } from '../../i18n/context';
import { usePrevious } from '../../internal/hooks/use-previous';
import { CellEditingModel } from '../use-cell-editing';
import { useSelector } from '../../area-chart/async-store/index.js';

interface TableBodyCellProps<ItemType> extends TableTdElementProps {
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  ariaLabels: TableProps['ariaLabels'];
}

function TableCellEditable<ItemType>({
  className,
  item,
  column,
  ariaLabels,
  isVisualRefresh,
  cellEditing,
  cellId,
  ...rest
}: TableBodyCellProps<ItemType> & { cellEditing: CellEditingModel<ItemType, unknown> }) {
  const isEditing = useSelector(cellEditing, state => state.editingCell === cellId);
  const isLastSuccessfulEdit = useSelector(cellEditing, state => state.lastSuccessfulEdit === cellId);
  const onEditStart = () => cellEditing.startEdit(cellId);
  const onEditEnd = (editCancelled: boolean) => cellEditing.completeEdit(cellId, editCancelled);
  const onSubmitEdit = cellEditing.submitEdit;

  const i18n = useInternalI18n('table');
  const editActivateRef = useRef<HTMLButtonElement>(null);
  const tdNativeAttributes = {
    'data-inline-editing-active': isEditing.toString(),
  };
  const isFocusMoveNeededRef = useRef(false);

  useEffect(() => {
    if (!isEditing && editActivateRef.current && isFocusMoveNeededRef.current) {
      isFocusMoveNeededRef.current = false;
      editActivateRef.current.focus();
    }
  }, [isEditing]);
  // To improve the initial page render performance we only show the edit icon when necessary.
  const [hasHover, setHasHover] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const showIcon = hasHover || hasFocus;

  const prevSuccessfulEdit = usePrevious(isLastSuccessfulEdit);
  const prevHasFocus = usePrevious(hasFocus);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  useEffect(() => {
    // Hide the success icon after a successful edit, when cell loses focus.
    if (isLastSuccessfulEdit && prevSuccessfulEdit && !hasFocus && prevHasFocus) {
      setShowSuccessIcon(false);
    }
    // Show success icon right after a successful edit, when `successfulEdit` switches to true.
    if (isLastSuccessfulEdit && !prevSuccessfulEdit) {
      setShowSuccessIcon(true);
    }
  }, [hasFocus, isLastSuccessfulEdit, prevHasFocus, prevSuccessfulEdit]);

  return (
    <TableTdElement
      {...rest}
      cellId={cellId}
      nativeAttributes={tdNativeAttributes as TableTdElementProps['nativeAttributes']}
      className={clsx(
        className,
        styles['body-cell-editable'],
        isEditing && styles['body-cell-edit-active'],
        showSuccessIcon && showIcon && styles['body-cell-has-success'],
        isVisualRefresh && styles['is-visual-refresh']
      )}
      onClick={!isEditing ? onEditStart : undefined}
      onMouseEnter={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
    >
      {isEditing ? (
        <InlineEditor
          ariaLabels={ariaLabels}
          column={column}
          item={item}
          onEditEnd={e => {
            setShowSuccessIcon(false);
            isFocusMoveNeededRef.current = true;
            onEditEnd(e);
          }}
          submitEdit={onSubmitEdit}
        />
      ) : (
        <>
          {column.cell(item)}
          {showSuccessIcon && showIcon && (
            <>
              <span
                className={styles['body-cell-success']}
                aria-label={ariaLabels?.successfulEditLabel?.(column)}
                role="img"
                onMouseDown={e => {
                  // Prevent the editor's Button blur event to be fired when clicking the success icon.
                  // This prevents unfocusing the button and triggers the `TableTdElement` onClick event which initiates the edit mode.
                  e.preventDefault();
                }}
              >
                <Icon name="status-positive" variant="success" />
              </span>
              <LiveRegion>
                {i18n('ariaLabels.successfulEditLabel', ariaLabels?.successfulEditLabel?.(column))}
              </LiveRegion>
            </>
          )}
          <button
            className={styles['body-cell-editor']}
            aria-label={ariaLabels?.activateEditLabel?.(column, item)}
            ref={editActivateRef}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
          >
            {showIcon && <Icon name="edit" />}
          </button>
        </>
      )}
    </TableTdElement>
  );
}

export function TableBodyCell<ItemType>({
  cellEditing,
  ...rest
}: TableBodyCellProps<ItemType> & { cellEditing?: CellEditingModel<ItemType, unknown> }) {
  if (cellEditing) {
    return <TableCellEditable {...rest} cellEditing={cellEditing} />;
  }
  const { column, item } = rest;
  return <TableTdElement {...rest}>{column.cell(item)}</TableTdElement>;
}
