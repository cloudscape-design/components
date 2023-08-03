// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import InternalIcon from '../icon/internal';
import InternalLink from '../link/internal';

import styles from './styles.css.js';

interface Props {
  children: React.ReactNode;
  recoveryText?: string;
  onRecoveryClick?: NonCancelableEventHandler<void>;
}

export default ({ children, recoveryText, onRecoveryClick }: Props) => {
  const onFollow = useCallback(() => fireNonCancelableEvent<void>(onRecoveryClick), [onRecoveryClick]);

  return (
    <div className={styles['error-screen']}>
      <InternalIcon name="status-negative" variant="error" />
      &nbsp;
      {children}
      &nbsp;
      <InternalLink variant="recovery" onFollow={onFollow}>
        {recoveryText}
      </InternalLink>
    </div>
  );
};
