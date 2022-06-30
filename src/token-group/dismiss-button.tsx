// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalIcon from '../icon/internal';

import useFocusVisible from '../internal/hooks/focus-visible';

interface DismissButtonProps {
  disabled?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

interface DismissButtonAttributes {
  onClick?(): void;
  tabIndex: number;
  'aria-label'?: string;
}
export default function DismissButton({ disabled, dismissLabel, onDismiss }: DismissButtonProps) {
  const tokenAttributes: DismissButtonAttributes = {
    tabIndex: -1,
  };

  if (dismissLabel) {
    tokenAttributes['aria-label'] = dismissLabel;
  }

  if (!disabled) {
    tokenAttributes.onClick = onDismiss;
    tokenAttributes.tabIndex = 0;
  }

  const focusVisible = useFocusVisible();

  return (
    <button type="button" className={clsx(styles['dismiss-button'])} {...tokenAttributes} {...focusVisible}>
      <InternalIcon name="close" />
    </button>
  );
}
