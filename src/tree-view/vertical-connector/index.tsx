// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

const VerticalConnector = ({
  level,
  isExpanded,
  isHighlighted = false,
}: {
  level: number;
  isExpanded?: boolean;
  isHighlighted?: boolean;
}) => {
  if (level === 1 || isExpanded) {
    return <div className={clsx(styles.root, isHighlighted && styles.highlighted)} />;
  }
  return <></>;
};

export default VerticalConnector;
