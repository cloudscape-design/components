// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ProgressBar, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const brand = { styleClassNames: { progressBar: styles['bar-brand'], progressPercentage: styles['percentage-brand'] } };
const genai = { styleClassNames: { progressBar: styles['bar-genai'], progressPercentage: styles['percentage-genai'] } };

export default function () {
  return (
    <SimplePage title="Progress bar - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="l">
        <ProgressBar value={45} label="Attachments" description="Files are uploading" {...brand} />
        <ProgressBar value={72} label="Attachments" additionalInfo="You can add more files at any time" {...genai} />

        {/* Below states are not covered with Style API */}
        <ProgressBar value={100} status="success" label="Attachments" resultText="Success" {...brand} />
        <ProgressBar
          value={100}
          status="error"
          label="Attachments"
          resultText="Failed to upload"
          resultButtonText="Retry"
          {...brand}
        />
      </SpaceBetween>
    </SimplePage>
  );
}
