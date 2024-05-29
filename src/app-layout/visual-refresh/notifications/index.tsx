// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { NotificationsContainer } from '../../skeleton/containers';
import { useAppLayoutInternals } from '../context';
import styles from './styles.css.js';

export function Notifications({ children }: { children: React.ReactNode }) {
  const { stickyNotifications, notificationsRef, verticalOffsets } = useAppLayoutInternals();
  return (
    <NotificationsContainer
      ref={notificationsRef}
      className={clsx(stickyNotifications && styles['sticky-notifications'])}
      style={{
        insetBlockStart: stickyNotifications ? verticalOffsets.notifications : undefined,
      }}
    >
      {children}
    </NotificationsContainer>
  );
}
