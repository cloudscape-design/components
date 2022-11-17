// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Button from '../../button/internal';
import FormField from '../../form-field/internal';
import SpaceBetween from '../../space-between/internal';
import { useClickAway } from './click-away';
import { TableProps } from '../interfaces';
import styles from './styles.css.js';

// A function that does nothing
const noop = () => undefined;

interface InlineEditorProps<ItemType> {
  ariaLabels: TableProps['ariaLabels'];
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  onEditEnd: () => void;
  submitEdit: TableProps.SubmitEditFunction<ItemType>;
}

export function InlineEditor<ItemType>({
  ariaLabels,
  item,
  column,
  onEditEnd,
  submitEdit,
}: InlineEditorProps<ItemType>) {
  const [currentEditLoading, setCurrentEditLoading] = useState(false);
  const [currentEditValue, setCurrentEditValue] = useState<any>(undefined);

  function finishEdit() {
    onEditEnd();
    setCurrentEditValue(undefined);
  }

  function onSubmitClick() {
    if (currentEditValue === undefined) {
      finishEdit();
      return;
    }

    setCurrentEditLoading(true);
    submitEdit(item, column, currentEditValue).then(
      () => {
        setCurrentEditLoading(false);
        finishEdit();
      },
      () => {
        setCurrentEditLoading(false);
      }
    );
  }

  function onCancel() {
    if (currentEditLoading) {
      return;
    }
    finishEdit();
  }

  function handleEscape(event: React.KeyboardEvent): void {
    if (event.key === 'Escape') {
      onCancel();
    }
  }

  const clickAwayRef = useClickAway(onCancel);

  // asserting non-undefined editConfig here because this component is unreachable otherwise
  const { ariaLabel = undefined, validation = noop } = column.editConfig!;

  return (
    <form
      ref={clickAwayRef}
      onSubmit={onSubmitClick}
      onKeyDown={handleEscape}
      className={styles['body-cell-editor-form']}
    >
      <FormField __hideLabel={true} stretch={true} label={ariaLabel} errorText={validation(item, currentEditValue)}>
        <div className={styles['body-cell-editor-row']}>
          {column.cell(item, {
            isEditing: true,
            currentValue: currentEditValue,
            setValue: setCurrentEditValue,
          })}
          <span className={styles['body-cell-editor-controls']}>
            <SpaceBetween direction="horizontal" size="xxs">
              {!currentEditLoading ? (
                <Button
                  ariaLabel={ariaLabels?.cancelEditLabel?.(column)}
                  formAction="none"
                  iconName="close"
                  variant="inline-icon"
                  onClick={onCancel}
                />
              ) : null}
              <Button
                ariaLabel={ariaLabels?.submitEditLabel?.(column)}
                formAction="submit"
                iconName="check"
                variant="inline-icon"
                loading={currentEditLoading}
              />
            </SpaceBetween>
          </span>
        </div>
      </FormField>
    </form>
  );
}
