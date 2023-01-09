// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React, { useCallback, useRef } from 'react';
import useFocusVisible from '../../internal/hooks/focus-visible';
import { useEffectOnUpdate } from '../../internal/hooks/use-effect-on-update';
import Button from '../../button/internal';
import { ButtonProps } from '../../button/interfaces';
import { TableProps } from '../interfaces';
import { TableTdElement, TableTdElementProps } from './td-element';
import { InlineEditor } from './inline-editor';
import { useStableScrollPosition } from './use-stable-scroll-position';

const readonlyState = Object.freeze({
  isEditing: false,
  currentValue: undefined,
  /* istanbul ignore next */
  setValue: () => {},
});

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
  ...rest
}: TableBodyCellProps<ItemType>) {
  const editActivateRef = useRef<ButtonProps.Ref>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const focusVisible = useFocusVisible();
  const { storeScrollPosition, restoreScrollPosition } = useStableScrollPosition(cellRef);

  const handleEditStart = () => {
    storeScrollPosition();
    if (!isEditing) {
      onEditStart();
    }
  };

  const scheduleRestoreScrollPosition = useCallback(
    () => setTimeout(restoreScrollPosition, 0),
    [restoreScrollPosition]
  );

  const tdNativeAttributes = {
    ...(focusVisible as Record<string, string>),
    onFocus: scheduleRestoreScrollPosition,
    'data-inline-editing-active': isEditing.toString(),
  };

  useEffectOnUpdate(() => {
    if (!isEditing && editActivateRef.current) {
      editActivateRef.current.focus({ preventScroll: true });
    }
    const timer = scheduleRestoreScrollPosition();
    return () => clearTimeout(timer);
  }, [isEditing, scheduleRestoreScrollPosition]);

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
      onClick={handleEditStart}
      ref={cellRef}
    >
      {isEditing ? (
        <InlineEditor
          ariaLabels={ariaLabels}
          column={column}
          item={item}
          onEditEnd={onEditEnd}
          submitEdit={submitEdit ?? submitHandlerFallback}
          __onRender={restoreScrollPosition}
        />
      ) : (
        <>
          {column.cell(item, readonlyState)}
          <span className={styles['body-cell-editor']}>
            <Button
              __hideFocusOutline={true}
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
  return <TableTdElement {...rest}>{column.cell(item, readonlyState)}</TableTdElement>;
}
