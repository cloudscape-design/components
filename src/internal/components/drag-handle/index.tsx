// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../../../icon/internal';

import styles from './styles.css.js';

export interface DragHandleProps {
  ariaLabel: string;
  ariaDescribedby?: string;
  disabled?: boolean;
  onPointerDown?: React.PointerEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
}

export default function DragHandle({
  ariaLabel,
  ariaDescribedby,
  disabled,
  onPointerDown,
  onKeyDown,
}: DragHandleProps) {
  return (
    // We need to use a div with button role instead of a button
    // so that Safari will focus on it when clicking it.
    // (See https://bugs.webkit.org/show_bug.cgi?id=22261)
    // Otherwise, we can't reliably catch keyboard events coming from the handle
    // when it is being dragged.
    <div
      role="button"
      tabIndex={0}
      className={clsx(styles.handle, disabled && styles['handle-disabled'])}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-disabled={disabled}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <InternalIcon variant={disabled ? 'disabled' : undefined} name="drag-indicator" />
    </div>
  );
}
