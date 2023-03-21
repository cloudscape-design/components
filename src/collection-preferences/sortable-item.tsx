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
  dragHandleAriaLabelId,
  isVisible,
  idPrefix,
  onToggle,
  option,
}: {
  dragHandleAriaLabelId: string;
  isVisible: boolean;
  idPrefix: string;
  onToggle: (id: string) => void;
  option: CollectionPreferencesProps.VisibleContentOption;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id: option.id });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const controlId = `${idPrefix}-control-${option.id}`;
  const labelId = `${idPrefix}-label-${option.id}`;

  const dragHandleAttributes = {
    ['aria-labelledby']: `${dragHandleAriaLabelId} ${labelId}`,
    ['aria-describedby']: attributes['aria-describedby'],
  };

  return (
    <div className={styles['content-display-option']}>
      <div
        ref={setNodeRef}
        className={clsx(className('content').className, styles.draggable, isDragging && styles.dragged)}
        style={style}
      >
        <DragHandle attributes={dragHandleAttributes} listeners={listeners} />

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
    </div>
  );
}
