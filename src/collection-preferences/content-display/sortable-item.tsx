// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import styles from '../styles.css.js';
import DragHandle from '../../internal/drag-handle';
import InternalToggle from '../../toggle/internal';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { OptionWithVisibility } from './utils';

const componentPrefix = 'sortable-item';
const getClassName = (suffix: string) => styles[`${componentPrefix}-${suffix}`];

export function SortableItem({
  dragHandleAriaLabel,
  onKeyDown,
  onToggle,
  option,
}: {
  dragHandleAriaLabel?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onToggle: (option: OptionWithVisibility) => void;
  option: OptionWithVisibility;
}) {
  const { isDragging, isSorting, listeners, over, rect, setNodeRef, transform } = useSortable({
    id: option.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const idPrefix = useUniqueId(componentPrefix);
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
  // Unfortunately we can't use dnd-kit's recommended approach of using a drag overlay
  // because it renders out of place when drag and drop is used in our modal.
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
            checked={!!option.visible}
            onChange={() => onToggle(option)}
            disabled={option.alwaysVisible === true}
            controlId={controlId}
          />
        </div>
      </div>
    </li>
  );
}
