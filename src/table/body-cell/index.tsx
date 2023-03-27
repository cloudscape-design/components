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
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';

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

const TableCellEditable = React.forwardRef(function TableCellEditable<ItemType>(
  {
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
  }: TableBodyCellProps<ItemType>,
  ref: React.Ref<HTMLTableCellElement>
) {
  const editActivateRef = useRef<ButtonProps.Ref>(null);
  const focusVisible = useFocusVisible();
  const cellRef = useRef<HTMLTableCellElement>(null);
  const mergedRef = useMergeRefs(ref, cellRef);

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
      ref={mergedRef}
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
          {column.cell(item)}
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
});

export const TableBodyCell = React.forwardRef(function TableBodyCell<ItemType>(
  props: TableBodyCellProps<ItemType> & { isEditable: boolean },
  ref: React.Ref<HTMLTableCellElement>
) {
  const { isEditable, ...rest } = props;
  if (isEditable || rest.isEditing) {
    return <TableCellEditable ref={ref} {...rest} />;
  }
  const { column, item } = rest;
  return (
    <TableTdElement ref={ref} {...rest}>
      {column.cell(item)}
    </TableTdElement>
  );
});
