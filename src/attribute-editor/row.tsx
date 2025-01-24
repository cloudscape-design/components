// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import InternalFormField from '../form-field/internal';
import { useInternalI18n } from '../i18n/context';
import { Breakpoint } from '../internal/breakpoints';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { AttributeEditorProps } from './interfaces';
import { getItemGridColumns, getRemoveButtonGridColumns, isRemoveButtonOnSameLine } from './utils';

import styles from './styles.css.js';

interface RowProps<T> {
  breakpoint: Breakpoint | null;
  layout: AttributeEditorProps.GridLayout;
  item: T;
  definition: ReadonlyArray<AttributeEditorProps.FieldDefinition<T>>;
  i18nStrings: AttributeEditorProps.I18nStrings | undefined;
  index: number;
  removable: boolean;
  removeButtonText?: string;
  removeButtonRefs: Array<ButtonProps.Ref | undefined>;
  customRowActions?: (props: AttributeEditorProps.RowActionsProps<T>) => React.ReactNode;
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
    breakpoint,
    item,
    definition,
    layout,
    i18nStrings = {},
    index,
    removable,
    removeButtonText,
    removeButtonRefs,
    customRowActions,
    onRemoveButtonClick,
    removeButtonAriaLabel,
  }: RowProps<T>) => {
    const i18n = useInternalI18n('attribute-editor');

    const handleRemoveClick = useCallback(() => {
      fireNonCancelableEvent(onRemoveButtonClick, { itemIndex: index });
    }, [onRemoveButtonClick, index]);

    const firstControlId = useUniqueId('first-control-id-');

    const buttonRef = (ref: ButtonProps.Ref | null) => {
      removeButtonRefs[index] = ref ?? undefined;
    };

    let gridColumnStart = 1;
    let gridColumnEnd = 1;
    const removeButtonOnSameLine = isRemoveButtonOnSameLine(layout);

    const customActions = customRowActions?.({
      item,
      itemIndex: index,
      ref: buttonRef,
      breakpoint,
      ownRow: !removeButtonOnSameLine,
    });

    return (
      <div
        className={clsx(styles.row, layout.rows.length === 1 && styles['single-row'])}
        role="group"
        aria-labelledby={`${firstControlId}-label ${firstControlId}`}
      >
        {definition.map(({ info, label, constraintText, errorText, warningText, control }, defIndex) => {
          ({ gridColumnStart, gridColumnEnd } = getItemGridColumns(layout, defIndex));
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
              __hideLabel={index !== 0 && removeButtonOnSameLine}
              controlId={defIndex === 0 ? firstControlId : undefined}
            >
              {render(item, index, control)}
            </InternalFormField>
          );
        })}
        <div
          className={clsx(styles['remove-button-container'], {
            [styles['remove-button-field-padding']]: removeButtonOnSameLine && index === 0,
            [styles['remove-button-own-row']]: !removeButtonOnSameLine,
          })}
          style={{ ...getRemoveButtonGridColumns(layout, gridColumnEnd) }}
        >
          {removable &&
            (customActions !== undefined ? (
              customActions
            ) : (
              <InternalButton
                className={styles['remove-button']}
                formAction="none"
                ref={buttonRef}
                ariaLabel={(removeButtonAriaLabel ?? i18nStrings.removeButtonAriaLabel)?.(item)}
                onClick={handleRemoveClick}
              >
                {i18n('removeButtonText', removeButtonText)}
              </InternalButton>
            ))}
        </div>
        {!removeButtonOnSameLine && <div className={styles.divider} />}
      </div>
    );
  }
) as <T>(props: RowProps<T>) => JSX.Element;
