// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useInternalI18n } from '../../i18n/context';
import Icon from '../../icon/internal';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context.js';
import { usePrevious } from '../../internal/hooks/use-previous';
import InternalLiveRegion from '../../live-region/internal';
import { TableProps } from '../interfaces';
import { DisabledInlineEditor } from './disabled-inline-editor';
import { InlineEditor } from './inline-editor';
import { TableTdElement, TableTdElementProps } from './td-element';

import styles from './styles.css.js';

const submitHandlerFallback = () => {
  throw new Error('The function `handleSubmit` is required for editable columns');
};

export interface TableBodyCellProps<ItemType> extends TableTdElementProps {
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  successfulEdit?: boolean;
  onEditStart: () => void;
  onEditEnd: (cancelled: boolean) => void;
  submitEdit?: TableProps.SubmitEditFunction<ItemType>;
  ariaLabels: TableProps['ariaLabels'];
}

function TableCellEditable<ItemType>({
  item,
  column,
  isEditing,
  onEditStart,
  onEditEnd,
  submitEdit,
  ariaLabels,
  successfulEdit = false,
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
  const showIcon = hasHover || hasFocus;

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
      isEditing={isEditing}
      hasSuccessIcon={showSuccessIcon && showIcon}
      onClick={!isEditing ? onEditStart : undefined}
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
              <InternalLiveRegion tagName="span" hidden={true}>
                {i18n('ariaLabels.successfulEditLabel', ariaLabels?.successfulEditLabel?.(column))}
              </InternalLiveRegion>
            </>
          )}

          <div className={styles['body-cell-editor-wrapper']}>
            <button
              className={styles['body-cell-editor']}
              aria-label={ariaLabels?.activateEditLabel?.(column, item)}
              ref={editActivateRef}
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

export function TableBodyCell<ItemType>(props: TableBodyCellProps<ItemType>) {
  const isExpandableColumnCell = props.level !== undefined;
  const editDisabledReason = props.column.editConfig?.disabledReason?.(props.item);

  // Inline editing is deactivated for expandable column because editable cells are interactive
  // and cannot include interactive content such as expand toggles.
  if (editDisabledReason && !isExpandableColumnCell) {
    return <DisabledInlineEditor editDisabledReason={editDisabledReason} {...props} />;
  }
  if ((props.isEditable || props.isEditing) && !isExpandableColumnCell) {
    return <TableCellEditable {...props} />;
  }

  const { column, item } = props;
  return (
    <TableTdElement {...props} isEditable={false}>
      {column.cell(item)}
    </TableTdElement>
  );
}
