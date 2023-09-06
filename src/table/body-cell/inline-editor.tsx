// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../button/internal';
import FormField from '../../form-field/internal';
import SpaceBetween from '../../space-between/internal';
import { useClickAway } from './click-away';
import { TableProps } from '../interfaces';
import styles from './styles.css.js';
import { Optional } from '../../internal/types';
import FocusLock, { FocusLockRef } from '../../internal/components/focus-lock';
import LiveRegion from '../../internal/components/live-region';
import { useInternalI18n } from '../../i18n/context';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

// A function that does nothing
const noop = () => undefined;

interface OnEditEndOptions {
  cancelled: boolean;
  refocusCell: boolean;
}

interface InlineEditorProps<ItemType> {
  ariaLabels: TableProps['ariaLabels'];
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
  onEditEnd: (options: OnEditEndOptions) => void;
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
  const i18n = useInternalI18n('table');

  const focusLockRef = useRef<FocusLockRef>(null);

  const cellContext = {
    currentValue: currentEditValue,
    setValue: setCurrentEditValue,
  };

  function finishEdit({ cancelled = false, refocusCell = true }: Partial<OnEditEndOptions> = {}) {
    if (!cancelled) {
      setCurrentEditValue(undefined);
    }
    onEditEnd({ cancelled, refocusCell: refocusCell });
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
      focusLockRef.current?.focusFirst();
    }
  }

  const onCancel = useStableCallback(({ reFocusEditedCell = true } = {}) => {
    if (currentEditLoading) {
      return;
    }
    finishEdit({ cancelled: true, refocusCell: reFocusEditedCell });
  });

  const dialogRef = useRef<HTMLDivElement>(null);
  const clickAwayRef = useClickAway(() => onCancel({ reFocusEditedCell: false }));
  const mergedRef = useMergeRefs(dialogRef, clickAwayRef);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onCancel();
          event.stopPropagation();
        }
      };
      dialog.addEventListener('keydown', handleEscape);
      return () => dialog.removeEventListener('keydown', handleEscape);
    }
  }, [onCancel]);

  useEffect(() => {
    if (__onRender) {
      const timer = setTimeout(__onRender, 1);
      return () => clearTimeout(timer);
    }
  }, [__onRender]);

  // asserting non-undefined editConfig here because this component is unreachable otherwise
  const {
    ariaLabel = undefined,
    validation = noop,
    errorIconAriaLabel,
    constraintText,
    editingCell,
  } = column.editConfig!;

  return (
    <FocusLock autoFocus={true} restoreFocus={true} ref={focusLockRef}>
      <div role="dialog" ref={mergedRef} aria-label={ariaLabels?.activateEditLabel?.(column, item)}>
        <form onSubmit={onSubmitClick} className={styles['body-cell-editor-form']}>
          <FormField
            stretch={true}
            label={ariaLabel}
            constraintText={constraintText}
            __hideLabel={true}
            __disableGutters={true}
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
                      onClick={() => onCancel()}
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
                <LiveRegion>
                  {currentEditLoading
                    ? i18n('ariaLabels.submittingEditText', ariaLabels?.submittingEditText?.(column))
                    : ''}
                </LiveRegion>
              </span>
            </div>
          </FormField>
        </form>
      </div>
    </FocusLock>
  );
}
