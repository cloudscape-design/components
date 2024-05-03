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
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context.js';
import { DisabledInlineEditor } from './disabled-inline-editor';

const submitHandlerFallback = () => {
  throw new Error('The function `handleSubmit` is required for editable columns');
};

export interface TableBodyCellProps<ItemType> extends TableTdElementProps {
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  isEditing: boolean;
  resizableColumns?: boolean;
  successfulEdit?: boolean;
  onEditStart: () => void;
  onEditEnd: (cancelled: boolean) => void;
  submitEdit?: TableProps.SubmitEditFunction<ItemType>;
  ariaLabels: TableProps['ariaLabels'];
  interactiveCell?: boolean;
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
  resizableColumns = false,
  successfulEdit = false,
  interactiveCell = true,
  ...rest
}: TableBodyCellProps<ItemType>) {
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
  // When a cell is both expandable and editable the icon is always shown.
  const showIcon = hasHover || hasFocus || !interactiveCell;

  const prevSuccessfulEdit = usePrevious(successfulEdit);
  const prevHasFocus = usePrevious(hasFocus);
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  useEffect(() => {
    // Hide the success icon after a successful edit, when cell loses focus.
    if (successfulEdit && prevSuccessfulEdit && !hasFocus && prevHasFocus) {
      setShowSuccessIcon(false);
    }
    // Show success icon right after a successful edit, when `successfulEdit` switches to true.
    if (successfulEdit && !prevSuccessfulEdit) {
      setShowSuccessIcon(true);
    }
  }, [hasFocus, successfulEdit, prevHasFocus, prevSuccessfulEdit]);

  const { tabIndex: editActivateTabIndex } = useSingleTabStopNavigation(editActivateRef);

  return (
    <TableTdElement
      {...rest}
      nativeAttributes={tdNativeAttributes as TableTdElementProps['nativeAttributes']}
      className={clsx(
        className,
        styles['body-cell-editable'],
        interactiveCell && styles['body-cell-interactive'],
        resizableColumns && styles['resizable-columns'],
        isEditing && styles['body-cell-edit-active'],
        showSuccessIcon && showIcon && styles['body-cell-has-success'],
        isVisualRefresh && styles['is-visual-refresh']
      )}
      onClick={interactiveCell && !isEditing ? onEditStart : undefined}
      onMouseEnter={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
    >
      {isEditing ? (
        <InlineEditor
          ariaLabels={ariaLabels}
          column={column}
          item={item}
          onEditEnd={options => {
            setShowSuccessIcon(false);
            isFocusMoveNeededRef.current = options.refocusCell;
            onEditEnd(options.cancelled);
          }}
          submitEdit={submitEdit ?? submitHandlerFallback}
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

          <div className={styles['body-cell-editor-wrapper']}>
            <button
              className={styles['body-cell-editor']}
              aria-label={ariaLabels?.activateEditLabel?.(column, item)}
              ref={editActivateRef}
              onClick={!interactiveCell && !isEditing ? onEditStart : undefined}
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              tabIndex={editActivateTabIndex}
            >
              {showIcon && <Icon name="edit" />}
            </button>
          </div>
        </>
      )}
    </TableTdElement>
  );
}

export function TableBodyCell<ItemType>({
  isEditable,
  ...rest
}: TableBodyCellProps<ItemType> & { isEditable: boolean }) {
  const isExpandableColumnCell = rest.level !== undefined;
  const editDisabledReason = rest.column.editConfig?.disabledReason?.(rest.item);

  // Inline editing is deactivated for expandable column because editable cells are interactive
  // and cannot include interactive content such as expand toggles.
  if (editDisabledReason && !isExpandableColumnCell) {
    return <DisabledInlineEditor editDisabledReason={editDisabledReason} {...rest} />;
  }
  if ((isEditable || rest.isEditing) && !isExpandableColumnCell) {
    return <TableCellEditable {...rest} />;
  }

  const { column, item } = rest;
  return <TableTdElement {...rest}>{column.cell(item)}</TableTdElement>;
}
