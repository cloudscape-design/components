// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

import styles from './input-field.scss';

export interface InputFieldState {
  invalid?: boolean;
  warning?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

// Class names for a forwarded Input in one of its owned states: one class for the field box (Input.root), one
// for the native input (Input.input). The interaction states are handled by selectors in input-field.scss.
export function getInputFieldClassNames({ invalid, warning, disabled, readOnly }: InputFieldState) {
  return {
    root: clsx({
      [styles['input-root-invalid']]: invalid,
      [styles['input-root-warning']]: warning && !invalid,
      [styles['input-root-disabled']]: disabled && !invalid && !warning,
      [styles['input-root-readonly']]: readOnly && !disabled && !invalid && !warning,
      [styles['input-root']]: !invalid && !warning && !disabled && !readOnly,
    }),
    input: clsx(
      styles['input-input'],
      disabled && styles['input-input-disabled'],
      readOnly && !disabled && styles['input-input-readonly']
    ),
  };
}
