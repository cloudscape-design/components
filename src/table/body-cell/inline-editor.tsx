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

interface InlineEditorProps<ItemType> {
  ariaLabels: TableProps['ariaLabels'];
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  onEditEnd: () => void;
  submitEdit: TableProps.SubmitEditFunction<ItemType>;
  __onRender?: () => void;
}

export function InlineEditor<ItemType>({
  ariaLabels,
  item,
  column,
  onEditEnd,
  submitEdit,
  __onRender,
}: InlineEditorProps<ItemType>) {
  const [currentEditLoading, setCurrentEditLoading] = useState(false);
  const [currentEditValue, setCurrentEditValue] = useState<Optional<any>>();

  const cellContext = {
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
    if (__onRender) {
      const timer = setTimeout(__onRender, 1);
      return () => clearTimeout(timer);
    }
  }, [__onRender]);

  // asserting non-undefined editConfig here because this component is unreachable otherwise
  const { ariaLabel = undefined, validation = noop, errorIconAriaLabel, editingCell } = column.editConfig!;

  return (
    <form
      ref={clickAwayRef}
      onSubmit={onSubmitClick}
      onKeyDown={handleEscape}
      className={styles['body-cell-editor-form']}
    >
      <FormField
        stretch={true}
        label={ariaLabel}
        __hideLabel={true}
        __disableGutters={true}
        __useReactAutofocus={true}
        i18nStrings={{ errorIconAriaLabel }}
        errorText={validation(item, currentEditValue)}
      >
        <div className={styles['body-cell-editor-row']}>
          {editingCell(item, cellContext)}
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
