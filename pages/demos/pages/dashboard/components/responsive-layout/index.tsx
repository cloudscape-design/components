// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import * as styles from './styles.module.scss';

interface ResponsiveLayoutProps {
  filters: React.ReactNode;
  children: React.ReactNode;
}

export function ResponsiveLayout({ filters, children }: ResponsiveLayoutProps) {
  const [width, ref] = useContainerQuery(rect => rect.borderBoxWidth);
  const multiColumn = width && width > 480;
  return (
    <div ref={ref} className={styles.root}>
      <div className={styles.filters}>{filters}</div>
      <div className={[styles.columns, multiColumn ? styles.multi : styles.single].join(' ')}>{children}</div>
    </div>
  );
}

interface WidgetLayoutColumnProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function WidgetLayoutColumn({ header, children }: WidgetLayoutColumnProps) {
  return (
    <div className={styles['column-item']}>
      {header}
      {children}
    </div>
  );
}

ResponsiveLayout.Column = WidgetLayoutColumn;
