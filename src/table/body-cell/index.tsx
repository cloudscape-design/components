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

const readonlyState = { isEditActive: false, currentValue: '', setValue: () => {} };
const submitHandlerFallback = () => {
  throw new Error('The function `handleSubmit` is required for editable columns');
};

interface TableBodyCellProps<ItemType> extends TableTdElementProps {
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  isEditActive: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  submitEdit: TableProps.SubmitEditFunction<ItemType> | undefined;
  ariaLabels: TableProps['ariaLabels'];
}

function TableCellEditable<ItemType>({
  className,
  item,
  column,
  isEditActive,
  onEditStart,
  onEditEnd,
  submitEdit,
  ariaLabels,
  ...rest
}: TableBodyCellProps<ItemType>) {
  const editActivateRef = useRef<ButtonProps.Ref>(null);
  const focusVisible = useFocusVisible();

  useEffectOnUpdate(() => {
    if (!isEditActive) {
      editActivateRef.current!.focus();
    }
  }, [isEditActive]);

  return (
    <TableTdElement
      {...rest}
      nativeAttributes={focusVisible as TableTdElementProps['nativeAttributes']}
      className={clsx(className, styles['body-cell-editable'], isEditActive && styles['body-cell-edit-active'])}
      onClick={!isEditActive ? onEditStart : undefined}
    >
      {isEditActive ? (
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

export function TableBodyCell<ItemType>({
  isEditable,
  ...rest
}: TableBodyCellProps<ItemType> & { isEditable: boolean }) {
  if (isEditable || rest.isEditActive) {
    return <TableCellEditable {...rest} />;
  }
  const { column, item } = rest;
  return <TableTdElement {...rest}>{column.cell(item, readonlyState)}</TableTdElement>;
}
