// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import Button from '../../button/internal';
import FormField from '../../form-field/internal';
import SpaceBetween from '../../space-between/internal';
import { useClickAway } from './click-away';
import { TableProps } from '../interfaces';
import styles from './styles.css.js';
import { Optional } from '../../internal/types';

// A function that does nothing
const noop = () => undefined;

interface InlineEditorProps<ItemType, ValueType> {
  ariaLabels: TableProps['ariaLabels'];
  column: TableProps.EditableColumnDefinition<ItemType, ValueType>;
  item: ItemType;
  onEditEnd: () => void;
  submitEdit: TableProps.SubmitEditFunction<ItemType, ValueType>;
  __onRender?: () => void;
}

export function InlineEditor<ItemType, ValueType>({
  ariaLabels,
  item,
  column,
  onEditEnd,
  submitEdit,
  __onRender,
}: InlineEditorProps<ItemType, ValueType>) {
  const [currentEditLoading, setCurrentEditLoading] = useState(false);
  const [currentEditValue, setCurrentEditValue] = useState<Optional<ValueType>>();

  const cellContext = {
    isEditing: true,
    currentValue: currentEditValue,
    setValue: setCurrentEditValue,
  };

  function finishEdit(cancel = false) {
    if (!cancel) {
      setCurrentEditValue(undefined);
    }
    onEditEnd();
  }

  async function onSubmitClick(evt: React.FormEvent) {
    evt.preventDefault();
    if (currentEditValue === undefined) {
      finishEdit();
      return;
    }

    setCurrentEditLoading(true);
    try {
      await submitEdit(item, column, currentEditValue);
      setCurrentEditLoading(false);
      finishEdit();
    } catch (e) {
      setCurrentEditLoading(false);
    }
  }

  function onCancel() {
    if (currentEditLoading) {
      return;
    }
    finishEdit(true);
  }

  function handleEscape(event: React.KeyboardEvent): void {
    if (event.key === 'Escape') {
      onCancel();
    }
  }

  const clickAwayRef = useClickAway(onCancel);

  useEffect(() => {
    __onRender?.();
  });

  // asserting non-undefined editConfig here because this component is unreachable otherwise
  const { ariaLabel = undefined, validation = noop, errorIconAriaLabel } = column.editConfig!;

  return (
    <form
      ref={clickAwayRef}
      onSubmit={onSubmitClick}
      onKeyDown={handleEscape}
      className={styles['body-cell-editor-form']}
    >
      <FormField
        __hideLabel={true}
        stretch={true}
        label={ariaLabel}
        errorText={validation(item, currentEditValue)}
        i18nStrings={{ errorIconAriaLabel }}
      >
        <div className={styles['body-cell-editor-row']}>
          {column.cell(item, cellContext)}
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
