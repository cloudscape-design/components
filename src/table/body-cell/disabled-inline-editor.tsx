// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import useHiddenDescription from '../../button-dropdown/utils/use-hidden-description';
import Icon from '../../icon/internal';
import PopoverContainer from '../../popover/container';
import PopoverBody from '../../popover/body';
import Portal from '../../internal/components/portal';
import { usePortalModeClasses } from '../../internal/hooks/use-portal-mode-classes';
import Arrow from '../../popover/arrow';
import { useClickAway } from './click-away';
import { TableTdElement, TableTdElementProps } from './td-element';
import { TableBodyCellProps } from './index';
import styles from './styles.css.js';

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
  const clickAwayRef = useClickAway(() => {
    if (isEditing) {
      onEditEnd(true);
    }
  });

  const [hasHover, setHasHover] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const showIcon = hasHover || hasFocus || isEditing;

  const iconRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLSpanElement>(null);

  function handleEscape(event: React.KeyboardEvent): void {
    if (event.key === 'Escape') {
      onEditEnd(true);
    }
  }

  const onClick = () => {
    onEditStart();
    buttonRef.current?.focus();
  };

  const { targetProps, descriptionEl } = useHiddenDescription(editDisabledReason);
  const portalClasses = usePortalModeClasses(portalRef);

  return (
    <TableTdElement
      {...rest}
      nativeAttributes={
        { 'data-inline-editing-active': isEditing.toString() } as TableTdElementProps['nativeAttributes']
      }
      className={clsx(
        className,
        styles['body-cell-editable'],
        styles['body-cell-disabled-edit'],
        isEditing && styles['body-cell-edit-disabled-popover'],
        isVisualRefresh && styles['is-visual-refresh']
      )}
      onClick={!isEditing ? onClick : undefined}
      onMouseEnter={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
      ref={clickAwayRef}
    >
      {column.cell(item)}

      <button
        ref={buttonRef}
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
      </button>
      {isEditing && (
        <span ref={portalRef}>
          <Portal>
            <span className={portalClasses}>
              <PopoverContainer
                size="medium"
                fixedWidth={false}
                position="top"
                trackRef={iconRef}
                arrow={position => <Arrow position={position} />}
                renderWithPortal={true}
                zIndex={2000}
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
            </span>
          </Portal>
        </span>
      )}
    </TableTdElement>
  );
}
