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

export const className = (suffix: string) => ({
  className: styles[`sortable-item-${suffix}`],
});

export function SortableItem({
  dragHandleAriaLabel,
  isVisible,
  idPrefix,
  onKeyDown,
  onToggle,
  option,
}: {
  dragHandleAriaLabel?: string;
  isVisible: boolean;
  idPrefix: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onToggle: (id: string) => void;
  option: CollectionPreferencesProps.VisibleContentOption;
}) {
  const { attributes, isDragging, isSorting, listeners, over, rect, setNodeRef, transform } = useSortable({
    id: option.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const controlId = `${idPrefix}-control-${option.id}`;
  const labelId = `${idPrefix}-label-${option.id}`;

  const dragHandleAttributes = {
    ['aria-label']: dragHandleAriaLabel,
    ['aria-describedby']: attributes['aria-describedby'],
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
    <li className={clsx(styles['content-display-option'], styles['sortable-item'])} aria-labelledby={labelId}>
      {isDragging && <div {...className('placeholder')} style={placeholderStyle} />}
      <div
        ref={setNodeRef}
        className={clsx(
          className('content').className,
          styles.draggable,
          isDragging && styles.active,
          isSorting && styles.sorting
        )}
        style={style}
      >
        <DragHandle attributes={dragHandleAttributes} listeners={combinedListeners} />

        <label {...className('label')} id={labelId} htmlFor={controlId}>
          {option.label}
        </label>
        <div {...className('toggle')}>
          <InternalToggle
            checked={isVisible}
            onChange={() => onToggle(option.id)}
            disabled={option.editable === false}
            controlId={controlId}
          />
        </div>
      </div>
    </li>
  );
}
