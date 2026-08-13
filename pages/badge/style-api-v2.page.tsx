// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Badge, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

export default function () {
  return (
    <SimplePage title="Badge - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <Badge {...{ styleClassNames: { root: clsx(styles.badge, styles['badge-info-pill']) } }}>Info pill</Badge>
        <Badge {...{ styleClassNames: { root: clsx(styles.badge, styles['badge-error-square']) } }}>Error square</Badge>
      </SpaceBetween>
    </SimplePage>
  );
}
