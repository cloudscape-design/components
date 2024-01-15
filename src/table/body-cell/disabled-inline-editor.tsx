// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { useClickAway } from './click-away';
import Icon from '../../icon/internal';
import PopoverContainer from '../../popover/container';
import PopoverBody from '../../popover/body';
import styles from './styles.css.js';
import Arrow from '../../popover/arrow';
import { TableTdElement } from './td-element';
import { TableBodyCellProps } from './index';
import useHiddenDescription from '../../button-dropdown/utils/use-hidden-description';

interface DisabledInlineEditorProps<ItemType> extends TableBodyCellProps<ItemType> {
  editDisabledReason: string;
}

export function DisabledInlineEditor<ItemType>({
  className,
  item,
  column,
  ariaLabels,
  isEditing,
  onEditStart,
  onEditEnd,
  editDisabledReason,
  isVisualRefresh,
  ...rest
}: DisabledInlineEditorProps<ItemType>) {
  const clickAwayRef = useClickAway(() => onEditEnd(true));

  const [hasHover, setHasHover] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const showIcon = hasHover || hasFocus || isEditing;

  const iconRef = useRef(null);

  function handleEscape(event: React.KeyboardEvent): void {
    if (event.key === 'Escape') {
      onEditEnd(true);
    }
  }

  const { targetProps, descriptionEl } = useHiddenDescription(editDisabledReason);

  return (
    <TableTdElement
      {...rest}
      className={clsx(
        className,
        styles['body-cell-editable'],
        styles['body-cell-disabled-edit'],
        isEditing && styles['body-cell-edit-disabled-popover'],
        isVisualRefresh && styles['is-visual-refresh']
      )}
      onClick={!isEditing ? onEditStart : undefined}
      onMouseEnter={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
      ref={clickAwayRef}
    >
      {column.cell(item)}

      <button
        tabIndex={0}
        className={styles['body-cell-editor']}
        aria-label={ariaLabels?.activateEditLabel?.(column, item)}
        aria-haspopup="dialog"
        aria-disabled="true"
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onKeyDown={handleEscape}
        {...targetProps}
      >
        {showIcon && <Icon name="lock-private" variant="normal" __internalRootRef={iconRef} />}
        {descriptionEl}
        {isEditing && (
          <PopoverContainer
            size="medium"
            fixedWidth={false}
            position="top"
            trackRef={iconRef}
            arrow={position => <Arrow position={position} />}
            renderWithPortal={true}
            zIndex={7000}
          >
            <PopoverBody
              dismissButton={false}
              dismissAriaLabel={undefined}
              header={null}
              onDismiss={() => {}}
              overflowVisible="both"
            >
              <span aria-live="polite">{editDisabledReason}</span>
            </PopoverBody>
          </PopoverContainer>
        )}
      </button>
    </TableTdElement>
  );
}
