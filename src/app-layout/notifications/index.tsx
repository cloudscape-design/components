// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { AppLayoutProps } from '../interfaces';
import { useStickyPosition } from '../utils/use-sticky-position';

interface NotificationsProps {
  testUtilsClassName: string;
  children?: React.ReactNode;
  labels: AppLayoutProps.Labels | undefined;
  topOffset: number | undefined;
  isMobile: boolean;
}

const StaticNotifications = ({ testUtilsClassName, children, labels }: NotificationsProps) => {
  return (
    <div className={clsx(testUtilsClassName)} role="region" aria-label={labels?.notifications}>
      {children}
    </div>
  );
};

const StickyNotifications = (props: NotificationsProps) => {
  const [stickyRef, placeholder] = useStickyPosition(props.topOffset);
  return (
    <>
      <div ref={stickyRef} className={styles['notifications-sticky']}>
        <StaticNotifications {...props} />
      </div>
      {placeholder}
    </>
  );
};

interface NotificationWrapperProps extends NotificationsProps {
  sticky: boolean | undefined;
  navigationPadding: boolean;
  toolsPadding: boolean;
  contentWidthStyles?: React.CSSProperties;
}

export const Notifications = React.forwardRef(
  (
    { navigationPadding, toolsPadding, sticky, isMobile, ...rest }: NotificationWrapperProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const notificationsProps: NotificationsProps = { isMobile, ...rest };
    return (
      <div
        ref={ref}
        className={clsx(
          isMobile && styles['root-mobile'],
          !navigationPadding && styles['root-no-navigation-padding'],
          !toolsPadding && styles['root-no-tools-padding']
        )}
      >
        {sticky ? <StickyNotifications {...notificationsProps} /> : <StaticNotifications {...notificationsProps} />}
      </div>
    );
  }
);
