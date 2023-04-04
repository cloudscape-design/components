// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import DismissButton from './dismiss-button';
import styles from './styles.css.js';
import { FormFieldError } from '../form-field/internal';
import InternalBox from '../box/internal';

interface ItemAttributes {
  children: React.ReactNode;
  dismissLabel?: string;
  onDismiss?: () => void;
  disabled?: boolean;
  errorText?: React.ReactNode;
}

interface TokenProps extends ItemAttributes {
  children: React.ReactNode;
}

export function Token({ disabled, dismissLabel, onDismiss, children, errorText }: TokenProps) {
  return (
    <InternalBox>
      <div className={clsx(styles.token, disabled && styles['token-disabled'])}>
        {children}
        {onDismiss && <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} />}
      </div>
      {errorText && (
        <div style={{ marginTop: '4px' }}>
          <FormFieldError>{errorText}</FormFieldError>
        </div>
      )}
    </InternalBox>
  );
}
