// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { highContrastHeaderClassName } from '../../../internal/utils/content-header-utils';
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
  const [hasNotificationsContent, contentRef] = useContainerQuery(rect => rect.borderBoxHeight > 0);
  const rootRef = useRef<HTMLDivElement>(null);
  useResizeObserver(rootRef, entry => setNotificationsHeight(entry.borderBoxHeight));
  useEffect(() => {
    return () => {
      setNotificationsHeight(0);
    };
    // unmount effect only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <NotificationsSlot
      ref={rootRef}
      className={clsx(
        appLayoutInternals.headerVariant === 'high-contrast' && highContrastHeaderClassName,
        stickyNotifications && styles['sticky-notifications'],
        hasNotificationsContent && styles['has-notifications-content'],
        appLayoutInternals.headerVariant !== 'high-contrast' && styles['sticky-notifications-with-background']
      )}
      style={{
        insetBlockStart: stickyNotifications ? verticalOffsets.notifications : undefined,
      }}
    >
      <div
        ref={contentRef}
        className={testutilStyles.notifications}
        role="region"
        aria-label={ariaLabels?.notifications}
      >
        {children}
      </div>
    </NotificationsSlot>
  );
}

export const createWidgetizedAppLayoutNotifications = createWidgetizedComponent(AppLayoutNotificationsImplementation);
