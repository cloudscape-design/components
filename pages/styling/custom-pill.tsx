// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './custom-pill.scss';

export interface CustomPillProps {
  className?: string;
  children?: React.ReactNode;
}

// A simple custom component that uses --awsui-style-* tokens directly (no inheritance and carrier tokens needed).
export function CustomPill({ className, children }: CustomPillProps) {
  return <div className={clsx(styles.pill, className)}>{children}</div>;
}
