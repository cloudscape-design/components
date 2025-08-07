// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { Badge, Box, SpaceBetween } from '~components';

import styles from '../styles.scss';

export function StepHeader({
  visited,
  active,
  isNew,
  onClick,
  children,
}: {
  children: React.ReactNode;
  visited: boolean;
  isNew: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      tabIndex={active ? -1 : 0}
      aria-current="step"
      className={clsx(styles['steps-button'], {
        [styles['steps-button-visited']]: visited,
        [styles['steps-button-active']]: active,
      })}
    >
      <SpaceBetween size="xs" direction="horizontal" alignItems="center">
        <span>{children}</span>
        {isNew ? <Badge color="blue">New</Badge> : null}
      </SpaceBetween>
    </button>
  );
}

export function StepDescription({ children }: { children: React.ReactNode }) {
  return (
    <Box fontSize="body-s" color="text-body-secondary" margin={{ bottom: 's' }}>
      {children}
    </Box>
  );
}
