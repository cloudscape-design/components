// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import InternalAlert from '../alert/internal';
import InternalBox from '../box/internal';
import styles from './styles.css.js';
import { FormProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

type InternalFormProps = FormProps & InternalBaseComponentProps;

export default function InternalForm({
  children,
  header,
  errorText,
  actions,
  secondaryActions,
  __internalRootRef,
  ...props
}: InternalFormProps) {
  const baseProps = getBaseProps(props);
  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(styles.root, baseProps.className)}>
      {header && <div className={styles.header}>{header}</div>}
      {children && <div className={styles.content}>{children}</div>}
      <div aria-live="assertive">
        {errorText && (
          <InternalBox margin={{ top: 'l' }}>
            <InternalAlert type="error">
              <div className={styles.error}>{errorText}</div>
            </InternalAlert>
          </InternalBox>
        )}
      </div>
      {(actions || secondaryActions) && (
        <div className={styles.footer}>
          <div className={styles['actions-section']}>
            {actions && <div className={styles.actions}>{actions}</div>}
            {secondaryActions && <div className={styles['secondary-actions']}>{secondaryActions}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
