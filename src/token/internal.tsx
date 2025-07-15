// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import DismissButton from './dismiss-button';
import { TokenProps } from './interfaces';

import styles from './styles.css.js';

function InternalToken({ ariaLabel, disabled, readOnly, dismissLabel, onDismiss, children, ...restProps }: TokenProps) {
  const baseProps = getBaseProps(restProps);

  return (
    <div
      {...baseProps}
      className={clsx(styles.token, baseProps.className)}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      <div
        className={clsx(
          styles['token-box'],
          disabled && styles['token-box-disabled'],
          readOnly && styles['token-box-readonly']
        )}
      >
        {children}
        {onDismiss && (
          <DismissButton disabled={disabled} dismissLabel={dismissLabel} onDismiss={onDismiss} readOnly={readOnly} />
        )}
      </div>
    </div>
  );
}

export default InternalToken;
