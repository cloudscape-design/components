// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Toast } from './toast';
import { NotificationCenterProps, ToastProps } from './interface';
import styles from './styles.css.js';

interface ToastListProps {
  toasts: Array<ToastProps>;
  onAutoClose: (id: NotificationCenterProps.ID) => void;
}
export const ToastList = ({ toasts, onAutoClose }: ToastListProps) => {
  return (
    <div className={styles['toasts-list']}>
      {toasts.map(toast => (
        <Toast key={toast.id} onAutoClose={onAutoClose} {...toast} />
      ))}
    </div>
  );
};
