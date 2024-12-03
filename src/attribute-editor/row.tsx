// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import InternalFormField from '../form-field/internal';
import { useInternalI18n } from '../i18n/context';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { AttributeEditorProps } from './interfaces';

import styles from './styles.css.js';

interface RowProps<T> {
  layout: AttributeEditorProps.GridLayout;
  item: T;
  definition: ReadonlyArray<AttributeEditorProps.FieldDefinition<T>>;
  i18nStrings: AttributeEditorProps.I18nStrings | undefined;
  index: number;
  removable: boolean;
  removeButtonText?: string;
  removeButtonRefs: Array<ButtonProps.Ref | undefined>;
  onRemoveButtonClick?: NonCancelableEventHandler<AttributeEditorProps.RemoveButtonClickDetail>;
  removeButtonAriaLabel?: (item: T) => string;
}

function render<T>(
  item: T,
  itemIndex: number,
  slot: AttributeEditorProps.FieldRenderable<T> | React.ReactNode | undefined
) {
  if (isSlotFunction(slot)) {
    return slot(item, itemIndex);
  }
  return slot;

  function isSlotFunction(slot: unknown): slot is AttributeEditorProps.FieldRenderable<T> {
    return typeof slot === 'function';
  }
}

export const Row = React.memo(
  <T,>({
    item,
    definition,
    layout,
    i18nStrings = {},
    index,
    removable,
    removeButtonText,
    removeButtonRefs,
    onRemoveButtonClick,
    removeButtonAriaLabel,
  }: RowProps<T>) => {
    const i18n = useInternalI18n('attribute-editor');

    const handleRemoveClick = useCallback(() => {
      fireNonCancelableEvent(onRemoveButtonClick, { itemIndex: index });
    }, [onRemoveButtonClick, index]);

    const firstControlId = useUniqueId('first-control-id-');

    const maxColumns = layout.rows.reduce(
      (max, columns) =>
        Math.max(
          max,
          columns.reduce((sum, col) => sum + col, 0)
        ),
      0
    );
    let gridColumnStart = 1;
    let gridColumnEnd = 2;

    const lastRow = layout.rows[layout.rows.length - 1];
    const removeButtonWidth = lastRow[lastRow.length - 1];

    return (
      <div
        className={clsx(styles.row, layout.rows.length === 1 && styles['single-row'])}
        role="group"
        aria-labelledby={`${firstControlId}-label ${firstControlId}`}
      >
        {definition.map(({ info, label, constraintText, errorText, warningText, control }, defIndex) => {
          let i = 0;
          rowloop: for (const row of layout.rows) {
            gridColumnStart = 1;
            for (const columnWidth of row) {
              if (i === defIndex) {
                gridColumnEnd = gridColumnStart + columnWidth;
                break rowloop;
              } else {
                gridColumnStart += columnWidth;
              }
              i++;
            }
          }
          return (
            <InternalFormField
              key={defIndex}
              className={styles.field}
              __style={{ gridColumnStart, gridColumnEnd }}
              label={label}
              info={info}
              constraintText={render(item, index, constraintText)}
              errorText={render(item, index, errorText)}
              warningText={render(item, index, warningText)}
              stretch={true}
              i18nStrings={{
                errorIconAriaLabel: i18nStrings.errorIconAriaLabel,
                warningIconAriaLabel: i18nStrings.warningIconAriaLabel,
              }}
              __hideLabel={index !== 0 && layout.rows.length === 1}
              controlId={defIndex === 0 ? firstControlId : undefined}
            >
              {render(item, index, control)}
            </InternalFormField>
          );
        })}
        <div
          className={clsx(styles['remove-button-container'], {
            [styles['remove-button-field-padding']]:
              (layout.rows.length === 1 && index === 0) || (lastRow.length > 1 && layout.rows.length > 1),
            [styles['remove-button-own-row']]: lastRow.length === 1,
          })}
          style={
            lastRow.length === 1
              ? { gridColumnStart: 1, gridColumnEnd: maxColumns + 1 }
              : { gridColumnStart: gridColumnEnd, gridColumnEnd: gridColumnEnd + removeButtonWidth }
          }
        >
          {removable && (
            <InternalButton
              className={styles['remove-button']}
              formAction="none"
              ref={ref => {
                removeButtonRefs[index] = ref ?? undefined;
              }}
              ariaLabel={(removeButtonAriaLabel ?? i18nStrings.removeButtonAriaLabel)?.(item)}
              onClick={handleRemoveClick}
            >
              {i18n('removeButtonText', removeButtonText)}
            </InternalButton>
          )}
        </div>
        {layout.rows.length > 1 && <div className={styles.divider} />}
      </div>
    );
  }
) as <T>(props: RowProps<T>) => JSX.Element;
