// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalIcon from '../icon/internal';

import useFocusVisible from '../internal/hooks/focus-visible';

interface DismissButtonProps {
  disabled?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export default forwardRef(DismissButton);

function DismissButton({ disabled, dismissLabel, onDismiss }: DismissButtonProps, ref: Ref<HTMLButtonElement>) {
  const focusVisible = useFocusVisible();
  return (
    <button
      ref={ref}
      type="button"
      className={clsx(styles['dismiss-button'])}
      disabled={disabled}
      onClick={onDismiss}
      aria-label={dismissLabel}
      {...focusVisible}
    >
      <InternalIcon name="close" />
    </button>
  );
}
