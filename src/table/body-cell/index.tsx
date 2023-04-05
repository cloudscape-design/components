// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React, { useRef } from 'react';
import useFocusVisible from '../../internal/hooks/focus-visible';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';
import Icon from '../../icon/internal';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { TableProps } from '../interfaces';
import { TableTdElement, TableTdElementProps } from './td-element';
import { InlineEditor } from './inline-editor';

const submitHandlerFallback = () => {
  throw new Error('The function `handleSubmit` is required for editable columns');
};

interface TableBodyCellProps<ItemType> extends TableTdElementProps {
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  isEditing: boolean;
  successfulEdit?: boolean;
  onEditStart: () => void;
  onEditEnd: (cancelled: boolean) => void;
  submitEdit?: TableProps.SubmitEditFunction<ItemType>;
  ariaLabels: TableProps['ariaLabels'];
}

function TableCellEditable<ItemType>({
  className,
  item,
  column,
  isEditing,
  onEditStart,
  onEditEnd,
  submitEdit,
  ariaLabels,
  isVisualRefresh,
  successfulEdit = false,
  ...rest
}: TableBodyCellProps<ItemType>) {
  const editActivateRef = useRef<HTMLDivElement>(null);
  const focusVisible = useFocusVisible();

  const tdNativeAttributes = {
    ...(focusVisible as Record<string, string>),
    'data-inline-editing-active': isEditing.toString(),
  };

  useEffectOnUpdate(() => {
    if (!isEditing && editActivateRef.current) {
      editActivateRef.current.focus();
    }
  }, [isEditing]);

  return (
    <TableTdElement
      {...rest}
      nativeAttributes={tdNativeAttributes as TableTdElementProps['nativeAttributes']}
      className={clsx(
        className,
        styles['body-cell-editable'],
        isEditing && styles['body-cell-edit-active'],
        successfulEdit && styles['body-cell-has-success'],
        isVisualRefresh && styles['is-visual-refresh']
      )}
    >
      {isEditing ? (
        <InlineEditor
          ariaLabels={ariaLabels}
          column={column}
          item={item}
          onEditEnd={onEditEnd}
          submitEdit={submitEdit ?? submitHandlerFallback}
        />
      ) : (
        <>
          <div
            ref={editActivateRef}
            className={styles['body-cell-edit-button']}
            role="button"
            tabIndex={0}
            aria-label={ariaLabels?.activateEditLabel?.(column, item)}
            onClick={onEditStart}
            onKeyDown={event => {
              if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                onEditStart();
              }
            }}
          >
            {column.cell(item)}
          </div>
          <span className={styles['body-cell-editor']} aria-hidden="true">
            <Icon name="edit" />
          </span>
          {successfulEdit && (
            <span className={styles['body-cell-success']} aria-label="Edit successful" role="img">
              <Icon name="status-positive" variant="success" />
            </span>
          )}
          <span aria-live="polite" aria-atomic="true">
            <ScreenreaderOnly>{successfulEdit ? 'Edit successful' : ''}</ScreenreaderOnly>
          </span>
        </>
      )}
    </TableTdElement>
  );
}

export function TableBodyCell<ItemType>({
  isEditable,
  ...rest
}: TableBodyCellProps<ItemType> & { isEditable: boolean }) {
  if (isEditable || rest.isEditing) {
    return <TableCellEditable {...rest} />;
  }
  const { column, item } = rest;
  return <TableTdElement {...rest}>{column.cell(item)}</TableTdElement>;
}
