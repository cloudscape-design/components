// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { AppLayoutProps } from '../interfaces';

interface NotificationsProps {
  testUtilsClassName: string;
  children?: React.ReactNode;
  labels: AppLayoutProps.Labels | undefined;
  topOffset: number | undefined;
  isMobile: boolean;
}
interface NotificationWrapperProps extends NotificationsProps {
  sticky: boolean | undefined;
  navigationPadding: boolean;
  toolsPadding: boolean;
  contentWidthStyles?: React.CSSProperties;
}

export const Notifications = React.forwardRef(
  ({ sticky, ...props }: NotificationWrapperProps, ref: React.Ref<HTMLDivElement>) => {
    return sticky ? (
      <div ref={ref} className={styles['notifications-sticky']} style={{ top: props.topOffset }}>
        <div role="region" className={clsx(props.testUtilsClassName)} aria-label={props.labels?.notifications}>
          {props.children}
        </div>
      </div>
    ) : (
      <div role="region" ref={ref} className={clsx(props.testUtilsClassName)} aria-label={props.labels?.notifications}>
        {props.children}
      </div>
    );
  }
);
