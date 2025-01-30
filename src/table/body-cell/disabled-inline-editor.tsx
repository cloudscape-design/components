// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import Icon from '../../icon/internal';
import Portal from '../../internal/components/portal';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { usePortalModeClasses } from '../../internal/hooks/use-portal-mode-classes';
import InternalLiveRegion from '../../live-region/internal';
import Arrow from '../../popover/arrow';
import PopoverBody from '../../popover/body';
import PopoverContainer from '../../popover/container';
import { useClickAway } from './click-away';
import { TableBodyCellProps } from './index';
import { TableTdElement, TableTdElementProps } from './td-element';

import styles from './styles.css.js';

interface DisabledInlineEditorProps<ItemType> extends TableBodyCellProps<ItemType> {
  editDisabledReason: string;
}

export function DisabledInlineEditor<ItemType>({
  item,
  column,
  ariaLabels,
  isEditing,
  onEditStart,
  onEditEnd,
  editDisabledReason,
  ...rest
}: DisabledInlineEditorProps<ItemType>) {
  const isExpandableColumn = rest.level !== undefined;
  const clickAwayRef = useClickAway(() => {
    if (isEditing) {
      onEditEnd(true);
    }
  });

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

  const { tabIndex } = useSingleTabStopNavigation(buttonRef);

  return (
    <TableTdElement
      {...rest}
      nativeAttributes={
        { 'data-inline-editing-active': isEditing.toString() } as TableTdElementProps['nativeAttributes']
      }
      isEditing={isEditing}
      isEditingDisabled={true}
      onClick={!isEditing && !isExpandableColumn ? onClick : undefined}
      ref={!isExpandableColumn ? clickAwayRef : undefined}
    >
      {column.cell(item)}

      <div className={styles['body-cell-editor-wrapper']}>
        <div ref={isExpandableColumn ? clickAwayRef : undefined}>
          <button
            ref={buttonRef}
            tabIndex={tabIndex}
            className={clsx(
              styles['body-cell-editor'],
              styles['body-cell-editor-disabled'],
              isExpandableColumn && styles['body-cell-editor-focusable']
            )}
            onClick={!isEditing && isExpandableColumn ? onClick : undefined}
            aria-label={ariaLabels?.activateEditLabel?.(column, item)}
            aria-haspopup="dialog"
            aria-disabled="true"
            onKeyDown={handleEscape}
            {...targetProps}
          >
            <span className={styles['body-cell-editor-icon']}>
              <Icon name="lock-private" variant="normal" __internalRootRef={iconRef} />
            </span>
            {descriptionEl}
          </button>
        </div>
      </div>

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
                  <InternalLiveRegion tagName="span">{editDisabledReason}</InternalLiveRegion>
                </PopoverBody>
              </PopoverContainer>
            </span>
          </Portal>
        </span>
      )}
    </TableTdElement>
  );
}
