// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

import InternalIcon from '../../../icon/internal';

import styles from './styles.css.js';

export interface DragHandleProps {
  attributes: ButtonHTMLAttributes<HTMLDivElement>;
  hideFocus?: boolean;
  // @dnd-kit uses this type
  // eslint-disable-next-line @typescript-eslint/ban-types
  listeners: Record<string, Function> | undefined;
}

export default function DragHandle({ attributes, hideFocus, listeners }: DragHandleProps) {
  const disabled = attributes['aria-disabled'];
  return (
    // We need to use a div with button role instead of a button
    // so that Safari will focus on it when clicking it.
    // (See https://bugs.webkit.org/show_bug.cgi?id=22261)
    // Otherwise, we can't reliably catch keyboard events coming from the handle
    // when it is being dragged.
    <div
      role="button"
      tabIndex={0}
      className={clsx(styles.handle, hideFocus && styles['hide-focus'], disabled && styles['handle-disabled'])}
      {...attributes}
      {...listeners}
    >
      <InternalIcon variant={disabled ? 'disabled' : undefined} name="drag-indicator" />
    </div>
  );
}
