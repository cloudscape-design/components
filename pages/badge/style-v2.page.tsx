// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Badge, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2BadgePage() {
  return (
    <SimplePage title="Badge with Style API v2" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <span className={styles['badge-pill']}>
          <Badge color="blue">Pill shape</Badge>
        </span>
        <span className={styles['badge-square']}>
          <Badge color="red">Error</Badge>
        </span>
        <span className={styles['badge-outline']}>
          <Badge color="blue">Outline</Badge>
        </span>
      </SpaceBetween>
    </SimplePage>
  );
}
