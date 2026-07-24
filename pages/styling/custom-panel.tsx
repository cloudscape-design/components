// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './custom-panel.scss';

export interface CustomPanelProps {
  title: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// A simple custom component that uses --awsui-style-* tokens with a carrier layer, thus allowing nested
// elements to inherit them.
export function CustomPanel({ title, className, children }: CustomPanelProps) {
  return (
    <div className={clsx(styles.panel, className)}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
