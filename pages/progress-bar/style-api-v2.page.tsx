// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ProgressBar } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const brand = { styleClassNames: { root: styles['bar-brand'], percentage: styles['percentage-brand'] } };
const genai = { styleClassNames: { root: styles['bar-genai'], percentage: styles['percentage-genai'] } };

export default function () {
  return (
    <SimplePage title="Progress bar - Style API v2" screenshotArea={{}}>
      <ProgressBar value={45} label="Attachments" description="Files are uploading" {...brand} />
      <ProgressBar value={72} label="Attachments" additionalInfo="You can add more files at any time" {...genai} />
    </SimplePage>
  );
}
