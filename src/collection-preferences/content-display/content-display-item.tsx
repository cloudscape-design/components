// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from './styles.css.js';
import clsx from 'clsx';
import DragHandle from '../../internal/drag-handle';
import InternalToggle from '../../toggle/internal';
import React, { ForwardedRef, forwardRef } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { OptionWithVisibility } from './utils';
import { useUniqueId } from '../../internal/hooks/use-unique-id';

const componentPrefix = 'sortable-item';
export const getClassName = (suffix: string) => styles[`${componentPrefix}-${suffix}`];

export interface ContentDisplayItemProps {
  ariaDescribedBy?: string;
  dragHandleAriaLabel?: string;
  isDragging?: boolean;
  isSorting?: boolean;
  listeners?: SyntheticListenerMap;
  onToggle: (option: OptionWithVisibility) => void;
  option: OptionWithVisibility;
  sortable?: boolean;
  style?: {
    transform?: string;
    transition?: string;
  };
}

const ContentDisplayItem = forwardRef(
  (
    {
      dragHandleAriaLabel,
      isDragging,
      isSorting,
      listeners,
      onToggle,
      option,
      sortable = true,
      style,
    }: ContentDisplayItemProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const idPrefix = useUniqueId(componentPrefix);
    const controlId = `${idPrefix}-control-${option.id}`;

    const dragHandleAttributes = {
      ['aria-label']: [dragHandleAriaLabel, option.label].join(', '),
    };

    const isPlaceholder = isDragging && sortable;

    return (
      <div
        className={clsx(
          styles['content-display-option'],
          isPlaceholder && styles.placeholder,
          sortable && styles.sortable
        )}
        style={style}
      >
        <div
          ref={ref}
          className={clsx(
            getClassName('content'),
            styles.draggable,
            isDragging && styles.active,
            isSorting && styles.sorting
          )}
        >
          <DragHandle attributes={dragHandleAttributes} listeners={listeners} />

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
      </div>
    );
  }
);

export default ContentDisplayItem;
