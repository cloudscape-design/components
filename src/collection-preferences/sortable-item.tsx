// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import styles from './styles.css.js';
import DragHandle from '../internal/drag-handle';
import InternalToggle from '../toggle/internal';
import { className } from './utils';
import { CollectionPreferencesProps } from './interfaces';

export function SortableItem({
  isVisible,
  labelId,
  onToggle,
  option,
  reorderContent,
}: {
  isVisible: boolean;
  labelId: string;
  onToggle: (id: string) => void;
  option: CollectionPreferencesProps.VisibleContentOption;
  reorderContent: boolean;
}) {
  const { isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div className={clsx(className('option').className)}>
      <div
        ref={setNodeRef}
        className={clsx(
          className('option-content').className,
          reorderContent && styles.draggable,
          reorderContent && isDragging && styles.dragged
        )}
        style={style}
      >
        {reorderContent && (
          <div {...listeners} {...className('drag-handle-wrapper')}>
            <DragHandle ariaLabelledBy={''} ariaDescribedBy={''} {...listeners} />
          </div>
        )}
        <label {...className('option-label')} htmlFor={labelId}>
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
