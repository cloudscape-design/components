// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import BaseStatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';

import styles from './status-indicator.scss';

export function StatusIndicator(props: StatusIndicatorProps) {
  return <BaseStatusIndicator {...props} classNames={{ root: styles[`root-${props.type}`] }} />;
}
