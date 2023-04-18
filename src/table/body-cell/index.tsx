// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React, { useRef } from 'react';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';
import Button from '../../button/internal';
import { ButtonProps } from '../../button/interfaces';
import { TableProps } from '../interfaces';
import { TableTdElement, TableTdElementProps } from './td-element';
import { InlineEditor } from './inline-editor';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';

const submitHandlerFallback = () => {
  throw new Error('The function `handleSubmit` is required for editable columns');
};

interface TableBodyCellProps<ItemType> extends TableTdElementProps {
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  submitEdit?: TableProps.SubmitEditFunction<ItemType>;
  ariaLabels: TableProps['ariaLabels'];
  tdRef: React.Ref<HTMLTableCellElement>;
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
  ...rest
}: TableBodyCellProps<ItemType>) {
  const editActivateRef = useRef<ButtonProps.Ref>(null);
  const isVisualRefresh = useVisualRefresh();
  const tdNativeAttributes = {
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
        isVisualRefresh && styles['is-visual-refresh']
      )}
      onClick={!isEditing ? onEditStart : undefined}
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
          <span className={styles['body-cell-editor']}>
            <Button
              __forcedFocusState="none"
              __internalRootRef={editActivateRef}
              ariaLabel={ariaLabels?.activateEditLabel?.(column)}
              formAction="none"
              iconName="edit"
              variant="inline-icon"
            />
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
