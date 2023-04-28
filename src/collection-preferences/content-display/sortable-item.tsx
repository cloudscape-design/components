// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { OptionWithVisibility } from './utils';
import ContentDisplayItem from './content-display-item';

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
    <ContentDisplayItem
      dragHandleAriaLabel={dragHandleAriaLabel}
      isDragging={isDragging}
      isSorting={isSorting}
      listeners={combinedListeners}
      onToggle={onToggle}
      option={option}
      ref={setNodeRef}
      sortable={true}
      style={style}
    />
  );
}
