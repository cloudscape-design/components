// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import styles from './styles.css.js';
import DragHandle from '../internal/drag-handle';
import InternalToggle from '../toggle/internal';
import { CollectionPreferencesProps } from './interfaces';

export const className = (suffix: string) => ({
  className: styles[`sortable-item-${suffix}`],
});

export function SortableItem({
  dragHandleAriaLabel,
  isVisible,
  labelId,
  onToggle,
  option,
  reorderContent,
}: {
  dragHandleAriaLabel?: string;
  isVisible: boolean;
  labelId: string;
  onToggle: (id: string) => void;
  option: CollectionPreferencesProps.VisibleContentOption;
  reorderContent: boolean;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const dragHandleAttributes = {
    ['aria-label']: dragHandleAriaLabel,
    ['aria-describedby']: attributes['aria-describedby'],
  };

  return (
    <div {...className('option')}>
      <div
        ref={setNodeRef}
        className={clsx(
          className('content').className,
          reorderContent && styles.draggable,
          reorderContent && isDragging && styles.dragged
        )}
        style={style}
      >
        {reorderContent && <DragHandle attributes={dragHandleAttributes} listeners={listeners} />}
        <label {...className('label')} htmlFor={labelId}>
          {option.label}
        </label>
        <div {...className('toggle')}>
          <InternalToggle
            checked={isVisible}
            onChange={() => onToggle(option.id)}
            disabled={option.editable === false}
            controlId={labelId}
          />
        </div>
      </div>
    </div>
  );
}
