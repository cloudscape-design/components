// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, forwardRef } from 'react';

import DragHandle, { DragHandleProps } from '../../internal/components/drag-handle';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import InternalToggle from '../../toggle/internal';
import { OptionWithVisibility } from './utils';

import styles from '../styles.css.js';

const componentPrefix = 'content-display-option';
export const getClassName = (suffix?: string) => styles[[componentPrefix, suffix].filter(Boolean).join('-')];

interface ContentDisplayOptionProps {
  dragHandleAriaLabel?: string;
  listeners?: DragHandleProps['listeners'];
  onToggle?: (option: OptionWithVisibility) => void;
  option: OptionWithVisibility;
  disabled?: boolean;
}

const ContentDisplayOption = forwardRef(
  (
    { dragHandleAriaLabel, listeners, onToggle, option, disabled }: ContentDisplayOptionProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const idPrefix = useUniqueId(componentPrefix);
    const controlId = `${idPrefix}-control-${option.id}`;

    const dragHandleAttributes = {
      ['aria-label']: [dragHandleAriaLabel, option.label].join(', '),
    };

    return (
      <div ref={ref} className={getClassName('content')}>
        <DragHandle disabled={disabled} attributes={dragHandleAttributes} listeners={listeners} />

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
