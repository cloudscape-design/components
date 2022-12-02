// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React, { useRef } from 'react';
import useFocusVisible from '../../internal/hooks/focus-visible';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';
import Button from '../../button/internal';
import { ButtonProps } from '../../button/interfaces';
import { TableProps } from '../interfaces';
import { TableTdElement, TableTdElementProps } from './td-element';
import { InlineEditor } from './inline-editor';
export { TableTdElement } from './td-element';

const readonlyState = Object.freeze({
  isEditing: false,
  currentValue: undefined,
  setValue: () => {},
});

const submitHandlerFallback = () => {
  throw new Error('The function `handleSubmit` is required for editable columns');
};

interface TableBodyCellProps<ItemType, ValueType> extends TableTdElementProps {
  column: TableProps.EditableColumnDefinition<ItemType, ValueType>;
  item: ItemType;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  submitEdit?: TableProps.SubmitEditFunction<ItemType, ValueType>;
  ariaLabels: TableProps['ariaLabels'];
}

function TableCellEditable<ItemType, ValueType>({
  className,
  item,
  column,
  isEditing,
  onEditStart,
  onEditEnd,
  submitEdit,
  ariaLabels,
  ...rest
}: TableBodyCellProps<ItemType, ValueType>) {
  const editActivateRef = useRef<ButtonProps.Ref>(null);
  const focusVisible = useFocusVisible();

  useEffectOnUpdate(() => {
    if (!isEditing && editActivateRef?.current) {
      editActivateRef.current!.focus();
    }
  }, [isEditing]);

  const tdNativeAttributes = {
    ...(focusVisible as Record<string, string>),
    'data-inline-editing-active': isEditing.toString(),
  };

  return (
    <TableTdElement
      {...rest}
      nativeAttributes={tdNativeAttributes as TableTdElementProps['nativeAttributes']}
      className={clsx(className, styles['body-cell-editable'], isEditing && styles['body-cell-edit-active'])}
      onClick={!isEditing ? onEditStart : undefined}
    >
      {isEditing ? (
        <InlineEditor
          ariaLabels={ariaLabels}
          column={column}
          item={item}
          submitEdit={submitEdit ?? submitHandlerFallback}
          onEditEnd={onEditEnd}
        />
      ) : (
        <>
          {column.cell(item, readonlyState)}
          <span className={styles['body-cell-editor']}>
            <Button
              ref={editActivateRef}
              __hideFocusOutline={true}
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

export function TableBodyCell<ItemType, ValueType>({
  isEditable,
  ...rest
}: TableBodyCellProps<ItemType, ValueType> & { isEditable: boolean }) {
  if (isEditable || rest.isEditing) {
    return <TableCellEditable {...rest} />;
  }
  const { column, item } = rest;
  return <TableTdElement {...rest}>{column.cell(item, readonlyState)}</TableTdElement>;
}
