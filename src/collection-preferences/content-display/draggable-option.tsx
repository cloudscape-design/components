// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { OptionWithVisibility } from './utils';
import ContentDisplayOption, { getClassName } from './content-display-option';
import clsx from 'clsx';
import styles from '../styles.css.js';

export default function DraggableOption({
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
  const { isDragging, isSorting, listeners, setNodeRef, transform } = useSortable({
    id: option.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
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

  return (
    <li className={clsx(getClassName(), isDragging && styles.placeholder, isSorting && styles.sorting)} style={style}>
      <ContentDisplayOption
        ref={setNodeRef}
        listeners={combinedListeners}
        dragHandleAriaLabel={dragHandleAriaLabel}
        onToggle={onToggle}
        option={option}
      />
    </li>
  );
}
