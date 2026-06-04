// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ProgressBar } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2ProgressBarPage() {
  return (
    <SimplePage title="ProgressBar with Style API v2" screenshotArea={{}}>
      <ProgressBar value={75} label="Thick rounded" description="75% complete" className={styles['progress-thick']} />
      <ProgressBar value={40} label="Thin flat" description="40% complete" className={styles['progress-thin']} />
      <ProgressBar value={90} label="Error accent" description="90% complete" className={styles['progress-accent']} />
    </SimplePage>
  );
}
