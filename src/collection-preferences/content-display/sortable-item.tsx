// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import styles from '../styles.css.js';
import DragHandle from '../../internal/drag-handle';
import InternalToggle from '../../toggle/internal';
import { CollectionPreferencesProps } from '../interfaces';

const getClassName = (suffix: string) => styles[`sortable-item-${suffix}`];

export function SortableItem({
  dragHandleAriaLabel,
  idPrefix,
  isVisible,
  isKeyboard,
  onKeyDown,
  onToggle,
  option,
}: {
  dragHandleAriaLabel?: string;
  idPrefix: string;
  isKeyboard: boolean;
  isVisible: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onToggle: (id: string) => void;
  option: CollectionPreferencesProps.ContentDisplayOption;
}) {
  const { isDragging, isSorting, listeners, over, rect, setNodeRef, transform } = useSortable({
    id: option.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const controlId = `${idPrefix}-control-${option.id}`;

  const dragHandleAttributes = {
    ['aria-label']: [dragHandleAriaLabel, option.label].join(', '),
  };

  const combinedListeners = {
    ...listeners,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
      if (listeners?.onKeyDown) {
        listeners.onKeyDown(event);
      }
    },
  };

  // The placeholder is rendered from within the dragged item, but is shown at the position of the displaced item.
  // Therefore, we need to translate it by the right amount.
  const placeholderOffsetY =
    isDragging && over?.rect?.top !== undefined && rect.current?.top !== undefined
      ? over.rect.top > rect.current?.top
        ? over.rect.bottom - rect.current?.bottom
        : over.rect.top - rect.current?.top
      : undefined;

  const placeholderStyle = placeholderOffsetY ? { transform: `translateY(${placeholderOffsetY}px)` } : undefined;

  return (
    <li className={clsx(styles['content-display-option'], styles['sortable-item'])}>
      {isDragging && <div className={getClassName('placeholder')} style={placeholderStyle} />}
      <div
        ref={setNodeRef}
        className={clsx(
          getClassName('content'),
          styles.draggable,
          isDragging && styles.active,
          isKeyboard && styles.keyboard,
          isSorting && styles.sorting
        )}
        style={style}
      >
        <DragHandle attributes={dragHandleAttributes} hideFocus={isDragging} listeners={combinedListeners} />

        <label className={getClassName('label')} htmlFor={controlId}>
          {option.label}
        </label>
        <div className={getClassName('toggle')}>
          <InternalToggle
            checked={isVisible}
            onChange={() => onToggle(option.id)}
            disabled={option.alwaysVisible === true}
            controlId={controlId}
          />
        </div>
      </div>
    </li>
  );
}
