// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';

interface ToolbarSlotProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const ToolbarSlot = React.forwardRef<HTMLElement, ToolbarSlotProps>(({ className, style, children }, ref) => (
  <section ref={ref as React.Ref<any>} className={clsx(styles['toolbar-container'], className)} style={style}>
    {children}
  </section>
));

interface NotificationsSlotProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const NotificationsSlot = React.forwardRef<HTMLElement, NotificationsSlotProps>(
  ({ className, style, children }, ref) => (
    <div ref={ref as React.Ref<any>} className={clsx(styles['notifications-container'], className)} style={style}>
      {children}
    </div>
  )
);
