// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Toast } from './toast';
import { ToastProps } from './interface';
import styles from './styles.css.js';

interface ToastListProps {
  toasts: Array<ToastProps>;
}
export const ToastList = ({ toasts }: ToastListProps) => {
  return (
    <div className={styles['toasts-list']}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast.message} />
      ))}
    </div>
  );
};
