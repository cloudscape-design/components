// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalIcon from '../icon/internal';

interface DismissButtonProps {
  disabled?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export default forwardRef(DismissButton);

function DismissButton({ disabled, dismissLabel, onDismiss }: DismissButtonProps, ref: Ref<HTMLButtonElement>) {
  return (
    <button
      ref={ref}
      type="button"
      className={clsx(styles['dismiss-button'])}
      aria-disabled={disabled ? true : undefined}
      onClick={!disabled && onDismiss ? () => onDismiss() : undefined}
      aria-label={dismissLabel}
    >
      <InternalIcon name="close" />
    </button>
  );
}
