// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { FormFieldError, FormFieldWarning } from '../form-field/internal';
import { getBaseProps } from '../internal/base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import DismissButton from './dismiss-button';

import styles from './styles.css.js';

interface TokenProps {
  children: React.ReactNode;
  ariaLabel?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  errorText?: React.ReactNode;
  errorIconAriaLabel?: string;
  warningText?: React.ReactNode;
  warningIconAriaLabel?: string;
  className?: string;
}

export function Token({
  ariaLabel,
  disabled,
  readOnly,
  dismissLabel,
  onDismiss,
  children,
  errorText,
  warningText,
  errorIconAriaLabel,
  warningIconAriaLabel,
  ...restProps
}: TokenProps) {
  const errorId = useUniqueId('error');
  const warningId = useUniqueId('warning');
  const baseProps = getBaseProps(restProps);

  const showWarning = warningText && !errorText;

  return (
    <div
      {...baseProps}
      className={clsx(styles.token, baseProps.className)}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={errorText ? errorId : warningText ? warningId : undefined}
      aria-disabled={disabled}
    >
      <div
        className={clsx(
          styles['token-box'],
          disabled && styles['token-box-disabled'],
          readOnly && styles['token-box-readonly'],
          errorText && styles['token-box-error'],
          showWarning && styles['token-box-warning']
        )}
      >
        {children}
        {onDismiss && (
          <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} readOnly={readOnly} />
        )}
      </div>
      {errorText && (
        <FormFieldError id={errorId} errorIconAriaLabel={errorIconAriaLabel}>
          {errorText}
        </FormFieldError>
      )}
      {showWarning && (
        <FormFieldWarning id={warningId} warningIconAriaLabel={warningIconAriaLabel}>
          {warningText}
        </FormFieldWarning>
      )}
    </div>
  );
}
