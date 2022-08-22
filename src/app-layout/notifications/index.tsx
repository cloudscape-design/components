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

const StaticNotifications = React.forwardRef(
  ({ testUtilsClassName, children, labels }: NotificationsProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div ref={ref} className={clsx(testUtilsClassName)} role="region" aria-label={labels?.notifications}>
        {children}
      </div>
    );
  }
);

const StickyNotifications = React.forwardRef(({ ...props }: NotificationsProps, ref: React.Ref<HTMLDivElement>) => {
  return (
    <>
      <div ref={ref} className={styles['notifications-sticky']} style={{ top: props.topOffset }}>
        <StaticNotifications {...props} />
      </div>
    </>
  );
});

interface NotificationWrapperProps extends NotificationsProps {
  sticky: boolean | undefined;
  navigationPadding: boolean;
  toolsPadding: boolean;
  contentWidthStyles?: React.CSSProperties;
}

export const Notifications = React.forwardRef(
  ({ sticky, isMobile, ...rest }: NotificationWrapperProps, ref: React.Ref<HTMLDivElement>) => {
    const notificationsProps: NotificationsProps = { isMobile, ...rest };
    return sticky ? (
      <StickyNotifications ref={ref} {...notificationsProps} />
    ) : (
      <StaticNotifications ref={ref} {...notificationsProps} />
    );
  }
);
