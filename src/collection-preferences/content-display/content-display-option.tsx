// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from '../styles.css.js';
import DragHandle from '../../internal/components/drag-handle';
import InternalToggle from '../../toggle/internal';
import React, { ForwardedRef, forwardRef } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { OptionWithVisibility } from './utils';
import { useUniqueId } from '../../internal/hooks/use-unique-id';

const componentPrefix = 'content-display-option';
export const getClassName = (suffix?: string) => styles[[componentPrefix, suffix].filter(Boolean).join('-')];

export interface ContentDisplayOptionProps {
  dragHandleAriaLabel?: string;
  listeners?: SyntheticListenerMap;
  onToggle?: (option: OptionWithVisibility) => void;
  option: OptionWithVisibility;
}

const ContentDisplayOption = forwardRef(
  (
    { dragHandleAriaLabel, listeners, onToggle, option }: ContentDisplayOptionProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const idPrefix = useUniqueId(componentPrefix);
    const controlId = `${idPrefix}-control-${option.id}`;

    const dragHandleAttributes = {
      ['aria-label']: [dragHandleAriaLabel, option.label].join(', '),
    };

    return (
      <div ref={ref} className={getClassName('content')}>
        <DragHandle attributes={dragHandleAttributes} listeners={listeners} />

        <label className={getClassName('label')} htmlFor={controlId}>
          {option.label}
        </label>
        <div className={getClassName('toggle')}>
          <InternalToggle
            checked={!!option.visible}
            onChange={() => onToggle && onToggle(option)}
            disabled={option.alwaysVisible === true}
            controlId={controlId}
          />
        </div>
      </div>
    );
  }
);

export default ContentDisplayOption;
