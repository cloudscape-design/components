// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React, { useRef, useState } from 'react';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';
import Icon from '../../icon/internal';
import { TableProps } from '../interfaces';
import { TableTdElement, TableTdElementProps } from './td-element';
import { InlineEditor } from './inline-editor';
import LiveRegion from '../../internal/components/live-region/index.js';

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
  const editActivateRef = useRef<HTMLButtonElement>(null);
  const tdNativeAttributes = {
    'data-inline-editing-active': isEditing.toString(),
  };

  useEffectOnUpdate(() => {
    if (!isEditing && editActivateRef.current) {
      editActivateRef.current.focus();
    }
  }, [isEditing]);

  // To improve the initial page render performance we only show the edit icon when necessary.
  const [hasHover, setHasHover] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const showIcon = hasHover || hasFocus;

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
      onClick={!isEditing ? onEditStart : undefined}
      onMouseEnter={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
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
          {column.cell(item)}
          {successfulEdit && (
            <>
              <span
                className={styles['body-cell-success']}
                aria-label={ariaLabels?.successfulEditLabel?.(column)}
                role="img"
              >
                <Icon name="status-positive" variant="success" />
              </span>
              <LiveRegion>{ariaLabels?.successfulEditLabel?.(column)}</LiveRegion>
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
  isEditable,
  ...rest
}: TableBodyCellProps<ItemType> & { isEditable: boolean }) {
  if (isEditable || rest.isEditing) {
    return <TableCellEditable {...rest} />;
  }
  const { column, item } = rest;
  return <TableTdElement {...rest}>{column.cell(item)}</TableTdElement>;
}
