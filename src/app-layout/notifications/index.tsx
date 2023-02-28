// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import { AppLayoutProps } from '../interfaces';
import clsx from 'clsx';

interface NotificationsProps {
  testUtilsClassName: string;
  children?: React.ReactNode;
  labels: AppLayoutProps.Labels | undefined;
  topOffset: number | undefined;
  disableContentPaddings?: boolean;
}
interface NotificationWrapperProps extends NotificationsProps {
  sticky: boolean | undefined;
}

export const Notifications = React.forwardRef(
  ({ sticky, disableContentPaddings, ...props }: NotificationWrapperProps, ref: React.Ref<HTMLDivElement>) => {
    return sticky ? (
      <div ref={ref} className={styles['notifications-sticky']} style={{ top: props.topOffset }}>
        <div
          role="region"
          className={clsx(props.testUtilsClassName, disableContentPaddings && styles['no-content-paddings'])}
          aria-label={props.labels?.notifications}
        >
          {props.children}
        </div>
      </div>
    ) : (
      <div
        role="region"
        ref={ref}
        className={clsx(
          props.testUtilsClassName,
          styles.notifications,
          disableContentPaddings && styles['no-content-paddings']
        )}
        aria-label={props.labels?.notifications}
      >
        {props.children}
      </div>
    );
  }
);
