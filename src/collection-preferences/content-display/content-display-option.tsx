// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, forwardRef } from 'react';

import { DragHandleProps } from '../../drag-handle/interfaces';
import InternalDragHandle from '../../drag-handle/internal';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import InternalToggle from '../../toggle/internal';
import { OptionWithVisibility } from './utils';

import styles from '../styles.css.js';

const componentPrefix = 'content-display-option';
export const getClassName = (suffix?: string) => styles[[componentPrefix, suffix].filter(Boolean).join('-')];

interface ContentDisplayOptionProps {
  dragHandleProps: DragHandleProps;
  onToggle?: (option: OptionWithVisibility) => void;
  option: OptionWithVisibility;
}

const ContentDisplayOption = forwardRef(
  ({ dragHandleProps, onToggle, option }: ContentDisplayOptionProps, ref: ForwardedRef<HTMLDivElement>) => {
    const idPrefix = useUniqueId(componentPrefix);
    const controlId = `${idPrefix}-control-${option.id}`;
    return (
      <div ref={ref} className={getClassName('content')}>
        <div className={styles['drag-handle-wrapper']}>
          <InternalDragHandle {...dragHandleProps} />
        </div>

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
