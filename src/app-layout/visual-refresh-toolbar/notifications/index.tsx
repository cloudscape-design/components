// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutInternals } from '../interfaces';
import { NotificationsSlot } from '../skeleton/slot-wrappers';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutNotificationsImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  children: React.ReactNode;
}

export function AppLayoutNotificationsImplementation({
  appLayoutInternals,
  children,
}: AppLayoutNotificationsImplementationProps) {
  const { ariaLabels, stickyNotifications, setNotificationsHeight, verticalOffsets } = appLayoutInternals;
  const ref = useRef<HTMLElement>(null);
  useResizeObserver(ref, entry => setNotificationsHeight(entry.borderBoxHeight));
  useEffect(() => {
    return () => {
      setNotificationsHeight(0);
    };
    // unmount effect only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <NotificationsSlot
      ref={ref}
      className={clsx(stickyNotifications && styles['sticky-notifications'])}
      style={{
        insetBlockStart: stickyNotifications ? verticalOffsets.notifications : undefined,
      }}
    >
      <div className={testutilStyles.notifications} role="region" aria-label={ariaLabels?.notifications}>
        {children}
      </div>
    </NotificationsSlot>
  );
}

export const createWidgetizedAppLayoutNotifications = createWidgetizedComponent(AppLayoutNotificationsImplementation);
