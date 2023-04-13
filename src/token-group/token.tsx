// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import DismissButton from './dismiss-button';
import styles from './styles.css.js';
import { FormFieldError } from '../form-field/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id';

interface TokenProps {
  children: React.ReactNode;
  ariaLabel?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  disabled?: boolean;
  errorText?: React.ReactNode;
  errorIconAriaLabel?: string;
  className?: string;
}

export function Token({
  ariaLabel,
  disabled,
  dismissLabel,
  onDismiss,
  children,
  errorText,
  errorIconAriaLabel,
  className,
}: TokenProps) {
  const errorId = useUniqueId('error');
  return (
    <div
      className={clsx(styles.token, className)}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={errorText ? errorId : undefined}
      aria-disabled={disabled}
    >
      <div
        className={clsx(
          styles['token-box'],
          disabled && styles['token-box-disabled'],
          errorText && styles['token-box-error']
        )}
      >
        {children}
        {onDismiss && <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} />}
      </div>
      {errorText && (
        <FormFieldError id={errorId} errorIconAriaLabel={errorIconAriaLabel}>
          {errorText}
        </FormFieldError>
      )}
    </div>
  );
}
