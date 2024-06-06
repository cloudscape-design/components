// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref } from 'react';
import styles from './styles.css.js';
import InternalIcon from '../icon/internal';

interface DismissButtonProps {
  disabled?: boolean;
  readOnly?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export default forwardRef(DismissButton);

function DismissButton(
  { disabled, dismissLabel, onDismiss, readOnly }: DismissButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      type="button"
      className={styles['dismiss-button']}
      aria-disabled={disabled ? true : undefined}
      onClick={!disabled && !readOnly && onDismiss ? () => onDismiss() : undefined}
      aria-label={dismissLabel}
    >
      <InternalIcon name="close" />
    </button>
  );
}
