// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

interface VerticalConnectorProps {
  variant: 'grid' | 'absolute';
}

// istanbul ignore next - tested via screenshot tests
export default function VerticalConnector({ variant }: VerticalConnectorProps) {
  // istanbul ignore next - tested via screenshot tests
  return <div className={clsx(styles['vertical-connector'], styles[variant])} />;
}
