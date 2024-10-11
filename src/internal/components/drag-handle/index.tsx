// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import InternalIcon from '../../../icon/internal';
import Handle from '../handle';

import handleStyles from '../handle/styles.css.js';
import styles from './styles.css.js';

export interface DragHandleProps {
  attributes: ButtonHTMLAttributes<HTMLDivElement>;
  hideFocus?: boolean;
  // @dnd-kit uses this type
  // eslint-disable-next-line @typescript-eslint/ban-types
  listeners: Record<string, Function> | undefined;
  disabled?: boolean;
}

export default function DragHandle({ attributes, hideFocus, listeners, disabled }: DragHandleProps) {
  return (
    <Handle
      aria-disabled={disabled}
      className={clsx(styles.handle, hideFocus && handleStyles['hide-focus'], disabled && styles['handle-disabled'])}
      {...attributes}
      {...listeners}
    >
      <InternalIcon variant={disabled ? 'disabled' : undefined} name="drag-indicator" />
    </Handle>
  );
}
